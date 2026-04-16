package com.example.OOAD;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class OoadApplication {

	public static void main(String[] args) {
		SpringApplication.run(OoadApplication.class, args);
	}

}
