package comp41720.cinequest.signservice.controller;

import comp41720.cinequest.signservice.dto.SignInResponse;
import comp41720.cinequest.signservice.service.SignService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@Slf4j
@RestController
@RequestMapping("/api/sign")
@RequiredArgsConstructor
public class SignController {
    
    private final SignService signService;
    
    @PostMapping
    public ResponseEntity<SignInResponse> signIn(
            @RequestHeader("X-User-Id") String userId,
            @RequestHeader("X-User-Email") String userEmail,
            @RequestHeader("X-User-Name") String userName) {
        log.info("POST /api/sign - Sign-in request for user {}", userId);

        try {
            SignInResponse response = signService.signIn(userId, userEmail, userName);
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (IllegalStateException e) {
            log.error("Sign-in error: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.CONFLICT).build();
        }
    }

}
