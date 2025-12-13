package comp41720.cinequest.gateway.config;

import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.MediaType;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.AuthenticationEntryPoint;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.time.Instant;
import java.util.HashMap;
import java.util.Map;

/**
 * Custom authentication entry point to handle unauthenticated requests
 * Returns a friendly JSON error response instead of default 401
 * 
 * @author CineQuest Team
 */
@Component
public class CustomAuthenticationEntryPoint implements AuthenticationEntryPoint {

    private static final Logger logger = LoggerFactory.getLogger(CustomAuthenticationEntryPoint.class);
    private final ObjectMapper objectMapper = new ObjectMapper();

    @Override
    public void commence(HttpServletRequest request, 
                        HttpServletResponse response,
                        AuthenticationException authException) throws IOException, ServletException {
        
        logger.warn("Unauthenticated request to: {} {}", request.getMethod(), request.getRequestURI());
        
        response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
        response.setContentType(MediaType.APPLICATION_JSON_VALUE);
        response.setCharacterEncoding("UTF-8");
        
        Map<String, Object> errorResponse = new HashMap<>();
        errorResponse.put("error", "Unauthorized");
        errorResponse.put("message", "Authentication required. Please login first.");
        errorResponse.put("status", 401);
        errorResponse.put("timestamp", Instant.now().toString());
        errorResponse.put("path", request.getRequestURI());
        
        // Add helpful information about how to authenticate
        Map<String, String> authInfo = new HashMap<>();
        authInfo.put("loginEndpoint", "/realms/cinequest/protocol/openid-connect/token");
        authInfo.put("authEndpoint", "/realms/cinequest/protocol/openid-connect/auth");
        authInfo.put("registrationEndpoint", "/realms/cinequest/protocol/openid-connect/registrations");
        errorResponse.put("authentication", authInfo);
        
        objectMapper.writeValue(response.getWriter(), errorResponse);
    }
}

