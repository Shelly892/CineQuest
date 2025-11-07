export default function ErrorMessage({ error, retry }) {
  const getErrorMessage = () => {
    if (error.response) {
      return (
        error.response.data?.message || "Server error, please try again later."
      );
    } else if (error.request) {
      return "Network request failed. Please check your connection.";
    } else {
      return error.message || "An unexpected error occurred.";
    }
  };

  return (
    <div className="flex flex-col items-center justify-center py-12">
      <div className="text-red-500 text-5xl mb-4">⚠️</div>
      <h3 className="text-xl font-semibold text-gray-800 mb-2">
        Something went wrong
      </h3>
      <p className="text-gray-600 text-center max-w-md mb-6">
        {getErrorMessage()}
      </p>
      {retry && (
        <button onClick={retry} className="btn btn-primary">
          Retry
        </button>
      )}
    </div>
  );
}
