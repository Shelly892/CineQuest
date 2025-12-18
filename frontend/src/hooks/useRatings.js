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
      // Invalidate achievements to refresh badges
      queryClient.invalidateQueries({ queryKey: ["achievements"] });
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
      // Invalidate achievements to refresh badges
      queryClient.invalidateQueries({ queryKey: ["achievements"] });
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
    onSuccess: (data, movieId) => {
      // Invalidate all ratings queries to refresh data
      queryClient.invalidateQueries({ queryKey: ["ratings"] });
      // Specifically remove user-movie rating queries for this movie
      // This ensures MovieDetail page will refetch and get null/undefined
      // Query key structure: ["ratings", "user", userId, "movie", movieId]
      queryClient.removeQueries({
        predicate: (query) => {
          const key = query.queryKey;
          return (
            Array.isArray(key) &&
            key[0] === "ratings" &&
            key[1] === "user" &&
            key[3] === "movie" &&
            key[4] === movieId
          );
        },
      });
      // Invalidate achievements to refresh badges
      queryClient.invalidateQueries({ queryKey: ["achievements"] });
      console.log("[Rating Deleted]");
    },
    onError: (error) => {
      console.error("[Delete Failed]", error);
    },
  });
};
