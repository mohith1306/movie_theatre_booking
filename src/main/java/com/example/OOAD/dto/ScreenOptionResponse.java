package com.example.OOAD.dto;

public class ScreenOptionResponse {

    private Long screenId;
    private String screenName;
    private Long theatreId;

    public ScreenOptionResponse(Long screenId, String screenName, Long theatreId) {
        this.screenId = screenId;
        this.screenName = screenName;
        this.theatreId = theatreId;
    }

    public Long getScreenId() {
        return screenId;
    }

    public String getScreenName() {
        return screenName;
    }

    public Long getTheatreId() {
        return theatreId;
    }
}