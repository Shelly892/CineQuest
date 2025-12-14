import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { usePopularMovies, useSearchMovies } from "../hooks/useMovies";
import FadeIn from "../components/common/FadeIn";
import StaggerContainer, {
  StaggerItem,
} from "../components/common/StaggerContainer";
import { getImageUrl } from "../utils/imageUtils";

export default function Movies() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);

  // Fetch movies (public access, no login required)
  const { data: popularMovies, isLoading: loadingPopular } =
    usePopularMovies(page);
  const { data: searchResults, isLoading: loadingSearch } = useSearchMovies(
    searchQuery,
    page
  );

  const movies = searchQuery.length > 2 ? searchResults : popularMovies;
  const isLoading = searchQuery.length > 2 ? loadingSearch : loadingPopular;

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
  };

  const handleMovieClick = (movieId) => {
    navigate(`/movies/${movieId}`);
  };

  return (
    <div className="flex flex-1 justify-center py-5 px-4 md:px-40 bg-[#141118]">
      <div className="flex flex-col max-w-[1200px] flex-1">
        {/* Header */}
        <FadeIn delay={0.1}>
          <h1 className="text-white text-4xl font-bold mb-6">
            {searchQuery ? "Search Results" : "Popular Movies"}
          </h1>
        </FadeIn>

        {/* Search Bar */}
        <FadeIn delay={0.2}>
          <form onSubmit={handleSearch} className="mb-8">
            <div className="flex gap-2">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search for movies..."
                className="flex-1 px-4 py-3 bg-[#211b27] border border-[#473b54] rounded-lg text-white placeholder:text-[#ab9cba] focus:outline-none focus:border-[#8d25f4] transition-colors"
              />
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                type="submit"
                className="px-6 py-3 bg-[#8d25f4] text-white font-bold rounded-lg hover:bg-[#7a1fd4] transition-colors"
              >
                Search
              </motion.button>
            </div>
          </form>
        </FadeIn>

        {/* Loading State */}
        {isLoading && (
          <div className="flex justify-center items-center py-20">
            <div className="w-16 h-16 border-4 border-[#8d25f4] border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}

        {/* Movies Grid */}
        {!isLoading && movies?.results && (
          <StaggerContainer className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {movies.results.map((movie) => (
              <StaggerItem key={movie.id}>
                <motion.div
                  whileHover={{ scale: 1.05, y: -10 }}
                  onClick={() => handleMovieClick(movie.id)}
                  className="cursor-pointer"
                >
                  <div className="bg-[#211b27] rounded-lg overflow-hidden border border-[#473b54] hover:border-[#8d25f4] transition-colors">
                    <img
                      src={getImageUrl(
                        movie.poster_path,
                        "https://via.placeholder.com/240x360/473b54/ab9cba?text=No+Poster"
                      )}
                      alt={movie.title}
                      className="w-full aspect-[2/3] object-cover"
                      onError={(e) => {
                        // Fallback if image fails to load
                        e.target.src = "https://via.placeholder.com/240x360/473b54/ab9cba?text=No+Poster";
                      }}
                    />
                    <div className="p-3">
                      <h3 className="text-white font-bold text-sm mb-1 truncate">
                        {movie.title}
                      </h3>
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-[#ab9cba]">
                          {movie.release_date?.split("-")[0] || "N/A"}
                        </span>
                        <div className="flex items-center gap-1">
                          <span className="text-yellow-400">★</span>
                          <span className="text-white">
                            {movie.vote_average?.toFixed(1) || "N/A"}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        )}

        {/* Empty State */}
        {!isLoading && movies?.results?.length === 0 && (
          <div className="text-center py-20">
            <p className="text-[#ab9cba] text-lg">No movies found</p>
          </div>
        )}

        {/* Pagination */}
        {!isLoading && movies?.total_pages > 1 && (
          <div className="flex justify-center gap-4 mt-8">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              disabled={page === 1}
              onClick={() => setPage((p) => p - 1)}
              className="px-4 py-2 bg-[#211b27] text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#302839] transition-colors"
            >
              Previous
            </motion.button>
            <span className="px-4 py-2 bg-[#211b27] text-white rounded-lg">
              Page {page} of {movies.total_pages}
            </span>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              disabled={page === movies.total_pages}
              onClick={() => setPage((p) => p + 1)}
              className="px-4 py-2 bg-[#211b27] text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#302839] transition-colors"
            >
              Next
            </motion.button>
          </div>
        )}
      </div>
    </div>
  );
}
