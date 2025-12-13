package comp41720.cinequest.gateway.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.web.SecurityFilterChain;

/**
 * Security configuration for the gateway (MVC version)
 * 
 * @author CineQuest Team
 */
@Configuration
@EnableWebSecurity
public class SecurityConfig {

    private final CustomAuthenticationEntryPoint authenticationEntryPoint;

    public SecurityConfig(CustomAuthenticationEntryPoint authenticationEntryPoint) {
        this.authenticationEntryPoint = authenticationEntryPoint;
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        return http
            .csrf(csrf -> csrf.disable())
            .authorizeHttpRequests(auth -> auth
                // Fallback endpoints - no authentication required
                .requestMatchers("/fallback/**").permitAll()
                // Keycloak endpoints - no authentication required for login/token endpoints
                .requestMatchers("/realms/**").permitAll()
                // Auth proxy endpoints - no authentication required (they proxy to Keycloak)
                .requestMatchers("/api/auth/**").permitAll()
                // Movie service routes - public access
                .requestMatchers("/api/movie/**", "/api/movies/**").permitAll()
                // Test endpoints - public access
                .requestMatchers("/test/**").permitAll()
                // Protected routes - require authentication
                .requestMatchers("/api/user/**", "/api/rating/**", "/api/sign/**", 
                               "/api/achievement/**", "/api/notification/**").authenticated()
                // All other routes require authentication
                .anyRequest().permitAll()
            )
//            .oauth2ResourceServer(oauth2 -> oauth2
//                .jwt(jwt -> {})
//                .authenticationEntryPoint(authenticationEntryPoint) // Custom 401 error handler
//            )
            .exceptionHandling(exceptions -> exceptions
                .authenticationEntryPoint(authenticationEntryPoint) // Handle unauthenticated requests
            )
            .build();
    }
}

