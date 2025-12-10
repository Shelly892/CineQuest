package comp41720.cinequest.signservice.repository;

import comp41720.cinequest.signservice.model.UserSignIn;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.Optional;

@Repository
public interface UserSignInRepository extends JpaRepository<UserSignIn, Long> {
    
    Optional<UserSignIn> findByUserIdAndSignDate(String userId, LocalDate signDate);
    
    long countByUserId(String userId);
}
