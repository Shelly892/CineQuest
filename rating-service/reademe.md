### 📁 Rating Service

```markdown
# Rating Service

## Overview
**Port:** `3003`
**Responsibility:** Manages movie ratings and comments. It stores user feedback and notifies the Achievement Service whenever a new rating is submitted.

## Tech Stack
*   **Language:** Java (SpringBoot)
*   **Database:** MongoDB
*   **Communication:** gRPC Client (calls Achievement Service)

## Database Schema (MongoDB)
**Collection:** `ratings`

**Document Structure:**
```json
{
  "_id": "ObjectId('...')",
  "user_id": "user_123_abc",   // String
  "movie_id": 27205,           // Integer (Matches TMDB ID)
  "score": 8,                  // Integer (1-10)
  "comment": "Great visual effects!",
  "created_at": "ISODate('2023-12-10T10:00:00Z')"
}
```