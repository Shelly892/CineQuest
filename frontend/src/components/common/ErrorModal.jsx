import { createPortal } from "react-dom";
import { motion } from "framer-motion";

export default function ErrorModal({
  isOpen,
  onClose,
  title,
  message,
  details,
}) {
  if (!isOpen) return null;

  return createPortal(
    <div
      className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
      style={{ zIndex: 9999 }}
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-[#211b27] border border-red-500/50 rounded-lg p-6 max-w-md w-full"
      >
        {/* Error Icon */}
        <div className="flex items-center justify-center mb-4">
          <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center">
            <span className="text-4xl">⚠️</span>
          </div>
        </div>

        {/* Title */}
        <h2 className="text-white text-2xl font-bold mb-3 text-center">
          {title || "Error"}
        </h2>

        {/* Message */}
        <p className="text-[#ab9cba] text-center mb-4">{message}</p>

        {/* Details (optional) */}
        {details && (
          <div className="mb-4 p-3 bg-[#141118] rounded-lg border border-[#473b54]">
            <p className="text-[#ab9cba] text-xs">{details}</p>
          </div>
        )}

        {/* Close Button */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onClose}
          className="w-full px-6 py-3 bg-[#8d25f4] text-white font-bold rounded-lg hover:bg-[#7a1fd4] transition-colors"
        >
          OK
        </motion.button>
      </motion.div>
    </div>,
    document.body
  );
}
