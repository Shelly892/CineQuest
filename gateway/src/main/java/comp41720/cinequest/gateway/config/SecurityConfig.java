package comp41720.cinequest.gateway.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.http.HttpMethod;

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
                        // Fallback & Keycloak
                        .requestMatchers("/fallback/**").permitAll()
                        .requestMatchers("/keycloak/**").permitAll()

                        // Movie Service (Public)
                        .requestMatchers("/api/movie/**", "/api/movies/**").permitAll()

                        // Achievement (Public) -> only contains GET
                        .requestMatchers("/api/achievement/**").permitAll()

                        // ratings (only GET Public)
                        .requestMatchers(HttpMethod.GET, "/api/ratings/**").permitAll()

                        // === Authenticated ===
                        // Sign (All Authenticated)
                        // ratings (POST/PUT/DELETE)
                        .requestMatchers("/api/sign/**", "/api/ratings/**").authenticated()

                        // === default ===
                        .anyRequest().authenticated()
                )
                .oauth2ResourceServer(oauth2 -> oauth2.jwt(Customizer.withDefaults()))
                .exceptionHandling(exceptions -> exceptions
                        .authenticationEntryPoint(authenticationEntryPoint)
                )
                .build();
    }
}

