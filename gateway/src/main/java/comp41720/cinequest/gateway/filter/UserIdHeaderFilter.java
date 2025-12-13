package comp41720.cinequest.gateway.filter;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;
import org.springframework.web.servlet.function.HandlerFilterFunction;
import org.springframework.web.servlet.function.ServerRequest;
import org.springframework.web.servlet.function.ServerResponse;

/**
 * Custom filter to extract user ID from JWT token and add it as X-User-Id header
 * to downstream service requests.
 * 
 * This filter extracts the 'sub' claim from the JWT token in SecurityContext
 * and adds it as X-User-Id header for downstream services to identify the user.
 * 
 * @author CineQuest Team
 */
public class UserIdHeaderFilter implements HandlerFilterFunction<ServerResponse, ServerResponse> {

    private static final Logger logger = LoggerFactory.getLogger(UserIdHeaderFilter.class);
    private static final String USER_ID_HEADER = "X-User-Id";

    @Override
    public ServerResponse filter(ServerRequest request, 
                                 org.springframework.web.servlet.function.HandlerFunction<ServerResponse> next) 
            throws Exception {
        try {
            // Get authentication from SecurityContext
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

            // Check if it's a JWT authentication
            if (authentication instanceof JwtAuthenticationToken jwtToken) {
                Jwt jwt = jwtToken.getToken();
                // Extract User ID (Keycloak stores user ID in 'sub' claim)
                String userId = jwt.getSubject();

                if (userId != null && !userId.isEmpty()) {
                    logger.debug("Extracted user ID from JWT: {}", userId);

                    // Create modified request with X-User-Id header
                    ServerRequest modifiedRequest = ServerRequest.from(request)
                            .header(USER_ID_HEADER, userId)
                            .build();

                    logger.debug("Added {} header with value: {} to downstream service", USER_ID_HEADER, userId);
                    return next.handle(modifiedRequest);
                } else {
                    logger.warn("JWT token found but subject (userId) is empty");
                }
            } else {
                // Try alternative: get from request principal (fallback)
                var principalOpt = request.principal();
                if (principalOpt.isPresent() && principalOpt.get() instanceof JwtAuthenticationToken jwtToken) {
                    String userId = jwtToken.getToken().getSubject();
                    if (userId != null && !userId.isEmpty()) {
                        logger.debug("Extracted user ID from request principal: {}", userId);
                        ServerRequest modifiedRequest = ServerRequest.from(request)
                                .header(USER_ID_HEADER, userId)
                                .build();
                        logger.debug("Added {} header with value: {} to downstream service (from principal)", 
                                   USER_ID_HEADER, userId);
                        return next.handle(modifiedRequest);
                    }
                }
            }
        } catch (Exception e) {
            logger.error("Error extracting user ID from JWT: {}", e.getMessage(), e);
        }

        // If no JWT found or extraction failed, proceed without X-User-Id header
        logger.debug("No JWT authentication found, proceeding without {} header", USER_ID_HEADER);
        return next.handle(request);
    }
}

