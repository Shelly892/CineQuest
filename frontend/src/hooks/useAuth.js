import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { authApi } from "../api";
import { queryKeys } from "../config/queryClient";

// ==================== Fetch current user ====================
export const useCurrentUser = () => {
  return useQuery({
    queryKey: queryKeys.auth.currentUser,
    queryFn: authApi.getCurrentUser,
    enabled: authApi.isAuthenticated(), // Only run the query when authenticated
    staleTime: Infinity, // Keep user data fresh indefinitely
    retry: false,
  });
};

// ==================== Sign in ====================
export const useLogin = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ username, password }) => authApi.login(username, password),
    onSuccess: (data) => {
      // Seed the React Query cache with the authenticated user
      queryClient.setQueryData(queryKeys.auth.currentUser, data.user);

      console.log("[Login Success]", data.user);

      // Redirect to the home page
      navigate("/");
    },
    onError: (error) => {
      console.error("[Login Failed]", error);
    },
  });
};

// ==================== Sign out ====================
export const useLogout = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: authApi.logout,
    onSuccess: () => {
      // Clear all cached data
      queryClient.clear();

      console.log("[Logout Success]");

      // Redirect to the login screen
      navigate("/login");
    },
  });
};

// ==================== Authentication status ====================
export const useAuth = () => {
  const { data: user, isLoading } = useCurrentUser();
  const isAuthenticated = authApi.isAuthenticated();

  return {
    user,
    isLoading,
    isAuthenticated,
  };
};
