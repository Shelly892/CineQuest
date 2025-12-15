import { useState, useMemo, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { usePopularMovies } from "../hooks/useMovies";
import FadeIn from "../components/common/FadeIn";
import StaggerContainer, {
  StaggerItem,
} from "../components/common/StaggerContainer";
import MovieCard from "../features/MovieCard";

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();
  const scrollContainerRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  // Fetch popular movies from API
  const { data: moviesData, isLoading } = usePopularMovies(1);

  // Get trending movies (first 6)
  const trendingMovies = useMemo(
    () => moviesData?.results?.slice(0, 6) || [],
    [moviesData]
  );

  // Get latest releases (sorted by release_date, newest first)
  const latestReleases = useMemo(() => {
    if (!moviesData?.results) return [];

    return [...moviesData.results]
      .sort((a, b) => {
        const dateA = a.release_date || "";
        const dateB = b.release_date || "";
        return dateB.localeCompare(dateA);
      })
      .slice(0, 12);
  }, [moviesData]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/movies?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  // Check scroll position
  const checkScrollPosition = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } =
        scrollContainerRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  // Scroll functions
  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({
        left: -280,
        behavior: "smooth",
      });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({
        left: 280,
        behavior: "smooth",
      });
    }
  };

  useEffect(() => {
    checkScrollPosition();
    const container = scrollContainerRef.current;
    if (container) {
      container.addEventListener("scroll", checkScrollPosition);
      return () => container.removeEventListener("scroll", checkScrollPosition);
    }
  }, [trendingMovies]);

  return (
    <div className="flex flex-1 justify-center py-5 px-4 md:px-40 bg-[#141118]">
      <div className="flex flex-col max-w-[1200px] flex-1">
        {/* Hero Section */}
        <FadeIn delay={0.2}>
          <div className="mb-6">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
              className="flex min-h-[480px] flex-col gap-6 bg-cover bg-center bg-no-repeat rounded-lg items-start justify-end px-4 pb-10 md:px-10 relative overflow-hidden"
              style={{
                backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.1) 0%, rgba(0, 0, 0, 0.4) 100%), url("https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=1200&h=600&fit=crop")`,
              }}
            >
              {/* Background animation glow */}
              <motion.div
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.3, 0.5, 0.3],
                }}
                transition={{
                  duration: 8,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="absolute inset-0 bg-gradient-to-br from-purple-500/20 to-blue-500/20"
              />

              {/* Hero Text */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.8 }}
                className="flex flex-col gap-3 text-left relative z-10"
              >
                <motion.h1
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4, duration: 0.8 }}
                  className="text-white text-4xl md:text-5xl font-black leading-tight tracking-[-0.033em]"
                >
                  CineQuest: Your Movie Adventure Awaits
                </motion.h1>
                <motion.h2
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5, duration: 0.8 }}
                  className="text-white text-base md:text-lg font-medium leading-relaxed"
                >
                  Discover · Rate · Connect
                  <span className="block text-[#ab9cba] text-sm md:text-base mt-1">
                    Join the community shaping cinema's hottest trends with
                    every click and vote.
                  </span>
                </motion.h2>
              </motion.div>

              {/* Search Bar */}
              <motion.form
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.8 }}
                onSubmit={handleSearch}
                className="flex flex-col min-w-40 h-14 md:h-16 w-full max-w-[480px] relative z-10"
              >
                <div className="flex w-full flex-1 items-stretch rounded-lg h-full">
                  <div className="text-[#ab9cba] flex border border-[#473b54] bg-[#211b27] items-center justify-center pl-[15px] rounded-l-lg border-r-0">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      fill="currentColor"
                      viewBox="0 0 256 256"
                    >
                      <path d="M229.66,218.34l-50.07-50.06a88.11,88.11,0,1,0-11.31,11.31l50.06,50.07a8,8,0,0,0,11.32-11.32ZM40,112a72,72,0,1,1,72,72A72.08,72.08,0,0,1,40,112Z" />
                    </svg>
                  </div>
                  <motion.input
                    whileFocus={{ scale: 1.01 }}
                    type="text"
                    placeholder="Search for movies"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-white focus:outline-0 focus:ring-0 border border-[#473b54] bg-[#211b27] focus:border-[#8d25f4] h-full placeholder:text-[#ab9cba] px-[15px] rounded-r-none border-r-0 pr-2 rounded-l-none border-l-0 pl-2 text-sm md:text-base font-normal leading-normal transition-colors duration-300"
                  />
                  <div className="flex items-center justify-center rounded-r-lg border-l-0 border border-[#473b54] bg-[#211b27] pr-[7px]">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      type="submit"
                      className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 md:h-12 px-4 md:px-5 bg-[#8d25f4] text-white text-sm md:text-base font-bold leading-normal tracking-[0.015em] hover:bg-[#7a1fd4] transition-colors"
                    >
                      <span className="truncate">Search</span>
                    </motion.button>
                  </div>
                </div>
              </motion.form>
            </motion.div>
          </div>
        </FadeIn>

        {/* Trending Movies */}
        <div className="mb-8">
          <FadeIn delay={0.3} direction="up">
            <div className="flex items-center justify-between mt-3">
              <h2 className="text-white text-[22px] font-bold leading-tight tracking-[-0.015em] px-4">
                Trending Now
              </h2>
              <button
                onClick={() => navigate("/movies")}
                className="text-[#8d25f4] hover:text-[#7a1fd4] text-sm font-medium px-4 transition-colors"
              >
                View All →
              </button>
            </div>
          </FadeIn>

          {isLoading ? (
            <div className="flex justify-center items-center py-20">
              <div className="w-16 h-16 border-4 border-[#8d25f4] border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : (
            <>
              {/* Desktop: Horizontal Scroll with External Arrows */}
              <div className="hidden md:block relative">
                <div className="flex items-center">
                  {/* Left Arrow - Outside */}
                  <div className="flex-shrink-0 w-12 flex justify-center">
                    {canScrollLeft && (
                      <motion.button
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={scrollLeft}
                        className="w-12 h-12 bg-[#211b27] border border-[#473b54] rounded-full flex items-center justify-center text-white hover:bg-[#302839] hover:border-[#8d25f4] transition-colors shadow-lg z-20"
                        aria-label="Scroll left"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="m15 18-6-6 6-6" />
                        </svg>
                      </motion.button>
                    )}
                  </div>

                  {/* Scroll Container with padding for hover effect */}
                  <div
                    ref={scrollContainerRef}
                    className="flex-1 overflow-x-auto scrollbar-hide scroll-smooth"
                  >
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.4, duration: 0.8 }}
                      className="flex items-stretch px-4 gap-6 py-6"
                    >
                      {trendingMovies.length > 0 ? (
                        trendingMovies.map((movie, index) => (
                          <motion.div
                            key={movie.id}
                            initial={{ opacity: 0, x: -50 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{
                              delay: 0.5 + index * 0.1,
                              duration: 0.5,
                            }}
                            className="flex-shrink-0 w-[220px]"
                          >
                            <MovieCard movie={movie} index={index} />
                          </motion.div>
                        ))
                      ) : (
                        <p className="text-[#ab9cba] px-4">
                          No trending movies available
                        </p>
                      )}
                    </motion.div>
                  </div>

                  {/* Right Arrow - Outside */}
                  <div className="flex-shrink-0 w-12 flex justify-center">
                    {canScrollRight && (
                      <motion.button
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={scrollRight}
                        className="w-12 h-12 bg-[#211b27] border border-[#473b54] rounded-full flex items-center justify-center text-white hover:bg-[#302839] hover:border-[#8d25f4] transition-colors shadow-lg z-20"
                        aria-label="Scroll right"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="m9 18 6-6-6-6" />
                        </svg>
                      </motion.button>
                    )}
                  </div>
                </div>
              </div>

              {/* Mobile: Grid Layout */}
              <div className="md:hidden">
                <StaggerContainer className="grid grid-cols-2 gap-4 px-4">
                  {trendingMovies.slice(0, 4).map((movie, index) => (
                    <StaggerItem key={movie.id}>
                      <MovieCard movie={movie} index={index} />
                    </StaggerItem>
                  ))}
                </StaggerContainer>
              </div>
            </>
          )}
        </div>

        {/* Latest Releases */}
        <FadeIn delay={0.5} direction="up">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-white text-[22px] font-bold leading-tight tracking-[-0.015em] px-4">
              Latest Releases
            </h2>
            <button
              onClick={() => navigate("/movies?sort=release_date.desc")}
              className="text-[#8d25f4] hover:text-[#7a1fd4] text-sm font-medium px-4 transition-colors"
            >
              View All →
            </button>
          </div>
        </FadeIn>

        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <div className="w-16 h-16 border-4 border-[#8d25f4] border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : (
          <StaggerContainer className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 px-4 pb-8">
            {latestReleases.length > 0 ? (
              latestReleases.map((movie, index) => (
                <StaggerItem key={movie.id}>
                  <MovieCard movie={movie} index={index} />
                </StaggerItem>
              ))
            ) : (
              <p className="text-[#ab9cba] col-span-full text-center py-8">
                No latest releases available
              </p>
            )}
          </StaggerContainer>
        )}
      </div>
    </div>
  );
}
