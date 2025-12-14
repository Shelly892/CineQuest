import axios from "axios";
import {
  API_BASE_URL,
  REQUEST_TIMEOUT,
  STORAGE_KEYS,
} from "../config/constants";

// Create a preconfigured Axios instance
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: REQUEST_TIMEOUT,
  headers: {
    "Content-Type": "application/json",
  },
});

// ==================== Request interceptor ====================
apiClient.interceptors.request.use(
  async (config) => {
    // 1. Attach the JWT access token from Keycloak
    // Import keycloak dynamically to ensure it's initialized
    const { default: keycloak } = await import("../config/keycloak");

    if (keycloak && keycloak.authenticated && keycloak.token) {
      // Update token if needed (Keycloak handles token refresh automatically)
      try {
        await keycloak.updateToken(30); // Refresh token if it expires within 30 seconds
      } catch (error) {
        console.error("[Token Update Failed]", error);
        // If token update fails, user will be redirected to login by Keycloak
      }

      if (keycloak.token) {
        config.headers.Authorization = `Bearer ${keycloak.token}`;
      }
    }

    // 2. Log requests in development for easier debugging
    if (import.meta.env.DEV) {
      console.log(
        `[API Request] ${config.method?.toUpperCase()} ${config.url}`,
        {
          params: config.params,
          data: config.data,
        }
      );
    }

    return config;
  },
  (error) => {
    console.error("[API Request Error]", error);
    return Promise.reject(error);
  }
);

// ==================== Response interceptor ====================
apiClient.interceptors.response.use(
  (response) => {
    // Log successful responses during development
    if (import.meta.env.DEV) {
      console.log(`[API Response] ${response.config.url}`, {
        status: response.status,
        data: response.data,
      });
    }

    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // 1. Handle 401 unauthorized responses
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Attempt to update Keycloak token
        const { default: keycloak } = await import("../config/keycloak");

        if (keycloak && keycloak.authenticated) {
          await keycloak.updateToken();
          if (keycloak.token) {
            originalRequest.headers.Authorization = `Bearer ${keycloak.token}`;
            return apiClient(originalRequest);
          }
        }

        // If not authenticated or token update failed, redirect to login
        if (keycloak) {
          keycloak.login();
        }
        return Promise.reject(error);
      } catch (refreshError) {
        // If refresh fails, redirect to login
        console.error("[Token Refresh Failed]", refreshError);
        const { default: keycloak } = await import("../config/keycloak");
        if (keycloak) {
          keycloak.login();
        }
        return Promise.reject(refreshError);
      }
    }

    // 2. Handle 403 forbidden responses
    if (error.response?.status === 403) {
      console.error("[Access Forbidden]", error.response.data);
    }

    // 3. Handle 429 rate limiting responses
    if (error.response?.status === 429) {
      console.error("[Rate Limited]", "Too many requests");
    }

    // 4. Handle 5xx server errors
    if (error.response?.status >= 500) {
      console.error("[Server Error]", error.response.data);
    }

    // 5. Handle network errors (no response received)
    if (!error.response) {
      console.error("[Network Error]", "Please check your internet connection");
    }

    // Provide full error details in development
    if (import.meta.env.DEV) {
      console.error("[API Error Details]", {
        url: error.config?.url,
        method: error.config?.method,
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        message: error.message,
      });
    }

    return Promise.reject(error);
  }
);

// ==================== Exports ====================
export default apiClient;

export const api = {
  get: (url, config) => apiClient.get(url, config),
  post: (url, data, config) => apiClient.post(url, data, config),
  put: (url, data, config) => apiClient.put(url, data, config),
  patch: (url, data, config) => apiClient.patch(url, data, config),
  delete: (url, config) => apiClient.delete(url, config),
};
