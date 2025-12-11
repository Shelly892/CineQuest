package com.cinequest.movieservice;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cache.annotation.EnableCaching;

@SpringBootApplication
@EnableCaching    //启用 Spring 缓存支持
public class MovieServiceApplication {
	public static void main(String[] args) {
		SpringApplication.run(MovieServiceApplication.class, args);
	}
}