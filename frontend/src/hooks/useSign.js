import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { signApi } from "../api";
import { queryKeys } from "../config/queryClient";

// ==================== Get user sign history ====================
export const useSignHistory = (userId) => {
  return useQuery({
    queryKey: queryKeys.sign.userHistory(userId),
    queryFn: () => signApi.getUserHistory(userId),
    enabled: !!userId,
    retry: false, // Don't retry on 404
    refetchOnWindowFocus: false,
  });
};

// ==================== Check in ====================
export const useCheckIn = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data) => signApi.checkIn(data),
    onSuccess: (data, variables) => {
      // Invalidate sign history to refresh
      queryClient.invalidateQueries(
        queryKeys.sign.userHistory(variables.userId)
      );
      console.log("[Check-in Success]", data);
    },
    onError: (error) => {
      console.error("[Check-in Failed]", error);
    },
  });
};
