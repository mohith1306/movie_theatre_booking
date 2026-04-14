package com.example.OOAD.strategy;

import com.example.OOAD.model.Seat;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import org.springframework.stereotype.Component;

@Component
public class DefaultAllocationStrategy implements AllocationStrategy {

    @Override
    public List<Seat> allocate(List<Seat> availableSeats, int seatCount, List<Long> preferredSeatIds) {
        List<Seat> sortedSeats = availableSeats.stream()
                .sorted(Comparator.comparing(Seat::getSeatNumber))
                .toList();

        List<Seat> selected = new ArrayList<>();
        Set<Long> usedSeatIds = new HashSet<>();

        if (preferredSeatIds != null && !preferredSeatIds.isEmpty()) {
            for (Long preferredSeatId : preferredSeatIds) {
                if (selected.size() == seatCount) {
                    break;
                }
                sortedSeats.stream()
                        .filter(seat -> seat.getSeatId().equals(preferredSeatId))
                        .findFirst()
                        .ifPresent(seat -> {
                            selected.add(seat);
                            usedSeatIds.add(seat.getSeatId());
                        });
            }
        }

        for (Seat seat : sortedSeats) {
            if (selected.size() == seatCount) {
                break;
            }
            if (!usedSeatIds.contains(seat.getSeatId())) {
                selected.add(seat);
            }
        }

        return selected;
    }
}
