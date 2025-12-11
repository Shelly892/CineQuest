#!/bin/bash

# 测试 Kafka Consumer 的脚本
# 使用方法: ./test-consumer.sh

echo "=== 测试 Kafka Consumer ==="
echo ""

# 检查 Kafka broker 容器是否运行
BROKER_CONTAINER=$(docker ps --filter "ancestor=confluentinc/cp-kafka:7.5.0" --format "{{.Names}}" | head -1)

if [ -z "$BROKER_CONTAINER" ]; then
    echo "❌ 错误: 找不到 Kafka broker 容器"
    echo "请先运行: docker-compose up -d broker schema-registry"
    exit 1
fi

echo "✓ 找到 Kafka broker 容器: $BROKER_CONTAINER"
echo ""

# 测试消息数据
TEST_JSON='{"userId":"test-user-123","userEmail":"test@example.com","userName":"Test User","badgeName":"Test Badge","badgeLevel":"Gold","description":"This is a test achievement","earnedAt":"2025-12-11T12:00:00Z"}'

echo "准备发送测试消息..."
echo "Topic: achievement_unlocked"
echo "消息内容: $TEST_JSON"
echo ""
echo "正在发送消息..."
echo ""

# 使用 docker exec 执行 kafka-avro-console-producer
docker exec -i $BROKER_CONTAINER kafka-avro-console-producer \
  --broker-list localhost:29092 \
  --topic achievement_unlocked \
  --property schema.registry.url=http://schema-registry:8081 \
  --property value.schema='{"type":"record","name":"AchievementUnlocked","namespace":"com.cinequest.notificationservice.events","fields":[{"name":"userId","type":"string"},{"name":"userEmail","type":"string"},{"name":"userName","type":"string"},{"name":"badgeName","type":"string"},{"name":"badgeLevel","type":"string"},{"name":"description","type":"string"},{"name":"earnedAt","type":"string"}]}' <<EOF
$TEST_JSON
EOF

if [ $? -eq 0 ]; then
    echo ""
    echo "✓ 消息发送成功!"
    echo "请检查 notification-service 的日志查看是否接收到消息"
else
    echo ""
    echo "❌ 消息发送失败"
    echo "请检查:"
    echo "1. Kafka broker 和 schema-registry 是否正常运行"
    echo "2. Topic 'achievement_unlocked' 是否存在"
    echo "3. Schema 是否已在 Schema Registry 中注册"
fi
