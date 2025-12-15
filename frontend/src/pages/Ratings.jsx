import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { useKeycloak } from "@react-keycloak/web";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  useUserRatings,
  useDeleteRating,
  useUpdateRating,
} from "../hooks/useRatings";
import { useMovieDetails } from "../hooks/useMovies";
import FadeIn from "../components/common/FadeIn";
import StaggerContainer, {
  StaggerItem,
} from "../components/common/StaggerContainer";
import { getImageUrl } from "../utils/imageUtils";

// ✅ Mini movie card component with caching
function MovieCard({ movieId, rating }) {
  const { data: movie, isLoading } = useMovieDetails(movieId);

  if (isLoading) {
    return (
      <div className="flex items-center gap-4">
        <div className="w-16 h-24 bg-[#473b54] animate-pulse rounded"></div>
        <div className="flex-1">
          <div className="h-4 bg-[#473b54] animate-pulse rounded w-32 mb-2"></div>
          <div className="h-3 bg-[#473b54] animate-pulse rounded w-24"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-4">
      {/*  Movie Thumbnail */}
      <img
        src={getImageUrl(
          movie?.poster_path,
          "https://via.placeholder.com/64x96/473b54/ab9cba?text=No+Poster"
        )}
        alt={movie?.title || "Movie"}
        className="w-16 h-24 rounded object-cover"
        onError={(e) => {
          e.target.src =
            "https://via.placeholder.com/64x96/473b54/ab9cba?text=No+Poster";
        }}
      />

      <div className="flex-1">
        {/*  Movie Title */}
        <h3 className="text-white text-xl font-bold mb-1">
          {movie?.title || `Movie ID: ${movieId}`}
        </h3>
        <p className="text-[#ab9cba] text-sm">
          Rated on{" "}
          {rating.createdAt
            ? new Date(rating.createdAt).toLocaleDateString()
            : "Unknown date"}
        </p>
      </div>
    </div>
  );
}

// Edit Modal Component
function EditRatingModal({ rating, onClose, onSave }) {
  const [score, setScore] = useState(rating.rating || rating.score || 0);
  const [comment, setComment] = useState(rating.comment || "");
  const [hoverRating, setHoverRating] = useState(0);

  const handleSave = () => {
    onSave({ movieId: rating.movieId, rating: score, comment: comment.trim() });
  };

  return createPortal(
    <div
      className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
      style={{ zIndex: 9999 }}
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-[#211b27] border border-[#473b54] rounded-lg p-6 max-w-md w-full"
      >
        <h2 className="text-white text-2xl font-bold mb-4">Edit Rating</h2>

        {/* Rating Stars */}
        <div className="mb-4">
          <label className="block text-white text-sm font-medium mb-2">
            Rating
          </label>
          <div className="flex items-center gap-2 mb-2">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((r) => (
              <button
                key={r}
                onClick={() => setScore(r)}
                onMouseEnter={() => setHoverRating(r)}
                onMouseLeave={() => setHoverRating(0)}
                className="text-3xl transition-colors"
              >
                <span
                  className={
                    r <= (hoverRating || score)
                      ? "text-yellow-400"
                      : "text-[#473b54]"
                  }
                >
                  ★
                </span>
              </button>
            ))}
          </div>
          <p className="text-white text-xl">{score.toFixed(1)}/10.0</p>
        </div>

        {/* Comment */}
        <div className="mb-4">
          <label className="block text-white text-sm font-medium mb-2">
            Comment
          </label>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Share your thoughts..."
            className="w-full px-4 py-3 bg-[#141118] border border-[#473b54] rounded-lg text-white placeholder-[#ab9cba] focus:border-[#8d25f4] focus:outline-none resize-none"
            rows="4"
            maxLength="500"
          />
          <p className="text-[#ab9cba] text-xs mt-1">{comment.length}/500</p>
        </div>

        {/* Buttons */}
        <div className="flex gap-3">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleSave}
            className="flex-1 px-6 py-3 bg-[#8d25f4] text-white font-bold rounded-lg hover:bg-[#7a1fd4] transition-colors"
          >
            Save
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onClose}
            className="flex-1 px-6 py-3 bg-[#473b54] text-white font-bold rounded-lg hover:bg-[#5a4764] transition-colors"
          >
            Cancel
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
}

