import { useEffect, useState } from "react";
import { useKeycloak } from "@react-keycloak/web";
import { useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { useCheckIn } from "../hooks/useSign";
import FadeIn from "../components/common/FadeIn";
import ErrorModal from "../components/common/ErrorModal";
import { STORAGE_KEYS } from "../config/constants";
import { useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "../config/queryClient";

export default function SignIn() {
  const { keycloak } = useKeycloak();
  const navigate = useNavigate();
  const location = useLocation();
  const queryClient = useQueryClient();

  const userId = keycloak.tokenParsed?.sub;
  const { mutate: checkIn, isLoading: checkingIn } = useCheckIn();

  const [signInResult, setSignInResult] = useState(null);
  const [errorModal, setErrorModal] = useState({
    isOpen: false,
    title: "",
    message: "",
    details: "",
  });

  useEffect(() => {
    if (userId) {
      const storedSignIn = localStorage.getItem(STORAGE_KEYS.SIGN_IN(userId));
      if (storedSignIn) {
        try {
          const parsed = JSON.parse(storedSignIn);
          const todayDate = new Date().toISOString().split("T")[0];
          if (parsed.signDate === todayDate) {
            setSignInResult(parsed);
          } else {
            localStorage.removeItem(STORAGE_KEYS.SIGN_IN(userId));
          }
        } catch (error) {
          console.error("[Failed to parse stored sign-in]", error);
          localStorage.removeItem(STORAGE_KEYS.SIGN_IN(userId));
        }
      }
    }
  }, [userId]);

  useEffect(() => {
    if (!keycloak.authenticated) {
      // Save current path and redirect to login
      navigate(`/login?from=${encodeURIComponent(location.pathname)}`);
    }
  }, [keycloak.authenticated, navigate, location.pathname]);

  if (!keycloak.authenticated) {
    return null;
  }

  const isCircuitBreakerError = (error) => {
    const responseData = error?.response?.data;
    return (
      error?.response?.status === 503 ||
      responseData?.status === "SERVICE_UNAVAILABLE" ||
      responseData?.error?.includes("Circuit breaker") ||
      responseData?.error?.includes("circuit breaker")
    );
  };

  const handleCheckIn = () => {
    checkIn(
      { userId },
      {
        onSuccess: (data) => {
          setSignInResult(data);
          if (userId) {
            localStorage.setItem(
              STORAGE_KEYS.SIGN_IN(userId),
              JSON.stringify(data)
            );
          }

          // Refresh achievements
          queryClient.invalidateQueries({
            queryKey: queryKeys.achievements.user(userId),
          });
        },
        onError: (error) => {
          if (isCircuitBreakerError(error)) {
            const responseData = error?.response?.data || {};
            setErrorModal({
              isOpen: true,
              title: "Service Temporarily Unavailable",
              message:
                responseData.message ||
                "The sign-in service is temporarily unavailable. Please try again later.",
              details:
                responseData.error ||
                "Circuit breaker is open or service timeout occurred",
            });
          } else {
            setErrorModal({
              isOpen: true,
              title: "Check-in Failed",
              message:
                error?.response?.data?.message ||
                error?.message ||
                "Failed to check in. Please try again.",
              details: error?.response?.data?.error || "",
            });
          }
        },
      }
    );
  };

  const todayDate = new Date().toISOString().split("T")[0];
  const hasSignedToday = signInResult?.signDate === todayDate;

  return (
    <div className="min-h-screen bg-[#141118] py-10 px-4 md:px-40">
      <div className="max-w-[800px] mx-auto">
        <FadeIn>
          <h1 className="text-white text-4xl font-bold mb-2">Daily Check-in</h1>
          <p className="text-[#ab9cba] mb-8">
            Check in daily to earn achievements and build your streak!
          </p>
        </FadeIn>

        <FadeIn delay={0.2}>
          <div className="bg-gradient-to-br from-[#8d25f4] to-[#667eea] rounded-lg p-8 mb-8 text-center">
            <div className="text-6xl mb-4">{hasSignedToday ? "✅" : "📅"}</div>
            <h2 className="text-white text-3xl font-bold mb-4">
              {hasSignedToday
                ? "You've checked in today!"
                : "Ready to check in?"}
            </h2>
            <p className="text-white/80 mb-6">
              {hasSignedToday
                ? "Come back tomorrow for your next check-in"
                : "Don't break your streak!"}
            </p>
            {!hasSignedToday && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleCheckIn}
                disabled={checkingIn}
                className="px-8 py-4 bg-white text-[#8d25f4] font-bold rounded-lg hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-lg"
              >
                {checkingIn ? "Checking in..." : "Check In Now"}
              </motion.button>
            )}
          </div>
        </FadeIn>

        {signInResult && (
          <FadeIn delay={0.3}>
            <div className="bg-[#211b27] border border-[#473b54] rounded-lg p-6 mb-8">
              <h2 className="text-white text-2xl font-bold mb-4">
                Check-in Information
              </h2>
              <div className="space-y-3">
                <div className="flex justify-between items-center py-2 border-b border-[#473b54]">
                  <span className="text-[#ab9cba]">Sign Date:</span>
                  <span className="text-white font-medium">
                    {new Date(signInResult.signDate).toLocaleDateString(
                      "en-US",
                      {
                        weekday: "long",
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      }
                    )}
                  </span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-[#473b54]">
                  <span className="text-[#ab9cba]">Total Sign Count:</span>
                  <span className="text-white font-bold text-xl">
                    {signInResult.totalSignCount}
                  </span>
                </div>
              </div>
            </div>
          </FadeIn>
        )}

        <FadeIn delay={0.4}>
          <div className="mt-8 bg-[#211b27] border border-[#473b54] rounded-lg p-6 text-center">
            <div className="text-4xl mb-2">🏆</div>
            <h3 className="text-white text-xl font-bold mb-2">Keep Going!</h3>
            <p className="text-[#ab9cba] mb-4">
              Check in regularly to unlock achievements
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate("/achievements")}
              className="px-6 py-3 bg-[#8d25f4] text-white font-bold rounded-lg hover:bg-[#7a1fd4] transition-colors"
            >
              View Achievements
            </motion.button>
          </div>
        </FadeIn>
      </div>

      <ErrorModal
        isOpen={errorModal.isOpen}
        onClose={() => setErrorModal({ ...errorModal, isOpen: false })}
        title={errorModal.title}
        message={errorModal.message}
        details={errorModal.details}
      />
    </div>
  );
}
