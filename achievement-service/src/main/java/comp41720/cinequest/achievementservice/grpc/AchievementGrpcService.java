package comp41720.cinequest.achievementservice.grpc;

import com.google.protobuf.Empty;
import io.grpc.stub.StreamObserver;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.grpc.server.service.GrpcService;
import comp41720.cinequest.grpc.AchievementServiceProto.*;
import comp41720.cinequest.grpc.AchievementServiceGrpc.AchievementServiceImplBase;
import comp41720.cinequest.achievementservice.service.AchievementService;

@GrpcService
@RequiredArgsConstructor
@Slf4j
public class AchievementGrpcService extends AchievementServiceImplBase {
    
    private final AchievementService achievementService;
    
    @Override
    public void notifyRatingSubmitted(NotifyRatingRequest request, StreamObserver<Empty> responseObserver) {
        log.info("Received NotifyRatingSubmitted: userId={}, movieId={}, totalRatings={}, userEmail={}, userName={}", 
                 request.getUserId(), request.getMovieId(), request.getTotalRatings(), 
                 request.getUserEmail(), request.getUserName());
        
        try {
            achievementService.processRatingCount(
                request.getUserId(), 
                request.getTotalRatings(),
                request.getUserEmail(),
                request.getUserName()
            );
            responseObserver.onNext(Empty.getDefaultInstance());
            responseObserver.onCompleted();
        } catch (Exception e) {
            log.error("Error processing rating notification", e);
            responseObserver.onError(e);
        }
    }
    
    @Override
    public void updateSignCount(UpdateSignCountRequest request, StreamObserver<Empty> responseObserver) {
        log.info("Received UpdateSignCount: userId={}, totalSignCount={}, userEmail={}, userName={}", 
                 request.getUserId(), request.getTotalSignCount(),
                 request.getUserEmail(), request.getUserName());
        
        try {
            achievementService.processSignCount(
                request.getUserId(), 
                request.getTotalSignCount(),
                request.getUserEmail(),
                request.getUserName()
            );
            responseObserver.onNext(Empty.getDefaultInstance());
            responseObserver.onCompleted();
        } catch (Exception e) {
            log.error("Error processing sign count update", e);
            responseObserver.onError(e);
        }
    }
}
