import { useQuery } from "@tanstack/react-query";
import { moviesApi } from "../api";
import { queryKeys } from "../config/queryClient";

// ==================== Popular movies ====================
export const usePopularMovies = (page = 1) => {
  return useQuery({
    queryKey: queryKeys.movies.popular(page),
    queryFn: () => moviesApi.getPopular(page),
    keepPreviousData: true, // Retain prior page data while fetching
  });
};

// ==================== Search movies ====================
export const useSearchMovies = (query, page = 1) => {
  return useQuery({
    queryKey: queryKeys.movies.search(query, page),
    queryFn: () => moviesApi.search(query, page),
    enabled: query.length > 2, // Require at least 3 characters before searching
    keepPreviousData: true,
  });
};

// ==================== Movie details ====================
export const useMovieDetails = (id) => {
  return useQuery({
    queryKey: queryKeys.movies.detail(id),
    queryFn: () => moviesApi.getDetails(id),
    enabled: !!id, // Only fetch when an ID is provided
  });
};
