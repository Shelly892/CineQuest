package comp41720.cinequest.achievementservice.repository;

import comp41720.cinequest.achievementservice.model.UserBadge;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserBadgeRepository extends MongoRepository<UserBadge, String> {
    
    Optional<UserBadge> findByUserIdAndBadgeName(String userId, String badgeName);
    
    List<UserBadge> findByUserId(String userId);
}
