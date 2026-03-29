package com.example.OOAD.model;

import jakarta.persistence.*;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "seats")
public class Seat {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "seat_id")
    private int seatId;
    
    @Column(name = "seat_number", nullable = false)
    private String seatNumber;
    
    @Column(name = "type", nullable = false)
    private String type;
    
    @Column(name = "status", nullable = false)
    private String status;
    
    @ManyToOne
    @JoinColumn(name = "screen_id", nullable = false)
    private Screen screen;
    
    @ManyToMany(mappedBy = "seats")
    private List<Booking> bookings = new ArrayList<>();
    public Seat() {
    }
    public Seat(String seatNumber, String type, String status) {
        this.seatNumber = seatNumber;
        this.type = type;
        this.status = status;
    }
    public int getSeatId() {
        return seatId;
    }
    
    public void setSeatId(int seatId) {
        this.seatId = seatId;
    }
    
    public String getSeatNumber() {
        return seatNumber;
    }
    
    public void setSeatNumber(String seatNumber) {
        this.seatNumber = seatNumber;
    }
    
    public String getType() {
        return type;
    }
    
    public void setType(String type) {
        this.type = type;
    }
    
    public String getStatus() {
        return status;
    }
    
    public void setStatus(String status) {
        this.status = status;
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
