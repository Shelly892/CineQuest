#!/bin/bash

# Achievement Service API Test Queries
# Run these commands to test the endpoints at localhost:3005

echo "=== Achievement Service API Tests ==="
echo ""

# 1. Get badges for user123 (should be empty initially)
echo "1. Get badges for user 'user123' (should be empty initially)"
curl -X GET http://localhost:3005/api/achievements/users/user123/badges
echo -e "\n"

# 2. Get badges for user456 (should be empty initially)
echo "2. Get badges for user 'user456' (should be empty initially)"
curl -X GET http://localhost:3005/api/achievements/users/user456/badges
echo -e "\n"

echo "=== Tests Complete ==="
echo ""
echo "Note: To test badge awarding, you need to:"
echo "  1. Use the Sign Service to trigger sign-in events (which calls gRPC UpdateSignCount)"
echo "  2. Use the Rating Service to submit ratings (which calls gRPC NotifyRatingSubmitted)"
echo "  3. After triggering these events, check the badges again using the GET endpoint above"
echo ""
echo "Example workflow:"
echo "  - Sign in 3 times with user123 -> Should award 'Sign Novice' (Bronze)"
echo "  - Sign in 10 times total -> Should award 'Sign Regular' (Silver)"
echo "  - Submit 3 ratings -> Should award 'Commentator' (Bronze)"
echo "  - Submit 10 ratings total -> Should award 'Critic' (Silver)"
