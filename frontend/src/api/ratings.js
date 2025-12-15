import { api } from "./client";
import { API_PATHS } from "../config/constants";

// ==================== Ratings API ====================
export const ratingsApi = {
  /**
   * Get all ratings for a specific user
   * Backend: GET /api/ratings/all?userId={userId}&page={page}&size={size}
   */
  getUserRatings: async (userId, page = 0, size = 20) => {
    const { data } = await api.get(API_PATHS.RATINGS.ALL, {
      params: { userId, page, size },
    });
    // Return the content array from paginated response
    return data.content || data;
  },

  /**
   * Get ratings for a specific movie with pagination
   * Backend: GET /api/ratings/movie/{movieId}?page={page}&size={size}
   */
  getMovieRatings: async (movieId, page = 0, size = 20) => {
    const { data } = await api.get(API_PATHS.RATINGS.MOVIE(movieId), {
      params: { page, size },
    });
    return data.content || data;
  },

  /**
   * Get rating statistics for a specific movie
   * Backend: GET /api/ratings/movie/{movieId}/stats
   */
  getMovieRatingStats: async (movieId) => {
    const { data } = await api.get(API_PATHS.RATINGS.MOVIE_STATS(movieId));
    return data;
  },

  /**
   * Get a specific user's rating for a specific movie
   * Backend: GET /api/ratings?userId={userId}&movieId={movieId}
   */
  getUserMovieRating: async (userId, movieId) => {
    try {
      const { data } = await api.get(API_PATHS.RATINGS.BASE, {
        params: { userId, movieId },
        validateStatus: (status) => status === 200 || status === 404,
      });
      return data;
    } catch (error) {
      if (error.response?.status === 404) {
        return null;
      }
      throw error;
    }
  },

  /**
   * Submit a new rating
   * Backend: POST /api/ratings
   * Headers: X-User-Id, X-User-Email, X-User-Name (added by gateway)
   * Body: { movieId, score, comment }
   */
  submitRating: async (ratingData) => {
    const { data } = await api.post(API_PATHS.RATINGS.CREATE, {
      movieId: ratingData.movieId,
      score: ratingData.rating, // Backend expects 'score', not 'rating'
      comment: ratingData.comment || "",
    });
    return data;
  },

  /**
   * Update an existing rating
   * Backend: PUT /api/ratings
   * Headers: X-User-Id (added by gateway)
   * Body: { movieId, score, comment }
   */
  updateRating: async (ratingData) => {
    const { data } = await api.put(API_PATHS.RATINGS.UPDATE, {
      movieId: ratingData.movieId,
      score: ratingData.rating, // Backend expects 'score', not 'rating'
      comment: ratingData.comment || "",
    });
    return data;
  },

  /**
   * Delete a rating
   * Backend: DELETE /api/ratings?movieId={movieId}
   * Headers: X-User-Id
   */
  deleteRating: async (movieId) => {
    const { data } = await api.delete(API_PATHS.RATINGS.DELETE, {
      params: { movieId },
    });
    return data;
  },
};
