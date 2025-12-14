import { api } from "./client";
import { API_PATHS } from "../config/constants";

// ==================== Sign API ====================
export const signApi = {
  /**
   * Check in for today
   */
  checkIn: async (data) => {
    const response = await api.post(API_PATHS.SIGN.CHECK_IN, data);
    return response.data;
  },

  /**
   * Get user's sign-in history
   */
  getUserHistory: async (userId) => {
    const { data } = await api.get(API_PATHS.SIGN.USER_HISTORY(userId));
    return data;
  },
};
