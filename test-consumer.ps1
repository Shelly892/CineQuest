# PowerShell 脚本 - 测试 Kafka Consumer
# 使用方法: .\test-consumer.ps1

Write-Host "=== 测试 Kafka Consumer ===" -ForegroundColor Cyan
Write-Host ""

# 检查 Kafka broker 容器是否运行
$brokerContainer = docker ps --filter "ancestor=confluentinc/cp-kafka:7.5.0" --format "{{.Names}}" | Select-Object -First 1

if (-not $brokerContainer) {
    Write-Host "❌ 错误: 找不到 Kafka broker 容器" -ForegroundColor Red
    Write-Host "请先运行: docker-compose up -d broker schema-registry" -ForegroundColor Yellow
    exit 1
}

Write-Host "✓ 找到 Kafka broker 容器: $brokerContainer" -ForegroundColor Green
Write-Host ""

# 测试消息数据
$testJson = '{"userId":"test-user-123","userEmail":"test@example.com","userName":"Test User","badgeName":"Test Badge","badgeLevel":"Gold","description":"This is a test achievement","earnedAt":"2025-12-11T12:00:00Z"}'

Write-Host "准备发送测试消息..." -ForegroundColor Yellow
Write-Host "Topic: achievement_unlocked"
Write-Host "消息内容: $testJson"
Write-Host ""
Write-Host "正在发送消息..." -ForegroundColor Yellow
Write-Host ""

# Schema 定义
$schema = @'
{"type":"record","name":"AchievementUnlocked","namespace":"com.cinequest.notificationservice.events","fields":[{"name":"userId","type":"string"},{"name":"userEmail","type":"string"},{"name":"userName","type":"string"},{"name":"badgeName","type":"string"},{"name":"badgeLevel","type":"string"},{"name":"description","type":"string"},{"name":"earnedAt","type":"string"}]}
'@

# 使用 docker exec 执行 kafka-avro-console-producer
$testJson | docker exec -i $brokerContainer kafka-avro-console-producer `
  --broker-list localhost:29092 `
  --topic achievement_unlocked `
  --property schema.registry.url=http://schema-registry:8081 `
  --property value.schema=$schema

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "✓ 消息发送成功!" -ForegroundColor Green
    Write-Host "请检查 notification-service 的日志查看是否接收到消息" -ForegroundColor Yellow
} else {
    Write-Host ""
    Write-Host "❌ 消息发送失败" -ForegroundColor Red
    Write-Host "请检查:" -ForegroundColor Yellow
    Write-Host "1. Kafka broker 和 schema-registry 是否正常运行"
    Write-Host "2. Topic 'achievement_unlocked' 是否存在"
    Write-Host "3. Schema 是否已在 Schema Registry 中注册"
}
