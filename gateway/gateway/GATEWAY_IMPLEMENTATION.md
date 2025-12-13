# Spring Cloud Gateway Server MVC 实现文档

## 概述

本 Gateway 是基于 Spring Cloud Gateway Server MVC（Spring MVC/Servlet）实现的统一认证、路由与容错层，使用 Keycloak 作为唯一用户认证中心。

## 核心功能

### 1. 认证与授权

- **OAuth2 Resource Server**: Gateway 配置为 OAuth2 Resource Server，使用 Keycloak 的 JWT 进行鉴权
- **Keycloak 代理**: 所有 Keycloak 端点通过 `/realms/**` 路由代理
- **认证端点代理**: `/api/auth/**` 路由代理到 Keycloak 的相应端点：
  - `/api/auth/login` → Keycloak token endpoint
  - `/api/auth/logout` → Keycloak logout endpoint
  - `/api/auth/refresh` → Keycloak token endpoint (with refresh_token grant)
  - `/api/auth/userinfo` → Keycloak userinfo endpoint

### 2. 路由权限规则

#### 允许匿名访问的路由
- `/realms/**` - Keycloak 端点
- `/api/auth/**` - 认证代理端点
- `/api/movie/**`, `/api/movies/**` - 电影服务（公开接口）
- `/test/**` - 测试端点
- `/fallback/**` - Fallback 端点

#### 需要认证的路由
- `/api/user/**` - 用户服务
- `/api/rating/**` - 评分服务
- `/api/sign/**` - 签到服务
- `/api/achievement/**` - 成就服务
- `/api/notification/**` - 通知服务

未认证请求返回 JSON 格式的 401 错误。

### 3. 用户身份透传

**UserIdHeaderFilter**: 自定义 HandlerFilterFunction，从 Spring Security 的 SecurityContext 中获取 JWT，提取 `sub`（userId）并写入请求 Header `X-User-Id`，自动透传给下游服务。

### 4. 容错能力（Resilience4j）

#### Circuit Breaker（熔断器）
- 配置了每个服务的独立 Circuit Breaker
- 失败率阈值: 50%
- 滑动窗口大小: 10
- 最小调用次数: 5
- 熔断时自动调用对应的 `/fallback/**` endpoint

#### Retry（重试）
- 仅对 GET 请求（幂等操作）进行重试
- 最大重试次数: 2 次
- 重试间隔: 500ms
- 仅重试连接异常和超时异常

#### Timeout（超时）
- 通过 HTTP 客户端配置实现
- 默认超时时间: 3 秒（可在 application.yml 中配置）

### 5. Fallback 机制

**FallbackController**: 支持所有 HTTP 方法，在以下情况自动触发：
- Circuit Breaker 熔断
- 请求超时
- 连接失败

返回 JSON 格式的 503 Service Unavailable 响应。

## 配置说明

### application.yml

```yaml
spring:
  gateway:
    services:
      keycloak: http://keycloak:8080
      movie: http://movie-service:8080
      rating: http://rating-service:8080
      # ... 其他服务
  security:
    oauth2:
      resourceserver:
        jwt:
          issuer-uri: http://keycloak:8080/realms/cinequest

resilience4j:
  circuitbreaker:
    # Circuit Breaker 配置
  retry:
    # Retry 配置
  timelimiter:
    # Timeout 配置
```

### Docker 服务名

所有下游服务 URI 使用 Docker 服务名而非 localhost：
- `http://keycloak:8080`
- `http://movie-service:8080`
- `http://rating-service:8080`
- `http://sign-service:8080`
- `http://achievement-service:8080`
- `http://notification-service:8080`
- `http://user-service:8080`

## 使用示例

### 1. 登录

```bash
POST http://localhost:8000/api/auth/login
Content-Type: application/x-www-form-urlencoded

grant_type=password&
client_id=your-client-id&
client_secret=your-client-secret&
username=your-username&
password=your-password
```

### 2. 访问受保护资源

