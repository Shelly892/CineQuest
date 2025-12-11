package comp41720.cinequest.achievementservice.grpc;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.grpc.server.service.GrpcService;
import comp41720.cinequest.grpc.AchievementServiceProto.*;
import comp41720.cinequest.grpc.AchievementServiceGrpc.AchievementServiceImplBase;
import comp41720.cinequest.achievementservice.service.AchievementService;
@GrpcService
@RequiredArgsConstructor
@Slf4j
public class AchievementGrpcService extends AchievementServiceImplBase{
    private final AchievementService achievementService;
}
