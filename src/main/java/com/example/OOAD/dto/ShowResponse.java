package com.example.OOAD.dto;

import java.time.LocalDateTime;

public class ShowResponse {

    private Long showId;
    private String movieName;
    private LocalDateTime showTime;
    private Long screenId;
    private String screenName;

    public ShowResponse(Long showId, String movieName, LocalDateTime showTime, Long screenId, String screenName) {
        this.showId = showId;
        this.movieName = movieName;
        this.showTime = showTime;
        this.screenId = screenId;
        this.screenName = screenName;
    }

    public Long getShowId() {
        return showId;
    }

    public String getMovieName() {
        return movieName;
    }

    public LocalDateTime getShowTime() {
        return showTime;
    }

    public Long getScreenId() {
        return screenId;
    }

    public String getScreenName() {
        return screenName;
    }
}