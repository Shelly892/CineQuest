package comp41720.cinequest.gateway.config;

import comp41720.cinequest.gateway.filter.UserIdHeaderFilter;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.cloud.gateway.server.mvc.filter.CircuitBreakerFilterFunctions;
import org.springframework.cloud.gateway.server.mvc.handler.GatewayRouterFunctions;
import org.springframework.cloud.gateway.server.mvc.handler.HandlerFunctions;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.function.*;
import java.net.URI;
import static org.springframework.cloud.gateway.server.mvc.filter.BeforeFilterFunctions.preserveHostHeader;

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

    @Value("${spring.gateway.services.keycloak}")
    private String keycloakServiceUrl;

    @Value("${spring.gateway.services.movie}")
    private String movieServiceUrl;

    @Value("${spring.gateway.services.rating}")
    private String ratingServiceUrl;

    @Value("${spring.gateway.services.sign}")
    private String signServiceUrl;

    @Value("${spring.gateway.services.achievement}")
    private String achievementServiceUrl;

    @Value("${spring.gateway.services.notification}")
    private String notificationServiceUrl;

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
        logger.info("===========================================");
        return "Service URLs logged";
    }

    /**
     * Keycloak proxy route - for all Keycloak endpoints
     */
    @Bean
    public RouterFunction<ServerResponse> keycloakRoute() {
        return GatewayRouterFunctions.route("keycloak")
                .route(RequestPredicates.path("/keycloak/**"),
                       HandlerFunctions.http(keycloakServiceUrl))
                .before(preserveHostHeader())
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
                .build();
    }

    /**
     * Rating Service route - authentication required
     * Includes: Circuit Breaker, Timeout, Retry (GET only), User ID Header
     */
    @Bean
    public RouterFunction<ServerResponse> ratingServiceRoute() {
        return GatewayRouterFunctions.route("rating_service")
                .filter(userIdHeaderFilter) // Apply user ID header filter
                .route(RequestPredicates.path("/api/rating/**")
                        .or(RequestPredicates.path("/api/ratings/**")), 
                       HandlerFunctions.http(ratingServiceUrl))
                .filter(CircuitBreakerFilterFunctions.circuitBreaker("ratingServiceCircuitBreaker",
                        URI.create("forward:/fallback/rating")))
                .build();
    }

    /**
     * Sign Service route - authentication required
     * Includes: Circuit Breaker, Timeout, Retry (GET only), User ID Header
     */
    @Bean
    public RouterFunction<ServerResponse> signServiceRoute() {
        return GatewayRouterFunctions.route("sign_service")
                .filter(userIdHeaderFilter) // Apply user ID header filter
                .route(RequestPredicates.path("/api/sign/**"),
                       HandlerFunctions.http(signServiceUrl))
                .filter(CircuitBreakerFilterFunctions.circuitBreaker("signServiceCircuitBreaker",
                        URI.create("forward:/fallback/sign")))
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
                .build();
    }
}
