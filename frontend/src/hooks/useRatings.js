import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ratingsApi } from "../api";
import { queryKeys } from "../config/queryClient";

// ==================== Get user ratings ====================
export const useUserRatings = (userId, page = 0, size = 100) => {
  return useQuery({
    queryKey: queryKeys.ratings.user(userId, page),
    queryFn: () => ratingsApi.getUserRatings(userId, page, size),
    enabled: !!userId,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

// ==================== Get movie ratings ====================
export const useMovieRatings = (movieId, page = 0, size = 20) => {
  return useQuery({
    queryKey: queryKeys.ratings.movie(movieId, page),
    queryFn: () => ratingsApi.getMovieRatings(movieId, page, size),
    enabled: !!movieId,
  });
};

// ==================== Get movie rating stats ====================
export const useMovieRatingStats = (movieId) => {
  return useQuery({
    queryKey: queryKeys.ratings.movieStats(movieId),
    queryFn: () => ratingsApi.getMovieRatingStats(movieId),
    enabled: !!movieId,
  });
};

// ==================== Get user's rating for a specific movie ====================
export const useUserMovieRating = (userId, movieId) => {
  return useQuery({
    queryKey: queryKeys.ratings.userMovie(userId, movieId),
    queryFn: () => ratingsApi.getUserMovieRating(userId, movieId),
    enabled: !!userId && !!movieId,
    retry: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });
};

// ==================== Submit rating ====================
export const useSubmitRating = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (ratingData) => ratingsApi.submitRating(ratingData),
    onSuccess: (data, variables) => {
      // Invalidate all ratings queries to refresh data
      queryClient.invalidateQueries({ queryKey: ["ratings"] });
      console.log("[Rating Submitted]", data);
    },
    onError: (error) => {
      console.error("[Rating Failed]", error);
    },
  });
};

// ==================== Update rating ====================
export const useUpdateRating = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (ratingData) => ratingsApi.updateRating(ratingData),
    onSuccess: () => {
      // Invalidate all ratings queries
      queryClient.invalidateQueries({ queryKey: ["ratings"] });
      console.log("[Rating Updated]");
    },
    onError: (error) => {
      console.error("[Update Failed]", error);
    },
  });
};

// ==================== Delete rating ====================
export const useDeleteRating = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (movieId) => ratingsApi.deleteRating(movieId),
    onSuccess: () => {
      // Invalidate all ratings queries to refresh data
      queryClient.invalidateQueries({ queryKey: ["ratings"] });
      console.log("[Rating Deleted]");
    },
    onError: (error) => {
      console.error("[Delete Failed]", error);
    },
  });
};
