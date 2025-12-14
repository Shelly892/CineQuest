import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { getImageUrl } from "../utils/imageUtils";

export default function MovieCard({ movie, index = 0 }) {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/movies/${movie.id}`);
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{
        duration: 0.4,
        delay: index * 0.05,
        ease: [0.25, 0.1, 0.25, 1],
      }}
      whileHover={{
        scale: 1.05,
        y: -10,
        transition: { duration: 0.2 },
      }}
      onClick={handleClick}
      className="cursor-pointer"
    >
      <div className="bg-[#211b27] rounded-lg overflow-hidden border border-[#473b54] hover:border-[#8d25f4] transition-all duration-300 shadow-lg hover:shadow-2xl">
        {/* Poster */}
        <div className="relative aspect-[2/3] overflow-hidden bg-[#302839]">
          <img
            src={getImageUrl(
              movie.poster || movie.poster_path,
              "https://via.placeholder.com/240x360/473b54/ab9cba?text=No+Poster"
            )}
            alt={movie.title}
            className="w-full h-full object-cover"
            loading="lazy"
            onError={(e) => {
              // Fallback if image fails to load
              e.target.src =
                "https://via.placeholder.com/240x360/473b54/ab9cba?text=No+Poster";
            }}
          />

          {/* Rating Badge */}
          {movie.rating && (
            <div className="absolute top-2 right-2 bg-black/70 backdrop-blur-sm px-2 py-1 rounded-md flex items-center gap-1">
              <span className="text-yellow-400 text-sm">★</span>
              <span className="text-white text-sm font-bold">
                {movie.rating}
              </span>
            </div>
          )}

          {/* Hover Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            whileHover={{ opacity: 1 }}
            className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent flex items-end p-3"
          >
            <div className="text-white text-sm">
              <p className="font-bold mb-1">Click to view details</p>
            </div>
          </motion.div>
        </div>

        {/* Info */}
        <div className="p-3">
          <h3
            className="text-white font-bold text-sm mb-1 truncate"
            title={movie.title}
          >
            {movie.title}
          </h3>
          <div className="flex items-center justify-between text-xs">
            <span className="text-[#ab9cba]">
              {movie.genre || movie.release_date?.split("-")[0] || "N/A"}
            </span>
            {movie.vote_average && (
              <div className="flex items-center gap-1">
                <span className="text-yellow-400">★</span>
                <span className="text-white font-medium">
                  {typeof movie.vote_average === "number"
                    ? movie.vote_average.toFixed(1)
                    : movie.vote_average}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
