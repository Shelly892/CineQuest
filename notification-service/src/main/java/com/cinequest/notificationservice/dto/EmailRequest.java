package com.cinequest.notificationservice.dto;

import lombok.Data;

@Data
public class EmailRequest {
    private String to;
    private String subject;
    private String content;
    private String template;
}