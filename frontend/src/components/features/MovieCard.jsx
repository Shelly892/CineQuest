import { motion } from "framer-motion";
import { Link } from "react-router-dom";

export default function MovieCard({ movie, index = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{
        duration: 0.4,
        delay: index * 0.05, // Delay based on index
        ease: [0.25, 0.1, 0.25, 1],
      }}
      whileHover={{
        scale: 1.05,
        y: -10,
        transition: { duration: 0.2 },
      }}
      className="cursor-pointer"
    >
      <Link to={`/movies/${movie.id}`}>
        <div className="relative group">
          {/* Movie poster */}
          <motion.div
            className="w-full bg-center bg-no-repeat aspect-[3/4] bg-cover rounded-lg overflow-hidden shadow-lg"
            style={{ backgroundImage: `url("${movie.poster}")` }}
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.3 }}
          >
            {/* Hover overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              whileHover={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
              className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent flex flex-col justify-end p-4"
            >
              <motion.h3
                initial={{ y: 20, opacity: 0 }}
                whileHover={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.1 }}
                className="text-white font-bold text-lg"
              >
                {movie.title}
              </motion.h3>
              {movie.genre && (
                <motion.p
                  initial={{ y: 20, opacity: 0 }}
                  whileHover={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.15 }}
                  className="text-gray-300 text-sm"
                >
                  {movie.genre}
                </motion.p>
              )}
              {movie.rating && (
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  whileHover={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="flex items-center gap-1 mt-2"
                >
                  <span className="text-yellow-400">⭐</span>
                  <span className="text-white font-semibold">
                    {movie.rating}
                  </span>
                  <span className="text-gray-400 text-sm">/10</span>
                </motion.div>
              )}
            </motion.div>
          </motion.div>
        </div>
      </Link>
    </motion.div>
  );
}
