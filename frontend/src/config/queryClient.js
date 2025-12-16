import { QueryClient } from "@tanstack/react-query";

// ==================== Query Client Configuration ====================
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      cacheTime: 10 * 60 * 1000, // 10 minutes
      retry: 1,
      refetchOnWindowFocus: false,
    },
    mutations: {
      retry: 0,
    },
  },
});

// ==================== Query Keys ====================
export const queryKeys = {
  // Authentication
  auth: {
    currentUser: ["auth", "currentUser"],
  },

  // Movies
  movies: {
    all: ["movies"],
    popular: (page = 1) => ["movies", "popular", page],
    search: (query, page = 1) => ["movies", "search", query, page],
    detail: (id) => ["movies", "detail", id],
  },

  // Ratings
  ratings: {
    all: ["ratings"],
    user: (userId, page = 0) => ["ratings", "user", userId, page],
    movie: (movieId, page = 0) => ["ratings", "movie", movieId, page],
    movieStats: (movieId) => ["ratings", "movie", movieId, "stats"],
    userMovie: (userId, movieId) => [
      "ratings",
      "user",
      userId,
      "movie",
      movieId,
    ],
  },

  // Sign-in
  sign: {
    all: ["sign"],
  },

  // Achievements
  achievements: {
    all: ["achievements"],
    user: (userId) => ["achievements", "user", userId],
  },
};
