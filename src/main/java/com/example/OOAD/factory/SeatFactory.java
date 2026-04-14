package com.example.OOAD.factory;

import com.example.OOAD.model.Seat;
import com.example.OOAD.model.SeatStatus;
import com.example.OOAD.model.SeatType;
import org.springframework.stereotype.Component;

@Component
public class SeatFactory {

    public Seat createSeat(String seatNumber, SeatType seatType) {
        // New seats always start in AVAILABLE state.
        return new Seat(seatNumber, seatType, SeatStatus.AVAILABLE);
    }
}
