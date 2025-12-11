package comp41720.cinequest.achievementservice.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.CompoundIndex;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

import java.time.Instant;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "user_badges")
@CompoundIndex(name = "user_badge_unique", def = "{'userId': 1, 'badgeName': 1}", unique = true)
public class UserBadge {
    
    @Id
    private String id;
    
    @Field("user_id")
    private String userId;
    
    @Field("badge_name")
    private String badgeName;
    
    @Field("badge_type")
    private BadgeType badgeType;
    
    @Field("badge_level")
    private BadgeLevel badgeLevel;
    
    @Field("description")
    private String description;
    
    @Field("earned_at")
    private Instant earnedAt;
    
    public enum BadgeType {
        SIGN,
        RATING
    }
    
    public enum BadgeLevel {
        Bronze,
        Silver,
        Gold,
        Platinum
    }
}
