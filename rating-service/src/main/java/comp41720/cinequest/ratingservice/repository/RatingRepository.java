package comp41720.cinequest.ratingservice.repository;

import comp41720.cinequest.ratingservice.model.Rating;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface RatingRepository extends MongoRepository<Rating, String> {
    
    Page<Rating> findByUserId(String userId, Pageable pageable);
    
    Page<Rating> findByMovieId(Integer movieId, Pageable pageable);
    
    Optional<Rating> findByUserIdAndMovieId(String userId, Integer movieId);
    
    List<Rating> findByMovieId(Integer movieId);
    
    long countByUserId(String userId);
}
