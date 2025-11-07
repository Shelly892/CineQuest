import { QueryClient } from "@tanstack/react-query";
import { QUERY_CONFIG } from "./constants";

// Instantiate a configured QueryClient
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: QUERY_CONFIG.STALE_TIME,
      cacheTime: QUERY_CONFIG.CACHE_TIME,
      retry: QUERY_CONFIG.RETRY,
      refetchOnWindowFocus: QUERY_CONFIG.REFETCH_ON_WINDOW_FOCUS,
      onError: (error) => {
        console.error("[Query Error]", error);
      },
    },
    mutations: {
      retry: 1,
      onError: (error) => {
        console.error("[Mutation Error]", error);
      },
    },
  },
});

// Query Keys - centralized definitions
export const queryKeys = {
  // Authentication
  auth: {
    currentUser: ["auth", "currentUser"],
  },

  // Movies
  movies: {
    all: ["movies"],
    popular: (page) => ["movies", "popular", page],
    search: (query, page) => ["movies", "search", query, page],
    detail: (id) => ["movies", "detail", id],
    recommendations: (id) => ["movies", "recommendations", id],
    nowPlaying: (page) => ["movies", "nowPlaying", page],
    upcoming: (page) => ["movies", "upcoming", page],
    topRated: (page) => ["movies", "topRated", page],
  },

  // Ratings
  ratings: {
    all: ["ratings"],
    userRating: (movieId) => ["ratings", "userRating", movieId],
    userRatings: (page) => ["ratings", "userRatings", page],
    movieRatings: (movieId, page) => ["ratings", "movieRatings", movieId, page],
  },
};
