package com.cinequest.movieservice.controller;

import com.cinequest.movieservice.model.Movie;
import com.cinequest.movieservice.model.TMDBResponse;
import com.cinequest.movieservice.service.TMDBService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/movies")
@CrossOrigin(origins = "*")
@Slf4j
public class MovieController {

    private final TMDBService tmdbService;

    public MovieController(TMDBService tmdbService) {
        this.tmdbService = tmdbService;
    }

    /**
     * 获取热门电影
     * GET /api/movies/popular?page=1
     */
    @GetMapping("/popular")
    public ResponseEntity<TMDBResponse> getPopularMovies(
            @RequestParam(defaultValue = "1") int page
    ) {
        log.info("Request received: GET /api/movies/popular?page={}", page);
        TMDBResponse response = tmdbService.getPopularMovies(page);
        log.info("Returning {} movies", response.getResults() != null ? response.getResults().size() : 0);
        return ResponseEntity.ok(response);
    }

    /**
     * 获取电影详情
     * GET /api/movies/{id}
     */
    @GetMapping("/{id}")
    public ResponseEntity<Movie> getMovieDetails(@PathVariable Long id) {
        log.info("Request received: GET /api/movies/{}", id);
        Movie movie = tmdbService.getMovieDetails(id);
        log.info("Returning movie: {}", movie != null ? movie.getTitle() : "null");
        return ResponseEntity.ok(movie);
    }

    /**
     * 搜索电影
     * GET /api/movies/search?q=batman&page=1
     */
    @GetMapping("/search")
    public ResponseEntity<TMDBResponse> searchMovies(
            @RequestParam String q,
            @RequestParam(defaultValue = "1") int page
    ) {
        log.info("Request received: GET /api/movies/search?q={}&page={}", q, page);
        TMDBResponse response = tmdbService.searchMovies(q, page);
        log.info("Returning {} search results", response.getResults() != null ? response.getResults().size() : 0);
        return ResponseEntity.ok(response);
    }

    /**
     * 健康检查
     * GET /api/movies/health
     */
    @GetMapping("/health")
    public ResponseEntity<String> health() {
        log.info("Health check");
        return ResponseEntity.ok("Movie Service is running! 🎬");
    }
}