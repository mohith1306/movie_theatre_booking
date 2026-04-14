package com.example.OOAD.dto;

import java.util.List;

public class TheatreResponse {

    private Long theatreId;
    private String name;
    private String location;
    private List<ShowResponse> shows;

    public TheatreResponse(Long theatreId, String name, String location, List<ShowResponse> shows) {
        this.theatreId = theatreId;
        this.name = name;
        this.location = location;
        this.shows = shows;
    }

    public Long getTheatreId() {
        return theatreId;
    }

    public String getName() {
        return name;
    }

    public String getLocation() {
        return location;
    }

    public List<ShowResponse> getShows() {
        return shows;
    }
}