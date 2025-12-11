package com.cinequest.notificationservice.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class NotificationEvent implements Serializable {

//    private String eventType;
    private String userId;
    private String userEmail;
    private String username;
    private String title;
    private String message;
    private LocalDateTime timestamp;

    // 额外数据
    private Object data;
}