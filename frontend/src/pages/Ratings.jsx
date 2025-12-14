import { useEffect } from "react";
import { useKeycloak } from "@react-keycloak/web";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useUserRatings, useDeleteRating } from "../hooks/useRatings";
import FadeIn from "../components/common/FadeIn";
import StaggerContainer, {
  StaggerItem,
} from "../components/common/StaggerContainer";

export default function Ratings() {
  const { keycloak } = useKeycloak();
  const navigate = useNavigate();

  const userId = keycloak.tokenParsed?.sub;
  const { data: ratings, isLoading } = useUserRatings(userId);
  const { mutate: deleteRating } = useDeleteRating();

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!keycloak.authenticated) {
      navigate("/login");
    }
  }, [keycloak.authenticated, navigate]);

  if (!keycloak.authenticated) {
    return null;
  }

  const handleDelete = (ratingId) => {
    if (window.confirm("Are you sure you want to delete this rating?")) {
      deleteRating(ratingId);
    }
  };

  const handleMovieClick = (movieId) => {
    navigate(`/movies/${movieId}`);
  };

  return (
    <div className="min-h-screen bg-[#141118] py-10 px-4 md:px-40">
      <div className="max-w-[1200px] mx-auto">
        {/* Header */}
        <FadeIn>
          <h1 className="text-white text-4xl font-bold mb-2">My Ratings</h1>
          <p className="text-[#ab9cba] mb-8">
            You have rated {ratings?.length || 0} movies
          </p>
        </FadeIn>

        {/* Loading State */}
        {isLoading && (
          <div className="flex justify-center items-center py-20">
            <div className="w-16 h-16 border-4 border-[#8d25f4] border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}

        {/* Empty State */}
        {!isLoading && (!ratings || ratings.length === 0) && (
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

        {/* Ratings List */}
        {!isLoading && ratings && ratings.length > 0 && (
          <StaggerContainer className="space-y-4">
            {ratings.map((rating) => (
              <StaggerItem key={rating.id}>
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  className="bg-[#211b27] border border-[#473b54] rounded-lg p-6 hover:border-[#8d25f4] transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 flex-1">
                      {/* Movie Info */}
                      <div
                        className="cursor-pointer hover:text-[#8d25f4] transition-colors flex-1"
                        onClick={() => handleMovieClick(rating.movieId)}
                      >
                        <h3 className="text-white text-xl font-bold mb-1">
                          {rating.movieTitle}
                        </h3>
                        <p className="text-[#ab9cba] text-sm">
                          Rated on{" "}
                          {new Date(rating.createdAt).toLocaleDateString()}
                        </p>
                      </div>

                      {/* Rating Display */}
                      <div className="flex items-center gap-2 bg-[#141118] px-4 py-2 rounded-lg">
                        <span className="text-yellow-400 text-2xl">★</span>
                        <span className="text-white text-2xl font-bold">
                          {rating.rating}
                        </span>
                        <span className="text-[#ab9cba]">/10</span>
                      </div>

                      {/* Delete Button */}
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => handleDelete(rating.id)}
                        className="text-red-400 hover:text-red-300 transition-colors p-2"
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

        {/* Stats */}
        {!isLoading && ratings && ratings.length > 0 && (
          <FadeIn delay={0.5}>
            <div className="mt-8 bg-[#211b27] border border-[#473b54] rounded-lg p-6">
              <h2 className="text-white text-2xl font-bold mb-4">Your Stats</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center">
                  <p className="text-[#ab9cba] text-sm mb-1">Total Ratings</p>
                  <p className="text-white text-3xl font-bold">
                    {ratings.length}
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-[#ab9cba] text-sm mb-1">Average Rating</p>
                  <p className="text-white text-3xl font-bold">
                    {(
                      ratings.reduce((sum, r) => sum + r.rating, 0) /
                      ratings.length
                    ).toFixed(1)}
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-[#ab9cba] text-sm mb-1">Highest Rating</p>
                  <p className="text-white text-3xl font-bold">
                    {Math.max(...ratings.map((r) => r.rating))}
                  </p>
                </div>
              </div>
            </div>
          </FadeIn>
        )}
      </div>
    </div>
  );
}
