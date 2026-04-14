package com.example.OOAD.dto;

import com.example.OOAD.model.SeatType;

public class CreateSeatRequest {

    private Long screenId;
    private String seatNumber;
    private SeatType type;

    public Long getScreenId() {
        return screenId;
    }

    public void setScreenId(Long screenId) {
        this.screenId = screenId;
    }

    public String getSeatNumber() {
        return seatNumber;
    }

    public void setSeatNumber(String seatNumber) {
        this.seatNumber = seatNumber;
    }

    public SeatType getType() {
        return type;
    }

    public void setType(SeatType type) {
        this.type = type;
    }
}
