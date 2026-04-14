package com.example.OOAD.controller;

import com.example.OOAD.dto.SeatResponse;
import com.example.OOAD.service.SeatAllocationService;
import java.util.List;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/seats")
public class SeatController {

    private final SeatAllocationService seatAllocationService;

    public SeatController(SeatAllocationService seatAllocationService) {
        this.seatAllocationService = seatAllocationService;
    }

    @GetMapping
    public ResponseEntity<List<SeatResponse>> getSeats(@RequestParam Long showId) {
        return ResponseEntity.ok(seatAllocationService.getSeatsForShow(showId));
    }

    @GetMapping("/{showId}")
    public ResponseEntity<List<SeatResponse>> getSeatsByPath(@PathVariable Long showId) {
        return ResponseEntity.ok(seatAllocationService.getSeatsForShow(showId));
    }
}
