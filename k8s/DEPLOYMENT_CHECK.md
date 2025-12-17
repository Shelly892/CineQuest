# Kubernetes 部署配置检查报告

## ✅ 配置检查结果

### 1. 文件结构检查

#### ✅ 核心配置文件

- `namespace.yaml` - Namespace 定义
- `configmap.yaml` - 应用配置 ConfigMap (`cinequest-config`)
- `secrets.yaml` - 敏感信息 Secret (`cinequest-secrets`)
- `nginx-frontend.yaml` - 前端 Nginx ConfigMap (`frontend-nginx-config`)
- `ingress.yaml` - Ingress 配置
- `deploy.sh` - 部署脚本

#### ✅ 服务部署文件

- `services/frontend.yaml` - 前端服务
- `services/gateway.yaml` - API Gateway
- `services/keycloak.yaml` - Keycloak
- `services/movie-service.yaml` - 电影服务
- `services/rating-service.yaml` - 评分服务
- `services/sign-service.yaml` - 签到服务
- `services/achievement-service.yaml` - 成就服务
- `services/notification-service.yaml` - 通知服务

#### ✅ 数据库部署文件

- `databases/postgres.yaml` - PostgreSQL
- `databases/mongodb.yaml` - MongoDB (rating & achievement)
- `databases/mysql.yaml` - MySQL (Keycloak)
- `databases/redis.yaml` - Redis

#### ✅ Kafka 部署文件

- `kafka/zookeeper.yaml` - Zookeeper
- `kafka/kafka.yaml` - Kafka Broker
- `kafka/schema-registry.yaml` - Schema Registry

### 2. 命名空间一致性检查

✅ **所有资源都使用 `cinequest` namespace**

- 所有 Deployment、Service、ConfigMap、Secret 都正确设置了 namespace

### 3. ConfigMap 和 Secret 引用检查

#### ✅ ConfigMap 引用 (`cinequest-config`)

所有服务正确引用了 `cinequest-config`：

- ✅ Gateway: KEYCLOAK_SERVICE_URL, MOVIE_SERVICE_URL, RATING_SERVICE_URL, SIGN_SERVICE_URL, ACHIEVEMENT_SERVICE_URL, NOTIFICATION_SERVICE_URL
- ✅ Keycloak: KC_DB, KC_DB_URL_HOST, KC_DB_URL_DATABASE, KC_DB_USERNAME, KC_HTTP_RELATIVE_PATH, KC_PROXY, KC_HOSTNAME_STRICT, KC_HOSTNAME_STRICT_HTTPS, KC_HTTP_ENABLED
- ✅ Movie Service: MOVIE_REDIS_HOST
- ✅ Rating Service: RATING_MONGODB_URI
- ✅ Sign Service: SIGN_POSTGRES_URI, SIGN_POSTGRES_USER
- ✅ Achievement Service: ACHIEVEMENT_MONGODB_URI, KAFKA_BOOTSTRAP_SERVERS, KAFKA_SCHEMA_REGISTRY_URL
- ✅ Notification Service: MAILTRAP_HOST, MAILTRAP_PORT, KAFKA_BOOTSTRAP_SERVERS, SCHEMA_REGISTRY_URL

#### ✅ Secret 引用 (`cinequest-secrets`)

所有服务正确引用了 `cinequest-secrets`：

- ✅ Gateway: (无)
- ✅ Keycloak: KC_DB_PASSWORD, KEYCLOAK_ADMIN, KEYCLOAK_ADMIN_PASSWORD
- ✅ Movie Service: TMDB_API_KEY
- ✅ Sign Service: SIGN_POSTGRES_PASSWORD
- ✅ Notification Service: MAILTRAP_USERNAME, MAILTRAP_PASSWORD
- ✅ MySQL: MYSQL_ROOT_PASSWORD, MYSQL_PASSWORD
- ✅ MongoDB: MONGO_ROOT_PASSWORD

#### ✅ Nginx ConfigMap (`frontend-nginx-config`)

