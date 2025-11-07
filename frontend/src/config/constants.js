export const APP_NAME = import.meta.env.VITE_APP_NAME || "CineQuest";
export const APP_VERSION = import.meta.env.VITE_APP_VERSION || "1.0.0";
export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";
export const ENABLE_DEVTOOLS = import.meta.env.VITE_ENABLE_DEVTOOLS === "true";

// API endpoints
export const API_PATHS = {
  // Authentication
  AUTH: {
    LOGIN: "/api/auth/login",
    LOGOUT: "/api/auth/logout",
    REGISTER: "/api/auth/register",
    REFRESH: "/api/auth/refresh",
    ME: "/api/auth/me",
  },

  // Users
  USERS: {
    BASE: "/api/users",
    PROFILE: (id) => `/api/users/${id}`,
  },

  // Movies
  MOVIES: {
    BASE: "/api/movies",
    POPULAR: "/api/movies/popular",
    SEARCH: "/api/movies/search",
    DETAIL: (id) => `/api/movies/${id}`,
    RECOMMENDATIONS: (id) => `/api/movies/${id}/recommendations`,
  },

  // Ratings
  RATINGS: {
    BASE: "/api/ratings",
    USER_RATING: (movieId) => `/api/ratings/movie/${movieId}/user`,
    CREATE: "/api/ratings",
    UPDATE: (id) => `/api/ratings/${id}`,
    DELETE: (id) => `/api/ratings/${id}`,
  },
};

// Local storage keys
export const STORAGE_KEYS = {
  ACCESS_TOKEN: "access_token",
  REFRESH_TOKEN: "refresh_token",
  USER: "user",
  THEME: "theme",
};

// Pagination defaults
export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_PAGE_SIZE: 20,
  MAX_PAGE_SIZE: 100,
};

// Request timeout (milliseconds)
export const REQUEST_TIMEOUT = 10000;

// React Query defaults
export const QUERY_CONFIG = {
  STALE_TIME: 5 * 60 * 1000, // 5 minutes
  CACHE_TIME: 10 * 60 * 1000, // 10 minutes
  RETRY: 2, // Retry twice
  REFETCH_ON_WINDOW_FOCUS: false, // Do not refetch when window regains focus
};
