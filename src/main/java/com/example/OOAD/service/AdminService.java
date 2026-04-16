package com.example.OOAD.service;

import com.example.OOAD.dto.AddShowRequest;
import com.example.OOAD.dto.CreateScreenRequest;
import com.example.OOAD.dto.CreateSeatRequest;
import com.example.OOAD.dto.CreateTheatreRequest;
import com.example.OOAD.dto.MovieRequest;
import com.example.OOAD.exception.BadRequestException;
import com.example.OOAD.exception.NotFoundException;
import com.example.OOAD.factory.SeatFactory;
import com.example.OOAD.model.Movie;
import com.example.OOAD.model.Screen;
import com.example.OOAD.model.Seat;
import com.example.OOAD.model.SeatStatus;
import com.example.OOAD.model.Show;
import com.example.OOAD.model.Theatre;
import com.example.OOAD.repository.MovieRepository;
import com.example.OOAD.repository.ScreenRepository;
import com.example.OOAD.repository.SeatRepository;
import com.example.OOAD.repository.ShowRepository;
import com.example.OOAD.repository.TheatreRepository;
import java.time.LocalDateTime;
import java.util.List;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AdminService {

    private final TheatreRepository theatreRepository;
    private final ScreenRepository screenRepository;
    private final MovieRepository movieRepository;
    private final ShowRepository showRepository;
    private final SeatRepository seatRepository;
    private final SeatFactory seatFactory;

    public AdminService(TheatreRepository theatreRepository,
            ScreenRepository screenRepository,
            MovieRepository movieRepository,
            ShowRepository showRepository,
            SeatRepository seatRepository,
            SeatFactory seatFactory) {
        this.theatreRepository = theatreRepository;
        this.screenRepository = screenRepository;
        this.movieRepository = movieRepository;
        this.showRepository = showRepository;
        this.seatRepository = seatRepository;
        this.seatFactory = seatFactory;
    }

    @Transactional
    public Movie addMovie(MovieRequest request) {
        validateMovieRequest(request);
        Movie movie = new Movie();
        applyMovieRequest(movie, request);
        return movieRepository.save(movie);
    }

    @Transactional
    public Movie updateMovie(Long movieId, MovieRequest request) {
        validateMovieRequest(request);
        Movie movie = movieRepository.findById(movieId)
                .orElseThrow(() -> new NotFoundException("Movie not found: " + movieId));

        String previousTitle = movie.getMovieName();
        applyMovieRequest(movie, request);
        Movie saved = movieRepository.save(movie);

        if (previousTitle != null && !previousTitle.equals(saved.getMovieName())) {
            List<Show> relatedShows = showRepository.findByMovieName(previousTitle);
            for (Show show : relatedShows) {
                show.setMovieName(saved.getMovieName());
            }
            showRepository.saveAll(relatedShows);
        }

        return saved;
    }

    @Transactional
    public void deleteMovie(Long movieId) {
        Movie movie = movieRepository.findById(movieId)
                .orElseThrow(() -> new NotFoundException("Movie not found: " + movieId));

        List<Show> relatedShows = showRepository.findByMovieName(movie.getMovieName());
        for (Show show : relatedShows) {
            show.setArchived(true);
            show.setArchivedAt(LocalDateTime.now());
        }
        showRepository.saveAll(relatedShows);
        movieRepository.delete(movie);
    }

    @Transactional
    public Theatre updateTheatre(Long theatreId, CreateTheatreRequest request) {
        validateTheatreRequest(request);
        Theatre theatre = theatreRepository.findById(theatreId)
                .orElseThrow(() -> new NotFoundException("Theatre not found: " + theatreId));

        theatre.setName(request.getName());
        theatre.setLocation(request.getLocation());
        return theatreRepository.save(theatre);
    }

    @Transactional
    public void deleteTheatre(Long theatreId) {
        Theatre theatre = theatreRepository.findById(theatreId)
                .orElseThrow(() -> new NotFoundException("Theatre not found: " + theatreId));

        theatreRepository.delete(theatre);
    }

    @Transactional
    public Theatre addTheatre(CreateTheatreRequest request) {
        validateTheatreRequest(request);
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

    private void applyMovieRequest(Movie movie, MovieRequest request) {
        movie.setMovieName(request.getTitle());
        movie.setGenre(request.getGenre());
        movie.setDuration(request.getDuration());
        movie.setRating(request.getRating());
        movie.setThumbnailUrl(request.getThumbnailUrl());
    }

    private void validateMovieRequest(MovieRequest request) {
        if (request.getTitle() == null || request.getTitle().isBlank()) {
            throw new BadRequestException("Movie title is required");
        }
        if (request.getGenre() == null || request.getGenre().isBlank()) {
            throw new BadRequestException("Movie genre is required");
        }
        if (request.getDuration() == null || request.getDuration().isBlank()) {
            throw new BadRequestException("Movie duration is required");
        }
        if (request.getRating() == null || request.getRating().isBlank()) {
            throw new BadRequestException("Movie rating is required");
        }
        if (request.getThumbnailUrl() == null || request.getThumbnailUrl().isBlank()) {
            throw new BadRequestException("Movie thumbnail URL is required");
        }
    }

    private void validateTheatreRequest(CreateTheatreRequest request) {
        if (request.getName() == null || request.getName().isBlank()) {
            throw new BadRequestException("Theatre name is required");
        }
        if (request.getLocation() == null || request.getLocation().isBlank()) {
            throw new BadRequestException("Theatre location is required");
        }
    }
}
