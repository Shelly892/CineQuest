# Postman 调用 Gateway 登录指南

## 前置条件

1. **Keycloak 已启动并配置**
   - Keycloak 管理界面：http://localhost:9090
   - 管理员账号：`admin` / `admin`
   - Realm 名称：`cinequest`

2. **Gateway 已启动**
   - Gateway 地址：http://localhost:8000

3. **Keycloak 客户端配置**
   - 需要在 Keycloak 中创建一个客户端（Client）
   - 客户端需要启用 "Direct Access Grants"（用于密码登录）

## 步骤 1：在 Keycloak 中创建客户端

1. 访问 Keycloak 管理界面：http://localhost:9090
2. 登录（admin/admin）
3. 选择 Realm：`cinequest`（如果不存在，需要先创建）
4. 进入 **Clients** → **Create client**
5. 配置客户端：
   - **Client ID**: `cinequest-client`（或自定义名称）
   - **Client protocol**: `openid-connect`
   - 点击 **Next**
6. 启用以下功能：
   - ✅ **Direct Access Grants Enabled**（必须，用于密码登录）
   - ✅ **Standard Flow Enabled**（可选，用于授权码流程）
7. 如果客户端类型是 **confidential**，记下 **Client Secret**
8. 保存配置

## 步骤 2：在 Keycloak 中创建测试用户

1. 进入 **Users** → **Create new user**
2. 填写用户信息：
   - **Username**: `testuser`（或自定义）
   - **Email**: `test@example.com`（可选）
   - 点击 **Create**
3. 设置密码：
   - 进入用户的 **Credentials** 标签
   - 点击 **Set password**
   - 输入密码（例如：`password123`）
   - 取消勾选 **Temporary**（如果希望密码永久有效）
   - 点击 **Save**

## 步骤 3：在 Postman 中配置登录请求

### 方法 1：使用 Gateway 的 `/api/auth/login` 端点（推荐）

#### 请求配置

1. **请求方法**: `POST`
2. **请求 URL**: 
   ```
   http://localhost:8000/api/auth/login
   ```

3. **Headers**:
   ```
   Content-Type: application/x-www-form-urlencoded
   ```

4. **Body** (选择 `x-www-form-urlencoded`):
   | Key | Value |
   |-----|-------|
   | `grant_type` | `password` |
   | `client_id` | `cinequest-client`（你的客户端 ID） |
   | `client_secret` | `your-client-secret`（如果客户端是 confidential） |
   | `username` | `testuser`（你的用户名） |
   | `password` | `password123`（你的密码） |

#### 完整示例

**URL**: `POST http://localhost:8000/api/auth/login`

**Headers**:
```
Content-Type: application/x-www-form-urlencoded
```

**Body** (form-urlencoded):
```
grant_type=password
client_id=cinequest-client
client_secret=your-client-secret
username=testuser
password=password123
```

#### 预期响应（200 OK）

```json
{
  "access_token": "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refresh_token": "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9...",
  "expires_in": 300,
  "refresh_expires_in": 1800,
  "token_type": "Bearer",
  "not-before-policy": 0,
  "session_state": "xxx-xxx-xxx",
  "scope": "profile email"
}
```

### 方法 2：直接使用 Keycloak 端点（通过 Gateway 代理）

#### 请求配置

1. **请求方法**: `POST`
2. **请求 URL**: 
   ```
   http://localhost:8000/realms/cinequest/protocol/openid-connect/token
   ```

3. **Headers** 和 **Body** 配置与方法 1 相同

## 步骤 4：使用 Token 访问受保护资源

登录成功后，使用返回的 `access_token` 访问受保护的 API：

### 示例：获取用户信息

**请求方法**: `GET`

**请求 URL**: 
```
http://localhost:8000/api/auth/userinfo
```

**Headers**:
```
Authorization: Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9...
```

### 示例：访问用户服务

**请求方法**: `GET`

**请求 URL**: 
```
http://localhost:8000/api/user/profile
```

**Headers**:
```
Authorization: Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9...
```

