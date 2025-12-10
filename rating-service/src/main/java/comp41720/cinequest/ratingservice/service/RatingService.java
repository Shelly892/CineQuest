package comp41720.cinequest.ratingservice.service;

import comp41720.cinequest.ratingservice.dto.*;
import comp41720.cinequest.ratingservice.model.Rating;
import comp41720.cinequest.ratingservice.repository.RatingRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.List;
import java.util.Optional;

@Slf4j
@Service
@RequiredArgsConstructor
public class RatingService {
    
    private final RatingRepository ratingRepository;
    private final AchievementNotificationService achievementNotificationService;
    
    public RatingResponse createRating(RatingRequest request) {
        log.info("Creating rating for user {} and movie {}", request.getUserId(), request.getMovieId());
        
        // Validate score range
        if (request.getScore() < 1 || request.getScore() > 10) {
            throw new IllegalArgumentException("Score must be between 1 and 10");
        }
        
        // Check if user has already rated this movie
        Optional<Rating> existingRating = ratingRepository.findByUserIdAndMovieId(
            request.getUserId(), 
            request.getMovieId()
        );
        
        if (existingRating.isPresent()) {
            throw new IllegalStateException("User has already rated this movie");
        }
        
        Rating rating = new Rating();
        rating.setUserId(request.getUserId());
        rating.setMovieId(request.getMovieId());
        rating.setScore(request.getScore());
        rating.setComment(request.getComment());
        rating.setCreatedAt(Instant.now());
        
        Rating savedRating = ratingRepository.save(rating);
        log.info("Rating created successfully with ID: {}", savedRating.getId());
        
        // Notify Achievement Service
        try {
            long totalRatings = ratingRepository.countByUserId(request.getUserId());
            achievementNotificationService.notifyRatingSubmitted(
                request.getUserId(), 
                request.getMovieId(), 
                totalRatings
            );
        } catch (Exception e) {
            log.error("Failed to notify Achievement Service", e);
            // Don't fail the rating creation if notification fails
        }
        
        return mapToResponse(savedRating);
    }
    
    public RatingResponse updateRating(String ratingId, RatingUpdateRequest request) {
        log.info("Updating rating with ID: {}", ratingId);
        
        Rating rating = ratingRepository.findById(ratingId)
            .orElseThrow(() -> new IllegalArgumentException("Rating not found"));
        
        // Validate score range if provided
        if (request.getScore() != null) {
            if (request.getScore() < 1 || request.getScore() > 10) {
                throw new IllegalArgumentException("Score must be between 1 and 10");
            }
            rating.setScore(request.getScore());
        }
        
        if (request.getComment() != null) {
            rating.setComment(request.getComment());
        }
        
        Rating updatedRating = ratingRepository.save(rating);
        log.info("Rating updated successfully");
        
        return mapToResponse(updatedRating);
    }
    
    public void deleteRating(String ratingId) {
        log.info("Deleting rating with ID: {}", ratingId);
        
        if (!ratingRepository.existsById(ratingId)) {
            throw new IllegalArgumentException("Rating not found");
        }
        
        ratingRepository.deleteById(ratingId);
        log.info("Rating deleted successfully");
    }

    
    public Optional<RatingResponse> getUserRatingForMovie(String userId, Integer movieId) {
        log.info("Fetching rating for user {} and movie {}", userId, movieId);
        
        return ratingRepository.findByUserIdAndMovieId(userId, movieId)
            .map(this::mapToResponse);
    }
    
    public Page<RatingResponse> getUserRatings(String userId, Pageable pageable) {
        log.info("Fetching ratings for user: {}", userId);
        
        return ratingRepository.findByUserId(userId, pageable)
            .map(this::mapToResponse);
    }
    
    public Page<RatingResponse> getMovieRatings(Integer movieId, Pageable pageable) {
        log.info("Fetching ratings for movie: {}", movieId);
        
        return ratingRepository.findByMovieId(movieId, pageable)
            .map(this::mapToResponse);
    }
    
    public MovieRatingStats getMovieRatingStats(Integer movieId) {
        log.info("Calculating rating statistics for movie: {}", movieId);
        
        List<Rating> ratings = ratingRepository.findByMovieId(movieId);
        
        if (ratings.isEmpty()) {
            return new MovieRatingStats(movieId, 0.0, 0L);
        }
        
        double averageScore = ratings.stream()
            .mapToInt(Rating::getScore)
            .average()
            .orElse(0.0);
        
        return new MovieRatingStats(movieId, averageScore, (long) ratings.size());
    }
    
    private RatingResponse mapToResponse(Rating rating) {
        return new RatingResponse(
            rating.getId(),
            rating.getUserId(),
            rating.getMovieId(),
            rating.getScore(),
            rating.getComment(),
            rating.getCreatedAt()
        );
    }
}
