import { useParams, useNavigate } from "react-router-dom";
import { useKeycloak } from "@react-keycloak/web";
import { motion } from "framer-motion";
import { useMovieDetails } from "../hooks/useMovies";
import { useSubmitRating } from "../hooks/useRatings";
import FadeIn from "../components/common/FadeIn";
import { useState } from "react";
import { getImageUrl } from "../utils/imageUtils";

export default function MovieDetail() {
  const { id } = useParams();
  const { keycloak } = useKeycloak();
  const navigate = useNavigate();
  const [selectedRating, setSelectedRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);

  const { data: movie, isLoading } = useMovieDetails(id);
  const { mutate: submitRating, isLoading: submitting } = useSubmitRating();

  // Page is public, but rating submission requires login
  const handleRatingSubmit = () => {
    if (!keycloak.authenticated) {
      navigate("/login");
      return;
    }

    if (selectedRating > 0 && movie) {
      submitRating({
        movieId: id,
        movieTitle: movie.title,
        rating: selectedRating,
        userId: keycloak.tokenParsed?.sub,
      });
    }
  };

  // Format currency
  const formatCurrency = (amount) => {
    if (!amount) return "N/A";
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // Format number
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

            {/* Genres */}
            {movie.genres && movie.genres.length > 0 && (
              <FadeIn delay={0.6}>
                <div className="mb-6">
                  <h2 className="text-white text-xl font-bold mb-3">Genres</h2>
                  <div className="flex flex-wrap gap-2">
                    {movie.genres.map((genre) => (
                      <span
                        key={genre.id}
                        className="px-3 py-1 bg-[#211b27] border border-[#473b54] text-white rounded-full text-sm"
                      >
                        {genre.name}
                      </span>
                    ))}
                  </div>
                </div>
              </FadeIn>
            )}

            {/* Additional Info Grid */}
            <FadeIn delay={0.7}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                {/* Budget & Revenue */}
                {(movie.budget > 0 || movie.revenue > 0) && (
                  <div className="bg-[#211b27] border border-[#473b54] rounded-lg p-4">
                    <h3 className="text-white font-bold mb-2">Box Office</h3>
                    {movie.budget > 0 && (
                      <div className="flex justify-between mb-2">
                        <span className="text-[#ab9cba] text-sm">Budget:</span>
                        <span className="text-white text-sm font-medium">
                          {formatCurrency(movie.budget)}
                        </span>
                      </div>
                    )}
                    {movie.revenue > 0 && (
                      <div className="flex justify-between">
                        <span className="text-[#ab9cba] text-sm">Revenue:</span>
                        <span className="text-white text-sm font-medium">
                          {formatCurrency(movie.revenue)}
                        </span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </FadeIn>

            {/* Production Companies */}
            {movie.production_companies &&
              movie.production_companies.length > 0 && (
                <FadeIn delay={0.8}>
                  <div className="mb-6">
                    <h2 className="text-white text-xl font-bold mb-3">
                      Production Companies
                    </h2>
                    <div className="flex flex-wrap gap-4">
                      {movie.production_companies.slice(0, 4).map((company) => (
                        <div
                          key={company.id}
                          className="flex items-center gap-2 px-3 py-2 bg-[#211b27] border border-[#473b54] rounded-lg"
                        >
                          {company.logo_path ? (
                            <img
                              src={`https://image.tmdb.org/t/p/w92${company.logo_path}`}
                              alt={company.name}
                              className="h-6 object-contain"
                            />
                          ) : (
                            <span className="text-white text-sm">
                              {company.name}
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </FadeIn>
              )}

            {/* Rating Section */}
            <FadeIn delay={0.9}>
              <div className="bg-[#211b27] border border-[#473b54] rounded-lg p-6 mt-8">
                <h2 className="text-white text-2xl font-bold mb-4">
                  Rate this Movie
                </h2>
                {!keycloak.authenticated && (
                  <div className="mb-4 p-3 bg-[#473b54] border border-[#8d25f4] rounded-lg">
                    <p className="text-[#ab9cba] text-sm">
                      Please{" "}
                      <button
                        onClick={() => navigate("/login")}
                        className="text-[#8d25f4] hover:text-[#7a1fd4] underline font-medium"
                      >
                        login
                      </button>{" "}
                      to submit a rating
                    </p>
                  </div>
                )}
                <div className="flex items-center gap-2 mb-4 flex-wrap">
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
                  {selectedRating > 0 && (
                    <span className="text-white text-xl ml-2">
                      {selectedRating}/10
                    </span>
                  )}
                </div>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleRatingSubmit}
                  disabled={
                    selectedRating === 0 ||
                    submitting ||
                    !keycloak.authenticated
                  }
                  className="px-6 py-3 bg-[#8d25f4] text-white font-bold rounded-lg hover:bg-[#7a1fd4] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {submitting ? "Submitting..." : "Submit Rating"}
                </motion.button>
              </div>
            </FadeIn>
          </div>
        </div>
      </div>
    </div>
  );
}
