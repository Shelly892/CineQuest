package com.cinequest.notificationservice.kafka;

import com.cinequest.notificationservice.model.NotificationEvent;
import com.cinequest.notificationservice.service.EmailService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.annotation.Profile;
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
    public void handleAchievementEvent(NotificationEvent event) {
        log.info(" Received achievement event: {}", event);

        try {
            emailService.sendAchievementEmail(
                    event.getUserEmail(),
                    event.getUsername(),
                    event.getTitle(),
                    event.getMessage()
            );
            log.info(" Achievement email sent to {}", event.getUserEmail());
        } catch (Exception e) {
            log.error(" Failed to process achievement event: {}", e.getMessage(), e);
        }
    }
}
//    /**
//     * 监听评分事件
//     */
//    @KafkaListener(topics = "movie-rated", groupId = "notification-group")
//    public void handleRatingEvent(NotificationEvent event) {
//        log.info("📨 Received rating event: {}", event);
//
//        try {
//            emailService.sendNotificationEmail(
//                    event.getUserEmail(),
//                    event.getUsername(),
//                    event.getTitle(),
//                    event.getMessage()
//            );
//            log.info(" Rating notification sent to {}", event.getUserEmail());
//        } catch (Exception e) {
//            log.error(" Failed to process rating event: {}", e.getMessage(), e);
//        }
//    }
//
//    /**
//     * 监听签到事件
//     */
//    @KafkaListener(topics = "user-signed-in", groupId = "notification-group")
//    public void handleSignInEvent(NotificationEvent event) {
//        log.info(" Received sign-in event: {}", event);
//
//        try {
//            emailService.sendNotificationEmail(
//                    event.getUserEmail(),
//                    event.getUsername(),
//                    "Daily Check-in Successful! ",
//                    event.getMessage()
//            );
//            log.info(" Sign-in notification sent to {}", event.getUserEmail());
//        } catch (Exception e) {
//            log.error(" Failed to process sign-in event: {}", e.getMessage(), e);
//        }
//    }
//
//    /**
//     * 监听通用通知事件
//     */
//    @KafkaListener(topics = "general-notification", groupId = "notification-group")
//    public void handleGeneralNotification(NotificationEvent event) {
//        log.info(" Received general notification: {}", event);
//
//        try {
//            emailService.sendNotificationEmail(
//                    event.getUserEmail(),
//                    event.getUsername(),
//                    event.getTitle(),
//                    event.getMessage()
//            );
//            log.info(" General notification sent to {}", event.getUserEmail());
//        } catch (Exception e) {
//            log.error(" Failed to process general notification: {}", e.getMessage(), e);
//        }
//    }
