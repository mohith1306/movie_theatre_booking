package com.example.OOAD.repository;

import com.example.OOAD.model.Movie;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface MovieRepository extends JpaRepository<Movie, Long> {
	Optional<Movie> findByMovieName(String movieName);
	boolean existsByMovieName(String movieName);
}