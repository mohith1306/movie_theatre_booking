package com.example.OOAD.service;

import com.example.OOAD.dto.BookingRequest;
import com.example.OOAD.dto.BookingResponse;
import com.example.OOAD.exception.BadRequestException;
import com.example.OOAD.exception.ConflictException;
import com.example.OOAD.exception.NotFoundException;
import com.example.OOAD.model.Booking;
import com.example.OOAD.model.BookingStatus;
import com.example.OOAD.model.Customer;
import com.example.OOAD.model.Seat;
import com.example.OOAD.model.Show;
import com.example.OOAD.repository.BookingRepository;
import com.example.OOAD.repository.CustomerRepository;
import com.example.OOAD.repository.ShowRepository;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class BookingService {

    private final BookingRepository bookingRepository;
    private final CustomerRepository customerRepository;
    private final ShowRepository showRepository;
    private final SeatAllocationService seatAllocationService;
    private final PaymentService paymentService;
    private final NotificationService notificationService;

    public BookingService(BookingRepository bookingRepository,
            CustomerRepository customerRepository,
            ShowRepository showRepository,
            SeatAllocationService seatAllocationService,
            PaymentService paymentService,
            NotificationService notificationService) {
        this.bookingRepository = bookingRepository;
        this.customerRepository = customerRepository;
        this.showRepository = showRepository;
        this.seatAllocationService = seatAllocationService;
        this.paymentService = paymentService;
        this.notificationService = notificationService;
    }

    @Transactional
    public BookingResponse createBooking(BookingRequest request) {
        validateRequest(request);

        Customer customer = customerRepository.findById(request.getCustomerId())
                .orElseThrow(() -> new NotFoundException("Customer not found: " + request.getCustomerId()));

        Show show = showRepository.findById(request.getShowId())
                .orElseThrow(() -> new NotFoundException("Show not found: " + request.getShowId()));

        List<Seat> lockedSeats = seatAllocationService.allocateAndLockSeats(
                request.getShowId(), request.getSeatCount(), request.getPreferredSeatIds());

        List<Long> lockedSeatIds = lockedSeats.stream().map(Seat::getSeatId).toList();
        if (seatAllocationService.hasConflict(request.getShowId(), lockedSeatIds)) {
            seatAllocationService.releaseLockedSeats(request.getShowId(), lockedSeats);
            throw new ConflictException("Seat conflict detected. Please retry booking.");
        }

        Double amount = request.getPaymentAmount() != null
                ? request.getPaymentAmount()
                : request.getSeatCount() * 150.0;

        if (!paymentService.processPayment(amount)) {
            seatAllocationService.releaseLockedSeats(request.getShowId(), lockedSeats);
            notificationService.sendBookingFailure(customer.getEmail(), request.getShowId());
            return new BookingResponse(null, BookingStatus.FAILED, LocalDateTime.now(), show.getShowId(),
                    show.getMovieName(), List.of(), "Payment failed. Seats were released.");
        }

        Booking booking = new Booking(LocalDateTime.now(), BookingStatus.CONFIRMED);
        booking.setCustomer(customer);
        booking.setShow(show);
        booking.setSeats(lockedSeats);

        Booking saved = bookingRepository.save(booking);
        seatAllocationService.confirmLockedSeats(show.getShowId(), lockedSeats);
        notificationService.sendBookingConfirmation(saved);

        return toResponse(saved, "Booking confirmed");
    }

    @Transactional
    public BookingResponse cancelBooking(Long bookingId) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new NotFoundException("Booking not found: " + bookingId));

        if (booking.getStatus() != BookingStatus.CONFIRMED) {
            throw new BadRequestException("Only confirmed bookings can be cancelled");
        }

        booking.setStatus(BookingStatus.CANCELLED);
        for (Seat seat : booking.getSeats()) {
            seatAllocationService.moveBookedSeatToAvailable(seat);
        }

        Booking saved = bookingRepository.save(booking);
        notificationService.sendBookingCancellation(saved);
        return toResponse(saved, "Booking cancelled and seats released");
    }

    public List<BookingResponse> getCustomerBookings(Long customerId) {
        return bookingRepository.findByCustomerUserId(customerId)
                .stream()
                .map(booking -> toResponse(booking, "Booking history"))
                .collect(Collectors.toList());
    }

    private void validateRequest(BookingRequest request) {
        if (request.getCustomerId() == null) {
            throw new BadRequestException("customerId is required");
        }
        if (request.getShowId() == null) {
            throw new BadRequestException("showId is required");
        }
        if (request.getSeatCount() == null || request.getSeatCount() <= 0) {
            throw new BadRequestException("seatCount must be greater than 0");
        }
    }

    private BookingResponse toResponse(Booking booking, String message) {
        return new BookingResponse(
                booking.getBookingId(),
                booking.getStatus(),
                booking.getBookingTime(),
                booking.getShow().getShowId(),
                booking.getShow().getMovieName(),
                booking.getSeats().stream().map(Seat::getSeatNumber).toList(),
                message);
    }
}
