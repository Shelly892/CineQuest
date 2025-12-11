package comp41720.cinequest.ratingservice.service.client;

import com.google.protobuf.Empty;
import comp41720.cinequest.grpc.AchievementServiceGrpc;
import comp41720.cinequest.grpc.AchievementServiceProto.NotifyRatingRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import net.devh.boot.grpc.client.inject.GrpcClient;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class AchievementGrpcClient {
    @GrpcClient("achievement-service")
    private AchievementServiceGrpc.AchievementServiceBlockingStub achievementStub;

    public void notifyRatingSubmitted(String userId, Integer movieId, long totalRatings, String userEmail, String userName) {
        log.info("Notifying Achievement Service: userId={}, movieId={}, totalRatings={}, userEmail={}, userName={}", 
                 userId, movieId, totalRatings, userEmail, userName);
        
        try {
            NotifyRatingRequest request = NotifyRatingRequest.newBuilder()
                .setUserId(userId)
                .setMovieId(movieId)
                .setTotalRatings(totalRatings)
                .setUserEmail(userEmail)
                .setUserName(userName)
                .build();
            
            Empty response = achievementStub.notifyRatingSubmitted(request);
            
            log.info("Successfully notified Achievement Service for user {}", userId);
        } catch (Exception e) {
            log.error("Failed to notify Achievement Service for user {}: {}", userId, e.getMessage(), e);
            throw e;
        }
    }
}
