package com.example.OOAD.service;

import com.example.OOAD.dto.AddShowRequest;
import com.example.OOAD.dto.CreateScreenRequest;
import com.example.OOAD.dto.CreateSeatRequest;
import com.example.OOAD.dto.CreateTheatreRequest;
import com.example.OOAD.exception.NotFoundException;
import com.example.OOAD.factory.SeatFactory;
import com.example.OOAD.model.Screen;
import com.example.OOAD.model.Seat;
import com.example.OOAD.model.SeatStatus;
import com.example.OOAD.model.Show;
import com.example.OOAD.model.Theatre;
import com.example.OOAD.repository.ScreenRepository;
import com.example.OOAD.repository.SeatRepository;
import com.example.OOAD.repository.ShowRepository;
import com.example.OOAD.repository.TheatreRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AdminService {

    private final TheatreRepository theatreRepository;
    private final ScreenRepository screenRepository;
    private final ShowRepository showRepository;
    private final SeatRepository seatRepository;
    private final SeatFactory seatFactory;

    public AdminService(TheatreRepository theatreRepository,
            ScreenRepository screenRepository,
            ShowRepository showRepository,
            SeatRepository seatRepository,
            SeatFactory seatFactory) {
        this.theatreRepository = theatreRepository;
        this.screenRepository = screenRepository;
        this.showRepository = showRepository;
        this.seatRepository = seatRepository;
        this.seatFactory = seatFactory;
    }

    @Transactional
    public Theatre addTheatre(CreateTheatreRequest request) {
        Theatre theatre = new Theatre(request.getName(), request.getLocation());
        return theatreRepository.save(theatre);
    }

    @Transactional
    public Screen addScreen(CreateScreenRequest request) {
        Theatre theatre = theatreRepository.findById(request.getTheatreId())
                .orElseThrow(() -> new NotFoundException("Theatre not found: " + request.getTheatreId()));

        Screen screen = new Screen(request.getScreenName());
        screen.setTheatre(theatre);
        return screenRepository.save(screen);
    }

    @Transactional
    public Seat addSeat(CreateSeatRequest request) {
        Screen screen = screenRepository.findById(request.getScreenId())
                .orElseThrow(() -> new NotFoundException("Screen not found: " + request.getScreenId()));

        Seat seat = seatFactory.createSeat(request.getSeatNumber(), request.getType());
        seat.setScreen(screen);
        return seatRepository.save(seat);
    }

    @Transactional
    public Show addShow(AddShowRequest request) {
        Screen screen = screenRepository.findById(request.getScreenId())
                .orElseThrow(() -> new NotFoundException("Screen not found: " + request.getScreenId()));

        Show show = new Show(request.getMovieName(), request.getShowTime());
        show.setScreen(screen);
        return showRepository.save(show);
    }

    @Transactional
    public Seat setSeatMaintenance(Long seatId, boolean underMaintenance) {
        Seat seat = seatRepository.findById(seatId)
                .orElseThrow(() -> new NotFoundException("Seat not found: " + seatId));

        seat.setStatus(underMaintenance ? SeatStatus.UNDER_MAINTENANCE : SeatStatus.AVAILABLE);
        return seatRepository.save(seat);
    }
}
