package comp41720.cinequest.signservice.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class SignInResponse {
    private Long id;
    private String userId;
    private LocalDate signDate;
    private Long totalSignCount;
}
