package com.cinequest.notificationservice.controller;

import com.cinequest.notificationservice.dto.EmailRequest;
import com.cinequest.notificationservice.service.EmailService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/notifications")
@CrossOrigin(origins = "*")
@Slf4j
@RequiredArgsConstructor
public class NotificationController {

    private final EmailService emailService;

    /**
     * 健康检查
     */
    @GetMapping("/health")
    public ResponseEntity<String> health() {
        log.info(" Health check");
        return ResponseEntity.ok("Notification Service is running! ");
    }

//    /**
//     * 手动发送测试邮件
//     * POST /api/notifications/test
//     */
//    @PostMapping("/test")
//    public ResponseEntity<Map<String, String>> sendTestEmail(@RequestBody EmailRequest request) {
//        log.info("Test email request: {}", request);
//
//        try {
//            emailService.sendSimpleEmail(
//                    request.getTo(),
//                    request.getSubject() != null ? request.getSubject() : "Test Email from CineQuest",
//                    request.getContent() != null ? request.getContent() : "This is a test email from CineQuest Notification Service."
//            );
//
//            Map<String, String> response = new HashMap<>();
//            response.put("status", "success");
//            response.put("message", "Test email sent to " + request.getTo());
//
//            return ResponseEntity.ok(response);
//        } catch (Exception e) {
//            log.error("❌ Failed to send test email: {}", e.getMessage(), e);
//
//            Map<String, String> response = new HashMap<>();
//            response.put("status", "error");
//            response.put("message", "Failed to send email: " + e.getMessage());
//
//            return ResponseEntity.status(500).body(response);
//        }
//    }

    /**
     * 发送成就解锁邮件
     * POST /api/notifications/achievement
     */
    @PostMapping("/achievement")
    public ResponseEntity<Map<String, String>> sendAchievementEmail(
            @RequestParam String email,
            @RequestParam String username,
            @RequestParam String achievementName,
            @RequestParam String description
    ) {
        log.info(" Achievement email request for user: {}", username);

        try {
            emailService.sendAchievementEmail(email, username, achievementName, description);

            Map<String, String> response = new HashMap<>();
            response.put("status", "success");
            response.put("message", "Achievement email sent");

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error(" Failed to send achievement email: {}", e.getMessage(), e);

            Map<String, String> response = new HashMap<>();
            response.put("status", "error");
            response.put("message", e.getMessage());

            return ResponseEntity.status(500).body(response);
        }
    }

//    /**
//     * 发送通用通知邮件
//     * POST /api/notifications/send
//     */
//    @PostMapping("/send")
//    public ResponseEntity<Map<String, String>> sendNotification(
//            @RequestParam String email,
//            @RequestParam String username,
//            @RequestParam String title,
//            @RequestParam String message
//    ) {
//        log.info(" Notification request: {} to {}", title, email);
//
//        try {
//            emailService.sendNotificationEmail(email, username, title, message);
//
//            Map<String, String> response = new HashMap<>();
//            response.put("status", "success");
//            response.put("message", "Notification sent");
//
//            return ResponseEntity.ok(response);
//        } catch (Exception e) {
//            log.error(" Failed to send notification: {}", e.getMessage(), e);
//
//            Map<String, String> response = new HashMap<>();
//            response.put("status", "error");
//            response.put("message", e.getMessage());
//
//            return ResponseEntity.status(500).body(response);
//        }
//    }
}