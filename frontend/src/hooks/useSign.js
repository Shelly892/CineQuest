import { useMutation } from "@tanstack/react-query";
import { signApi } from "../api";

// ==================== Check in ====================
export const useCheckIn = () => {
  return useMutation({
    mutationFn: (data) => signApi.checkIn(data),
    onSuccess: (data) => {
      console.log("[Check-in Success]", data);
    },
    onError: (error) => {
      console.error("[Check-in Failed]", error);
    },
  });
};
