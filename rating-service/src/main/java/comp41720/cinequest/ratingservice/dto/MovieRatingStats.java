package comp41720.cinequest.ratingservice.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class MovieRatingStats {
    private Integer movieId;
    private Double averageScore;
    private Long totalRatings;
}
