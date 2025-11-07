import { usePopularMovies } from "../hooks/useMovies";
import Loading from "../components/common/Loading";
import ErrorMessage from "../components/common/ErrorMessage";

export default function Home() {
  const { data, isLoading, error, refetch } = usePopularMovies(1);

  if (isLoading) {
    return <Loading text="Loading popular movies..." />;
  }

  if (error) {
    return <ErrorMessage error={error} retry={refetch} />;
  }

  return (
    <div>
      <section className="mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">
          Welcome to CineQuest
        </h1>
        <p className="text-gray-600 text-lg">
          Find movies you love and share your viewing experience.
        </p>
      </section>

      <section>
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          Trending Movies
        </h2>

        {/* Temporary placeholder: replace with movie card component once the API is ready */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {data?.results?.slice(0, 10).map((movie) => (
            <div key={movie.id} className="card">
              <h3 className="font-semibold text-gray-900">{movie.title}</h3>
              <p className="text-gray-500 text-sm mt-1">
                Rating: {movie.vote_average}
              </p>
            </div>
          ))}
        </div>

        {/* Fallback when no data is available */}
        {!data?.results?.length && (
          <div className="text-center text-gray-500 py-12">
            No movies found.
          </div>
        )}
      </section>
    </div>
  );
}
