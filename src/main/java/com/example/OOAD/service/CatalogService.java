package com.example.OOAD.service;

import com.example.OOAD.dto.MovieResponse;
import com.example.OOAD.dto.ShowResponse;
import com.example.OOAD.dto.TheatreResponse;
import com.example.OOAD.model.Movie;
import com.example.OOAD.model.Show;
import com.example.OOAD.model.Theatre;
import com.example.OOAD.repository.MovieRepository;
import com.example.OOAD.repository.ShowRepository;
import com.example.OOAD.repository.TheatreRepository;
import java.util.Comparator;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class CatalogService {

    private final MovieRepository movieRepository;
    private final TheatreRepository theatreRepository;
    private final ShowRepository showRepository;

    public CatalogService(MovieRepository movieRepository, TheatreRepository theatreRepository, ShowRepository showRepository) {
        this.movieRepository = movieRepository;
        this.theatreRepository = theatreRepository;
        this.showRepository = showRepository;
    }

    @Transactional(readOnly = true)
    public List<MovieResponse> getMovies() {
        return movieRepository.findAll().stream()
                .sorted(Comparator.comparing(Movie::getMovieId))
                .map(movie -> new MovieResponse(
                        movie.getMovieId(),
                        movie.getMovieName(),
                        movie.getGenre(),
                        movie.getDuration(),
                        movie.getRating(),
                        movie.getThumbnailUrl()))
                .toList();
    }

    @Transactional(readOnly = true)
    public List<TheatreResponse> getTheatres() {
        List<Theatre> theatres = theatreRepository.findAll();
        List<Show> shows = showRepository.findAll();

        Map<Long, List<ShowResponse>> showsByTheatre = shows.stream()
                .filter(show -> show.getScreen() != null && show.getScreen().getTheatre() != null)
                .collect(Collectors.groupingBy(
                        show -> show.getScreen().getTheatre().getTheatreId(),
                        Collectors.mapping(show -> new ShowResponse(
                                show.getShowId(),
                                show.getMovieName(),
                                show.getShowTime(),
                                show.getScreen().getScreenId(),
                                show.getScreen().getScreenName()),
                                Collectors.toList())));

        return theatres.stream()
                .sorted(Comparator.comparing(Theatre::getTheatreId))
                .map(theatre -> new TheatreResponse(
                        theatre.getTheatreId(),
                        theatre.getName(),
                        theatre.getLocation(),
                        showsByTheatre.getOrDefault(theatre.getTheatreId(), List.of())))
                .toList();
    }
}