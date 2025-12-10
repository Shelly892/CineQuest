package comp41720.cinequest.ratingservice.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class RatingResponse {
    private String id;
    private String userId;
    private Integer movieId;
    private Integer score;
    private String comment;
    private Instant createdAt;
}
