import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ratingsApi } from "../api";
import { queryKeys } from "../config/queryClient";

// ==================== Get user ratings ====================
export const useUserRatings = (userId) => {
  return useQuery({
    queryKey: queryKeys.ratings.user(userId),
    queryFn: () => ratingsApi.getUserRatings(userId),
    enabled: !!userId,
  });
};

// ==================== Get movie ratings ====================
export const useMovieRatings = (movieId) => {
  return useQuery({
    queryKey: queryKeys.ratings.movie(movieId),
    queryFn: () => ratingsApi.getMovieRatings(movieId),
    enabled: !!movieId,
  });
};

// ==================== Submit rating ====================
export const useSubmitRating = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (ratingData) => ratingsApi.submitRating(ratingData),
    onSuccess: (data, variables) => {
      // Invalidate user ratings to refresh the list
      queryClient.invalidateQueries(queryKeys.ratings.user(variables.userId));
      queryClient.invalidateQueries(queryKeys.ratings.movie(variables.movieId));
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
    mutationFn: ({ id, rating }) => ratingsApi.updateRating(id, rating),
    onSuccess: () => {
      queryClient.invalidateQueries(queryKeys.ratings.all);
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
    mutationFn: (id) => ratingsApi.deleteRating(id),
    onSuccess: () => {
      queryClient.invalidateQueries(queryKeys.ratings.all);
      console.log("[Rating Deleted]");
    },
    onError: (error) => {
      console.error("[Delete Failed]", error);
    },
  });
};