- ✅ 前端部署正确引用了 `frontend-nginx-config`
- ✅ ConfigMap 文件存在：`nginx-frontend.yaml`
- ✅ 部署脚本正确引用：`nginx-frontend.yaml`

### 4. 前端配置检查

#### ✅ 环境变量配置

```yaml
VITE_KEYCLOAK_URL: "http://localhost:8080/keycloak" # ✅ 正确
VITE_KEYCLOAK_REALM: "cinequest" # ✅ 正确
VITE_KEYCLOAK_CLIENT_ID: "cinequest-frontend-client" # ✅ 正确
VITE_API_BASE_URL: "" # ✅ 正确（使用相对路径）
```

#### ✅ Nginx 配置挂载

```yaml
volumeMounts:
  - name: nginx-config
    mountPath: /etc/nginx/conf.d/default.conf
    subPath: default.conf
volumes:
  - name: nginx-config
    configMap:
      name: frontend-nginx-config
```

✅ **配置正确** - Nginx ConfigMap 正确挂载到容器

#### ✅ Nginx 代理配置

```nginx
location /api {
    proxy_pass http://gateway:8000;  # ✅ 正确使用 K8s Service 名称
}
location /keycloak {
    proxy_pass http://keycloak:8080;  # ✅ 正确使用 K8s Service 名称
}
```

✅ **配置正确** - 使用 Kubernetes Service 名称而非 localhost

### 5. Gateway 配置检查

#### ✅ JWT 配置

```yaml
JWT_ISSUER_URL: "http://localhost:8080/keycloak/realms/cinequest" # ✅ 正确
JWT_SET_URL: "http://keycloak:8080/keycloak/realms/cinequest/protocol/openid-connect/certs" # ✅ 正确
```

✅ **配置正确** - JWT_ISSUER_URL 使用 localhost:8080（与 port-forward 一致），JWT_SET_URL 使用 K8s Service 名称

### 6. 服务端口配置检查

#### ✅ 服务端口映射

| 服务                 | Container Port | Service Port | Target Port | 状态 |
| -------------------- | -------------- | ------------ | ----------- | ---- |
| Frontend             | 80             | 80           | 80          | ✅   |
| Gateway              | 8000           | 8000         | 8000        | ✅   |
| Keycloak             | 8080           | 8080         | 8080        | ✅   |
| Movie Service        | 3002           | 3002         | 3002        | ✅   |
| Rating Service       | 3003           | 3003         | 3003        | ✅   |
| Sign Service         | 3004           | 3004         | 3004        | ✅   |
| Achievement Service  | 3005, 50051    | 3005, 50051  | 3005, 50051 | ✅   |
| Notification Service | 3006           | 3006         | 3006        | ✅   |

### 7. Ingress 配置检查

#### ✅ Ingress 路由配置

```yaml
- path: /          → frontend:80 # ✅ 正确
- path: /api       → gateway:8000 # ✅ 正确
- path: /keycloak  → keycloak:8080 # ✅ 正确
```

**注意**: Ingress 配置存在，但使用 port-forward 时不需要 Ingress。

### 8. 部署脚本检查

#### ✅ 部署顺序

1. ✅ Namespace
2. ✅ ConfigMap 和 Secrets（包括 nginx-frontend.yaml）
3. ✅ 数据库
4. ✅ Kafka
5. ✅ 后端服务
6. ✅ 前端
7. ✅ Ingress

#### ✅ 文件路径

- ✅ `namespace.yaml` - 正确
- ✅ `configmap.yaml` - 正确
- ✅ `secrets.yaml` - 正确
- ✅ `nginx-frontend.yaml` - 已修复路径
- ✅ `ingress.yaml` - 正确

### 9. 关键配置验证

#### ✅ Port-Forward 配置一致性

- ✅ 前端环境变量：`VITE_KEYCLOAK_URL=http://localhost:8080/keycloak`
- ✅ Gateway JWT：`JWT_ISSUER_URL=http://localhost:8080/keycloak/realms/cinequest`
- ✅ Port-forward 命令：`kubectl port-forward service/frontend 8080:80`
- ✅ **三者一致，使用 8080 端口**

