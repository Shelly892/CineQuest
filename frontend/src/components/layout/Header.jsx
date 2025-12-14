import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useKeycloak } from "@react-keycloak/web";

export default function Header() {
  const { keycloak } = useKeycloak();

  const handleLogout = () => {
    keycloak.logout();
  };

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
          {[
            { name: "Home", path: "/" },
            { name: "Movies", path: "/movies" },
            { name: "My Ratings", path: "/ratings" },
            { name: "Sign In", path: "/sign-in" },
            { name: "Achievements", path: "/achievements" },
          ].map((item, index) => (
            <motion.div
              key={item.name}
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + index * 0.1, duration: 0.5 }}
            >
              <Link
                to={item.path}
                className="text-white text-sm font-medium leading-normal hover:text-[#8d25f4] transition-colors relative group"
              >
                {item.name}
                <motion.span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#8d25f4] group-hover:w-full transition-all duration-300" />
              </Link>
            </motion.div>
          ))}
        </nav>
      </div>

      {/* Right: User Info + Logout */}
      <div className="flex items-center gap-4">
        {keycloak.authenticated && (
          <>
            {/* User Info */}
            <div className="text-right">
              <p className="text-white text-sm font-medium">
                {keycloak.tokenParsed?.preferred_username || "User"}
              </p>
              <p className="text-[#ab9cba] text-xs">
                {keycloak.tokenParsed?.email || ""}
              </p>
            </div>

            {/* User Avatar */}
            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.6, duration: 0.5 }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="bg-gradient-to-br from-[#8d25f4] to-[#667eea] rounded-full w-10 h-10 flex items-center justify-center cursor-pointer ring-2 ring-transparent hover:ring-[#8d25f4] transition-all duration-300"
            >
              <span className="text-white font-bold text-lg">
                {(keycloak.tokenParsed?.preferred_username ||
                  "U")[0].toUpperCase()}
              </span>
            </motion.div>

            {/* Logout Button */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleLogout}
              className="text-white hover:text-[#8d25f4] transition-colors"
              title="Logout"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                fill="currentColor"
                viewBox="0 0 256 256"
              >
                <path d="M112,216a8,8,0,0,1-8,8H48a16,16,0,0,1-16-16V48A16,16,0,0,1,48,32h56a8,8,0,0,1,0,16H48V208h56A8,8,0,0,1,112,216Zm109.66-93.66-40-40a8,8,0,0,0-11.32,11.32L196.69,120H104a8,8,0,0,0,0,16h92.69l-26.35,26.34a8,8,0,0,0,11.32,11.32l40-40A8,8,0,0,0,221.66,122.34Z" />
              </svg>
            </motion.button>
          </>
        )}
      </div>
    </motion.header>
  );
}
