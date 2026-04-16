package com.example.OOAD.service;

import com.example.OOAD.dto.AddShowRequest;
import com.example.OOAD.dto.CreateMovieRequest;
import com.example.OOAD.dto.ScreenOptionResponse;
import com.example.OOAD.dto.CreateScreenRequest;
import com.example.OOAD.dto.CreateSeatRequest;
import com.example.OOAD.dto.CreateTheatreRequest;
import com.example.OOAD.exception.NotFoundException;
import com.example.OOAD.factory.SeatFactory;
import com.example.OOAD.model.Movie;
import com.example.OOAD.model.Screen;
import com.example.OOAD.model.Seat;
import com.example.OOAD.model.SeatStatus;
import com.example.OOAD.model.SeatType;
import com.example.OOAD.model.Show;
import com.example.OOAD.model.Theatre;
import com.example.OOAD.repository.MovieRepository;
import com.example.OOAD.repository.ScreenRepository;
import com.example.OOAD.repository.SeatRepository;
import com.example.OOAD.repository.ShowRepository;
import com.example.OOAD.repository.TheatreRepository;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.UUID;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

@Service
public class AdminService {

    private static final Path THUMBNAIL_UPLOAD_DIR = Paths.get("uploads", "thumbnails");
    private static final String[] DEFAULT_ROWS = {"A", "B", "C", "D", "E", "F", "G", "H", "I", "J"};
    private static final int DEFAULT_COLUMNS = 10;

    private final TheatreRepository theatreRepository;
    private final MovieRepository movieRepository;
    private final ScreenRepository screenRepository;
    private final ShowRepository showRepository;
    private final SeatRepository seatRepository;
    private final SeatFactory seatFactory;

    public AdminService(TheatreRepository theatreRepository,
            MovieRepository movieRepository,
            ScreenRepository screenRepository,
            ShowRepository showRepository,
            SeatRepository seatRepository,
            SeatFactory seatFactory) {
        this.theatreRepository = theatreRepository;
        this.movieRepository = movieRepository;
        this.screenRepository = screenRepository;
        this.showRepository = showRepository;
        this.seatRepository = seatRepository;
        this.seatFactory = seatFactory;
    }

    @Transactional
    public Movie addMovie(CreateMovieRequest request) {
        Movie movie = new Movie();
        movie.setMovieName(request.getMovieName());
        movie.setGenre(request.getGenre());
        movie.setDuration(request.getDuration());
        movie.setRating(request.getRating());
        movie.setThumbnailUrl(request.getThumbnailUrl());
        return movieRepository.save(movie);
    }

    @Transactional
    public void deleteMovie(Long movieId) {
        if (!movieRepository.existsById(movieId)) {
            throw new NotFoundException("Movie not found: " + movieId);
        }
        movieRepository.deleteById(movieId);
    }

    @Transactional(readOnly = true)
    public List<ScreenOptionResponse> getAllScreens() {
        return screenRepository.findAllScreenOptions();
    }

    @Transactional(readOnly = true)
    public List<ScreenOptionResponse> getScreensByTheatre(Long theatreId) {
        return screenRepository.findScreenOptionsByTheatreId(theatreId);
    }

    public String uploadThumbnail(MultipartFile file) {
        if (file == null || file.isEmpty()) {
            throw new IllegalArgumentException("Thumbnail file is required");
        }

        String originalName = file.getOriginalFilename() == null ? "thumbnail" : file.getOriginalFilename();
        String extension = "";
        int extensionIndex = originalName.lastIndexOf('.');
        if (extensionIndex >= 0) {
            extension = originalName.substring(extensionIndex);
        }

        String safeName = UUID.randomUUID() + extension;

        try {
            Files.createDirectories(THUMBNAIL_UPLOAD_DIR);
            Path targetFile = THUMBNAIL_UPLOAD_DIR.resolve(safeName);
            Files.copy(file.getInputStream(), targetFile, StandardCopyOption.REPLACE_EXISTING);
            return "/uploads/thumbnails/" + safeName;
        } catch (IOException exception) {
            throw new RuntimeException("Failed to store thumbnail", exception);
        }
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
        Screen savedScreen = screenRepository.save(screen);
        createMissingDefaultSeats(savedScreen);
        return savedScreen;
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

    @Transactional
    public void ensureDefaultSeatsForAllScreens() {
        for (Screen screen : screenRepository.findAll()) {
            createMissingDefaultSeats(screen);
        }
    }

    private void createMissingDefaultSeats(Screen screen) {
        Set<String> existingSeatNumbers = new HashSet<>();
        for (Seat seat : seatRepository.findByScreenScreenId(screen.getScreenId())) {
            existingSeatNumbers.add(seat.getSeatNumber());
        }

        List<Seat> seatsToCreate = new ArrayList<>();
        for (String row : DEFAULT_ROWS) {
            for (int column = 1; column <= DEFAULT_COLUMNS; column++) {
                String seatNumber = row + column;
                if (existingSeatNumbers.contains(seatNumber)) {
                    continue;
                }

                Seat seat = seatFactory.createSeat(seatNumber, SeatType.REGULAR);
                seat.setScreen(screen);
                seatsToCreate.add(seat);
            }
        }

        if (!seatsToCreate.isEmpty()) {
            seatRepository.saveAll(seatsToCreate);
        }
    }
}
