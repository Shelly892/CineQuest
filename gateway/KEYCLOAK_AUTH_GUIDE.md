# Keycloak 认证集成指南

## 概述

Gateway 已集成 Keycloak 进行用户认证和授权。本文档说明如何通过 Gateway 进行用户注册、登录，以及如何处理未登录请求。

## 功能状态

### ✅ 已实现的功能

1. **Keycloak 代理路由**
   - Gateway 代理所有 `/realms/**` 请求到 Keycloak
   - 无需认证即可访问 Keycloak 的认证端点

2. **拦截未登录请求**
   - 所有需要认证的路由（除明确允许的路径外）都会检查 JWT token
   - 未登录请求返回友好的 JSON 错误响应（401）

3. **用户 ID 传递**
   - 已认证的请求会自动提取用户 ID 并添加到 `X-User-Id` header
   - 下游服务可以通过该 header 获取当前用户 ID

### ⚠️ 需要配置的功能

1. **Keycloak 用户注册**
   - 需要在 Keycloak 管理界面中启用用户自注册功能
   - 或者通过 Keycloak Admin API 创建用户

## Keycloak 端点

通过 Gateway 访问 Keycloak 的端点（端口 8000）：

### 1. 获取 Token（登录）

```bash
POST http://localhost:8000/realms/cinequest/protocol/openid-connect/token
Content-Type: application/x-www-form-urlencoded

grant_type=password&
client_id=your-client-id&
client_secret=your-client-secret&
username=your-username&
password=your-password
```

**响应示例：**
```json
{
  "access_token": "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refresh_token": "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "Bearer",
  "expires_in": 300
}
```

### 2. 用户注册（如果已启用）

```bash
POST http://localhost:8000/realms/cinequest/protocol/openid-connect/registrations
Content-Type: application/json

{
  "username": "newuser",
  "email": "user@example.com",
  "password": "password123",
  "firstName": "John",
  "lastName": "Doe"
}
```

### 3. 授权码流程（浏览器登录）

```
GET http://localhost:8000/realms/cinequest/protocol/openid-connect/auth?
  client_id=your-client-id&
  redirect_uri=http://localhost:3000/callback&
  response_type=code&
  scope=openid profile email
```

### 4. 刷新 Token

```bash
POST http://localhost:8000/realms/cinequest/protocol/openid-connect/token
Content-Type: application/x-www-form-urlencoded

grant_type=refresh_token&
client_id=your-client-id&
client_secret=your-client-secret&
refresh_token=your-refresh-token
```

## 使用 Token 访问受保护资源

### 1. 在请求头中添加 Token

```bash
GET http://localhost:8000/api/user/profile
Authorization: Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9...
```

### 2. Gateway 会自动：
- 验证 JWT token
- 提取用户 ID（从 `sub` claim）
- 添加 `X-User-Id` header 到下游服务请求

### 3. 下游服务接收用户 ID

```java
@GetMapping("/profile")
public ResponseEntity<UserProfile> getProfile(
    @RequestHeader("X-User-Id") String userId) {
    // 使用 userId 获取用户信息
    return ResponseEntity.ok(userService.getProfile(userId));
}
```

## 未登录请求处理

### 访问受保护资源（未提供 Token）

```bash
GET http://localhost:8000/api/user/profile
```

**响应（401）：**
```json
{
  "error": "Unauthorized",
  "message": "Authentication required. Please login first.",
  "status": 401,
  "timestamp": "2024-01-01T12:00:00Z",
  "path": "/api/user/profile",
  "authentication": {
    "loginEndpoint": "/realms/cinequest/protocol/openid-connect/token",
    "authEndpoint": "/realms/cinequest/protocol/openid-connect/auth",
    "registrationEndpoint": "/realms/cinequest/protocol/openid-connect/registrations"
  }
}
```

## Keycloak 配置步骤

### 1. 启动 Keycloak

```bash
docker-compose up -d keycloak
```

访问 Keycloak 管理界面：`http://localhost:9090`
- 用户名：`admin`
- 密码：`admin`

### 2. 创建 Realm

1. 登录 Keycloak 管理界面
2. 创建新 Realm：`cinequest`
3. 配置 Realm 设置

### 3. 创建客户端

1. 在 `cinequest` Realm 中创建客户端
2. 客户端 ID：例如 `cinequest-client`
3. 访问类型：`public` 或 `confidential`
4. 启用以下功能：
   - Direct Access Grants（用于密码登录）
   - Standard Flow（用于授权码流程）

### 4. 启用用户自注册（可选）

1. 进入 Realm Settings
2. 找到 "User registration" 选项
3. 启用 "User registration"
4. 保存设置

### 5. 配置重定向 URI

在客户端设置中添加：
- Valid Redirect URIs: `http://localhost:3000/*`（前端应用地址）
- Web Origins: `http://localhost:3000`

## 路由权限配置

### 无需认证的路由

- `/realms/**` - Keycloak 端点
- `/api/movie/**`, `/api/movies/**` - Movie 服务（公开访问）
- `/test/**` - 测试端点
- `/fallback/**` - Fallback 端点

### 需要认证的路由

- `/api/user/**` - User 服务
- `/api/rating/**` - Rating 服务
- `/api/sign/**` - Sign 服务
- `/api/achievement/**` - Achievement 服务
- `/api/notification/**` - Notification 服务
- 其他所有路由

## 测试

### 1. 测试未登录拦截

```bash
curl -X GET http://localhost:8000/api/user/profile
```

应该返回 401 错误和友好的错误信息。

### 2. 测试登录

```bash
curl -X POST http://localhost:8000/realms/cinequest/protocol/openid-connect/token \
  -d "grant_type=password" \
  -d "client_id=your-client-id" \
  -d "client_secret=your-client-secret" \
  -d "username=testuser" \
  -d "password=testpass"
```

### 3. 测试受保护资源访问

```bash
curl -X GET http://localhost:8000/api/user/profile \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

### 4. 测试用户 ID Header 传递

```bash
curl -X GET http://localhost:8000/test/auth-info \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

应该返回包含用户 ID 和 JWT 信息的响应。

## 注意事项

1. **Keycloak Realm 名称**：确保 Realm 名称与配置一致（`cinequest`）
2. **客户端配置**：确保客户端已正确配置并启用所需的功能
3. **Token 过期**：Access token 默认过期时间较短，需要定期刷新
4. **HTTPS**：生产环境应使用 HTTPS
5. **CORS**：确保 Keycloak 和 Gateway 的 CORS 配置正确

## 故障排查

### 问题：401 Unauthorized

- 检查 Token 是否有效
- 检查 Token 是否过期
- 检查 Keycloak Realm 配置是否正确

### 问题：无法访问 Keycloak 端点

- 检查 Gateway 的 Keycloak 代理路由是否正常
- 检查 Keycloak 服务是否运行
- 检查端口配置（Gateway: 8000, Keycloak: 9090）

### 问题：用户 ID Header 未传递

- 检查 JWT token 是否包含 `sub` claim
- 检查 `authHeaderFilter` 是否应用到相应路由
- 查看 Gateway 日志确认 filter 是否执行

