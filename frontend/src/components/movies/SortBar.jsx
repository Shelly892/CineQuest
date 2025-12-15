import { motion, AnimatePresence } from "framer-motion";

export default function SortBar({
  isExpanded,
  selectedSort,
  onSortChange,
  onReset,
}) {
  const sortOptions = [
    {
      value: "popularity.desc",
      label: "Most Popular",
      description: "Trending movies first",
    },
    {
      value: "vote_average.desc",
      label: "Highest Rated",
      description: "Best ratings first",
    },
    {
      value: "vote_average.asc",
      label: "Lowest Rated",
      description: "Worst ratings first",
    },
    {
      value: "release_date.desc",
      label: "Newest First",
      description: "Latest releases",
    },
    {
      value: "release_date.asc",
      label: "Oldest First",
      description: "Earlier releases",
    },
    {
      value: "title.asc",
      label: "A → Z",
      description: "Alphabetical order",
    },
    {
      value: "title.desc",
      label: "Z → A",
      description: "Reverse alphabetical",
    },
  ];

  const hasCustomSort = selectedSort !== "popularity.desc";

  return (
    <AnimatePresence>
      {isExpanded && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="overflow-hidden mb-8"
        >
          <div className="p-6 bg-[#211b27] border border-[#473b54] rounded-lg">
            <h3 className="text-white text-lg font-bold mb-4">
              Sort Movies By
            </h3>

            {/* Sort Options Grid */}
            <div className="flex flex-wrap gap-3 mb-4">
              {sortOptions.map((option) => (
                <motion.button
                  key={option.value}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => onSortChange(option.value)}
                  className={`flex-1 min-w-[120px] p-4 rounded-lg text-left transition-all ${
                    selectedSort === option.value
                      ? "bg-[#8d25f4] border-2 border-[#8d25f4]"
                      : "bg-[#302839] border-2 border-[#473b54] hover:border-[#8d25f4]"
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-white font-medium">
                      {option.label}
                    </span>
                    {selectedSort === option.value && (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="text-white"
                      >
                        <path d="M20 6 9 17l-5-5" />
                      </svg>
                    )}
                  </div>
                  <p className="text-[#ab9cba] text-xs">{option.description}</p>
                </motion.button>
              ))}
            </div>

            {/* Reset Button */}
            {hasCustomSort && (
              <motion.button
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={onReset}
                className="w-full px-4 py-3 bg-[#473b54] text-white rounded-lg hover:bg-[#5a4765] transition-colors flex items-center justify-center gap-2 font-medium"
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
                  <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" />
                  <path d="M21 3v5h-5" />
                  <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" />
                  <path d="M8 16H3v5" />
                </svg>
                Reset to Most Popular
              </motion.button>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
