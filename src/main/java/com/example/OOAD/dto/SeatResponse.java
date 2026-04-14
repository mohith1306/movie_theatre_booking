package com.example.OOAD.dto;

import com.example.OOAD.model.SeatStatus;
import com.example.OOAD.model.SeatType;

public class SeatResponse {

    private Long seatId;
    private String seatNumber;
    private SeatType type;
    private SeatStatus status;

    public SeatResponse(Long seatId, String seatNumber, SeatType type, SeatStatus status) {
        this.seatId = seatId;
        this.seatNumber = seatNumber;
        this.type = type;
        this.status = status;
    }

    public Long getSeatId() {
        return seatId;
    }

    public String getSeatNumber() {
        return seatNumber;
    }

    public SeatType getType() {
        return type;
    }

    public SeatStatus getStatus() {
        return status;
    }
}
