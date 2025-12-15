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
import SortBar from "../components/movies/SortBar";
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
  const [selectedSort, setSelectedSort] = useState(
    searchParams.get("sort") || "popularity.desc"
  );

  // Sort expand state
  const [isSortExpanded, setIsSortExpanded] = useState(false);

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

  // Sort movies (client-side sorting)
  const sortedMovies = movies?.results
    ? {
        ...movies,
        results: [...movies.results].sort((a, b) => {
          switch (selectedSort) {
            case "popularity.desc":
              return (b.popularity || 0) - (a.popularity || 0);
            case "popularity.asc":
              return (a.popularity || 0) - (b.popularity || 0);
            case "vote_average.desc":
              return (b.vote_average || 0) - (a.vote_average || 0);
            case "vote_average.asc":
              return (a.vote_average || 0) - (b.vote_average || 0);
            case "release_date.desc":
              return (b.release_date || "").localeCompare(a.release_date || "");
            case "release_date.asc":
              return (a.release_date || "").localeCompare(b.release_date || "");
            case "title.asc":
              return (a.title || "").localeCompare(b.title || "");
            case "title.desc":
              return (b.title || "").localeCompare(a.title || "");
            default:
              return 0;
          }
        }),
      }
    : movies;

  // Sync state to URL parameters
  useEffect(() => {
    const params = {};
    if (debouncedSearchQuery) params.q = debouncedSearchQuery;
    if (page > 1) params.page = page.toString();
    if (selectedSort !== "popularity.desc") params.sort = selectedSort;
    setSearchParams(params, { replace: true });
  }, [debouncedSearchQuery, page, selectedSort, setSearchParams]);

  // Reset page when search query or sort changes
  useEffect(() => {
    setPage(1);
  }, [debouncedSearchQuery, selectedSort]);

  // Save search history to localStorage
  useEffect(() => {
    if (debouncedSearchQuery && movies?.results && movies.results.length > 0) {
      const history = JSON.parse(localStorage.getItem("searchHistory") || "[]");
      const updated = [
        debouncedSearchQuery,
        ...history.filter((q) => q !== debouncedSearchQuery),
      ].slice(0, 10);
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
  };

  const handleSortToggle = () => {
    setIsSortExpanded(!isSortExpanded);
  };

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  const handleSortChange = (sort) => {
    setSelectedSort(sort);
  };

  const handleSortReset = () => {
    setSelectedSort("popularity.desc");
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
                    debouncedSearchQuery ? ` for "${debouncedSearchQuery}"` : ""
                  }`
                : "Popular Movies"}
            </h1>
            {sortedMovies?.results && sortedMovies.results.length > 0 && (
              <p className="text-[#ab9cba] text-sm">
                Showing {sortedMovies.results.length} movies
                {sortedMovies.total_results > sortedMovies.results.length &&
                  ` of ${sortedMovies.total_results.toLocaleString()} total`}
                {sortedMovies.total_pages > 0 &&
                  ` • Page ${page} of ${Math.min(
                    sortedMovies.total_pages,
                    500
                  )}`}
              </p>
            )}
          </div>
        </FadeIn>

        {/* ==================== Search Bar with Sort Button ==================== */}
        <FadeIn delay={0.2}>
          <SearchBar
            value={searchQuery}
            onChange={handleSearchChange}
            onClear={handleSearchClear}
            onSubmit={handleSearchSubmit}
            onSortToggle={handleSortToggle}
            isSortExpanded={isSortExpanded}
            currentSort={selectedSort}
            placeholder="Search for movies... (e.g., Avatar, Inception)"
          />
        </FadeIn>

        {/* ==================== Sort Bar (appears below SearchBar) ==================== */}
        {!isSearchMode && (
          <SortBar
            isExpanded={isSortExpanded}
            selectedSort={selectedSort}
            onSortChange={handleSortChange}
            onReset={handleSortReset}
          />
        )}

        {/* ==================== Loading State ==================== */}
        {isLoading && (
          <Loading
            text={isSearchMode ? "Searching movies..." : "Loading movies..."}
          />
        )}

        {/* ==================== Error State ==================== */}
        {!isLoading && isError && (
          <ErrorMessage error={error} retry={refetch} />
        )}

        {/* ==================== Empty State ==================== */}
        {!isLoading && !isError && sortedMovies?.results?.length === 0 && (
          <EmptyState searchQuery={debouncedSearchQuery} />
        )}

        {/* ==================== Movies Grid ==================== */}
        {!isLoading &&
          !isError &&
          sortedMovies?.results &&
          sortedMovies.results.length > 0 && (
            <>
              <StaggerContainer className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                {sortedMovies.results.map((movie, index) => (
                  <StaggerItem key={movie.id}>
                    <MovieCard movie={movie} index={index} />
                  </StaggerItem>
                ))}
              </StaggerContainer>

              {/* ==================== Pagination ==================== */}
              <Pagination
                currentPage={page}
                totalPages={Math.min(sortedMovies.total_pages || 1, 500)}
                onPageChange={handlePageChange}
              />
            </>
          )}
      </div>
    </div>
  );
}
