package com.example.OOAD.repository;

import com.example.OOAD.model.Show;
import java.time.LocalDateTime;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ShowRepository extends JpaRepository<Show, Long> {
    List<Show> findByScreenTheatreTheatreId(Long theatreId);
    List<Show> findByMovieName(String movieName);
    List<Show> findByArchivedFalseAndShowTimeBefore(LocalDateTime showTime);
    List<Show> findByArchivedFalseOrderByShowTimeAsc();
}
