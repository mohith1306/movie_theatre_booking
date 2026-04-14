package com.example.OOAD.repository;

import com.example.OOAD.model.Booking;
import com.example.OOAD.model.BookingStatus;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface BookingRepository extends JpaRepository<Booking, Long> {
    List<Booking> findByShowShowIdAndStatus(Long showId, BookingStatus status);
    List<Booking> findByCustomerUserId(Long customerId);
}
