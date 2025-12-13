package comp41720.cinequest.movieservice.exception;

import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.HttpServerErrorException;
import org.springframework.web.client.ResourceAccessException;

import java.util.HashMap;
import java.util.Map;

@RestControllerAdvice
@Slf4j
public class GlobalExceptionHandler {

    /**
     * Handle TMDB API 4xx errors
     */
    @ExceptionHandler(HttpClientErrorException.class)
    public ResponseEntity<Map<String, Object>> handleClientError(HttpClientErrorException ex) {
        log.error("❌ TMDB API Client Error: {}", ex.getMessage());

        Map<String, Object> error = new HashMap<>();
        error.put("error", "External API Error");
        error.put("message", "Failed to fetch data from TMDB");
        error.put("status", ex.getStatusCode().value());

        return ResponseEntity.status(ex.getStatusCode()).body(error);
    }

    /**
     * Handle TMDB API 5xx errors
     */
    @ExceptionHandler(HttpServerErrorException.class)
    public ResponseEntity<Map<String, Object>> handleServerError(HttpServerErrorException ex) {
        log.error("❌ TMDB API Server Error: {}", ex.getMessage());

        Map<String, Object> error = new HashMap<>();
        error.put("error", "External Service Unavailable");
        error.put("message", "TMDB service is temporarily unavailable");
        error.put("status", HttpStatus.SERVICE_UNAVAILABLE.value());

        return ResponseEntity.status(HttpStatus.SERVICE_UNAVAILABLE).body(error);
    }

    /**
     * Handle network connection errors
     */
    @ExceptionHandler(ResourceAccessException.class)
    public ResponseEntity<Map<String, Object>> handleNetworkError(ResourceAccessException ex) {
        log.error("❌ Network Error: {}", ex.getMessage());

        Map<String, Object> error = new HashMap<>();
        error.put("error", "Network Error");
        error.put("message", "Failed to connect to external service");
        error.put("status", HttpStatus.SERVICE_UNAVAILABLE.value());

        return ResponseEntity.status(HttpStatus.SERVICE_UNAVAILABLE).body(error);
    }

    /**
     * Handle all other exceptions
     */
    @ExceptionHandler(Exception.class)
    public ResponseEntity<Map<String, Object>> handleGeneralError(Exception ex) {
        log.error("❌ Unexpected Error: {}", ex.getMessage(), ex);

        Map<String, Object> error = new HashMap<>();
        error.put("error", "Internal Server Error");
        error.put("message", "An unexpected error occurred");
        error.put("status", HttpStatus.INTERNAL_SERVER_ERROR.value());

        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
    }
}