package com.example.OOAD.dto;

import com.example.OOAD.model.BookingStatus;
import java.time.LocalDateTime;
import java.util.List;

public class BookingResponse {

    private Long bookingId;
    private BookingStatus status;
    private LocalDateTime bookingTime;
    private Long showId;
    private String movieName;
    private List<String> seatNumbers;
    private String message;

    public BookingResponse(Long bookingId, BookingStatus status, LocalDateTime bookingTime,
            Long showId, String movieName, List<String> seatNumbers, String message) {
        this.bookingId = bookingId;
        this.status = status;
        this.bookingTime = bookingTime;
        this.showId = showId;
        this.movieName = movieName;
        this.seatNumbers = seatNumbers;
        this.message = message;
    }

    public Long getBookingId() {
        return bookingId;
    }

    public BookingStatus getStatus() {
        return status;
    }

    public LocalDateTime getBookingTime() {
        return bookingTime;
    }

    public Long getShowId() {
        return showId;
    }

    public String getMovieName() {
        return movieName;
    }

    public List<String> getSeatNumbers() {
        return seatNumbers;
    }

    public String getMessage() {
        return message;
    }
}
