package com.example.OOAD.config;

import com.example.OOAD.model.Admin;
import com.example.OOAD.model.User;
import com.example.OOAD.repository.UserRepository;
import java.util.List;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

@Component
public class AdminBootstrap implements CommandLineRunner {

    private final UserRepository userRepository;

    public AdminBootstrap(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    @Transactional
    public void run(String... args) {
        List<User> users = userRepository.findAll();
        boolean updated = false;

        for (User user : users) {
            if (user instanceof Admin && (user.getUsername() == null || user.getUsername().isBlank())) {
                user.setUsername(deriveUsername(user));
                updated = true;
            }
        }

        if (updated) {
            userRepository.saveAll(users);
        }
    }

    private String deriveUsername(User user) {
        if (user.getEmail() != null && user.getEmail().contains("@")) {
            return user.getEmail().substring(0, user.getEmail().indexOf('@')).toLowerCase();
        }

        return "admin";
    }
}