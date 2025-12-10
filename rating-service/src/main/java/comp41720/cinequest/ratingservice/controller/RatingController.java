package comp41720.cinequest.ratingservice.controller;

import comp41720.cinequest.ratingservice.dto.*;
import comp41720.cinequest.ratingservice.service.RatingService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@Slf4j
@RestController
@RequestMapping("/api/ratings")
@RequiredArgsConstructor
public class RatingController {
    
    private final RatingService ratingService;
    
    @PostMapping
    public ResponseEntity<RatingResponse> createRating(
            @RequestHeader("X-User-Id") String userId,
            @RequestBody RatingRequest request) {
        log.info("POST /api/ratings - Creating rating for user {} and movie {}",
            userId, request.getMovieId());

        try {
            RatingResponse response = ratingService.createRating(userId, request);
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (IllegalArgumentException | IllegalStateException e) {
            log.error("Validation error: {}", e.getMessage());
            return ResponseEntity.badRequest().build();
        }
    }
    
    @PutMapping
    public ResponseEntity<RatingResponse> updateRating(
            @RequestHeader("X-User-Id") String userId,
            @RequestBody RatingRequest request) {
        log.info("PUT /api/ratings - Updating rating for user {} and movie {}", userId, request.getMovieId());
        
        try {
            RatingResponse response = ratingService.updateRating(userId, request);
            return ResponseEntity.ok(response);
        } catch (IllegalArgumentException e) {
            log.error("Rating not found: {}", e.getMessage());
            return ResponseEntity.notFound().build();
        }
    }
    
    @DeleteMapping
    public ResponseEntity<Void> deleteRating(
            @RequestHeader("X-User-Id") String userId,
            @RequestParam Integer movieId
            ) {
        log.info("DELETE /api/ratings?movieId={} - Deleting rating for user {} and movie {}", movieId, userId, movieId);
        
        try {
            ratingService.deleteRating(userId, movieId);
            return ResponseEntity.noContent().build();
        } catch (IllegalArgumentException e) {
            log.error("Rating not found: {}", e.getMessage());
            return ResponseEntity.notFound().build();
        }
    }
    
    @GetMapping
    public ResponseEntity<RatingResponse> getUserRatingForMovie(
            @RequestParam String userId,
            @RequestParam Integer movieId) {
        log.info("GET /api/ratings?userId={}&movieId={} - Fetching rating for user {} and movie {}", userId, movieId, userId, movieId);
        
        Optional<RatingResponse> response = ratingService.getUserRatingForMovie(userId, movieId);
        return response.map(ResponseEntity::ok)
            .orElse(ResponseEntity.notFound().build());
    }
    
    @GetMapping("/all")
    public ResponseEntity<Page<RatingResponse>> getUserRatings(
            @RequestParam String userId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        log.info("GET /api/ratings/all?userId={}&page={}&size={})", userId, page, size);
        
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        Page<RatingResponse> ratings = ratingService.getUserRatings(userId, pageable);
        
        return ResponseEntity.ok(ratings);
    }
    
    @GetMapping("/movie/{movieId}")
    public ResponseEntity<Page<RatingResponse>> getMovieRatings(
            @PathVariable Integer movieId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        log.info("GET /api/ratings/movie/{}?page={}&size={}", movieId, page, size);
        
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        Page<RatingResponse> ratings = ratingService.getMovieRatings(movieId, pageable);
        
        return ResponseEntity.ok(ratings);
    }
    
    @GetMapping("/movie/{movieId}/stats")
    public ResponseEntity<MovieRatingStats> getMovieRatingStats(@PathVariable Integer movieId) {
        log.info("GET /api/ratings/movie/{}/stats - Fetching rating statistics", movieId);
        
        MovieRatingStats stats = ratingService.getMovieRatingStats(movieId);
        return ResponseEntity.ok(stats);
    }
}
