package comp41720.cinequest.gateway.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.Instant;
import java.util.HashMap;
import java.util.Map;

/**
 * Fallback controller for handling service unavailability (MVC version)
 * 
 * This controller is automatically triggered by Circuit Breaker when services are down,
 * timeout occurs, or connection fails. It supports all HTTP methods to handle any request type.
 * 
 * @author CineQuest Team
 */
@RestController
@RequestMapping("/fallback")
public class FallbackController {

    /**
     * Generic fallback handler that accepts all HTTP methods
     */
    private ResponseEntity<Map<String, Object>> createFallbackResponse(String serviceName, String message) {
        Map<String, Object> response = new HashMap<>();
        response.put("message", message);
        response.put("service", serviceName);
        response.put("status", "SERVICE_UNAVAILABLE");
        response.put("timestamp", Instant.now().toString());
        response.put("error", "Circuit breaker is open or service timeout occurred");
        
        return ResponseEntity
            .status(HttpStatus.SERVICE_UNAVAILABLE)
            .body(response);
    }

    @RequestMapping(value = "/global", method = {RequestMethod.GET, RequestMethod.POST, 
            RequestMethod.PUT, RequestMethod.DELETE, RequestMethod.PATCH})
    public ResponseEntity<Map<String, Object>> globalFallback(
            @RequestParam(value = "service", required = false, defaultValue = "unknown") String serviceName) {
        return createFallbackResponse(serviceName, "Service temporarily unavailable");
    }
    
    @RequestMapping(value = "/movie", method = {RequestMethod.GET, RequestMethod.POST, 
            RequestMethod.PUT, RequestMethod.DELETE, RequestMethod.PATCH})
    public ResponseEntity<Map<String, Object>> movieServiceFallback() {
        return createFallbackResponse("movie-service", 
                "Movie service is temporarily unavailable. Please try again later.");
    }
    
    @RequestMapping(value = "/rating", method = {RequestMethod.GET, RequestMethod.POST, 
            RequestMethod.PUT, RequestMethod.DELETE, RequestMethod.PATCH})
    public ResponseEntity<Map<String, Object>> ratingServiceFallback() {
        return createFallbackResponse("rating-service", 
                "Rating service is temporarily unavailable. Please try again later.");
    }

    @RequestMapping(value = "/sign", method = {RequestMethod.GET, RequestMethod.POST, 
            RequestMethod.PUT, RequestMethod.DELETE, RequestMethod.PATCH})
    public ResponseEntity<Map<String, Object>> signServiceFallback() {
        return createFallbackResponse("sign-service", 
                "Sign service is temporarily unavailable. Please try again later.");
    }

    @RequestMapping(value = "/achievement", method = {RequestMethod.GET, RequestMethod.POST, 
            RequestMethod.PUT, RequestMethod.DELETE, RequestMethod.PATCH})
    public ResponseEntity<Map<String, Object>> achievementServiceFallback() {
        return createFallbackResponse("achievement-service", 
                "Achievement service is temporarily unavailable. Please try again later.");
    }

    @RequestMapping(value = "/notification", method = {RequestMethod.GET, RequestMethod.POST, 
            RequestMethod.PUT, RequestMethod.DELETE, RequestMethod.PATCH})
    public ResponseEntity<Map<String, Object>> notificationServiceFallback() {
        return createFallbackResponse("notification-service", 
                "Notification service is temporarily unavailable. Please try again later.");
    }

    @RequestMapping(value = "/user", method = {RequestMethod.GET, RequestMethod.POST, 
            RequestMethod.PUT, RequestMethod.DELETE, RequestMethod.PATCH})
    public ResponseEntity<Map<String, Object>> userServiceFallback() {
        return createFallbackResponse("user-service", 
                "User service is temporarily unavailable. Please try again later.");
    }
}

