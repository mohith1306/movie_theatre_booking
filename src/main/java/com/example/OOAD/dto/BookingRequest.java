package com.example.OOAD.dto;

import java.util.List;

public class BookingRequest {

    private Long customerId;
    private Long showId;
    private Integer seatCount;
    private List<Long> preferredSeatIds;
    private Double paymentAmount;

    public Long getCustomerId() {
        return customerId;
    }

    public void setCustomerId(Long customerId) {
        this.customerId = customerId;
    }

    public Long getShowId() {
        return showId;
    }

    public void setShowId(Long showId) {
        this.showId = showId;
    }

    public Integer getSeatCount() {
        return seatCount;
    }

    public void setSeatCount(Integer seatCount) {
        this.seatCount = seatCount;
    }

    public List<Long> getPreferredSeatIds() {
        return preferredSeatIds;
    }

    public void setPreferredSeatIds(List<Long> preferredSeatIds) {
        this.preferredSeatIds = preferredSeatIds;
    }

    public Double getPaymentAmount() {
        return paymentAmount;
    }

    public void setPaymentAmount(Double paymentAmount) {
        this.paymentAmount = paymentAmount;
    }
}
