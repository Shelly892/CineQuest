package comp41720.cinequest.ratingservice.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class RatingRequest {
    private Integer movieId;
    private Integer score;
    private String comment;
}
