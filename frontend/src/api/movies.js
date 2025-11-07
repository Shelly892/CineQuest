import apiClient from "./client";
import { API_PATHS } from "../config/constants";

// ==================== Movie API ====================
export const moviesApi = {
  /**
   * Fetch a paginated list of popular movies
   */
  getPopular: async (page = 1) => {
    const { data } = await apiClient.get(API_PATHS.MOVIES.POPULAR, {
      params: { page },
    });
    return data;
  },

  /**
   * Search for movies by keyword
   */
  search: async (query, page = 1) => {
    const { data } = await apiClient.get(API_PATHS.MOVIES.SEARCH, {
      params: { q: query, page },
    });
    return data;
  },

  /**
   * Retrieve the details for a single movie
   */
  getDetails: async (id) => {
    const { data } = await apiClient.get(API_PATHS.MOVIES.DETAIL(id));
    return data;
  },
};
