package com.cinequest.notificationservice.kafka;

import com.cinequest.notificationservice.events.AchievementUnlocked;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.kafka.test.context.EmbeddedKafka;
import org.springframework.test.annotation.DirtiesContext;

import java.time.Instant;
import java.util.concurrent.TimeUnit;

/**
 * Kafka Consumer manual test class
 * 
 * Usage:
 * 1. Ensure Kafka broker and Schema Registry are running
 * 2. Run this test class
 * 3. Check notification-service logs to confirm message was received
 */
@SpringBootTest
@DirtiesContext
@EmbeddedKafka(partitions = 1, topics = {"achievement_unlocked"})
public class KafkaConsumerTest {

    @Autowired
    private KafkaTemplate<String, AchievementUnlocked> kafkaTemplate;

    @Test
    public void testSendAchievementEvent() throws InterruptedException {
        // Create test message
        AchievementUnlocked event = AchievementUnlocked.newBuilder()
                .setUserId("test-user-123")
                .setUserEmail("test@example.com")
                .setUserName("Test User")
                .setBadgeName("Test Badge")
                .setBadgeLevel("Gold")
                .setDescription("This is a test achievement for manual testing")
                .setEarnedAt(Instant.now().toString())
                .build();

        // Send message to Kafka
        System.out.println("Sending test message to topic: achievement_unlocked");
        System.out.println("Message content: " + event);
        
        kafkaTemplate.send("achievement_unlocked", event.getUserId().toString(), event);
        
        // Wait for Consumer to process message
        Thread.sleep(2000);
        
        System.out.println("Test message sent, please check Consumer logs to confirm message was received");
    }
}
