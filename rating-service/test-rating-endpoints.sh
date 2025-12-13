#!/bin/bash

# Rating Service API Test Queries
# Run these commands to test the endpoints at localhost:3003

echo "=== Rating Service API Tests ==="
echo ""

# 1. Create a rating
echo "1. Creating a rating for user 'user7' and movie '550'"
curl -X POST http://localhost:3003/api/ratings \
  -H "Content-Type: application/json" \
  -H "X-User-Id: user7" \
  -H "X-User-Email: user7@example.com" \
  -H "X-User-Name: John Doe" \
  -d '{
    "movieId": 550,
    "score": 8,
    "comment": "Brilliant film, loved it!"
  }'
echo -e "\n"

# 2. Create another rating (different movie)
echo "2. Creating another rating for user 'user7' and movie '680'"
curl -X POST http://localhost:3003/api/ratings \
  -H "Content-Type: application/json" \
  -H "X-User-Id: user7" \
  -H "X-User-Email: user7@example.com" \
  -H "X-User-Name: John Doe" \
  -d '{
    "movieId": 680,
    "score": 9,
    "comment": "Absolutely fantastic!"
  }'
echo -e "\n"

# 3. Get a specific user rating for a movie
echo "3. Getting rating for user 'user7' and movie '550'"
curl -X GET "http://localhost:3003/api/ratings?userId=user7&movieId=550"
echo -e "\n"

# 4. Get all ratings by a user
echo "4. Getting all ratings by user 'user7'"
curl -X GET "http://localhost:3003/api/ratings/all?userId=user7&page=0&size=20"
echo -e "\n"

# 5. Get all ratings for a movie
echo "5. Getting all ratings for movie '550'"
curl -X GET "http://localhost:3003/api/ratings/movie/550?page=0&size=20"
echo -e "\n"

# 6. Get rating statistics for a movie
echo "6. Getting rating statistics for movie '550'"
curl -X GET "http://localhost:3003/api/ratings/movie/550/stats"
echo -e "\n"

# 7. Update a rating
echo "7. Updating rating for user 'user7' and movie '550'"
curl -X PUT http://localhost:3003/api/ratings \
  -H "Content-Type: application/json" \
  -H "X-User-Id: user7" \
  -d '{
    "movieId": 550,
    "score": 10,
    "comment": "Changed my mind - this is a masterpiece!"
  }'
echo -e "\n"

# 8. Try to create an invalid rating (score out of range)
echo "8. Testing validation - invalid score (should fail)"
curl -X POST http://localhost:3003/api/ratings \
  -H "Content-Type: application/json" \
  -H "X-User-Id: user7" \
  -H "X-User-Email: user7@example.com" \
  -H "X-User-Name: John Doe" \
  -d '{
    "movieId": 550,
    "score": 15,
    "comment": "This should fail"
  }'
echo -e "\n"

# 9. Try to create a duplicate rating (should fail)
echo "9. Testing duplicate rating (should fail)"
curl -X POST http://localhost:3003/api/ratings \
  -H "Content-Type: application/json" \
  -H "X-User-Id: user7" \
  -H "X-User-Email: user7@example.com" \
  -H "X-User-Name: John Doe" \
  -d '{
    "movieId": 550,
    "score": 7,
    "comment": "This should fail as rating already exists"
  }'
echo -e "\n"

# 10. Delete a rating
echo "10. Deleting rating for user 'user7' and movie '680', movie '550'"
curl -X DELETE "http://localhost:3003/api/ratings?movieId=680" \
  -H "X-User-Id: user7"
curl -X DELETE "http://localhost:3003/api/ratings?movieId=550" \
  -H "X-User-Id: user7"
echo -e "\n"

echo "=== Tests Complete ==="
