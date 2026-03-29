package com.example.OOAD.model;

import jakarta.persistence.*;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "theatres")
public class Theatre {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "theatre_id")
    private int theatreId;
    
    @Column(name = "name", nullable = false)
    private String name;
    
    @Column(name = "location", nullable = false)
    private String location;
    
    @OneToMany(mappedBy = "theatre", cascade = CascadeType.ALL)
    private List<Screen> screens = new ArrayList<>();
    
    public Theatre() {
    }
    public Theatre(int theatreId, String name, String location) {
        this.theatreId = theatreId;
        this.name = name;
        this.location = location;
    }
    
    // Getters and Setters
    public int getTheatreId() {
        return theatreId;
    }
    
    public void setTheatreId(int theatreId) {
        this.theatreId = theatreId;
    }
    
    public String getName() {
        return name;
    }
    
    public void setName(String name) {
        this.name = name;
    }
    
    public String getLocation() {
        return location;
    }
    
    public void setLocation(String location) {
        this.location = location;
    }
    
    public List<Screen> getScreens() {
        return screens;
    }
    
    public void setScreens(List<Screen> screens) {
        this.screens = screens;
    }
}
