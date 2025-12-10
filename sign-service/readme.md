### 📁 1. Sign Service (`sign-service/README.md`)

```markdown
# Sign Service

## Overview
**Port:** `3004`
**Responsibility:** Handles user daily check-ins (sign-ins). It ensures a user can only sign in once per day and notifies the Achievement Service of the user's total progress.

## Tech Stack
*   **Language:** Java (SpringBoot)
*   **Database:** PostgreSQL
*   **Communication:** gRPC Client (calls AchievementGrpcClient)

## Database Schema (PostgreSQL)
**Table:** `user_sign_ins`

| Column | Type | Description |
| :--- | :--- | :--- |
| `id` | `SERIAL` (PK) | Auto-increment ID. |
| `user_id` | `VARCHAR(255)` | The unique User ID (String). |
| `sign_date` | `DATE` | The date of the check-in. |

**Constraints:**
```sql
-- Composite unique index to prevent duplicate check-ins on the same day
CREATE UNIQUE INDEX idx_user_date ON user_sign_ins (user_id, sign_date);
```

## Functional Requirements & Logic

### 1. User Check-in
*   **Input:** `userId` (String)
*   **Logic:**
    1.  **DB Write:** Attempt to insert `(user_id, current_date)` into PostgreSQL.
        *   *Edge Case:* If the insertion fails due to the unique constraint, return "Already signed in today."
    2.  **DB Read:** On success, query the total count: `SELECT COUNT(*) FROM user_sign_ins WHERE user_id = ?`.
    3.  **gRPC Call:** Call `AchievementGrpcClient.updateSignCount` with the updated count.

### 2. Get Check-in Count
*   **Input:** `userId`
*   **Output:** Returns the total number of days the user has signed in (Integer).