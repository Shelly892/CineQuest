import { useKeycloak } from "@react-keycloak/web";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useLogin } from "../hooks/useAuth";

export default function Login() {
  const { keycloak, initialized } = useKeycloak();
  const navigate = useNavigate();
  const handleLogin = useLogin();

  useEffect(() => {
    // If already authenticated, redirect to home
    if (initialized && keycloak.authenticated) {
      navigate("/");
    }
  }, [initialized, keycloak.authenticated, navigate]);

  if (!initialized) {
    return (
      <div className="min-h-screen bg-[#141118] flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-[#8d25f4] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#141118]">
      <div className="w-full max-w-md px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-[#211b27] rounded-lg p-8 shadow-2xl border border-[#473b54]"
        >
          {/* Logo */}
          <div className="text-center mb-8">
            <motion.div
              animate={{ rotate: [0, 5, -5, 0] }}
              transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
              className="w-16 h-16 mx-auto mb-4 text-[#8d25f4]"
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
            <h2 className="text-3xl font-bold text-white mb-2">
              Welcome to CineQuest
            </h2>
            <p className="text-[#ab9cba]">Your ultimate movie companion</p>
          </div>

          {/* Login Button - Redirects to Keycloak login page */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleLogin}
            className="w-full bg-[#8d25f4] hover:bg-[#7a1fd4] text-white font-bold py-4 px-6 rounded-lg transition-colors duration-300 flex items-center justify-center gap-3"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              fill="currentColor"
              viewBox="0 0 256 256"
            >
              <path d="M141.66,133.66l-40,40a8,8,0,0,1-11.32-11.32L116.69,136H24a8,8,0,0,1,0-16h92.69L90.34,93.66a8,8,0,0,1,11.32-11.32l40,40A8,8,0,0,1,141.66,133.66ZM192,32H136a8,8,0,0,0,0,16h56V208H136a8,8,0,0,0,0,16h56a16,16,0,0,0,16-16V48A16,16,0,0,0,192,32Z" />
            </svg>
            <span>登录 / 注册</span>
          </motion.button>

          {/* Info */}
          <div className="mt-6 text-center">
            <p className="text-sm text-[#ab9cba]">
              点击按钮跳转到 Keycloak 登录页面
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
