package com.cinequest.gateway.config;

import com.cinequest.gateway.filter.UserIdHeaderFilter;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.cloud.gateway.server.mvc.filter.CircuitBreakerFilterFunctions;
import org.springframework.cloud.gateway.server.mvc.handler.GatewayRouterFunctions;
import org.springframework.cloud.gateway.server.mvc.handler.HandlerFunctions;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.web.servlet.function.*;

import java.net.URI;

/**
 * Gateway routes configuration using Spring Cloud Gateway Server MVC
 * 
 * This configuration includes:
 * - Keycloak authentication proxy routes (/api/auth/**)
 * - Business service routes with authentication and resilience patterns
 * - Circuit breaker, timeout, and retry configurations
 * - User ID header injection for protected routes
 * 
 * @author CineQuest Team
 */
@Configuration
public class Routes {

    private static final Logger logger = LoggerFactory.getLogger(Routes.class);

    @Value("${cinequest.keycloak-service-url:http://keycloak:8080}")
    private String keycloakServiceUrl;

    @Value("${gateway.services.movie:http://movie-service:8080}")
    private String movieServiceUrl;

    @Value("${gateway.services.rating:http://rating-service:8080}")
    private String ratingServiceUrl;

    @Value("${gateway.services.sign:http://sign-service:8080}")
    private String signServiceUrl;

    @Value("${gateway.services.achievement:http://achievement-service:8080}")
    private String achievementServiceUrl;

    @Value("${gateway.services.notification:http://notification-service:8080}")
    private String notificationServiceUrl;

    @Value("${gateway.services.user:http://user-service:8080}")
    private String userServiceUrl;

    private final UserIdHeaderFilter userIdHeaderFilter = new UserIdHeaderFilter();

    /**
     * Log service URLs on startup for debugging
     */
    @Bean
    public String logServiceUrls() {
        logger.info("=== Gateway Service URLs Configuration ===");
        logger.info("Keycloak: {}", keycloakServiceUrl);
        logger.info("Movie Service: {}", movieServiceUrl);
        logger.info("Rating Service: {}", ratingServiceUrl);
        logger.info("Sign Service: {}", signServiceUrl);
        logger.info("Achievement Service: {}", achievementServiceUrl);
        logger.info("Notification Service: {}", notificationServiceUrl);
        logger.info("User Service: {}", userServiceUrl);
        logger.info("===========================================");
        return "Service URLs logged";
    }

    /**
     * Retry filter - only retries GET requests (idempotent operations)
     * Timeout is handled by the underlying HTTP client configuration
     */
    private HandlerFilterFunction<ServerResponse, ServerResponse> retryFilter(int maxRetries) {
        return (request, next) -> {
            // Only retry GET requests (idempotent operations)
            if (!HttpMethod.GET.name().equals(request.method())) {
                return next.handle(request);
            }

            int attempts = 0;
            Exception lastException = null;

            while (attempts < maxRetries) {
                try {
                    return next.handle(request);
                } catch (Exception e) {
                    attempts++;
                    lastException = e;
                    logger.warn("Request failed (attempt {}/{}): {}", attempts, maxRetries, e.getMessage());
                    if (attempts >= maxRetries) {
                        break;
                    }
                    // Brief delay before retry
                    try {
                        Thread.sleep(500);
                    } catch (InterruptedException ie) {
                        Thread.currentThread().interrupt();
                        throw new RuntimeException("Retry interrupted", ie);
                    }
                }
            }

            // All retries exhausted, throw last exception
            throw new RuntimeException("Request failed after " + maxRetries + " attempts", lastException);
        };
    }

    /**
     * Keycloak proxy route - for all Keycloak endpoints
     */
    @Bean
    public RouterFunction<ServerResponse> keycloakRoute() {
        return GatewayRouterFunctions.route("keycloak_proxy")
                .route(RequestPredicates.path("/realms/**"), 
                       HandlerFunctions.http(keycloakServiceUrl))
                .build();
    }

    /**
     * Auth proxy routes - proxy /api/auth/** to Keycloak endpoints
     * 
     * /api/auth/login -> /realms/{realm}/protocol/openid-connect/token
     * /api/auth/logout -> /realms/{realm}/protocol/openid-connect/logout
     * /api/auth/refresh -> /realms/{realm}/protocol/openid-connect/token (with refresh_token grant)
     * /api/auth/userinfo -> /realms/{realm}/protocol/openid-connect/userinfo
     */
    /**
     * Create a handler function that proxies to Keycloak with path rewriting
     */
    private HandlerFunction<ServerResponse> createKeycloakHandler(String targetPath) {
        URI targetUri = URI.create(keycloakServiceUrl + targetPath);
        return request -> {
            // Create a new request with the rewritten URI
            ServerRequest rewrittenRequest = ServerRequest.from(request)
                    .uri(targetUri)
                    .build();
            return HandlerFunctions.http(targetUri).handle(rewrittenRequest);
        };
    }
    
    @Bean
    public RouterFunction<ServerResponse> authLoginRoute() {
        String realm = "cinequest";
        String targetPath = "/realms/" + realm + "/protocol/openid-connect/token";
        
        return GatewayRouterFunctions.route("auth_login")
                .route(RequestPredicates.path("/api/auth/login")
                        .and(RequestPredicates.method(HttpMethod.POST)),
                       createKeycloakHandler(targetPath))
                .build();
    }
    
