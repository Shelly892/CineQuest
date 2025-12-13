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

    @GetMapping("/health")
    public ResponseEntity<String> health() {
        log.info(" Health check");
        return ResponseEntity.ok("Notification Service is running! ");
    }

}