import { api } from "./client";
import { API_PATHS } from "../config/constants";

// ==================== Achievements API ====================
export const achievementsApi = {
  /**
   * Get achievements for a specific user
   * Backend: GET /api/achievements/users/{userId}/badges
   */
  getUserAchievements: async (userId) => {
    const { data } = await api.get(API_PATHS.ACHIEVEMENTS.USER(userId));
    return data;
  },
 
};
