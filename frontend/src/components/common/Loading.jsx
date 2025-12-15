import { motion } from "framer-motion";

export default function Loading({ text = "Loading movies..." }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex flex-col items-center justify-center py-20"
    >
      {/* Spinner */}
      <div className="relative w-16 h-16 mb-4">
        <div className="absolute inset-0 border-4 border-[#8d25f4] border-t-transparent rounded-full animate-spin"></div>
        <div className="absolute inset-2 border-4 border-[#473b54] border-t-transparent rounded-full animate-spin-reverse"></div>
      </div>

      {/* Loading Text */}
      {text && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-[#ab9cba] text-sm"
        >
          {text}
        </motion.p>
      )}
    </motion.div>
  );
}
