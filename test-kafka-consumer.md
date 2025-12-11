# 手动测试 Kafka Consumer 的方法

## 🚀 方法 1: 使用 PowerShell 脚本 (Windows 推荐) ⭐

### 前提条件

1. 确保 Kafka 服务运行: `docker-compose up -d zookeeper broker schema-registry`
2. 确保 notification-service 正在运行

### 步骤

```powershell
# 在项目根目录运行
.\test-consumer.ps1
```

脚本会自动：

- 找到 Kafka broker 容器
- 发送测试消息到 `achievement_unlocked` topic
- 使用正确的 Avro schema

### 查看结果

检查 notification-service 的控制台日志，应该看到：

```
Received achievement event: ...
Achievement email sent to test@example.com
```

---

## 🐧 方法 2: 使用 Bash 脚本 (Linux/Mac/WSL)

```bash
# 赋予执行权限
chmod +x test-consumer.sh

# 运行脚本
./test-consumer.sh
```

---

## 🌐 方法 3: 使用 Kafka UI (图形界面)

1. **访问 Kafka UI**
   - 打开浏览器: http://localhost:8086
2. **创建 Topic** (如果不存在)
   - 左侧菜单 `Topics` → `Add a Topic`
   - 名称: `achievement_unlocked`
   - Partitions: 1, Replication Factor: 1
3. **发送消息**

   - 进入 `achievement_unlocked` topic
   - 点击 `Produce Message`
   - ⚠️ **注意**: Kafka UI 可能需要先注册 schema
   - 输入 JSON 数据:

   ```json
   {
     "userId": "test-user-123",
     "userEmail": "test@example.com",
     "userName": "Test User",
     "badgeName": "Test Badge",
     "badgeLevel": "Gold",
     "description": "This is a test achievement",
     "earnedAt": "2025-12-11T12:00:00Z"
   }
   ```

   ⚠️ **重要**: 由于使用 Avro，可能需要先在 Schema Registry 中注册 schema

---

## 💻 方法 4: 使用命令行手动发送 (高级)

### 前提条件

确保 docker-compose 中 Kafka 服务正在运行。

### 步骤

1. **进入 Kafka broker 容器**

   ```bash
   docker exec -it <broker-container-name> bash
   ```

   或者如果使用的是 docker-compose:

   ```bash
   docker-compose exec broker bash
   ```

2. **发送 Avro 消息**

   ```bash
   kafka-avro-console-producer \
     --broker-list localhost:29092 \
     --topic achievement_unlocked \
     --property schema.registry.url=http://schema-registry:8081 \
     --property value.schema='{
       "type": "record",
       "name": "AchievementUnlocked",
       "namespace": "com.cinequest.notificationservice.events",
       "fields": [
         {"name": "userId", "type": "string"},
         {"name": "userEmail", "type": "string"},
         {"name": "userName", "type": "string"},
         {"name": "badgeName", "type": "string"},
         {"name": "badgeLevel", "type": "string"},
         {"name": "description", "type": "string"},
         {"name": "earnedAt", "type": "string"}
       ]
     }'
   ```

3. **输入 JSON 数据**（回车后输入，输入完按回车发送）

   ```json
   {
     "userId": "test-user-123",
     "userEmail": "test@example.com",
     "userName": "Test User",
     "badgeName": "Test Badge",
     "badgeLevel": "Gold",
     "description": "This is a test achievement",
     "earnedAt": "2025-12-11T12:00:00Z"
   }
   ```

4. **退出**: 按 `Ctrl+C`

---

## 方法 3: 创建测试脚本 (使用 kafkacat/kcat)

### 安装 kcat (如果没有)

**Windows (使用 WSL 或 Git Bash):**

```bash
# 在 WSL 中
sudo apt-get install kafkacat
```

**或者使用 Docker:**

```bash
docker run --rm -it --network <your-network> edenhill/kafkacat:1.6.0
```

### 发送消息 (需要先注册 schema，这个方法比较复杂)

---

## 方法 4: 使用 Postman/HTTP 客户端 (通过 Schema Registry)

如果 Schema Registry 已经注册了 schema，可以使用 HTTP API：

1. **获取 Schema ID**

   ```bash
   curl http://localhost:8085/subjects/achievement_unlocked-value/versions/latest
   ```

2. **发送消息** (这个需要手动构建 Avro 二进制格式，比较复杂)

---

## ⚡ 快速测试步骤 (推荐使用方法 1)

### 最简单的测试流程：

1. **确保服务运行**

   ```bash
   # 启动 Kafka 相关服务
   docker-compose up -d zookeeper broker schema-registry kafka-ui

   # 启动 notification-service
   # (在你的 IDE 中运行或使用 mvn spring-boot:run)
   ```

2. **打开 Kafka UI**

   - 访问 http://localhost:8086

3. **创建/选择 Topic**

   - 在 Kafka UI 中找到 `achievement_unlocked` topic
   - 如果不存在，创建它（partitions: 1, replication factor: 1）

4. **发送测试消息**

   - 使用上面提供的 JSON 数据

5. **查看日志**
   - 检查 notification-service 的控制台日志

---

## 测试数据示例

```json
{
  "userId": "user-001",
  "userEmail": "john.doe@example.com",
  "userName": "John Doe",
  "badgeName": "Movie Critic",
  "badgeLevel": "Silver",
  "description": "Posted 10 movie ratings",
  "earnedAt": "2025-12-11T23:30:00Z"
}
```

---

## 故障排查

如果 Consumer 没有接收到消息：

1. **检查 Topic 是否存在**

   ```bash
   docker-compose exec broker kafka-topics --list --bootstrap-server localhost:9092
   ```

2. **检查 Consumer Group 状态**

   ```bash
   docker-compose exec broker kafka-consumer-groups --bootstrap-server localhost:9092 --group notification-group --describe
   ```

3. **检查 Consumer 日志**

   - 查看是否有连接错误
   - 查看是否有反序列化错误

4. **验证 Schema**
   - 访问 http://localhost:8085/subjects/achievement_unlocked-value/versions/latest
   - 确认 schema 已正确注册
