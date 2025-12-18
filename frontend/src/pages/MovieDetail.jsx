import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useKeycloak } from "@react-keycloak/web";
import { motion } from "framer-motion";
import { createPortal } from "react-dom";
import toast from "react-hot-toast";
import { useMovieDetails } from "../hooks/useMovies";
import {
  useSubmitRating,
  useUpdateRating,
  useUserMovieRating,
  useDeleteRating,
  useMovieRatings,
  useMovieRatingStats,
} from "../hooks/useRatings";
import { useAchievementUnlock } from "../hooks/useAchievementUnlock";
import FadeIn from "../components/common/FadeIn";
import ToastProvider from "../components/common/ToastProvider";
import AchievementUnlockModal from "../components/common/AchievementUnlockModal";
import { useState, useEffect } from "react";
import { getImageUrl } from "../utils/imageUtils";

export default function MovieDetail() {
  const { id } = useParams();
  const { keycloak } = useKeycloak();
  const navigate = useNavigate();
  const location = useLocation();
  const userId = keycloak.authenticated ? keycloak.tokenParsed?.sub : null;

  const [selectedRating, setSelectedRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const { data: movie, isLoading } = useMovieDetails(id);
  const { data: existingRating } = useUserMovieRating(userId, id);
  const { data: movieRatingsResponse, isLoading: isLoadingRatings } =
    useMovieRatings(id, 0, 10);
  const { data: movieStats, isLoading: isLoadingStats } =
    useMovieRatingStats(id);

  const { mutate: submitRating, isLoading: submitting } = useSubmitRating();
  const { mutate: updateRating, isLoading: updating } = useUpdateRating();
  const { mutate: deleteRating, isLoading: deleting } = useDeleteRating();
  const { newAchievements, markAsShown, refetchAchievements } =
    useAchievementUnlock(userId, !!userId);

  const [currentAchievement, setCurrentAchievement] = useState(null);

  const movieRatings =
    movieRatingsResponse?.content || movieRatingsResponse || [];

  useEffect(() => {
    if (existingRating) {
      setSelectedRating(existingRating.rating || existingRating.score || 0);
      setComment(existingRating.comment || "");
      setIsEditing(false);
    } else {
      // Clear form state when rating is deleted or doesn't exist
      setSelectedRating(0);
      setComment("");
      setIsEditing(true);
    }
  }, [existingRating, id]);

  // Handle new achievement unlocks
  useEffect(() => {
    if (newAchievements.length > 0 && !currentAchievement) {
      // Show the first new achievement
      setCurrentAchievement(newAchievements[0]);
    }
  }, [newAchievements, currentAchievement]);

  const handleAchievementClose = () => {
    if (currentAchievement) {
      // Mark this achievement as shown so it won't appear again
      const achievementId = currentAchievement.badgeName || currentAchievement.name;
      markAsShown(achievementId);
      setCurrentAchievement(null);
      
      // If there are more achievements, show the next one after a short delay
      if (newAchievements.length > 1) {
        setTimeout(() => {
          setCurrentAchievement(newAchievements[1]);
        }, 500);
      }
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    if (existingRating) {
      setSelectedRating(existingRating.rating || existingRating.score || 0);
      setComment(existingRating.comment || "");
      setIsEditing(false);
    }
  };

  const handleDelete = () => {
    setShowDeleteConfirm(true);
  };

  const confirmDelete = () => {
    deleteRating(parseInt(id), {
      onSuccess: () => {
        toast.success("Rating deleted successfully!");
        setSelectedRating(0);
        setComment("");
        setIsEditing(true);
        setShowDeleteConfirm(false);
      },
      onError: (error) => {
        console.error("[Delete Error]", error);
        toast.error("Failed to delete rating. Please try again.");
        setShowDeleteConfirm(false);
      },
    });
  };

  const handleRatingSubmit = () => {
    if (!keycloak.authenticated) {
      // Save current path and redirect to login
      navigate(`/login?from=${encodeURIComponent(location.pathname)}`);
      return;
    }

    if (selectedRating === 0) {
      toast.error("Please select a rating");
      return;
    }

    const ratingData = {
      movieId: parseInt(id),
      rating: selectedRating,
      comment: comment.trim(),
    };

    if (existingRating) {
      updateRating(ratingData, {
        onSuccess: () => {
          toast.success("Rating updated successfully!");
          setIsEditing(false);
          // Refetch achievements to check for new unlocks
          refetchAchievements();
        },
        onError: (error) => {
          console.error("[Update Error]", error);
          toast.error("Failed to update rating. Please try again.");
        },
      });
    } else {
      submitRating(ratingData, {
        onSuccess: () => {
          toast.success("Rating submitted successfully!");
          setIsEditing(false);
          // Refetch achievements to check for new unlocks
          refetchAchievements();
        },
        onError: (error) => {
          console.error("[Submit Error]", error);
          toast.error("Failed to submit rating. Please try again.");
        },
      });
    }
  };

  const formatNumber = (num) => {
    if (!num) return "N/A";
    return new Intl.NumberFormat("en-US").format(num);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-[#141118]">
        <div className="w-16 h-16 border-4 border-[#8d25f4] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!movie) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-[#141118]">
        <p className="text-white text-xl">Movie not found</p>
      </div>
    );
  }

  const isSubmittingOrUpdating = submitting || updating || deleting;

  return (
    <div className="min-h-screen bg-[#141118]">
      {/* Backdrop */}
      <div
        className="relative h-[500px] bg-cover bg-center"
        style={{
          backgroundImage: `linear-gradient(to bottom, rgba(20, 17, 24, 0.3), rgba(20, 17, 24, 1)), url(${getImageUrl(
            movie.backdrop_path || movie.poster_path,
            "https://via.placeholder.com/1200x500/473b54/ab9cba?text=No+Backdrop"
          )})`,
        }}
      >
        <div className="absolute inset-0 flex items-end">
          <div className="container mx-auto px-4 md:px-40 pb-10">
            <FadeIn>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate(-1)}
                className="mb-4 px-4 py-2 bg-[#211b27] text-white rounded-lg hover:bg-[#302839] transition-colors flex items-center gap-2"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  fill="currentColor"
                  viewBox="0 0 256 256"
                >
                  <path d="M224,128a8,8,0,0,1-8,8H59.31l58.35,58.34a8,8,0,0,1-11.32,11.32l-72-72a8,8,0,0,1,0-11.32l72-72a8,8,0,0,1,11.32,11.32L59.31,120H216A8,8,0,0,1,224,128Z" />
                </svg>
                Back
              </motion.button>
            </FadeIn>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 md:px-40 pt-10 pb-20">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Poster */}
          <FadeIn delay={0.2}>
            <div className="flex-shrink-0">
              <img
                src={getImageUrl(
                  movie.poster_path,
                  "https://via.placeholder.com/300x450/473b54/ab9cba?text=No+Poster"
                )}
                alt={movie.title}
                className="w-full md:w-[300px] rounded-lg shadow-2xl"
                onError={(e) => {
                  e.target.src =
                    "https://via.placeholder.com/300x450/473b54/ab9cba?text=No+Poster";
                }}
              />
            </div>
          </FadeIn>

          {/* Details */}
          <div className="flex-1">
            <FadeIn delay={0.3}>
              <h1 className="text-white text-4xl font-bold mb-2">
                {movie.title}
              </h1>
              {movie.tagline && (
                <p className="text-[#ab9cba] italic text-lg mb-4">
                  "{movie.tagline}"
                </p>
              )}
            </FadeIn>

            <FadeIn delay={0.4}>
              <div className="flex items-center gap-4 mb-6 flex-wrap">
                <div className="flex items-center gap-2">
                  <span className="text-yellow-400 text-2xl">★</span>
                  <span className="text-white text-xl font-bold">
                    {movie.vote_average?.toFixed(1)}
                  </span>
                  <span className="text-[#ab9cba] text-sm">
                    ({formatNumber(movie.vote_count)} votes)
                  </span>
                </div>
                {movie.release_date && (
                  <span className="text-[#ab9cba]">
                    {new Date(movie.release_date).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </span>
                )}
                {movie.runtime && (
                  <span className="text-[#ab9cba]">{movie.runtime} min</span>
                )}
                {movie.adult && (
                  <span className="px-2 py-1 bg-red-500/20 border border-red-500 text-red-400 rounded text-sm font-bold">
                    18+
                  </span>
                )}
              </div>
            </FadeIn>

            {/* Overview */}
            <FadeIn delay={0.5}>
              <div className="mb-6">
                <h2 className="text-white text-2xl font-bold mb-3">Overview</h2>
                <p className="text-[#ab9cba] leading-relaxed">
                  {movie.overview || "No overview available."}
                </p>
              </div>
            </FadeIn>

            {/*  Community Rating Statistics */}
            {movieStats && (
              <FadeIn delay={0.6}>
                <div className="mb-6">
                  <h2 className="text-white text-2xl font-bold mb-3">
                    Community Ratings
                  </h2>
                  {isLoadingStats ? (
                    <div className="flex justify-center py-4">
                      <div className="w-8 h-8 border-2 border-[#8d25f4] border-t-transparent rounded-full animate-spin"></div>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="text-center p-4">
                        <p className="text-[#ab9cba] text-sm mb-2">
                          Total Ratings
                        </p>
                        <p className="text-white text-3xl font-bold">
                          {movieStats.totalRatings || 0}
                        </p>
                      </div>
                      <div className="text-center p-4">
                        <p className="text-[#ab9cba] text-sm mb-2">
                          Average Rating
                        </p>
                        <div className="flex items-center justify-center gap-2">
                          <span className="text-yellow-400 text-2xl">★</span>
                          <p className="text-white text-3xl font-bold">
                            {movieStats.averageScore
                              ? movieStats.averageScore.toFixed(1)
                              : "0.0"}
                          </p>
                          <span className="text-[#ab9cba]">/10.0</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </FadeIn>
            )}
          </div>
        </div>

        {/* Rating Section */}
        <div className="mt-12 space-y-6">
          {/* Your Rating */}
          <FadeIn delay={0.8}>
            <div className="bg-[#211b27] border border-[#473b54] rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-white text-2xl font-bold">
                  {existingRating ? "Your Rating" : "Rate this Movie"}
                </h2>

                {/* Edit & Delete Buttons */}
                {existingRating && !isEditing && keycloak.authenticated && (
                  <div className="flex gap-2">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={handleEdit}
                      className="px-4 py-2 bg-[#8d25f4] text-white font-medium rounded-lg hover:bg-[#7a1fd4] transition-colors flex items-center gap-2"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        fill="currentColor"
                        viewBox="0 0 256 256"
                      >
                        <path d="M227.31,73.37,182.63,28.68a16,16,0,0,0-22.63,0L36.69,152A15.86,15.86,0,0,0,32,163.31V208a16,16,0,0,0,16,16H92.69A15.86,15.86,0,0,0,104,219.31L227.31,96a16,16,0,0,0,0-22.63ZM92.69,208H48V163.31l88-88L180.69,120ZM192,108.68,147.31,64l24-24L216,84.68Z" />
                      </svg>
                      Edit
                    </motion.button>

                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={handleDelete}
                      disabled={deleting}
                      className="px-4 py-2 bg-red-500/20 border border-red-500 text-red-400 font-medium rounded-lg hover:bg-red-500/30 transition-colors flex items-center gap-2 disabled:opacity-50"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        fill="currentColor"
                        viewBox="0 0 256 256"
                      >
                        <path d="M216,48H176V40a24,24,0,0,0-24-24H104A24,24,0,0,0,80,40v8H40a8,8,0,0,0,0,16h8V208a16,16,0,0,0,16,16H192a16,16,0,0,0,16-16V64h8a8,8,0,0,0,0-16ZM96,40a8,8,0,0,1,8-8h48a8,8,0,0,1,8,8v8H96Zm96,168H64V64H192ZM112,104v64a8,8,0,0,1-16,0V104a8,8,0,0,1,16,0Zm48,0v64a8,8,0,0,1-16,0V104a8,8,0,0,1,16,0Z" />
                      </svg>
                      Delete
                    </motion.button>
                  </div>
                )}
              </div>

              {/* Login prompt */}
              {!keycloak.authenticated && (
                <div className="mb-4 p-3 bg-[#473b54] border border-[#8d25f4] rounded-lg">
                  <p className="text-[#ab9cba] text-sm">
                    Please{" "}
                    <button
                      onClick={() =>
                        navigate(
                          `/login?from=${encodeURIComponent(location.pathname)}`
                        )
                      }
                      className="text-[#8d25f4] hover:text-[#7a1fd4] underline font-medium"
                    >
                      login
                    </button>{" "}
                    to submit a rating
                  </p>
                </div>
              )}

              {/* Read-only view */}
              {existingRating && !isEditing && keycloak.authenticated && (
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <span className="text-yellow-400 text-4xl">★</span>
                    <span className="text-white text-4xl font-bold">
                      {(
                        existingRating.rating ||
                        existingRating.score ||
                        0
                      ).toFixed(1)}
                    </span>
                    <span className="text-[#ab9cba] text-2xl">/10.0</span>
                  </div>

                  {existingRating.comment && (
                    <div className="p-4 bg-[#141118] rounded-lg border border-[#473b54]">
                      <p className="text-[#ab9cba] italic">
                        "{existingRating.comment}"
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* Edit mode */}
              {isEditing && keycloak.authenticated && (
                <div className="space-y-4">
                  {/* Rating stars */}
                  <div>
                    <div className="flex items-center gap-2 mb-2 flex-wrap">
                      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((rating) => (
                        <motion.button
                          key={rating}
                          whileHover={{ scale: 1.2 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => setSelectedRating(rating)}
                          onMouseEnter={() => setHoverRating(rating)}
                          onMouseLeave={() => setHoverRating(0)}
                          className="text-3xl transition-colors"
                        >
                          <span
                            className={
                              rating <= (hoverRating || selectedRating)
                                ? "text-yellow-400"
                                : "text-[#473b54]"
                            }
                          >
                            ★
                          </span>
                        </motion.button>
                      ))}
                    </div>
                    {selectedRating > 0 && (
                      <p className="text-white text-xl">
                        {selectedRating.toFixed(1)}/10.0
                      </p>
                    )}
                  </div>

                  {/* Comment textarea */}
                  <div>
                    <label className="block text-white text-sm font-medium mb-2">
                      Comment (optional)
                    </label>
                    <textarea
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      placeholder="Share your thoughts about this movie..."
                      className="w-full px-4 py-3 bg-[#141118] border border-[#473b54] rounded-lg text-white placeholder-[#ab9cba] focus:border-[#8d25f4] focus:outline-none resize-none"
                      rows="4"
                      maxLength="500"
                    />
                    <div className="flex justify-between mt-1">
                      <p className="text-[#ab9cba] text-xs">
                        Max 500 characters
                      </p>
                      <p className="text-[#ab9cba] text-xs">
                        {comment.length}/500
                      </p>
                    </div>
                  </div>

                  {/* Action buttons */}
                  <div className="flex gap-3">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={handleRatingSubmit}
                      disabled={selectedRating === 0 || isSubmittingOrUpdating}
                      className="flex-1 px-6 py-3 bg-[#8d25f4] text-white font-bold rounded-lg hover:bg-[#7a1fd4] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isSubmittingOrUpdating
                        ? "Saving..."
                        : existingRating
                        ? "Update Rating"
                        : "Submit Rating"}
                    </motion.button>

                    {existingRating && (
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={handleCancel}
                        disabled={isSubmittingOrUpdating}
                        className="px-6 py-3 bg-[#473b54] text-white font-bold rounded-lg hover:bg-[#5a4764] transition-colors disabled:opacity-50"
                      >
                        Cancel
                      </motion.button>
                    )}
                  </div>
                </div>
              )}
            </div>
          </FadeIn>

          {/* All User Ratings List */}
          <FadeIn delay={0.9}>
            <div className="bg-[#211b27] border border-[#473b54] rounded-lg p-6">
              <h2 className="text-white text-2xl font-bold mb-4">
                Recent Ratings
              </h2>
              {isLoadingRatings ? (
                <div className="flex justify-center py-8">
                  <div className="w-8 h-8 border-2 border-[#8d25f4] border-t-transparent rounded-full animate-spin"></div>
                </div>
              ) : movieRatings.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-[#ab9cba]">
                    No ratings yet. Be the first to rate!
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {movieRatings.map((rating) => (
                    <motion.div
                      key={`${rating.userId}-${rating.movieId}`}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-[#141118] border border-[#473b54] rounded-lg p-4 hover:border-[#8d25f4] transition-colors"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <div className="flex items-center gap-2 bg-[#211b27] px-3 py-1 rounded-lg">
                              <span className="text-yellow-400 text-lg">★</span>
                              <span className="text-white text-xl font-bold">
                                {(rating.rating || rating.score || 0).toFixed(
                                  1
                                )}
                              </span>
                              <span className="text-[#ab9cba]">/10.0</span>
                            </div>
                            {rating.userId && (
                              <span className="text-[#ab9cba] text-sm">
                                by{" "}
                                {rating.userId === userId
                                  ? "YOU"
                                  : rating.userId.substring(0, 8)}
                              </span>
                            )}
                          </div>
                          {rating.comment && (
                            <p className="text-[#ab9cba] text-sm italic mt-2">
                              "{rating.comment}"
                            </p>
                          )}
                        </div>
                        {rating.createdAt && (
                          <div className="flex-shrink-0">
                            <span className="text-[#ab9cba] text-xs">
                              {new Date(rating.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </FadeIn>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm &&
        typeof document !== "undefined" &&
        document.body &&
        createPortal(
          <div
            className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
            style={{ zIndex: 9999 }}
            onClick={() => setShowDeleteConfirm(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-[#211b27] border border-[#473b54] rounded-lg p-6 max-w-md w-full"
            >
              <h2 className="text-white text-2xl font-bold mb-4">
                Confirm Delete
              </h2>
              <p className="text-[#ab9cba] mb-6">
                Are you sure you want to delete your rating? This action cannot
                be undone.
              </p>
              <div className="flex gap-3">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={confirmDelete}
                  disabled={deleting}
                  className="flex-1 px-6 py-3 bg-red-600 text-white font-bold rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {deleting ? "Deleting..." : "Delete"}
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowDeleteConfirm(false)}
                  disabled={deleting}
                  className="flex-1 px-6 py-3 bg-[#473b54] text-white font-bold rounded-lg hover:bg-[#5a4764] transition-colors disabled:opacity-50"
                >
                  Cancel
                </motion.button>
              </div>
            </motion.div>
          </div>,
          document.body
        )}

      {/* Toast Provider */}
      <ToastProvider />

      {/* Achievement Unlock Modal */}
      <AchievementUnlockModal
        achievement={currentAchievement}
        isOpen={!!currentAchievement}
        onClose={handleAchievementClose}
      />
    </div>
  );
}
