package comp41720.cinequest.ratingservice.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

import java.time.Instant;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "ratings")
public class Rating {
    
    @Id
    private String id;
    
    @Field("user_id")
    private String userId;
    
    @Field("movie_id")
    private Integer movieId;
    
    @Field("score")
    private Integer score;
    
    @Field("comment")
    private String comment;
    
    @Field("created_at")
    private Instant createdAt;
}
