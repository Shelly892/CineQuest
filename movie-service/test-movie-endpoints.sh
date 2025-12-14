#!/bin/bash

# Movie Service API Test Queries
# Run these commands to test the endpoints at localhost:3002

echo "=== Movie Service API Tests ==="
echo ""

# 1. Get popular movies (page 1)
echo "1. Getting popular movies (page 1)"
curl -X GET "http://localhost:3002/api/movies/popular?page=1"
echo -e "\n"

# 2. Get popular movies (page 2)
echo "2. Getting popular movies (page 2)"
curl -X GET "http://localhost:3002/api/movies/popular?page=2"
echo -e "\n"

# 3. Get movie details for a specific movie ID (e.g., 550 for The Shawshank Redemption)
echo "3. Getting movie details for ID 550"
curl -X GET "http://localhost:3002/api/movies/550"
echo -e "\n"

# 4. Get movie details for a different movie ID (e.g., 680 for Pulp Fiction)
echo "4. Getting movie details for ID 680"
curl -X GET "http://localhost:3002/api/movies/680"
echo -e "\n"

# 5. Search for movies with a query (e.g., "Batman")
echo "5. Searching for movies with query 'Batman' (page 1)"
curl -X GET "http://localhost:3002/api/movies/search?q=Batman&page=1"
echo -e "\n"

# 6. Search for movies with a different query (e.g., "Inception")
echo "6. Searching for movies with query 'Inception' (page 1)"
curl -X GET "http://localhost:3002/api/movies/search?q=Inception&page=1"
echo -e "\n"

# 7. Health check
echo "7. Health check"
curl -X GET "http://localhost:3002/api/movies/health"
echo -e "\n"

echo "=== Tests Complete ==="
