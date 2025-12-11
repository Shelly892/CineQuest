package comp41720.cinequest.achievementservice.service;

import comp41720.cinequest.achievementservice.model.UserBadge;
import comp41720.cinequest.achievementservice.repository.UserBadgeRepository;
import comp41720.cinequest.events.AchievementUnlocked;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.List;
import java.util.Optional;

@Slf4j
@Service
@RequiredArgsConstructor
public class AchievementService {
    
    private final UserBadgeRepository userBadgeRepository;
    private final KafkaTemplate<String, AchievementUnlocked> kafkaTemplate;
    
    public void processSignCount(String userId, long totalSignCount, String userEmail, String userName) {
        log.info("Processing sign count for userId={}, count={}, userEmail={}, userName={}", 
                 userId, totalSignCount, userEmail, userName);
        
        BadgeDefinition badge = determineSignBadge(totalSignCount);
        if (badge != null) {
            awardBadge(userId, badge, UserBadge.BadgeType.SIGN, userEmail, userName);
        }
    }
    
    public void processRatingCount(String userId, long totalRatings, String userEmail, String userName) {
        log.info("Processing rating count for userId={}, count={}, userEmail={}, userName={}", 
                 userId, totalRatings, userEmail, userName);
        
        BadgeDefinition badge = determineRatingBadge(totalRatings);
        if (badge != null) {
            awardBadge(userId, badge, UserBadge.BadgeType.RATING, userEmail, userName);
        }
    }
    
    public List<UserBadge> getUserBadges(String userId) {
        log.info("Fetching badges for userId={}", userId);
        return userBadgeRepository.findByUserId(userId);
    }
    
    private BadgeDefinition determineSignBadge(long count) {
        if (count == 100) {
            return new BadgeDefinition("Sign God", UserBadge.BadgeLevel.Platinum, "Signed in 100 days");
        } else if (count == 50) {
            return new BadgeDefinition("Sign Master", UserBadge.BadgeLevel.Gold, "Signed in 50 days");
        } else if (count == 10) {
            return new BadgeDefinition("Sign Regular", UserBadge.BadgeLevel.Silver, "Signed in 10 days");
        } else if (count == 1) {
            return new BadgeDefinition("Sign Novice", UserBadge.BadgeLevel.Bronze, "Signed in 1 days");
        }
        return null;
    }

    private BadgeDefinition determineRatingBadge(long count) {
        if (count == 50) {
            return new BadgeDefinition("Opinion Leader", UserBadge.BadgeLevel.Gold, "Posted 50 ratings");
        } else if (count == 10) {
            return new BadgeDefinition("Critic", UserBadge.BadgeLevel.Silver, "Posted 10 ratings");
        } else if (count == 1) {
            return new BadgeDefinition("Commentator", UserBadge.BadgeLevel.Bronze, "Posted 1 ratings");
        }
        return null;
    }
    
    private void awardBadge(String userId, BadgeDefinition badgeDef, UserBadge.BadgeType badgeType, 
                           String userEmail, String userName) {
        // Check if badge already exists (idempotency)
        Optional<UserBadge> existing = userBadgeRepository.findByUserIdAndBadgeName(userId, badgeDef.name);
        
        if (existing.isPresent()) {
            log.info("Badge '{}' already awarded to userId={}", badgeDef.name, userId);
            return;
        }
        
        // Create and save new badge
        Instant now = Instant.now();
        UserBadge badge = new UserBadge();
        badge.setUserId(userId);
        badge.setBadgeName(badgeDef.name);
        badge.setBadgeType(badgeType);
        badge.setBadgeLevel(badgeDef.level);
        badge.setDescription(badgeDef.description);
        badge.setEarnedAt(now);
        
        userBadgeRepository.save(badge);
        log.info("Badge '{}' awarded to userId={}", badgeDef.name, userId);
        
        // Publish Kafka event with user email and name
        publishAchievementUnlocked(userId, badgeDef, now, userEmail, userName);
    }
    
    private void publishAchievementUnlocked(String userId, BadgeDefinition badgeDef, Instant earnedAt,
                                           String userEmail, String userName) {
        AchievementUnlocked event = AchievementUnlocked.newBuilder()
            .setUserId(userId)
            .setUserEmail(userEmail)
            .setUserName(userName)
            .setBadgeName(badgeDef.name)
            .setBadgeLevel(badgeDef.level.name())
            .setDescription(badgeDef.description)
            .setEarnedAt(earnedAt.toString())
            .build();
        
        kafkaTemplate.send("achievement_unlocked", userId, event);
        log.info("Published achievement_unlocked event for userId={}, badge={}, userEmail={}, userName={}", 
                 userId, badgeDef.name, userEmail, userName);
    }
    
    private static class BadgeDefinition {
        String name;
        UserBadge.BadgeLevel level;
        String description;
        
        BadgeDefinition(String name, UserBadge.BadgeLevel level, String description) {
            this.name = name;
            this.level = level;
            this.description = description;
        }
    }
}
