package com.example.OOAD.controller;

import com.example.OOAD.dto.MovieResponse;
import com.example.OOAD.dto.TheatreResponse;
import com.example.OOAD.service.CatalogService;
import java.util.List;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping
public class CatalogController {

    private final CatalogService catalogService;

    public CatalogController(CatalogService catalogService) {
        this.catalogService = catalogService;
    }

    @GetMapping("/movies")
    public ResponseEntity<List<MovieResponse>> getMovies() {
        return ResponseEntity.ok(catalogService.getMovies());
    }

    @GetMapping("/theatres")
    public ResponseEntity<List<TheatreResponse>> getTheatres() {
        return ResponseEntity.ok(catalogService.getTheatres());
    }
}