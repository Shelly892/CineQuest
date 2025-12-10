package comp41720.cinequest.signservice.service.client;

import com.google.protobuf.Empty;
import comp41720.cinequest.grpc.AchievementServiceGrpc;
import comp41720.cinequest.grpc.AchievementServiceProto.UpdateSignCountRequest;
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

    public void updateSignCount(String userId, long totalSignCount) {
        log.info("Notifying Achievement Service: userId={}, totalSignCount={}", 
                 userId, totalSignCount);
        
        try {
            UpdateSignCountRequest request = UpdateSignCountRequest.newBuilder()
                .setUserId(userId)
                .setTotalSignCount(totalSignCount)
                .build();
            
            Empty response = achievementStub.updateSignCount(request);
            
            log.info("Successfully notified Achievement Service for user {}", userId);
        } catch (Exception e) {
            log.error("Failed to notify Achievement Service for user {}: {}", userId, e.getMessage(), e);
            throw e;
        }
    }
}
