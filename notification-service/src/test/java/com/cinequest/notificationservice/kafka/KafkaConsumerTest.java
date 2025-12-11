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
 * Kafka Consumer 手动测试类
 * 
 * 使用方法:
 * 1. 确保 Kafka broker 和 Schema Registry 正在运行
 * 2. 运行这个测试类
 * 3. 查看 notification-service 日志确认消息被接收
 */
@SpringBootTest
@DirtiesContext
@EmbeddedKafka(partitions = 1, topics = {"achievement_unlocked"})
public class KafkaConsumerTest {

    @Autowired
    private KafkaTemplate<String, AchievementUnlocked> kafkaTemplate;

    @Test
    public void testSendAchievementEvent() throws InterruptedException {
        // 创建测试消息
        AchievementUnlocked event = AchievementUnlocked.newBuilder()
                .setUserId("test-user-123")
                .setUserEmail("test@example.com")
                .setUserName("Test User")
                .setBadgeName("Test Badge")
                .setBadgeLevel("Gold")
                .setDescription("This is a test achievement for manual testing")
                .setEarnedAt(Instant.now().toString())
                .build();

        // 发送消息到 Kafka
        System.out.println("发送测试消息到 topic: achievement_unlocked");
        System.out.println("消息内容: " + event);
        
        kafkaTemplate.send("achievement_unlocked", event.getUserId().toString(), event);
        
        // 等待 Consumer 处理消息
        Thread.sleep(2000);
        
        System.out.println("测试消息已发送，请检查 Consumer 日志确认是否接收到消息");
    }
}
