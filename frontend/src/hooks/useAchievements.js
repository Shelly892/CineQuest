import { useQuery } from "@tanstack/react-query";
import { achievementsApi } from "../api";
import { queryKeys } from "../config/queryClient";

// ==================== Get user achievements ====================
export const useUserAchievements = (userId) => {
  return useQuery({
    queryKey: queryKeys.achievements.user(userId),
    queryFn: () => achievementsApi.getUserAchievements(userId),
    enabled: !!userId,
  });
};

// ==================== Get all achievements ====================
export const useAllAchievements = () => {
  return useQuery({
    queryKey: queryKeys.achievements.all,
    queryFn: () => achievementsApi.getAllAchievements(),
  });
};
