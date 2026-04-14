package com.example.OOAD.service;

import com.example.OOAD.dto.SeatResponse;
import com.example.OOAD.exception.ConflictException;
import com.example.OOAD.exception.NotFoundException;
import com.example.OOAD.model.BookingStatus;
import com.example.OOAD.model.Seat;
import com.example.OOAD.model.SeatStatus;
import com.example.OOAD.model.Show;
import com.example.OOAD.repository.BookingRepository;
import com.example.OOAD.repository.SeatRepository;
import com.example.OOAD.repository.ShowRepository;
import com.example.OOAD.strategy.AllocationStrategy;
import java.time.Duration;
import java.time.Instant;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;
import org.springframework.stereotype.Service;

@Service
public class SeatAllocationService {

    private static final Duration LOCK_DURATION = Duration.ofMinutes(5);

    private final SeatRepository seatRepository;
    private final ShowRepository showRepository;
    private final BookingRepository bookingRepository;
    private final AllocationStrategy allocationStrategy;

    private final Map<String, Instant> lockRegistry = new HashMap<>();

    public SeatAllocationService(SeatRepository seatRepository,
            ShowRepository showRepository,
            BookingRepository bookingRepository,
            AllocationStrategy allocationStrategy) {
        this.seatRepository = seatRepository;
        this.showRepository = showRepository;
        this.bookingRepository = bookingRepository;
        this.allocationStrategy = allocationStrategy;
    }

    public List<SeatResponse> getSeatsForShow(Long showId) {
        Show show = showRepository.findById(showId)
                .orElseThrow(() -> new NotFoundException("Show not found: " + showId));

        cleanupExpiredLocks(showId);

        Set<Long> bookedSeatIds = bookingRepository.findByShowShowIdAndStatus(showId, BookingStatus.CONFIRMED)
                .stream()
                .flatMap(booking -> booking.getSeats().stream())
                .map(Seat::getSeatId)
                .collect(Collectors.toSet());

        return seatRepository.findByScreenScreenId(show.getScreen().getScreenId())
                .stream()
                .map(seat -> new SeatResponse(seat.getSeatId(), seat.getSeatNumber(), seat.getType(),
                        resolveDynamicSeatStatus(showId, seat.getSeatId(), seat.getStatus(), bookedSeatIds)))
                .toList();
    }

    public synchronized List<Seat> allocateAndLockSeats(Long showId, int seatCount, List<Long> preferredSeatIds) {
        List<Seat> available = getAvailableSeats(showId);
        if (available.size() < seatCount) {
            throw new ConflictException("Not enough seats available");
        }

        List<Seat> selected = allocationStrategy.allocate(available, seatCount, preferredSeatIds);
        if (selected.size() < seatCount) {
            throw new ConflictException("Could not allocate enough seats");
        }

        for (Seat seat : selected) {
            if (isSeatLocked(showId, seat.getSeatId())) {
                throw new ConflictException("Seat already locked by another user: " + seat.getSeatNumber());
            }
            seat.setStatus(SeatStatus.LOCKED);
            lockRegistry.put(lockKey(showId, seat.getSeatId()), Instant.now().plus(LOCK_DURATION));
        }
        seatRepository.saveAll(selected);
        return selected;
    }

    public synchronized boolean hasConflict(Long showId, List<Long> seatIds) {
        Set<Long> alreadyBooked = bookingRepository.findByShowShowIdAndStatus(showId, BookingStatus.CONFIRMED)
                .stream()
                .flatMap(booking -> booking.getSeats().stream())
                .map(Seat::getSeatId)
                .collect(Collectors.toSet());
        return seatIds.stream().anyMatch(alreadyBooked::contains);
    }

    public synchronized void confirmLockedSeats(Long showId, List<Seat> seats) {
        for (Seat seat : seats) {
            seat.setStatus(SeatStatus.BOOKED);
            lockRegistry.remove(lockKey(showId, seat.getSeatId()));
        }
        seatRepository.saveAll(seats);
    }

    public synchronized void releaseLockedSeats(Long showId, List<Seat> seats) {
        for (Seat seat : seats) {
            if (seat.getStatus() == SeatStatus.LOCKED) {
                seat.setStatus(SeatStatus.AVAILABLE);
            }
            lockRegistry.remove(lockKey(showId, seat.getSeatId()));
        }
        seatRepository.saveAll(seats);
    }

    public synchronized void moveBookedSeatToAvailable(Seat seat) {
        // Explicit two-step transition from the state diagram.
        seat.setStatus(SeatStatus.CANCELLED);
        seatRepository.save(seat);
        seat.setStatus(SeatStatus.AVAILABLE);
        seatRepository.save(seat);
    }

    private List<Seat> getAvailableSeats(Long showId) {
        Show show = showRepository.findById(showId)
                .orElseThrow(() -> new NotFoundException("Show not found: " + showId));

        cleanupExpiredLocks(showId);

        Set<Long> bookedSeatIds = bookingRepository.findByShowShowIdAndStatus(showId, BookingStatus.CONFIRMED)
                .stream()
            .flatMap(booking -> booking.getSeats().stream())
                .map(Seat::getSeatId)
                .collect(Collectors.toSet());

        return seatRepository.findByScreenScreenId(show.getScreen().getScreenId())
                .stream()
                .filter(seat -> seat.getStatus() == SeatStatus.AVAILABLE)
                .filter(seat -> !bookedSeatIds.contains(seat.getSeatId()))
                .filter(seat -> !isSeatLocked(showId, seat.getSeatId()))
                .toList();
    }

    private SeatStatus resolveDynamicSeatStatus(Long showId, Long seatId, SeatStatus persisted,
            Set<Long> bookedSeatIds) {
        if (persisted == SeatStatus.UNDER_MAINTENANCE) {
            return SeatStatus.UNDER_MAINTENANCE;
        }
        if (bookedSeatIds.contains(seatId)) {
            return SeatStatus.BOOKED;
        }
        if (isSeatLocked(showId, seatId)) {
            return SeatStatus.LOCKED;
        }
        return SeatStatus.AVAILABLE;
    }

    private void cleanupExpiredLocks(Long showId) {
        Instant now = Instant.now();
        Set<String> expiredKeys = new HashSet<>();

        for (Map.Entry<String, Instant> entry : lockRegistry.entrySet()) {
            if (entry.getValue().isBefore(now)) {
                expiredKeys.add(entry.getKey());
            }
        }

        for (String key : expiredKeys) {
            lockRegistry.remove(key);
            String[] parts = key.split(":");
            Long keyShowId = Long.valueOf(parts[0]);
            Long seatId = Long.valueOf(parts[1]);

            if (!keyShowId.equals(showId)) {
                continue;
            }
            seatRepository.findById(seatId).ifPresent(seat -> {
                if (seat.getStatus() == SeatStatus.LOCKED) {
                    seat.setStatus(SeatStatus.AVAILABLE);
                    seatRepository.save(seat);
                }
            });
        }
    }

    private boolean isSeatLocked(Long showId, Long seatId) {
        Instant expiry = lockRegistry.get(lockKey(showId, seatId));
        return expiry != null && expiry.isAfter(Instant.now());
    }

    private String lockKey(Long showId, Long seatId) {
        return showId + ":" + seatId;
    }
}
