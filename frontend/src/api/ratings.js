import { api } from "./client";
import { API_PATHS } from "../config/constants";

// ==================== Ratings API ====================
export const ratingsApi = {
  /**
   * Get ratings for a specific user
   */
  getUserRatings: async (userId) => {
    const { data } = await api.get(API_PATHS.RATINGS.USER(userId));
    return data;
  },

  /**
   * Get ratings for a specific movie
   */
  getMovieRatings: async (movieId) => {
    const { data } = await api.get(API_PATHS.RATINGS.MOVIE(movieId));
    return data;
  },

  /**
   * Submit a new rating
   */
  submitRating: async (ratingData) => {
    const { data } = await api.post(API_PATHS.RATINGS.CREATE, ratingData);
    return data;
  },

  /**
   * Update an existing rating
   */
  updateRating: async (id, rating) => {
    const { data } = await api.put(API_PATHS.RATINGS.UPDATE(id), { rating });
    return data;
  },

  /**
   * Delete a rating
   */
  deleteRating: async (id) => {
    const { data } = await api.delete(API_PATHS.RATINGS.DELETE(id));
    return data;
  },
};
