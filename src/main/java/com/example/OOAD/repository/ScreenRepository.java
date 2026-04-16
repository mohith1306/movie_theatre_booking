package com.example.OOAD.repository;

import com.example.OOAD.dto.ScreenOptionResponse;
import com.example.OOAD.model.Screen;
import java.util.List;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.query.Param;

public interface ScreenRepository extends JpaRepository<Screen, Long> {
    List<Screen> findByTheatreTheatreId(Long theatreId);

    @Query("""
            select new com.example.OOAD.dto.ScreenOptionResponse(
                s.screenId,
                s.screenName,
                s.theatre.theatreId
            )
            from Screen s
            """)
    List<ScreenOptionResponse> findAllScreenOptions();

    @Query("""
            select new com.example.OOAD.dto.ScreenOptionResponse(
                s.screenId,
                s.screenName,
                s.theatre.theatreId
            )
            from Screen s
            where s.theatre.theatreId = :theatreId
            """)
    List<ScreenOptionResponse> findScreenOptionsByTheatreId(@Param("theatreId") Long theatreId);
}
