package com.example.OOAD.config;

import com.example.OOAD.service.AdminService;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class SeatBootstrap {

    @Bean
    public CommandLineRunner backfillDefaultSeats(AdminService adminService) {
        return args -> adminService.ensureDefaultSeatsForAllScreens();
    }
}