Gateway 会自动：
1. 验证 JWT token
2. 提取用户 ID（从 `sub` claim）
3. 添加 `X-User-Id` header 到下游服务请求

## 步骤 5：刷新 Token

当 access_token 过期时，使用 refresh_token 刷新：

**请求方法**: `POST`

**请求 URL**: 
```
http://localhost:8000/api/auth/refresh
```

**Headers**:
```
Content-Type: application/x-www-form-urlencoded
```

**Body** (form-urlencoded):
```
grant_type=refresh_token
client_id=cinequest-client
client_secret=your-client-secret
refresh_token=eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9...
```

## Postman 环境变量配置（推荐）

为了方便管理，可以在 Postman 中创建环境变量：

### 环境变量

| 变量名 | 初始值 | 当前值 |
|--------|--------|--------|
| `gateway_url` | `http://localhost:8000` | `http://localhost:8000` |
| `client_id` | `cinequest-client` | `cinequest-client` |
| `client_secret` | `your-client-secret` | `your-client-secret` |
| `access_token` | (空) | (自动填充) |
| `refresh_token` | (空) | (自动填充) |

### 使用环境变量

**登录请求 URL**:
```
{{gateway_url}}/api/auth/login
```

**Body**:
```
grant_type=password
client_id={{client_id}}
client_secret={{client_secret}}
username=testuser
password=password123
```

### 自动保存 Token（Tests 脚本）

在登录请求的 **Tests** 标签中添加以下脚本，自动保存 token：

```javascript
if (pm.response.code === 200) {
    var jsonData = pm.response.json();
    pm.environment.set("access_token", jsonData.access_token);
    pm.environment.set("refresh_token", jsonData.refresh_token);
    console.log("Token saved successfully");
}
```

### 使用保存的 Token

在后续请求的 **Headers** 中使用：
```
Authorization: Bearer {{access_token}}
```

## 常见问题

### 1. 401 Unauthorized

**可能原因**:
- 客户端 ID 或 Secret 错误
- 客户端未启用 "Direct Access Grants"
- 用户名或密码错误

**解决方法**:
- 检查 Keycloak 客户端配置
- 确认用户名和密码正确
- 检查客户端类型（public 不需要 secret）

### 2. 403 Forbidden

**可能原因**:
- Token 已过期
- Token 无效

**解决方法**:
- 使用 refresh_token 刷新 access_token
- 重新登录获取新 token

### 3. 500 Internal Server Error

**可能原因**:
- Gateway 无法连接到 Keycloak
- Keycloak 服务未启动

**解决方法**:
- 检查 Keycloak 是否正常运行：`docker-compose ps keycloak`
- 检查 Gateway 日志：`docker-compose logs gateway`

### 4. 连接被拒绝

**可能原因**:
- Gateway 服务未启动
- 端口配置错误

**解决方法**:
- 启动 Gateway：`docker-compose up -d gateway`
- 检查端口：Gateway 应该在 8000 端口

## 完整 Postman Collection 示例

可以创建一个 Postman Collection，包含以下请求：

1. **Login** - POST `/api/auth/login`
2. **Get User Info** - GET `/api/auth/userinfo`
3. **Refresh Token** - POST `/api/auth/refresh`
4. **Access Protected Resource** - GET `/api/user/profile`
5. **Logout** - POST `/api/auth/logout`

## 测试流程

1. ✅ 启动 Keycloak：`docker-compose up -d keycloak`
2. ✅ 启动 Gateway：`docker-compose up -d gateway`
3. ✅ 在 Keycloak 中创建客户端和用户
4. ✅ 在 Postman 中配置登录请求
5. ✅ 发送登录请求，获取 token
6. ✅ 使用 token 访问受保护资源

## 注意事项

1. **客户端类型**:
   - **Public**: 不需要 client_secret（适用于前端应用）
   - **Confidential**: 需要 client_secret（适用于后端服务）

2. **Token 过期时间**:
   - Access Token: 默认 5 分钟（300 秒）
   - Refresh Token: 默认 30 分钟（1800 秒）

3. **生产环境**:
   - 使用 HTTPS
   - 使用更强的密码策略
   - 限制客户端访问范围

