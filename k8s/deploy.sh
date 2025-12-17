#!/bin/bash

echo "🚀 Starting CineQuest deployment to Minikube..."

# 1. Create Namespace
echo "📦 Creating Namespace..."
kubectl apply -f namespace.yaml

# 2. Create ConfigMap and Secrets
echo "🔐 Creating ConfigMap and Secrets..."
kubectl apply -f configmap.yaml
kubectl apply -f secrets.yaml
# Create nginx ConfigMap for frontend
kubectl apply -f nginx-frontend.yaml

# 3. Deploy Databases
echo "💾 Deploying Databases..."
kubectl apply -f databases/postgres.yaml
kubectl apply -f databases/mongodb.yaml
kubectl apply -f databases/mysql.yaml
kubectl apply -f databases/redis.yaml

# Wait for databases to start
echo "⏳ Waiting for databases to start..."
sleep 30

# 4. Deploy Kafka
echo "📨 Deploying Kafka..."
kubectl apply -f kafka/zookeeper.yaml
sleep 10
kubectl apply -f kafka/kafka.yaml
sleep 20
kubectl apply -f kafka/schema-registry.yaml

# 5. Deploy Backend Services
echo "🔧 Deploying Backend Services..."
kubectl apply -f services/keycloak.yaml
sleep 10
kubectl apply -f services/movie-service.yaml
kubectl apply -f services/rating-service.yaml
kubectl apply -f services/sign-service.yaml
kubectl apply -f services/achievement-service.yaml
kubectl apply -f services/notification-service.yaml
kubectl apply -f services/gateway.yaml

# 6. Deploy Frontend
echo "🎨 Deploying Frontend..."
kubectl apply -f services/frontend.yaml

# 7. Deploy Ingress
echo "🌐 Deploying Ingress..."
kubectl apply -f ingress.yaml

# 8. Check Deployment Status
echo ""
echo "✅ Deployment completed!"
echo ""
echo "📊 Pod Status:"
kubectl get pods -n cinequest

echo ""
echo "🌐 Service Status:"
kubectl get svc -n cinequest

echo ""
echo "🔗 Access Address:"
minikube ip

echo ""
echo "📝 Please add the following to /etc/hosts (Windows: C:\Windows\System32\drivers\etc\hosts):"
echo "$(minikube ip) cinequest.local"
echo ""
echo "🎉 Access the application using port-forward:"
echo "   1. Run: kubectl port-forward service/frontend 8080:80 -n cinequest"
echo "   2. Access: http://localhost:8080"
echo ""
echo "   Note: JWT_ISSUER_URL is configured as http://localhost:8080/keycloak/realms/cinequest"
echo "   You must use port 8080 for port-forward to maintain JWT issuer URL consistency"