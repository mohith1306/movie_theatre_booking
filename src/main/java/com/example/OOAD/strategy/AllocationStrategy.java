package com.example.OOAD.strategy;

import com.example.OOAD.model.Seat;
import java.util.List;

public interface AllocationStrategy {

    List<Seat> allocate(List<Seat> availableSeats, int seatCount, List<Long> preferredSeatIds);
}
