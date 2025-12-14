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
    user: (userId) => ["ratings", "user", userId],
    movie: (movieId) => ["ratings", "movie", movieId],
  },

  // Sign-in
  sign: {
    all: ["sign"],
    userHistory: (userId) => ["sign", "user", userId],
  },

  // Achievements
  achievements: {
    all: ["achievements"],
    user: (userId) => ["achievements", "user", userId],
  },
};
