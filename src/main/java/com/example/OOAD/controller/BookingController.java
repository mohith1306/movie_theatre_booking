package com.example.OOAD.controller;

import com.example.OOAD.dto.BookingRequest;
import com.example.OOAD.dto.BookingResponse;
import com.example.OOAD.service.BookingService;
import java.util.List;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/booking")
public class BookingController {

    private final BookingService bookingService;

    public BookingController(BookingService bookingService) {
        this.bookingService = bookingService;
    }

    @PostMapping("/create")
    public ResponseEntity<BookingResponse> createBooking(@RequestBody BookingRequest request) {
        return ResponseEntity.ok(bookingService.createBooking(request));
    }

    @PostMapping("/cancel/{id}")
    public ResponseEntity<BookingResponse> cancelBooking(@PathVariable("id") Long bookingId) {
        return ResponseEntity.ok(bookingService.cancelBooking(bookingId));
    }

    @GetMapping("/customer")
    public ResponseEntity<List<BookingResponse>> getCustomerBookings(@RequestParam Long customerId) {
        return ResponseEntity.ok(bookingService.getCustomerBookings(customerId));
    }
}
