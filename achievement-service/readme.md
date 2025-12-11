### 📁 Achievement Service

```markdown
# Achievement Service

## Overview
**Port:** `3005`
**Responsibility:** Acts as the gamification engine. It receives progress updates (counts) from other services via gRPC, evaluates logic tiers, awards badges, and publishes events to Kafka.

## Tech Stack
*   **Language:** Java (SpringBoot)
*   **Database:** MongoDB
*   **Communication:** gRPC Server, Kafka Producer

## Database Schema (MongoDB)
**Collection:** `user_badges` (Stores earned achievements only)

**Document Structure:**
```json
{
  "_id": "ObjectId('...')",
  "user_id": "user_123_abc",
  "badge_name": "Sign Novice",
  "badge_type": "SIGN",        // Enum: "SIGN" or "RATING"
  "badge_level": "Bronze",     // Enum: "Bronze", "Silver", "Gold", "Platinum" (For UI image selection)
  "description": "Signed in 3 days",
  "earned_at": "ISODate('2023-12-10T10:05:00Z')"
}
```

## Functional Requirements & Logic

### 1. gRPC: UpdateSignCount
*   **Input:** `userId` (String), `count` (Int)
*   **Tier Logic (Hardcoded):**
    *   **Count == 3:**
        *   Badge: "Sign Novice"
        *   Level: "Bronze"
        *   Description: "Signed in 3 days"
    *   **Count == 10:**
        *   Badge: "Sign Regular"
        *   Level: "Silver"
        *   Description: "Signed in 10 days"
    *   **Count == 50:**
        *   Badge: "Sign Master"
        *   Level: "Gold"
        *   Description: "Signed in 50 days"
    *   **Count == 100:**
        *   Badge: "Sign God"
        *   Level: "Platinum"
        *   Description: "Signed in 100 days"
*   **Action:**
    1.  Check if the badge already exists in MongoDB (idempotency).
    2.  If new, insert into `user_badges`.
    3.  **Produce Kafka Message** (Topic: `achievement_unlocked`).

### 2. gRPC: UpdateRatingCount
*   **Input:** `userId` (String), `count` (Int)
*   **Tier Logic (Hardcoded):**
    *   **Count == 3:**
        *   Badge: "Commentator"
        *   Level: "Bronze"
        *   Description: "Posted 3 ratings"
    *   **Count == 10:**
        *   Badge: "Critic"
        *   Level: "Silver"
        *   Description: "Posted 10 ratings"
    *   **Count == 50:**
        *   Badge: "Opinion Leader"
        *   Level: "Gold"
        *   Description: "Posted 50 ratings"
*   **Action:**
    1.  Check if the badge already exists.
    2.  If new, insert into `user_badges`.
    3.  **Produce Kafka Message** (Topic: `achievement_unlocked`).

### 3. API: Get Badges of one user
*   **Input:** `userId`
*   **Output:** Returns a list of all badge documents earned by the user.

## Kafka Events
**Topic:** `achievement_unlocked`
**Payload Example:**
```json
{
  "user_id": "user_123_abc",
  "badge_name": "Sign Novice",
  "badge_level": "Bronze",
  "description": "Signed in 3 days",
  "timestamp": "2023-12-10T10:05:00Z"
}
```