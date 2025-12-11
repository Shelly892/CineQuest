package comp41720.cinequest.achievementservice.controller;

import comp41720.cinequest.achievementservice.dto.BadgeResponse;
import comp41720.cinequest.achievementservice.model.UserBadge;
import comp41720.cinequest.achievementservice.service.AchievementService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@RestController
@RequestMapping("/api/achievements")
@RequiredArgsConstructor
public class AchievementController {
    
    private final AchievementService achievementService;
    
    @GetMapping("/users/{userId}/badges")
    public ResponseEntity<List<BadgeResponse>> getUserBadges(@PathVariable String userId) {
        log.info("GET /api/achievements/users/{}/badges", userId);
        
        List<UserBadge> badges = achievementService.getUserBadges(userId);
        List<BadgeResponse> response = badges.stream()
            .map(BadgeResponse::from)
            .collect(Collectors.toList());
        
        return ResponseEntity.ok(response);
    }
}
