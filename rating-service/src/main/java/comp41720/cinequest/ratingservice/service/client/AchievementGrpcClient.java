package comp41720.cinequest.ratingservice.service.client;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import net.devh.boot.grpc.client.inject.GrpcClient;
import org.springframework.stereotype.Service;
import comp41720.cinequest.grpc.AchievementServiceGrpc;

@Service
@RequiredArgsConstructor
@Slf4j
public class AchievementGrpcClient {
    @GrpcClient("achievement-service")
    private AchievementServiceGrpc.AchievementServiceBlockingStub achievementStub;

    public void notifyRatingSubmitted(String userId, Integer movieId, long totalRatings) {
    }
}
