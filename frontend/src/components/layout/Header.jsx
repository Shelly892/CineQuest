import { Link } from "react-router-dom";
import { motion } from "framer-motion";

export default function Header() {
  return (
    <motion.header
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
      className="flex items-center justify-between border-b border-[#302839] px-10 py-3 bg-[#141118] sticky top-0 z-50 backdrop-blur-sm bg-opacity-95"
    >
      {/* Left: Logo + Navigation */}
      <div className="flex items-center gap-8">
        {/* Logo */}
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Link to="/" className="flex items-center gap-4 text-white">
            <motion.div
              animate={{ rotate: [0, 5, -5, 0] }}
              transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
              className="w-4 h-4"
            >
              <svg
                viewBox="0 0 48 48"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M6 6H42L36 24L42 42H6L12 24L6 6Z"
                  fill="currentColor"
                />
              </svg>
            </motion.div>
            <h2 className="text-white text-lg font-bold leading-tight tracking-[-0.015em]">
              CineQuest
            </h2>
          </Link>
        </motion.div>

        {/* Navigation Links */}
        <nav className="flex items-center gap-9">
          {["Home", "Movies", "TV Shows", "My List"].map((item, index) => (
            <motion.div
              key={item}
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + index * 0.1, duration: 0.5 }}
            >
              <Link
                to={
                  item === "Home"
                    ? "/"
                    : `/${item.toLowerCase().replace(" ", "-")}`
                }
                className="text-white text-sm font-medium leading-normal hover:text-[#8d25f4] transition-colors relative group"
              >
                {item}
                <motion.span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#8d25f4] group-hover:w-full transition-all duration-300" />
              </Link>
            </motion.div>
          ))}
        </nav>
      </div>

      {/* Right: Search + User */}
      <div className="flex flex-1 justify-end gap-8 items-center">
        {/* Search Bar */}
        <motion.label
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="flex flex-col min-w-40 h-10 max-w-64"
        >
          <div className="flex w-full flex-1 items-stretch rounded-lg h-full">
            <div className="text-[#ab9cba] flex bg-[#302839] items-center justify-center pl-4 rounded-l-lg">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                fill="currentColor"
                viewBox="0 0 256 256"
              >
                <path d="M229.66,218.34l-50.07-50.06a88.11,88.11,0,1,0-11.31,11.31l50.06,50.07a8,8,0,0,0,11.32-11.32ZM40,112a72,72,0,1,1,72,72A72.08,72.08,0,0,1,40,112Z" />
              </svg>
            </div>
            <motion.input
              whileFocus={{ scale: 1.02 }}
              placeholder="Search"
              className="flex w-full min-w-0 flex-1 resize-none overflow-hidden text-white focus:outline-0 focus:ring-0 border-none bg-[#302839] h-full placeholder:text-[#ab9cba] px-4 rounded-r-lg text-base font-normal leading-normal transition-all duration-300"
            />
          </div>
        </motion.label>

        {/* User Avatar */}
        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.6, duration: 0.5 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="bg-center bg-no-repeat aspect-square bg-cover rounded-full w-10 h-10 cursor-pointer ring-2 ring-transparent hover:ring-[#8d25f4] transition-all duration-300"
          style={{
            backgroundImage: `url("https://via.placeholder.com/40")`,
          }}
        />
      </div>
    </motion.header>
  );
}
