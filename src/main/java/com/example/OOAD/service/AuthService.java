package com.example.OOAD.service;

import com.example.OOAD.dto.AuthResponse;
import com.example.OOAD.dto.LoginRequest;
import com.example.OOAD.dto.RegisterRequest;
import com.example.OOAD.exception.BadRequestException;
import com.example.OOAD.model.Admin;
import com.example.OOAD.model.Customer;
import com.example.OOAD.model.User;
import com.example.OOAD.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AuthService {

    private final UserRepository userRepository;

    public AuthService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Transactional
    public AuthResponse register(RegisterRequest request) {
        if (request.getEmail() == null || request.getEmail().isBlank()) {
            throw new BadRequestException("Email is required");
        }
        if (request.getPassword() == null || request.getPassword().isBlank()) {
            throw new BadRequestException("Password is required");
        }
        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new BadRequestException("Email is already registered");
        }

        User user;
        if (request.isAdmin()) {
            user = new Admin();
        } else {
            user = new Customer();
        }
        user.setName(request.getName());
        user.setEmail(request.getEmail());
        user.setPassword(request.getPassword());

        User saved = userRepository.save(user);
        return toAuthResponse(saved);
    }

    public AuthResponse login(LoginRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new BadRequestException("Invalid email or password"));

        if (!user.getPassword().equals(request.getPassword())) {
            throw new BadRequestException("Invalid email or password");
        }

        return toAuthResponse(user);
    }

    private AuthResponse toAuthResponse(User user) {
        String role = (user instanceof Admin) ? "ADMIN" : "CUSTOMER";
        return new AuthResponse(user.getUserId(), user.getName(), user.getEmail(), role);
    }
}
