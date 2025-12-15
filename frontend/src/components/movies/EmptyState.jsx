import { motion } from "framer-motion";

export default function EmptyState({ searchQuery }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center py-20"
    >
      {/* Icon */}
      <div className="bg-[#211b27] border border-[#473b54] rounded-full p-6 mb-4">
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
          className="text-[#ab9cba]"
        >
          <rect width="18" height="18" x="3" y="3" rx="2" />
          <path d="M7 3v18" />
          <path d="M3 7.5h4" />
          <path d="M3 12h18" />
          <path d="M3 16.5h4" />
          <path d="M17 3v18" />
          <path d="M17 7.5h4" />
          <path d="M17 16.5h4" />
        </svg>
      </div>

      {/* Title */}
      <h3 className="text-white text-xl font-bold mb-2">No Movies Found</h3>

      {/* Description */}
      <p className="text-[#ab9cba] text-center max-w-md">
        {searchQuery
          ? `No results found for "${searchQuery}". Try a different search term.`
          : "No movies available at the moment."}
      </p>
    </motion.div>
  );
}
