import apiClient from "./client";
import { API_PATHS, STORAGE_KEYS } from "../config/constants";

// ==================== Authentication API ====================
export const authApi = {
  /**
   * Authenticate a user with username and password
   */
  login: async (username, password) => {
    const { data } = await apiClient.post(API_PATHS.AUTH.LOGIN, {
      username,
      password,
    });

    // Persist tokens and user profile locally
    localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, data.access_token);
    localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, data.refresh_token);
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(data.user));

    return data;
  },

  /**
   * Sign the current user out
   */
  logout: async () => {
    try {
      await apiClient.post(API_PATHS.AUTH.LOGOUT);
    } finally {
      // Always clear locally stored auth data
      localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
      localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
      localStorage.removeItem(STORAGE_KEYS.USER);
    }
  },

  /**
   * Fetch the currently authenticated user
   */
  getCurrentUser: async () => {
    const { data } = await apiClient.get(API_PATHS.AUTH.ME);
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(data));
    return data;
  },

  /**
   * Determine whether a user is authenticated
   */
  isAuthenticated: () => {
    return !!localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
  },

  /**
   * Read the stored user record from localStorage
   */
  getStoredUser: () => {
    const userStr = localStorage.getItem(STORAGE_KEYS.USER);
    return userStr ? JSON.parse(userStr) : null;
  },
};
