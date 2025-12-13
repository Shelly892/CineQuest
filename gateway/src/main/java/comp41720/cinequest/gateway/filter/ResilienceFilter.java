package comp41720.cinequest.gateway.filter;

import io.github.resilience4j.retry.Retry;
import io.github.resilience4j.retry.RetryRegistry;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpMethod;
import org.springframework.web.servlet.function.HandlerFilterFunction;
import org.springframework.web.servlet.function.ServerRequest;
import org.springframework.web.servlet.function.ServerResponse;

import java.util.function.Supplier;

/**
 * Resilience filter that applies retry logic for idempotent GET requests
 * 
 * Timeout is handled by the HTTP client configuration in Spring Cloud Gateway Server MVC.
 * Circuit Breaker is handled separately by CircuitBreakerFilterFunctions.
 * 
 * This filter only applies retry logic for GET requests (idempotent operations).
 * 
 * @author CineQuest Team
 */
public class ResilienceFilter implements HandlerFilterFunction<ServerResponse, ServerResponse> {

    private static final Logger logger = LoggerFactory.getLogger(ResilienceFilter.class);
    
    private final Retry retry;
    private final boolean enableRetry;

    public ResilienceFilter(RetryRegistry retryRegistry, String instanceName) {
        this.retry = retryRegistry.retry(instanceName);
        this.enableRetry = true;
    }

    public ResilienceFilter() {
        // No-op filter when retry is not needed
        this.retry = null;
        this.enableRetry = false;
    }

    @Override
    public ServerResponse filter(ServerRequest request, 
                               org.springframework.web.servlet.function.HandlerFunction<ServerResponse> next) 
            throws Exception {
        
        // Only retry GET requests (idempotent operations)
        boolean shouldRetry = enableRetry && HttpMethod.GET.name().equals(request.method());
        
        if (!shouldRetry) {
            return next.handle(request);
        }

        // Apply retry for GET requests
        Supplier<ServerResponse> responseSupplier = () -> {
            try {
                return next.handle(request);
            } catch (Exception e) {
                logger.warn("Request failed, will retry: {}", e.getMessage());
                throw new RuntimeException(e);
            }
        };

        try {
            Supplier<ServerResponse> decoratedSupplier = Retry.decorateSupplier(retry, responseSupplier);
            return decoratedSupplier.get();
        } catch (Exception e) {
            logger.error("Request failed after retries: {}", e.getMessage());
            throw e;
        }
    }
}

