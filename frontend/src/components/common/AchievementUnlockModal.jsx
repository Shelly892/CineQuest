import { useEffect } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";

const LEVEL_COLORS = {
  Bronze: "from-[#CD7F32] to-[#A0522D]",
  Silver: "from-[#C0C0C0] to-[#A8A8A8]",
  Gold: "from-[#FFD700] to-[#FFA500]",
  Platinum: "from-[#E5E4E2] to-[#B9F2FF]",
};

const LEVEL_ICONS = {
  Bronze: "🥉",
  Silver: "🥈",
  Gold: "🥇",
  Platinum: "💎",
};

const TYPE_ICONS = {
  SIGN: "📅",
  RATING: "⭐",
};

export default function AchievementUnlockModal({ achievement, isOpen, onClose }) {
  useEffect(() => {
    if (isOpen) {
      // Auto close after 5 seconds
      const timer = setTimeout(() => {
        onClose();
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [isOpen, onClose]);

  if (!isOpen || !achievement) return null;

  if (typeof document === "undefined" || !document.body) {
    return null;
  }

  const level = achievement.badgeLevel || achievement.level || "Bronze";
  const gradientClass = LEVEL_COLORS[level] || LEVEL_COLORS.Bronze;
  const icon = LEVEL_ICONS[level] || "🏆";
  const typeIcon = TYPE_ICONS[achievement.badgeType] || "🎖️";

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
          style={{ zIndex: 9999 }}
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0, y: 50 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.8, opacity: 0, y: 50 }}
            transition={{ type: "spring", damping: 20, stiffness: 300 }}
            onClick={(e) => e.stopPropagation()}
            className={`bg-gradient-to-br ${gradientClass} rounded-2xl p-8 max-w-md w-full shadow-2xl relative overflow-hidden`}
          >
            {/* Animated background effects */}
            <div className="absolute inset-0 opacity-20">
              <motion.div
                animate={{
                  scale: [1, 1.2, 1],
                  rotate: [0, 180, 360],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="absolute top-0 right-0 w-32 h-32 bg-white rounded-full blur-2xl"
              />
              <motion.div
                animate={{
                  scale: [1.2, 1, 1.2],
                  rotate: [360, 180, 0],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="absolute bottom-0 left-0 w-40 h-40 bg-white rounded-full blur-2xl"
              />
            </div>

            <div className="relative z-10">
              {/* Celebration Icon */}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{
                  type: "spring",
                  delay: 0.2,
                  stiffness: 200,
                  damping: 10,
                }}
                className="flex items-center justify-center mb-4"
              >
                <div className="text-8xl">{icon}</div>
              </motion.div>

              {/* Confetti Animation */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="absolute top-0 left-0 w-full h-full pointer-events-none"
              >
                {[...Array(20)].map((_, i) => (
                  <motion.div
                    key={i}
                    initial={{
                      x: "50%",
                      y: "50%",
                      opacity: 1,
                      scale: 1,
                    }}
                    animate={{
                      x: `${Math.random() * 100}%`,
                      y: `${Math.random() * 100 + 100}%`,
                      opacity: 0,
                      scale: 0,
                    }}
                    transition={{
                      duration: 2,
                      delay: Math.random() * 0.5,
                      ease: "easeOut",
                    }}
                    className="absolute text-2xl"
                  >
                    {["🎉", "✨", "⭐", "🎊"][Math.floor(Math.random() * 4)]}
                  </motion.div>
                ))}
              </motion.div>

              {/* Title */}
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-white text-3xl font-bold mb-2 text-center"
              >
                Achievement Unlocked!
              </motion.h2>

              {/* Badge Name */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="text-center mb-4"
              >
                <div className="flex items-center justify-center gap-2 mb-2">
                  <span className="text-2xl">{typeIcon}</span>
                  <h3 className="text-white text-2xl font-bold">
                    {achievement.badgeName || achievement.name}
                  </h3>
                </div>
                <p className="text-white/90 text-sm mb-3">
                  {achievement.description}
                </p>
                <div className="flex items-center justify-center gap-2">
                  <span className="px-3 py-1 bg-white/20 text-white rounded-full text-xs font-bold">
                    {level}
                  </span>
                  <span className="px-2 py-1 bg-white/10 text-white rounded-full text-xs flex items-center gap-1">
                    {typeIcon} {achievement.badgeType}
                  </span>
                </div>
              </motion.div>

              {/* Close Button */}
              <motion.button
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={onClose}
                className="w-full px-6 py-3 bg-white/20 backdrop-blur-sm text-white font-bold rounded-lg hover:bg-white/30 transition-colors border border-white/30"
              >
                Awesome! 🎉
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
}

