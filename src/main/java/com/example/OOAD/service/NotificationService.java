package com.example.OOAD.service;

import com.example.OOAD.model.Booking;
import org.springframework.stereotype.Service;

@Service
public class NotificationService {

    public void sendBookingConfirmation(Booking booking) {
        System.out.printf("Notification: Booking %d confirmed for %s%n",
                booking.getBookingId(), booking.getCustomer().getEmail());
    }

    public void sendBookingFailure(String email, Long showId) {
        System.out.printf("Notification: Booking failed for %s on show %d%n", email, showId);
    }

    public void sendBookingCancellation(Booking booking) {
        System.out.printf("Notification: Booking %d cancelled for %s%n",
                booking.getBookingId(), booking.getCustomer().getEmail());
    }
}
