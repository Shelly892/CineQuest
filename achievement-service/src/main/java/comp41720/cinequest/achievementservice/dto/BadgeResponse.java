package comp41720.cinequest.achievementservice.dto;

import comp41720.cinequest.achievementservice.model.UserBadge;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class BadgeResponse {
    private String id;
    private String userId;
    private String badgeName;
    private String badgeType;
    private String badgeLevel;
    private String description;
    private Instant earnedAt;
    
    public static BadgeResponse from(UserBadge badge) {
        return new BadgeResponse(
            badge.getId(),
            badge.getUserId(),
            badge.getBadgeName(),
            badge.getBadgeType().name(),
            badge.getBadgeLevel().name(),
            badge.getDescription(),
            badge.getEarnedAt()
        );
    }
}
