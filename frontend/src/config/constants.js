// ==================== Environment Variables ====================
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "";
export const KEYCLOAK_URL =
  import.meta.env.VITE_KEYCLOAK_URL || "http://localhost:8000/keycloak";
export const KEYCLOAK_REALM =
  import.meta.env.VITE_KEYCLOAK_REALM || "cinequest";
export const KEYCLOAK_CLIENT_ID =
  import.meta.env.VITE_KEYCLOAK_CLIENT_ID || "cinequest-frontend-client";

// Mock data mode is disabled - always use real API
// export const USE_MOCK_DATA = false;

// ==================== API Configuration ====================
export const REQUEST_TIMEOUT = 30000; // 30 seconds
export const ENABLE_DEVTOOLS = import.meta.env.DEV;

// ==================== Local Storage Keys ====================
export const STORAGE_KEYS = {
  ACCESS_TOKEN: "cinequest_access_token",
  REFRESH_TOKEN: "cinequest_refresh_token",
  USER: "cinequest_user",
};

// API endpoints
export const API_PATHS = {
  // Authentication
  AUTH: {
    LOGIN: "/api/auth/login",
    LOGOUT: "/api/auth/logout",
    REFRESH: "/api/auth/refresh",
    ME: "/api/auth/me",
  },

  // Movies
  MOVIES: {
    POPULAR: "/api/movies/popular",
    SEARCH: "/api/movies/search",
    DETAIL: (id) => `/api/movies/${id}`,
  },

  // Ratings
  RATINGS: {
    BASE: "/api/ratings", // GET ?userId=xxx&movieId=xxx
    ALL: "/api/ratings/all", // GET ?userId=xxx&page=0&size=20
    MOVIE: (movieId) => `/api/ratings/movie/${movieId}`, // GET /api/ratings/movie/{movieId}
    MOVIE_STATS: (movieId) => `/api/ratings/movie/${movieId}/stats`, // GET stats
    CREATE: "/api/ratings", // POST
    UPDATE: "/api/ratings", // PUT
    DELETE: "/api/ratings", // DELETE ?movieId=xxx
  },

  // Sign-in
  SIGN: {
    CHECK_IN: "/api/signs",
    USER_HISTORY: (userId) => `/api/signs/user/${userId}`,
  },

  // Achievements
  ACHIEVEMENTS: {
    USER: (userId) => `/api/achievement/user/${userId}`,
    ALL: "/api/achievement",
  },
};

// ==================== Route Paths ====================
export const ROUTES = {
  HOME: "/",
  LOGIN: "/login",
  MOVIES: "/movies",
  MOVIE_DETAIL: (id) => `/movies/${id}`,
  RATINGS: "/ratings",
  SIGN_IN: "/sign-in",
  ACHIEVEMENTS: "/achievements",
};
