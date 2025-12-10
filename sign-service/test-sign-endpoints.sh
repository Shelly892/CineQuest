#!/bin/bash

# Sign Service API Test Queries
# Run these commands to test the endpoints at localhost:3004

echo "=== Sign Service API Tests ==="
echo ""

# 1. Sign in for the first time
echo "1. Sign-in for user 'user123' (first time)"
curl -X POST http://localhost:3004/api/sign \
  -H "Content-Type: application/json" \
  -H "X-User-Id: user123"
echo -e "\n"

# 2. Try to sign in again on the same day (should fail)
echo "2. Attempting duplicate sign-in for user 'user123' (should fail)"
curl -X POST http://localhost:3004/api/sign \
  -H "Content-Type: application/json" \
  -H "X-User-Id: user123"
echo -e "\n"

# 3. Sign in for a different user
echo "3. Sign-in for user 'user456' (first time)"
curl -X POST http://localhost:3004/api/sign \
  -H "Content-Type: application/json" \
  -H "X-User-Id: user456"
echo -e "\n"

echo "=== Tests Complete ==="
echo ""
echo "Note: To test multiple sign-ins across different days, you would need to:"
echo "  1. Manually update the sign_date in the database, or"
echo "  2. Wait until the next day and run the sign-in request again"
