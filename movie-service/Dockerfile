# Use official Maven image as build stage
FROM maven:3.9.6-eclipse-temurin-17 AS build

# Set working directory
WORKDIR /app

# Copy pom.xml and source code
COPY pom.xml .
COPY src ./src

# Build application (skip tests to speed up build)
RUN mvn clean package -DskipTests

# Use lightweight JRE image as runtime stage
FROM eclipse-temurin:17-jre-alpine

# Set working directory
WORKDIR /app

# Copy JAR file from build stage
COPY --from=build /app/target/*.jar app.jar

# Expose port
EXPOSE 3002

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=40s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:3002/actuator/health || exit 1

# Start application
ENTRYPOINT ["java", "-jar", "app.jar"]