import { useEffect, useState, useRef } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "../config/queryClient";
import { useUserAchievements } from "./useAchievements";

const STORAGE_KEY_PREFIX = "cinequest_shown_achievements_";

/**
 * Get the storage key for a user's shown achievements
 */
const getStorageKey = (userId) => `${STORAGE_KEY_PREFIX}${userId}`;

/**
 * Get list of achievement IDs that have been shown to the user
 */
const getShownAchievementIds = (userId) => {
  if (!userId) return [];
  try {
    const stored = localStorage.getItem(getStorageKey(userId));
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error("[Failed to get shown achievements]", error);
    return [];
  }
};

/**
 * Mark an achievement as shown
 */
const markAchievementAsShown = (userId, achievementId) => {
  if (!userId || !achievementId) return;
  try {
    const shownIds = getShownAchievementIds(userId);
    if (!shownIds.includes(achievementId)) {
      const updated = [...shownIds, achievementId];
      localStorage.setItem(getStorageKey(userId), JSON.stringify(updated));
    }
  } catch (error) {
    console.error("[Failed to mark achievement as shown]", error);
  }
};

/**
 * Hook to detect newly unlocked achievements
 * @param {string} userId - User ID
 * @param {boolean} enabled - Whether to enable achievement checking
 * @returns {Object} { newAchievements, clearNewAchievements, markAsShown }
 */
export function useAchievementUnlock(userId, enabled = true) {
  const queryClient = useQueryClient();
  const [newAchievements, setNewAchievements] = useState([]);
  const previousAchievementsRef = useRef([]);
  const hasInitializedRef = useRef(false);

  const { data: achievements = [] } = useUserAchievements(userId);

  useEffect(() => {
    if (!enabled || !userId || !achievements) return;

    // On first load, initialize with current achievements to avoid showing old ones
    if (!hasInitializedRef.current) {
      previousAchievementsRef.current = achievements;
      hasInitializedRef.current = true;
      return;
    }

    const currentAchievementIds = achievements.map(
      (a) => a.badgeName || a.name
    );
    const previousAchievementIds = previousAchievementsRef.current.map(
      (a) => a.badgeName || a.name
    );
    const shownAchievementIds = getShownAchievementIds(userId);

    // Find newly unlocked achievements that haven't been shown yet
    const newlyUnlocked = achievements.filter((achievement) => {
      const achievementId = achievement.badgeName || achievement.name;
      const wasUnlockedBefore = previousAchievementIds.includes(achievementId);
      const isUnlockedNow = currentAchievementIds.includes(achievementId);
      const hasBeenShown = shownAchievementIds.includes(achievementId);

      // Only show if:
      // 1. It's newly unlocked (wasn't unlocked before)
      // 2. It hasn't been shown to the user yet
      return isUnlockedNow && !wasUnlockedBefore && !hasBeenShown;
    });

    if (newlyUnlocked.length > 0) {
      setNewAchievements((prev) => [...prev, ...newlyUnlocked]);
    }

    // Update ref with current achievements
    previousAchievementsRef.current = achievements;
  }, [achievements, userId, enabled]);

  const clearNewAchievements = () => {
    setNewAchievements([]);
  };

  const markAsShown = (achievementId) => {
    markAchievementAsShown(userId, achievementId);
    // Remove from new achievements queue
    setNewAchievements((prev) =>
      prev.filter((a) => (a.badgeName || a.name) !== achievementId)
    );
  };

  // Refetch achievements to get latest data
  const refetchAchievements = () => {
    queryClient.invalidateQueries({
      queryKey: queryKeys.achievements.user(userId),
    });
  };

  return {
    newAchievements,
    clearNewAchievements,
    markAsShown,
    refetchAchievements,
  };
}