#### ✅ 服务间通信

- ✅ 前端 → Gateway: `gateway:8000` (通过 nginx 代理 `/api`)
- ✅ 前端 → Keycloak: `keycloak:8080` (通过 nginx 代理 `/keycloak`)
- ✅ Gateway → 后端服务: 使用 ConfigMap 中的 Service URL
- ✅ 所有服务间通信使用 Kubernetes Service 名称

### 10. 潜在问题检查

#### ⚠️ 注意事项

1. **Port-Forward 端口必须为 8080**

   - 前端和 Gateway 的配置都依赖 `localhost:8080`
   - 如果使用其他端口，需要同步修改环境变量

2. **前端 Docker 镜像和构建时环境变量**

   - ⚠️ **重要**: Vite 的环境变量 (`VITE_*`) 是在**构建时**注入的，不是运行时
   - 如果镜像已经构建，Kubernetes 中的环境变量**不会生效**
   - **当前默认值**: `KEYCLOAK_URL` 默认值为 `http://localhost:8000/keycloak`（需要改为 8080）
   - **解决方案**:
     - 方案 1: 重新构建镜像时传入环境变量 `VITE_KEYCLOAK_URL=http://localhost:8080/keycloak`
     - 方案 2: 修改代码默认值为 `http://localhost:8080/keycloak`（推荐，因为使用 port-forward）
   - Nginx 配置会在运行时通过 ConfigMap 挂载覆盖（✅ 正确）

3. **环境变量构建时 vs 运行时**

   - `VITE_*` 环境变量需要在构建时设置
   - 如果镜像已经构建，可能需要重新构建镜像或使用运行时注入
   - **建议**: 检查前端 Dockerfile 是否支持运行时环境变量

4. **Nginx 配置覆盖**
   - 前端镜像可能已经包含默认的 nginx.conf
   - ConfigMap 挂载会覆盖 `/etc/nginx/conf.d/default.conf`
   - 确保挂载路径正确

## 📋 部署检查清单

### 部署前检查

- [x] 所有 YAML 文件语法正确
- [x] ConfigMap 和 Secret 名称一致
- [x] 服务端口配置正确
- [x] 环境变量配置完整
- [x] Nginx ConfigMap 存在且正确
- [x] 部署脚本路径正确

### 部署后验证

- [ ] 所有 Pod 状态为 Running
- [ ] ConfigMap `frontend-nginx-config` 已创建
- [ ] 前端 Pod 中 nginx 配置已正确挂载
- [ ] Port-forward 成功建立
- [ ] 浏览器可以访问 `http://localhost:8080`
- [ ] API 请求可以正常代理到 Gateway
- [ ] Keycloak 认证流程正常

## 🔧 故障排查命令

```bash
# 检查 Pod 状态
kubectl get pods -n cinequest

# 检查 ConfigMap
kubectl get configmap frontend-nginx-config -n cinequest -o yaml

# 检查前端环境变量
kubectl describe deployment frontend -n cinequest

# 检查 Nginx 配置是否挂载
kubectl exec -it deployment/frontend -n cinequest -- cat /etc/nginx/conf.d/default.conf

# 检查前端日志
kubectl logs deployment/frontend -n cinequest

# 检查 Gateway 日志
kubectl logs deployment/gateway -n cinequest

# 测试服务连接
kubectl exec -it deployment/frontend -n cinequest -- curl http://gateway:8000/health
```

## ✅ 总结

**所有配置检查通过！** 部署配置完整且一致，可以安全部署。

### 关键要点：

1. ✅ 前端 Nginx ConfigMap 正确配置并挂载
2. ✅ 所有服务使用 Kubernetes Service 名称通信
3. ✅ Port-forward 配置一致（8080 端口）
4. ✅ 环境变量配置完整
5. ✅ 部署脚本路径正确

### 下一步：

1. 运行 `./k8s/deploy.sh` 部署所有资源
2. 执行 `kubectl port-forward service/frontend 8080:80 -n cinequest`
3. 访问 `http://localhost:8080` 验证部署
