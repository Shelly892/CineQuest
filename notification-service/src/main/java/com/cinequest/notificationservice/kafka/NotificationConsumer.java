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

    /**
     * 监听成就解锁事件
     */
    @KafkaListener(topics = "achievement_unlocked", groupId = "notification-group")
    public void handleAchievementEvent(AchievementUnlocked event) {
        log.info(" Received achievement event: {}", event);

        try {
            emailService.sendAchievementEmail(
                    event.getUserEmail().toString(),
                    event.getUserName().toString(),
                    event.getBadgeName().toString(),
                    event.getDescription().toString()
            );
            log.info(" Achievement email sent to {}", event.getUserEmail());
        } catch (Exception e) {
            log.error(" Failed to process achievement event: {}", e.getMessage(), e);
        }
    }
}