```bash
GET http://localhost:8000/api/user/profile
Authorization: Bearer <access_token>
```

Gateway 会自动：
1. 验证 JWT token
2. 提取用户 ID（从 `sub` claim）
3. 添加 `X-User-Id` header 到下游服务请求

### 3. 刷新 Token

```bash
POST http://localhost:8000/api/auth/refresh
Content-Type: application/x-www-form-urlencoded

grant_type=refresh_token&
client_id=your-client-id&
client_secret=your-client-secret&
refresh_token=<refresh_token>
```

### 4. 获取用户信息

```bash
GET http://localhost:8000/api/auth/userinfo
Authorization: Bearer <access_token>
```

## 文件结构

```
gateway/
├── src/main/java/com/cinequest/gateway/
│   ├── GatewayApplication.java          # 主应用类
│   ├── config/
│   │   ├── SecurityConfig.java          # 安全配置（权限规则）
│   │   ├── Routes.java                  # 路由配置（路由、过滤器、容错）
│   │   ├── CustomAuthenticationEntryPoint.java  # 自定义 401 错误处理
│   │   └── CorsConfig.java              # CORS 配置
│   ├── filter/
│   │   ├── UserIdHeaderFilter.java      # 用户 ID Header 过滤器
│   │   └── ResilienceFilter.java        # 容错过滤器（可选）
│   └── controller/
│       └── FallbackController.java      # Fallback 控制器
├── src/main/resources/
│   └── application.yml                  # 应用配置
├── Dockerfile                            # Docker 构建文件
└── pom.xml                               # Maven 依赖配置
```

## Docker 部署

### 构建镜像

```bash
cd gateway
docker build -t cinequest-gateway .
```

### 使用 docker-compose

```bash
docker-compose up -d gateway
```

Gateway 服务将在 `http://localhost:8000` 启动。

## 健康检查

Gateway 提供 Actuator 健康检查端点：

```bash
GET http://localhost:8000/actuator/health
```

## 注意事项

1. **Keycloak 配置**: 确保 Keycloak Realm 名称为 `cinequest`
2. **服务发现**: 在 Docker 环境中，所有服务必须使用服务名而非 localhost
3. **Token 过期**: Access token 默认过期时间较短，需要定期刷新
4. **HTTPS**: 生产环境应使用 HTTPS
5. **CORS**: Gateway 已配置 CORS，允许所有来源（生产环境应限制）

## 故障排查

### 401 Unauthorized
- 检查 Token 是否有效
- 检查 Token 是否过期
- 检查 Keycloak Realm 配置

### 503 Service Unavailable
- 检查下游服务是否运行
- 检查 Circuit Breaker 状态
- 查看 Gateway 日志

### X-User-Id Header 未传递
- 检查 JWT token 是否包含 `sub` claim
- 检查 UserIdHeaderFilter 是否应用到相应路由
- 查看 Gateway 日志

## 开发与测试

### 本地开发

1. 启动 Keycloak（使用 docker-compose）
2. 配置 Keycloak Realm 和客户端
3. 启动 Gateway：
   ```bash
   mvn spring-boot:run
   ```

### 测试路由

```bash
# 测试公开路由（无需认证）
curl http://localhost:8000/api/movie/list

# 测试受保护路由（需要认证）
curl -H "Authorization: Bearer <token>" http://localhost:8000/api/user/profile

# 测试 Fallback（模拟服务不可用）
# Circuit Breaker 会自动触发 fallback
```

## 总结

本 Gateway 实现提供了：
- ✅ 统一的认证入口（Keycloak）
- ✅ 灵活的路由配置
- ✅ 自动的用户身份透传
- ✅ 完善的容错机制（Circuit Breaker、Retry、Timeout）
- ✅ 自动的 Fallback 处理
- ✅ Docker 环境支持

前端只需请求 Gateway 即可完成登录/注册/鉴权、访问受保护接口、触发容错机制，并自动将用户身份透传给各个微服务。

