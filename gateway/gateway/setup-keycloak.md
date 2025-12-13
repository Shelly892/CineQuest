# Keycloak 快速配置指南

在运行测试之前，需要先配置Keycloak。按照以下步骤操作：

## 步骤1: 启动Keycloak

```powershell
docker-compose up -d keycloak keycloak-db
```

等待Keycloak完全启动（大约30-60秒），可以通过以下命令检查：

```powershell
Invoke-WebRequest -Uri "http://localhost:9090/health/ready" -Method GET
```

## 步骤2: 访问Keycloak管理界面

1. 打开浏览器访问：`http://localhost:9090`
2. 点击 "Administration Console"
3. 使用以下凭据登录：
   - 用户名：`admin`
   - 密码：`admin`

## 步骤3: 创建Realm

1. 在左侧菜单中，点击 "Create Realm"
2. Realm名称输入：`cinequest`
3. 点击 "Create"

## 步骤4: 创建客户端

1. 在左侧菜单中，选择 "Clients"
2. 点击 "Create client"
3. 配置客户端：
   - **Client type**: OpenID Connect
   - **Client ID**: `cinequest-client`
   - 点击 "Next"
4. 在 "Capability config" 页面：
   - ✅ 启用 "Client authentication"（如果使用confidential客户端）
   - ✅ 启用 "Authorization"（可选）
   - ✅ 启用 "Standard flow"
   - ✅ 启用 "Direct access grants"（用于密码登录）
   - 点击 "Next"
5. 在 "Login settings" 页面：
   - **Valid redirect URIs**: `http://localhost:3000/*`（前端应用地址）
   - **Web origins**: `http://localhost:3000`
   - 点击 "Save"

## 步骤5: 创建测试用户

1. 在左侧菜单中，选择 "Users"
2. 点击 "Create new user"
3. 填写用户信息：
   - **Username**: `testuser`
   - **Email**: `test@example.com`
   - ✅ 启用 "Email verified"
   - 点击 "Create"
4. 设置密码：
   - 点击 "Credentials" 标签
   - 点击 "Set password"
   - 输入密码（例如：`testpass123`）
   - ✅ 取消勾选 "Temporary"（使密码永久有效）
   - 点击 "Save"

## 步骤6: 启用用户自注册（可选）

1. 在左侧菜单中，选择 "Realm settings"
2. 点击 "Login" 标签
3. 找到 "User registration" 选项
4. ✅ 启用 "User registration"
5. 点击 "Save"

## 步骤7: 验证配置

运行测试脚本验证配置：

```powershell
.\test-auth.ps1
```

## 常见问题

### 问题1: Keycloak无法访问

- 检查Docker容器是否运行：`docker ps`
- 检查端口9090是否被占用
- 查看Keycloak日志：`docker logs keycloak`

### 问题2: Realm未找到

- 确保Realm名称是 `cinequest`（小写）
- 检查是否在正确的Realm中创建客户端

### 问题3: 登录失败

- 检查客户端ID是否正确：`cinequest-client`
- 检查客户端是否启用了 "Direct access grants"
- 检查用户密码是否正确设置

### 问题4: Token验证失败

- 检查Gateway配置中的 `issuer-uri` 是否正确
- 确保Realm名称匹配：`http://localhost:9090/realms/cinequest`

## 测试端点

配置完成后，可以使用以下PowerShell命令进行测试：

### 1. 获取Token（登录）
```powershell
$body = @{
    grant_type = "password"
    client_id = "cinequest-client"
    username = "testuser"
    password = "testpass123"
}

$response = Invoke-RestMethod -Uri "http://localhost:8000/realms/cinequest/protocol/openid-connect/token" `
    -Method POST `
    -ContentType "application/x-www-form-urlencoded" `
    -Body $body

$response | ConvertTo-Json
```

### 2. 访问受保护资源
```powershell
$headers = @{
    "Authorization" = "Bearer <access_token>"
}

Invoke-RestMethod -Uri "http://localhost:8000/api/user/profile" `
    -Method GET `
    -Headers $headers
```

### 3. 测试未登录拦截
```powershell
Invoke-WebRequest -Uri "http://localhost:8000/api/user/profile" -Method GET
# 应该返回401错误
```

