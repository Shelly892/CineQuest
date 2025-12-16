import { api } from "./client";
import { API_PATHS } from "../config/constants";

// ==================== Sign API ====================
export const signApi = {
  /**
   * Check in for today
   * Backend: POST /api/sign
   * Returns: { id, userId, signDate, totalSignCount }
   */
  checkIn: async (data) => {
    const response = await api.post(API_PATHS.SIGN.CHECK_IN, data);
    return response.data;
  },
};
