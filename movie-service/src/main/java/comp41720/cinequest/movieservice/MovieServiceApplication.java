package comp41720.cinequest.movieservice;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cache.annotation.EnableCaching;

@SpringBootApplication
@EnableCaching    // Enable Spring cache support
public class MovieServiceApplication {
	public static void main(String[] args) {
		SpringApplication.run(MovieServiceApplication.class, args);
	}
}