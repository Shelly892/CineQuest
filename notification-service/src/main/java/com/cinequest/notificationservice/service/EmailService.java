package com.cinequest.notificationservice.service;

import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.thymeleaf.TemplateEngine;
import org.thymeleaf.context.Context;

import java.util.Map;

@Service
@Slf4j
@RequiredArgsConstructor
public class EmailService {

    private final JavaMailSender mailSender;
    private final TemplateEngine templateEngine;

    @Value("${notification.from-email}")
    private String fromEmail;

    @Value("${notification.from-name}")
    private String fromName;

    /**
     * Send HTML email using template
     */
    @Async
    public void sendTemplateEmail(String to, String subject, String template, Map<String, Object> variables) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            // Set sender
            helper.setFrom(fromEmail, fromName);
            helper.setTo(to);
            helper.setSubject(subject);

            // Create Thymeleaf template
            Context context = new Context();
            context.setVariables(variables);
            String html = templateEngine.process("email/" + template, context);

            helper.setText(html, true);

            // Send email
            mailSender.send(message);

            log.info(" Email sent successfully to {}", to);
        } catch (Exception e) {
            log.error(" Failed to send email to {}: {}", to, e.getMessage(), e);
        }
    }

//    /**
//     * Send simple text email
//     */
//    @Async
//    public void sendSimpleEmail(String to, String subject, String content) {
//        try {
//            MimeMessage message = mailSender.createMimeMessage();
//            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
//
//            helper.setFrom(fromEmail, fromName);
//            helper.setTo(to);
//            helper.setSubject(subject);
//            helper.setText(content, false);
//
//            mailSender.send(message);
//
//            log.info(" Simple email sent to {}", to);
//        } catch (Exception e) {
//            log.error(" Failed to send simple email to {}: {}", to, e.getMessage(), e);
//        }
//    }

    /**
     * Send achievement unlocked email
     */
    public void sendAchievementEmail(String to, String username, String achievementName, String description, String badgeLevel, String earnedAt) {
        Map<String, Object> variables = Map.of(
                "username", username,
                "achievementName", achievementName,
                "description", description,
                "badgeLevel", badgeLevel,
                "earnedAt", earnedAt,
                "message", "You've successfully unlocked this achievement! Keep up the great work!"
        );

        sendTemplateEmail(to, "🎉 Achievement Unlocked: " + achievementName, "achievement", variables);
    }
}