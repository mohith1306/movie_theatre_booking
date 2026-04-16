package com.example.OOAD.service;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.OOAD.dto.AdminLoginRequest;
import com.example.OOAD.dto.AuthResponse;
import com.example.OOAD.dto.LoginRequest;
import com.example.OOAD.dto.RegisterRequest;
import com.example.OOAD.exception.BadRequestException;
import com.example.OOAD.model.Admin;
import com.example.OOAD.model.Customer;
import com.example.OOAD.model.User;
import com.example.OOAD.repository.UserRepository;
import com.example.OOAD.security.JwtUtil;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final JwtUtil jwtUtil;
    private final PasswordEncoder passwordEncoder;

    public AuthService(UserRepository userRepository, JwtUtil jwtUtil, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.jwtUtil = jwtUtil;
        this.passwordEncoder = passwordEncoder;
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
            user.setUsername(resolveAdminUsername(request));
        } else {
            user = new Customer();
        }
        user.setName(request.getName());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));

        User saved = userRepository.save(user);
        return toAuthResponse(saved);
    }

    public AuthResponse adminLogin(AdminLoginRequest request) {
        if (request.getUsername() == null || request.getUsername().isBlank()) {
            throw new BadRequestException("Username is required");
        }
        if (request.getPassword() == null || request.getPassword().isBlank()) {
            throw new BadRequestException("Password is required");
        }

        User user = userRepository.findByUsername(request.getUsername())
                .orElseThrow(() -> new BadRequestException("Invalid username or password"));

        if (!(user instanceof Admin)) {
            throw new BadRequestException("Invalid username or password");
        }

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new BadRequestException("Invalid username or password");
        }

        return toAuthResponse(user);
    }

    public AuthResponse login(LoginRequest request) {
        System.out.println("[LOGIN] Attempting login for email: " + request.getEmail());
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> {
                    System.out.println("[LOGIN] User not found for email: " + request.getEmail());
                    return new BadRequestException("Invalid email or password");
                });

        System.out.println("[LOGIN] User found: " + user.getEmail());
        System.out.println("[LOGIN] Stored hash: " + user.getPassword().substring(0, Math.min(20, user.getPassword().length())) + "...");
        
        boolean passwordMatches = passwordEncoder.matches(request.getPassword(), user.getPassword());
        System.out.println("[LOGIN] Password match result: " + passwordMatches);
        
        if (!passwordMatches) {
            System.out.println("[LOGIN] Password mismatch for user: " + request.getEmail());
            throw new BadRequestException("Invalid email or password");
        }

        System.out.println("[LOGIN] Login successful for user: " + request.getEmail());
        return toAuthResponse(user);
    }

    private AuthResponse toAuthResponse(User user) {
        String role = (user instanceof Admin) ? "ADMIN" : "CUSTOMER";
        String token = jwtUtil.generateToken(user.getEmail(), user.getUserId(), role);
        return new AuthResponse(user.getUserId(), user.getName(), user.getUsername(), user.getEmail(), role, token);
    }

    private String resolveAdminUsername(RegisterRequest request) {
        if (request.getUsername() != null && !request.getUsername().isBlank()) {
            return request.getUsername().trim();
        }

        String email = request.getEmail();
        if (email != null && email.contains("@")) {
            return email.substring(0, email.indexOf('@')).trim();
        }

        return "admin";
    }
}
