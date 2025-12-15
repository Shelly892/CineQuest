import { motion } from "framer-motion";

export default function ErrorMessage({ error, retry }) {
  const getErrorMessage = () => {
    if (error?.response) {
      return (
        error.response.data?.message || "Server error, please try again later."
      );
    } else if (error?.request) {
      return "Network request failed. Please check your connection.";
    } else {
      return error?.message || "An unexpected error occurred.";
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center py-20"
    >
      {/* Error Icon */}
      <div className="bg-red-500/10 border border-red-500/30 rounded-full p-4 mb-4">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="48"
          height="48"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-red-400"
        >
          <circle cx="12" cy="12" r="10" />
          <line x1="12" x2="12" y1="8" y2="12" />
          <line x1="12" x2="12.01" y1="16" y2="16" />
        </svg>
      </div>

      {/* Title */}
      <h3 className="text-red-400 text-xl font-bold mb-2">
        ⚠️ Service Temporarily Unavailable
      </h3>

      {/* Error Message */}
      <p className="text-[#ab9cba] text-center max-w-md mb-6">
        {getErrorMessage()}
      </p>

      {/* Retry Button */}
      {retry && (
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={retry}
          className="px-6 py-3 bg-[#8d25f4] text-white font-bold rounded-lg hover:bg-[#7a1fd4] transition-colors flex items-center gap-2"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
            <path d="M3 3v5h5" />
            <path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16" />
            <path d="M16 16h5v5" />
          </svg>
          Try Again
        </motion.button>
      )}
    </motion.div>
  );
}
