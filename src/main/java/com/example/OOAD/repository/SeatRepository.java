package com.example.OOAD.repository;

import com.example.OOAD.model.Seat;
import com.example.OOAD.model.SeatStatus;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SeatRepository extends JpaRepository<Seat, Long> {
    List<Seat> findByScreenScreenId(Long screenId);
    List<Seat> findByScreenScreenIdAndStatus(Long screenId, SeatStatus status);
}
