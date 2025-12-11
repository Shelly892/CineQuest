package comp41720.cinequest.signservice.service;

import comp41720.cinequest.signservice.dto.SignInResponse;
import comp41720.cinequest.signservice.model.UserSignIn;
import comp41720.cinequest.signservice.repository.UserSignInRepository;
import comp41720.cinequest.signservice.service.client.AchievementGrpcClient;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.ZoneId;

@Slf4j
@Service
@RequiredArgsConstructor
public class SignService {

    private final UserSignInRepository userSignInRepository;
    private final AchievementGrpcClient achievementGrpcClient;

    public SignInResponse signIn(String userId, String userEmail, String userName) {
        log.info("Processing sign-in for user {}", userId);

        LocalDate today = LocalDate.now(ZoneId.of("UTC"));
        long totalSignCount = 0;
        UserSignIn savedSignIn = userSignInRepository.findByUserIdAndSignDate(userId, today).orElse(null);
        if (savedSignIn == null){
            UserSignIn signIn = new UserSignIn();
            signIn.setUserId(userId);
            signIn.setSignDate(today);

            savedSignIn = userSignInRepository.save(signIn);
            log.info("Sign-in created successfully for user {} on {}", userId, today);

            totalSignCount = userSignInRepository.countByUserId(userId);

            try {
                achievementGrpcClient.updateSignCount(userId, totalSignCount, userEmail, userName);
            } catch (Exception e) {
                log.error("Failed to notify Achievement Service", e);
            }
        }else {
            totalSignCount = userSignInRepository.countByUserId(userId);
        }

        return new SignInResponse(
            savedSignIn.getId(),
            savedSignIn.getUserId(),
            savedSignIn.getSignDate(),
            totalSignCount
        );

    }
}
