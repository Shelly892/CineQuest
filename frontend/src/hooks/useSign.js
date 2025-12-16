import { useMutation, useQueryClient } from "@tanstack/react-query";
import { signApi } from "../api";

// ==================== Check in ====================
export const useCheckIn = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data) => signApi.checkIn(data),
    onSuccess: (data) => {
      // Invalidate achievements to refresh badges after sign-in
      queryClient.invalidateQueries({ queryKey: ["achievements"] });
      console.log("[Check-in Success]", data);
    },
    onError: (error) => {
      console.error("[Check-in Failed]", error);
    },
  });
};
