import { motion, AnimatePresence } from "framer-motion";

export default function SearchBar({
  value,
  onChange,
  onClear,
  onSubmit,
  placeholder = "Search for movies...",
}) {
  return (
    <form onSubmit={onSubmit} className="mb-8">
      <div className="relative flex gap-2">
        {/* Search Icon */}
        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#ab9cba] pointer-events-none z-10">
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
          >
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.35-4.35" />
          </svg>
        </div>

        {/* Input Field */}
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="flex-1 pl-12 pr-12 py-3 bg-[#211b27] border border-[#473b54] rounded-lg text-white placeholder:text-[#ab9cba] focus:outline-none focus:border-[#8d25f4] transition-colors"
          autoComplete="off"
        />

        {/* Clear Button */}
        <AnimatePresence>
          {value && (
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              type="button"
              onClick={onClear}
              className="absolute right-20 top-1/2 -translate-y-1/2 text-[#ab9cba] hover:text-white transition-colors p-1 z-10"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
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
              >
                <path d="M18 6 6 18" />
                <path d="m6 6 12 12" />
              </svg>
            </motion.button>
          )}
        </AnimatePresence>

        {/* Search Button */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          type="submit"
          className="px-6 py-3 bg-[#8d25f4] text-white font-bold rounded-lg hover:bg-[#7a1fd4] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={value.length === 0}
        >
          Search
        </motion.button>
      </div>

      {/* Search Hint */}
      {value.length > 0 && value.length <= 2 && (
        <motion.p
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-[#ab9cba] text-xs mt-2 ml-1"
        >
          Type at least 3 characters to search
        </motion.p>
      )}
    </form>
  );
}