    @Bean
    public RouterFunction<ServerResponse> authLogoutRoute() {
        String realm = "cinequest";
        String targetPath = "/realms/" + realm + "/protocol/openid-connect/logout";
        
        return GatewayRouterFunctions.route("auth_logout")
                .route(RequestPredicates.path("/api/auth/logout")
                        .and(RequestPredicates.method(HttpMethod.POST)),
                       createKeycloakHandler(targetPath))
                .build();
    }
    
    @Bean
    public RouterFunction<ServerResponse> authRefreshRoute() {
        String realm = "cinequest";
        String targetPath = "/realms/" + realm + "/protocol/openid-connect/token";
        
        return GatewayRouterFunctions.route("auth_refresh")
                .route(RequestPredicates.path("/api/auth/refresh")
                        .and(RequestPredicates.method(HttpMethod.POST)),
                       createKeycloakHandler(targetPath))
                .build();
    }
    
    @Bean
    public RouterFunction<ServerResponse> authUserinfoRoute() {
        String realm = "cinequest";
        String targetPath = "/realms/" + realm + "/protocol/openid-connect/userinfo";
        
        return GatewayRouterFunctions.route("auth_userinfo")
                .route(RequestPredicates.path("/api/auth/userinfo")
                        .and(RequestPredicates.method(HttpMethod.GET)),
                       createKeycloakHandler(targetPath))
                .build();
    }

    /**
     * Movie Service route - public access, no authentication required
     * Includes: Circuit Breaker, Timeout, Retry (GET only)
     */
    @Bean
    public RouterFunction<ServerResponse> movieServiceRoute() {
        return GatewayRouterFunctions.route("movie_service")
                .route(RequestPredicates.path("/api/movie/**")
                        .or(RequestPredicates.path("/api/movies/**")), 
                       HandlerFunctions.http(movieServiceUrl))
                .filter(CircuitBreakerFilterFunctions.circuitBreaker("movieServiceCircuitBreaker",
                        URI.create("forward:/fallback/movie")))
                .filter(retryFilter(2))
                .build();
    }

    /**
     * Rating Service route - authentication required
     * Includes: Circuit Breaker, Timeout, Retry (GET only), User ID Header
     */
    @Bean
    public RouterFunction<ServerResponse> ratingServiceRoute() {
        return GatewayRouterFunctions.route("rating_service")
                .route(RequestPredicates.path("/api/rating/**")
                        .or(RequestPredicates.path("/api/ratings/**")), 
                       HandlerFunctions.http(ratingServiceUrl))
                .filter(CircuitBreakerFilterFunctions.circuitBreaker("ratingServiceCircuitBreaker",
                        URI.create("forward:/fallback/rating")))
                .filter(retryFilter(2))
                .filter(userIdHeaderFilter) // Apply user ID header filter
                .build();
    }

    /**
     * Sign Service route - authentication required
     * Includes: Circuit Breaker, Timeout, Retry (GET only), User ID Header
     */
    @Bean
    public RouterFunction<ServerResponse> signServiceRoute() {
        return GatewayRouterFunctions.route("sign_service")
                .route(RequestPredicates.path("/api/sign/**"), 
                       HandlerFunctions.http(signServiceUrl))
                .filter(CircuitBreakerFilterFunctions.circuitBreaker("signServiceCircuitBreaker",
                        URI.create("forward:/fallback/sign")))
                .filter(retryFilter(2))
                .filter(userIdHeaderFilter) // Apply user ID header filter
                .build();
    }

    /**
     * Achievement Service route - authentication required
     * Includes: Circuit Breaker, Timeout, Retry (GET only), User ID Header
     */
    @Bean
    public RouterFunction<ServerResponse> achievementServiceRoute() {
        return GatewayRouterFunctions.route("achievement_service")
                .route(RequestPredicates.path("/api/achievement/**")
                        .or(RequestPredicates.path("/api/achievements/**")), 
                       HandlerFunctions.http(achievementServiceUrl))
                .filter(CircuitBreakerFilterFunctions.circuitBreaker("achievementServiceCircuitBreaker",
                        URI.create("forward:/fallback/achievement")))
                .filter(retryFilter(2))
                .filter(userIdHeaderFilter) // Apply user ID header filter
                .build();
    }

    /**
     * Notification Service route - authentication required
     * Includes: Circuit Breaker, Timeout, Retry (GET only), User ID Header
     */
    @Bean
    public RouterFunction<ServerResponse> notificationServiceRoute() {
        return GatewayRouterFunctions.route("notification_service")
                .route(RequestPredicates.path("/api/notification/**")
                        .or(RequestPredicates.path("/api/notifications/**")), 
                       HandlerFunctions.http(notificationServiceUrl))
                .filter(CircuitBreakerFilterFunctions.circuitBreaker("notificationServiceCircuitBreaker",
                        URI.create("forward:/fallback/notification")))
                .filter(retryFilter(2))
                .filter(userIdHeaderFilter) // Apply user ID header filter
                .build();
    }

    /**
     * User Service route - authentication required
     * Includes: Circuit Breaker, Timeout, Retry (GET only), User ID Header
     */
    @Bean
    public RouterFunction<ServerResponse> userServiceRoute() {
        return GatewayRouterFunctions.route("user_service")
                .route(RequestPredicates.path("/api/user/**"), 
                       HandlerFunctions.http(userServiceUrl))
                .filter(CircuitBreakerFilterFunctions.circuitBreaker("userServiceCircuitBreaker",
                        URI.create("forward:/fallback/user")))
                .filter(retryFilter(2))
                .filter(userIdHeaderFilter) // Apply user ID header filter
                .build();
    }
}
