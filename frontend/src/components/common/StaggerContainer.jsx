import { motion } from "framer-motion";

export default function StaggerContainer({ children, className = "" }) {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1, // 每个子元素延迟 0.1s
      },
    },
  };

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function StaggerItem({ children, className = "" }) {
  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  };

  return (
    <motion.div variants={item} className={className}>
      {children}
    </motion.div>
  );
}
