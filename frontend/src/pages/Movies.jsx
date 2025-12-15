import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { usePopularMovies, useSearchMovies } from "../hooks/useMovies";
import { useDebounce } from "../hooks/useDebounce";

// Common components
import FadeIn from "../components/common/FadeIn";
import StaggerContainer, {
  StaggerItem,
} from "../components/common/StaggerContainer";
import ErrorMessage from "../components/common/ErrorMessage";
import Loading from "../components/common/Loading";

// Movie-specific components
import SearchBar from "../components/movies/SearchBar";
import Pagination from "../components/movies/Pagination";
import EmptyState from "../components/movies/EmptyState";

// MovieCard from features folder
import MovieCard from "../features/MovieCard";

export default function Movies() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  // Initialize state from URL parameters
  const [searchQuery, setSearchQuery] = useState(searchParams.get("q") || "");
  const [page, setPage] = useState(
    parseInt(searchParams.get("page") || "1", 10)
  );

  // Debounce search query to reduce API calls
  const debouncedSearchQuery = useDebounce(searchQuery, 500);

  // Determine if we're in search mode
  const isSearchMode = debouncedSearchQuery.length > 2;

  // Fetch popular movies
  const {
    data: popularMovies,
    isLoading: loadingPopular,
    isError: errorPopular,
    error: popularError,
    refetch: refetchPopular,
  } = usePopularMovies(page);

  // Fetch search results
  const {
    data: searchResults,
    isLoading: loadingSearch,
    isError: errorSearch,
    error: searchError,
    refetch: refetchSearch,
  } = useSearchMovies(debouncedSearchQuery, page);

  // Select current data source based on mode
  const movies = isSearchMode ? searchResults : popularMovies;
  const isLoading = isSearchMode ? loadingSearch : loadingPopular;
  const isError = isSearchMode ? errorSearch : errorPopular;
  const error = isSearchMode ? searchError : popularError;
  const refetch = isSearchMode ? refetchSearch : refetchPopular;

  // Sync state to URL parameters
  useEffect(() => {
    const params = {};
    if (debouncedSearchQuery) params.q = debouncedSearchQuery;
    if (page > 1) params.page = page.toString();
    setSearchParams(params, { replace: true });
  }, [debouncedSearchQuery, page, setSearchParams]);

  // Reset page when search query changes
  useEffect(() => {
    setPage(1);
  }, [debouncedSearchQuery]);

  // Save search history to localStorage (optional)
  useEffect(() => {
    if (
      debouncedSearchQuery &&
      movies?.results &&
      movies.results.length > 0
    ) {
      const history = JSON.parse(
        localStorage.getItem("searchHistory") || "[]"
      );
      const updated = [
        debouncedSearchQuery,
        ...history.filter((q) => q !== debouncedSearchQuery),
      ].slice(0, 10); // Keep last 10 searches
      localStorage.setItem("searchHistory", JSON.stringify(updated));
    }
  }, [debouncedSearchQuery, movies]);

  // Event handlers
  const handleSearchChange = (value) => {
    setSearchQuery(value);
  };

  const handleSearchClear = () => {
    setSearchQuery("");
    setPage(1);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    // Debounce already handles the search trigger
  };

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  return (
    <div className="flex flex-1 justify-center py-5 px-4 md:px-40 bg-[#141118] min-h-screen">
      <div className="flex flex-col max-w-[1200px] flex-1">
        {/* ==================== Header ==================== */}
        <FadeIn delay={0.1}>
          <div className="mb-6">
            <h1 className="text-white text-4xl font-bold mb-2">
              {isSearchMode
                ? `Search Results${
                    debouncedSearchQuery
                      ? ` for "${debouncedSearchQuery}"`
                      : ""
                  }`
                : "Popular Movies"}
            </h1>
            {movies?.total_results > 0 && (
              <p className="text-[#ab9cba] text-sm">
                Found {movies.total_results.toLocaleString()} movies
                {movies.total_pages > 0 &&
                  ` • Page ${page} of ${Math.min(movies.total_pages, 500)}`}
              </p>
            )}
          </div>
        </FadeIn>

        {/* ==================== Search Bar ==================== */}
        <FadeIn delay={0.2}>
          <SearchBar
            value={searchQuery}
            onChange={handleSearchChange}
            onClear={handleSearchClear}
            onSubmit={handleSearchSubmit}
            placeholder="Search for movies... (e.g., Avatar, Inception)"
          />
        </FadeIn>

        {/* ==================== Loading State ==================== */}
        {isLoading && (
          <Loading
            text={isSearchMode ? "Searching movies..." : "Loading movies..."}
          />
        )}

        {/* ==================== Error State ==================== */}
        {!isLoading && isError && <ErrorMessage error={error} retry={refetch} />}

        {/* ==================== Empty State ==================== */}
        {!isLoading && !isError && movies?.results?.length === 0 && (
          <EmptyState searchQuery={debouncedSearchQuery} />
        )}

        {/* ==================== Movies Grid ==================== */}
        {!isLoading &&
          !isError &&
          movies?.results &&
          movies.results.length > 0 && (
            <>
              <StaggerContainer className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                {movies.results.map((movie, index) => (
                  <StaggerItem key={movie.id}>
                    <MovieCard movie={movie} index={index} />
                  </StaggerItem>
                ))}
              </StaggerContainer>

              {/* ==================== Pagination ==================== */}
              <Pagination
                currentPage={page}
                totalPages={Math.min(movies.total_pages || 1, 500)} // TMDB API max 500 pages
                onPageChange={handlePageChange}
              />
            </>
          )}
      </div>
    </div>
  );
}