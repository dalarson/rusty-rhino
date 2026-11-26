package com.rusty_rhino.rusty_api;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableAsync;

@SpringBootApplication
@EnableAsync
public class RustyApiApplication {

	public static void main(String[] args) {
		SpringApplication.run(RustyApiApplication.class, args);
	}
}
