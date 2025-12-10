package comp41720.cinequest.signservice.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "user_sign_ins", 
       uniqueConstraints = @UniqueConstraint(columnNames = {"user_id", "sign_date"}))
public class UserSignIn {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(name = "user_id", nullable = false)
    private String userId;
    
    @Column(name = "sign_date", nullable = false)
    private LocalDate signDate;
}
