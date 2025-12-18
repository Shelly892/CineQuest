# ========== Stage 1: Build Stage ==========
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy source code
COPY . .

# Build production version
RUN npm run build

# ========== Stage 2: Production Stage ==========
FROM nginx:alpine

# Copy build artifacts to Nginx
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy Nginx configuration
COPY default.conf.template /etc/nginx/templates/default.conf.template

# Expose port
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]