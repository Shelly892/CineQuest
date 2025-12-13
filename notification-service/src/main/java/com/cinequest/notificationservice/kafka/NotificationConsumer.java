package com.cinequest.notificationservice.kafka;

import com.cinequest.notificationservice.events.AchievementUnlocked;
import com.cinequest.notificationservice.service.EmailService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Component;

@Component
@Slf4j
@RequiredArgsConstructor
public class NotificationConsumer {

    private final EmailService emailService;


    @KafkaListener(topics = "achievement_unlocked")
    public void handleAchievementEvent(AchievementUnlocked event) {
        log.info("Received achievement event: {}", event);

        try {

            if (event.getUserEmail() == null || event.getUserName() == null || 
                event.getBadgeName() == null || event.getDescription() == null ||
                event.getBadgeLevel() == null || event.getEarnedAt() == null) {
                log.warn("Received event with missing required fields: {}", event);
                return;
            }

            emailService.sendAchievementEmail(
                    event.getUserEmail().toString(),
                    event.getUserName().toString(),
                    event.getBadgeName().toString(),
                    event.getDescription().toString(),
                    event.getBadgeLevel().toString(),
                    event.getEarnedAt().toString()
            );
            log.info("Achievement email sent to {}", event.getUserEmail());
        } catch (Exception e) {
            log.error("Failed to process achievement event: {}", e.getMessage(), e);
            throw e; 
        }
    }
}

