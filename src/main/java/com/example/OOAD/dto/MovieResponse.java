package com.example.OOAD.dto;

public class MovieResponse {

    private Long movieId;
    private String title;
    private String genre;
    private String duration;
    private String rating;
    private String thumbnailUrl;

    public MovieResponse(Long movieId, String title, String genre, String duration, String rating, String thumbnailUrl) {
        this.movieId = movieId;
        this.title = title;
        this.genre = genre;
        this.duration = duration;
        this.rating = rating;
        this.thumbnailUrl = thumbnailUrl;
    }

    public Long getMovieId() {
        return movieId;
    }

    public String getTitle() {
        return title;
    }

    public String getGenre() {
        return genre;
    }

    public String getDuration() {
        return duration;
    }

    public String getRating() {
        return rating;
    }

    public String getThumbnailUrl() {
        return thumbnailUrl;
    }
}