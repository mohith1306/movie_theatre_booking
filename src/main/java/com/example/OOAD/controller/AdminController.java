package com.example.OOAD.controller;

import com.example.OOAD.dto.AddShowRequest;
import com.example.OOAD.dto.ApiMessage;
import com.example.OOAD.dto.CreateScreenRequest;
import com.example.OOAD.dto.CreateSeatRequest;
import com.example.OOAD.dto.CreateTheatreRequest;
import com.example.OOAD.model.Screen;
import com.example.OOAD.model.Seat;
import com.example.OOAD.model.Show;
import com.example.OOAD.model.Theatre;
import com.example.OOAD.service.AdminService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/admin")
public class AdminController {

    private final AdminService adminService;

    public AdminController(AdminService adminService) {
        this.adminService = adminService;
    }

    @PostMapping("/addTheatre")
    public ResponseEntity<ApiMessage> addTheatre(@RequestBody CreateTheatreRequest request) {
        Theatre theatre = adminService.addTheatre(request);
        return ResponseEntity.ok(new ApiMessage("Theatre created with id " + theatre.getTheatreId()));
    }

    @PostMapping("/addScreen")
    public ResponseEntity<ApiMessage> addScreen(@RequestBody CreateScreenRequest request) {
        Screen screen = adminService.addScreen(request);
        return ResponseEntity.ok(new ApiMessage("Screen created with id " + screen.getScreenId()));
    }

    @PostMapping("/addSeat")
    public ResponseEntity<ApiMessage> addSeat(@RequestBody CreateSeatRequest request) {
        Seat seat = adminService.addSeat(request);
        return ResponseEntity.ok(new ApiMessage("Seat created with id " + seat.getSeatId()));
    }

    @PostMapping("/addShow")
    public ResponseEntity<ApiMessage> addShow(@RequestBody AddShowRequest request) {
        Show show = adminService.addShow(request);
        return ResponseEntity.ok(new ApiMessage("Show created with id " + show.getShowId()));
    }

    @PostMapping("/seat/{seatId}/maintenance")
    public ResponseEntity<ApiMessage> setMaintenance(@PathVariable Long seatId, @RequestParam boolean value) {
        Seat seat = adminService.setSeatMaintenance(seatId, value);
        return ResponseEntity.ok(new ApiMessage("Seat " + seat.getSeatId() + " updated to " + seat.getStatus()));
    }
}