export default function Ratings() {
  const { keycloak } = useKeycloak();
  const navigate = useNavigate();
  const userId = keycloak.tokenParsed?.sub;

  const [editingRating, setEditingRating] = useState(null);

  const {
    data: ratingsResponse,
    isLoading,
    isFetching,
    error,
  } = useUserRatings(userId, 0, 100);
  const { mutate: deleteRating, isLoading: isDeleting } = useDeleteRating();
  const { mutate: updateRating, isLoading: isUpdating } = useUpdateRating();

  const ratings = ratingsResponse?.content || ratingsResponse || [];

  // Generate a key based on ratings data to force re-render when data changes
  // This ensures StaggerContainer animation resets when data updates
  const ratingsKey =
    ratings.length > 0
      ? ratings
          .map(
            (r) => `${r.movieId}-${r.rating || r.score || 0}-${r.comment || ""}`
          )
          .join("|")
      : "empty";

  useEffect(() => {
    if (!keycloak.authenticated) {
      navigate("/login");
    }
  }, [keycloak.authenticated, navigate]);

  if (!keycloak.authenticated) {
    return null;
  }

  // ✅ Handle edit
  const handleEdit = (rating) => {
    setEditingRating(rating);
  };

  // ✅ Handle save edit
  const handleSaveEdit = (ratingData) => {
    updateRating(ratingData, {
      onSuccess: () => {
        console.log("[Rating Updated Successfully]");
        setEditingRating(null);
      },
      onError: (error) => {
        console.error("[Update Error]", error);
        alert("Failed to update rating. Please try again.");
      },
    });
  };

  const handleDelete = (rating) => {
    if (window.confirm("Are you sure you want to delete this rating?")) {
      deleteRating(rating.movieId, {
        onSuccess: () => {
          console.log("[Rating Deleted Successfully]");
        },
        onError: (error) => {
          console.error("[Delete Error]", error);
          alert("Failed to delete rating. Please try again.");
        },
      });
    }
  };

  const handleMovieClick = (movieId) => {
    navigate(`/movies/${movieId}`);
  };

  const calculateStats = () => {
    if (!ratings || ratings.length === 0) {
      return { total: 0, average: 0, highest: 0 };
    }

    const total = ratings.length;
    const sum = ratings.reduce((acc, r) => acc + (r.rating || r.score || 0), 0);
    const average = sum / total;
    const highest = Math.max(...ratings.map((r) => r.rating || r.score || 0));

    return {
      total,
      average: isNaN(average) ? 0 : average,
      highest: isNaN(highest) ? 0 : highest,
    };
  };

  const stats = calculateStats();

  return (
    <div className="min-h-screen bg-[#141118] py-10 px-4 md:px-40">
      <div className="max-w-[1200px] mx-auto">
        <FadeIn>
          <h1 className="text-white text-4xl font-bold mb-2">My Ratings</h1>
          <p className="text-[#ab9cba] mb-8">
            You have rated {stats.total}{" "}
            {stats.total === 1 ? "movie" : "movies"}
          </p>
        </FadeIn>

        {(isLoading || isFetching) && (
          <div className="flex justify-center items-center py-20">
            <div className="w-16 h-16 border-4 border-[#8d25f4] border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}

        {error && (
          <FadeIn delay={0.2}>
            <div className="text-center py-20">
              <div className="text-6xl mb-4">❌</div>
              <p className="text-red-400 text-lg mb-6">
                Failed to load your ratings
              </p>
              <p className="text-[#ab9cba] text-sm mb-6">
                {error.message || "Please try again later"}
              </p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => window.location.reload()}
                className="px-6 py-3 bg-[#8d25f4] text-white font-bold rounded-lg hover:bg-[#7a1fd4] transition-colors"
              >
                Retry
              </motion.button>
            </div>
          </FadeIn>
        )}

        {!isLoading && !isFetching && !error && stats.total === 0 && (
          <FadeIn delay={0.2}>
            <div className="text-center py-20">
              <div className="text-6xl mb-4">🎬</div>
              <p className="text-[#ab9cba] text-lg mb-6">
                You haven't rated any movies yet
              </p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate("/movies")}
                className="px-6 py-3 bg-[#8d25f4] text-white font-bold rounded-lg hover:bg-[#7a1fd4] transition-colors"
              >
                Browse Movies
              </motion.button>
            </div>
          </FadeIn>
        )}

        {!isLoading && !isFetching && !error && stats.total > 0 && (
          <StaggerContainer key={ratingsKey} className="space-y-4">
            {ratings.map((rating) => (
              <StaggerItem key={`${rating.movieId}-${rating.userId}`}>
                <motion.div
                  whileHover={{ scale: 1.01 }}
                  className="bg-[#211b27] border border-[#473b54] rounded-lg p-6 hover:border-[#8d25f4] transition-colors"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div
                      className="cursor-pointer hover:opacity-80 transition-opacity flex-1"
                      onClick={() => handleMovieClick(rating.movieId)}
                    >
                      {/* ✅ Movie Card with Thumbnail & Title */}
                      <MovieCard movieId={rating.movieId} rating={rating} />

                      {/* Comment */}
                      {rating.comment && (
                        <div className="mt-3 p-3 bg-[#141118] rounded-lg border border-[#473b54]">
                          <p className="text-[#ab9cba] text-sm italic">
                            "{rating.comment}"
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Rating Display & Action Buttons */}
                    <div className="flex items-start gap-3">
                      {/* Rating Display */}
                      <div className="flex items-center gap-2 bg-[#141118] px-4 py-2 rounded-lg">
                        <span className="text-yellow-400 text-2xl">★</span>
                        <span className="text-white text-2xl font-bold">
                          {(rating.rating || rating.score || 0).toFixed(1)}
                        </span>
                        <span className="text-[#ab9cba]">/10.0</span>
                      </div>

                      {/* ✅ Edit Button */}
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => handleEdit(rating)}
                        disabled={isUpdating}
                        className="text-[#8d25f4] hover:text-[#7a1fd4] transition-colors p-2 disabled:opacity-50"
                        title="Edit rating"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="24"
                          height="24"
                          fill="currentColor"
                          viewBox="0 0 256 256"
                        >
                          <path d="M227.31,73.37,182.63,28.68a16,16,0,0,0-22.63,0L36.69,152A15.86,15.86,0,0,0,32,163.31V208a16,16,0,0,0,16,16H92.69A15.86,15.86,0,0,0,104,219.31L227.31,96a16,16,0,0,0,0-22.63ZM92.69,208H48V163.31l88-88L180.69,120ZM192,108.68,147.31,64l24-24L216,84.68Z" />
                        </svg>
                      </motion.button>

                      {/* Delete Button */}
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => handleDelete(rating)}
                        disabled={isDeleting}
                        className="text-red-400 hover:text-red-300 transition-colors p-2 disabled:opacity-50"
                        title="Delete rating"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="24"
                          height="24"
                          fill="currentColor"
                          viewBox="0 0 256 256"
                        >
                          <path d="M216,48H176V40a24,24,0,0,0-24-24H104A24,24,0,0,0,80,40v8H40a8,8,0,0,0,0,16h8V208a16,16,0,0,0,16,16H192a16,16,0,0,0,16-16V64h8a8,8,0,0,0,0-16ZM96,40a8,8,0,0,1,8-8h48a8,8,0,0,1,8,8v8H96Zm96,168H64V64H192ZM112,104v64a8,8,0,0,1-16,0V104a8,8,0,0,1,16,0Zm48,0v64a8,8,0,0,1-16,0V104a8,8,0,0,1,16,0Z" />
                        </svg>
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        )}

        {!isLoading && !isFetching && !error && stats.total > 0 && (
          <FadeIn delay={0.5}>
            <div className="mt-8 bg-[#211b27] border border-[#473b54] rounded-lg p-6">
              <h2 className="text-white text-2xl font-bold mb-4">Your Stats</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center">
                  <p className="text-[#ab9cba] text-sm mb-1">Total Ratings</p>
                  <p className="text-white text-3xl font-bold">{stats.total}</p>
                </div>
                <div className="text-center">
                  <p className="text-[#ab9cba] text-sm mb-1">Average Rating</p>
                  <p className="text-white text-3xl font-bold">
                    {stats.average.toFixed(1)}
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-[#ab9cba] text-sm mb-1">Highest Rating</p>
                  <p className="text-white text-3xl font-bold">
                    {stats.highest.toFixed(1)}
                  </p>
                </div>
              </div>
            </div>
          </FadeIn>
        )}

        {/* Edit Modal */}
        {editingRating && (
          <EditRatingModal
            rating={editingRating}
            onClose={() => setEditingRating(null)}
            onSave={handleSaveEdit}
          />
        )}
      </div>
    </div>
  );
}
