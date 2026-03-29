package com.example.OOAD.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "shows")
public class Show {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "show_id")
    private int showId;
    
    @Column(name = "show_name", nullable = false)
    private String showName;
    
    @Column(name = "show_time", nullable = false)
    private LocalDateTime showTime;
    
    @ManyToOne
    @JoinColumn(name = "screen_id", nullable = false)
    private Screen screen;
    
    @OneToMany(mappedBy = "show", cascade = CascadeType.ALL)
    private List<Booking> bookings = new ArrayList<>();
    
    // No-argument constructor (required by JPA)
    public Show() {
    }
    
    // Constructor with parameters
    public Show(int showId, String showName, LocalDateTime showTime) {
        this.showId = showId;
        this.showName = showName;
        this.showTime = showTime;
    }
    
    // Getters and Setters
    public int getShowId() {
        return showId;
    }
    
    public void setShowId(int showId) {
        this.showId = showId;
    }
    
    public String getShowName() {
        return showName;
    }
    
    public void setShowName(String showName) {
        this.showName = showName;
    }
    
    public LocalDateTime getShowTime() {
        return showTime;
    }
    
    public void setShowTime(LocalDateTime showTime) {
        this.showTime = showTime;
    }
    
    public Screen getScreen() {
        return screen;
    }
    
    public void setScreen(Screen screen) {
        this.screen = screen;
    }
    
    public List<Booking> getBookings() {
        return bookings;
    }
    
    public void setBookings(List<Booking> bookings) {
        this.bookings = bookings;
    }
}
