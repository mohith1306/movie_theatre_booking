package com.example.OOAD.service;

import org.springframework.stereotype.Service;

@Service
public class PaymentService {

    public boolean processPayment(Double paymentAmount) {
        if (paymentAmount == null || paymentAmount <= 0) {
            return false;
        }
        // Deterministic simulation for predictable testing/viva demos.
        return paymentAmount % 7 != 0;
    }
}
