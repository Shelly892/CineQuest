import { api } from "./client";
import { API_PATHS } from "../config/constants";

// ==================== Sign API ====================
export const signApi = {
  /**
   * Check in for today
   * Backend: POST /api/sign
   */
  checkIn: async (data) => {
    const response = await api.post(API_PATHS.SIGN.CHECK_IN, data);
    return response.data;
  },

  /**
   * Get user's sign-in history
   * Backend: GET /api/signs/user/{userId}
   */
  getUserHistory: async (userId) => {
    try {
      const response = await api.get(API_PATHS.SIGN.USER_HISTORY(userId), {
        validateStatus: (status) => status === 200 || status === 404,
      });

      // If status is 404, return empty data structure
      if (response.status === 404) {
        return {
          todaySigned: false,
          consecutiveDays: 0,
          totalDays: 0,
          signHistory: [],
        };
      }

      return response.data;
    } catch (error) {
      // Handle any other errors
      if (error.response?.status === 404) {
        // Return empty data structure when user has no sign history
        return {
          todaySigned: false,
          consecutiveDays: 0,
          totalDays: 0,
          signHistory: [],
        };
      }
      throw error;
    }
  },
};
