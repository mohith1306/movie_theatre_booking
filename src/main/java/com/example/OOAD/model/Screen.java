package com.example.OOAD.model;

import jakarta.persistence.*;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "screens")
public class Screen {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "screen_id")
    private int screenId;
    
    @Column(name = "screen_name", nullable = false)
    private String screenName;
    
    @ManyToOne
    @JoinColumn(name = "theatre_id", nullable = false)
    private Theatre theatre;
    
    @OneToMany(mappedBy = "screen", cascade = CascadeType.ALL)
    private List<Seat> seats = new ArrayList<>();
    
    @OneToMany(mappedBy = "screen", cascade = CascadeType.ALL)
    private List<Show> shows = new ArrayList<>();
    
    // No-argument constructor (required by JPA)
    public Screen() {
    }
    
    // Constructor with parameters
    public Screen(int screenId, String screenName) {
        this.screenId = screenId;
        this.screenName = screenName;
    }
    
    // Getters and Setters
    public int getScreenId() {
        return screenId;
    }
    
    public void setScreenId(int screenId) {
        this.screenId = screenId;
    }
    
    public String getScreenName() {
        return screenName;
    }
    
    public void setScreenName(String screenName) {
        this.screenName = screenName;
    }
    
    public Theatre getTheatre() {
        return theatre;
    }
    
    public void setTheatre(Theatre theatre) {
        this.theatre = theatre;
    }
    
    public List<Seat> getSeats() {
        return seats;
    }
    
    public void setSeats(List<Seat> seats) {
        this.seats = seats;
    }
    
    public List<Show> getShows() {
        return shows;
    }
    
    public void setShows(List<Show> shows) {
        this.shows = shows;
    }
}
