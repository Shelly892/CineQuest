import { useEffect, useState } from "react";
import { useKeycloak } from "@react-keycloak/web";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useCheckIn, useSignHistory } from "../hooks/useSign";
import FadeIn from "../components/common/FadeIn";
import ErrorModal from "../components/common/ErrorModal";

export default function SignIn() {
  const { keycloak } = useKeycloak();
  const navigate = useNavigate();

  const userId = keycloak.tokenParsed?.sub;
  const { data: signData, isLoading, error } = useSignHistory(userId);
  const { mutate: checkIn, isLoading: checkingIn } = useCheckIn();

  // State for error modal
  const [errorModal, setErrorModal] = useState({
    isOpen: false,
    title: "",
    message: "",
    details: "",
  });

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!keycloak.authenticated) {
      navigate("/login");
    }
  }, [keycloak.authenticated, navigate]);

  if (!keycloak.authenticated) {
    return null;
  }

  // Helper function to check if error is circuit breaker
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
            // Handle other errors
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
  // Handle empty data gracefully - treat as new user with no sign history
  const hasSignedToday = signData?.todaySigned || false;
  const consecutiveDays = signData?.consecutiveDays || 0;
  const totalDays = signData?.totalDays || 0;
  const signHistory = signData?.signHistory || [];

  return (
    <div className="min-h-screen bg-[#141118] py-10 px-4 md:px-40">
      <div className="max-w-[800px] mx-auto">
        {/* Header */}
        <FadeIn>
          <h1 className="text-white text-4xl font-bold mb-2">Daily Check-in</h1>
          <p className="text-[#ab9cba] mb-8">
            Check in daily to earn achievements and build your streak!
          </p>
        </FadeIn>

        {/* Loading State */}
        {isLoading && (
          <div className="flex justify-center items-center py-20">
            <div className="w-16 h-16 border-4 border-[#8d25f4] border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}

        {/* Error State */}
        {error && !isLoading && (
          <FadeIn delay={0.2}>
            <div className="text-center py-20">
              <div className="text-6xl mb-4">❌</div>
              <p className="text-red-400 text-lg mb-6">
                Failed to load sign-in data
              </p>
              <p className="text-[#ab9cba] text-sm mb-6">
                {error.message || "Please try again later"}
              </p>
            </div>
          </FadeIn>
        )}

        {/* Content - Show even if signData is empty (new user) */}
        {!isLoading && !error && (
          <>
            {/* Check-in Card */}
            <FadeIn delay={0.2}>
              <div className="bg-gradient-to-br from-[#8d25f4] to-[#667eea] rounded-lg p-8 mb-8 text-center">
                <div className="text-6xl mb-4">
                  {hasSignedToday ? "✅" : "📅"}
                </div>
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

            {/* Stats */}
            <FadeIn delay={0.3}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="bg-[#211b27] border border-[#473b54] rounded-lg p-6 text-center">
                  <div className="text-4xl mb-2">🔥</div>
                  <p className="text-[#ab9cba] text-sm mb-1">Current Streak</p>
                  <p className="text-white text-4xl font-bold">
                    {consecutiveDays}
                  </p>
                  <p className="text-[#ab9cba] text-sm mt-1">days</p>
                </div>
                <div className="bg-[#211b27] border border-[#473b54] rounded-lg p-6 text-center">
                  <div className="text-4xl mb-2">📊</div>
                  <p className="text-[#ab9cba] text-sm mb-1">Total Check-ins</p>
                  <p className="text-white text-4xl font-bold">{totalDays}</p>
                  <p className="text-[#ab9cba] text-sm mt-1">days</p>
                </div>
              </div>
            </FadeIn>

            {/* History */}
            <FadeIn delay={0.4}>
              <div className="bg-[#211b27] border border-[#473b54] rounded-lg p-6">
                <h2 className="text-white text-2xl font-bold mb-4">
                  Recent Check-ins
                </h2>
                {signHistory.length > 0 ? (
                  <div className="space-y-2">
                    {signHistory.slice(0, 7).map((sign) => (
                      <div
                        key={sign.id}
                        className="flex items-center justify-between py-3 px-4 bg-[#141118] rounded-lg"
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-2xl">
                            {sign.signDate === todayDate ? "✅" : "📅"}
                          </span>
                          <div>
                            <p className="text-white font-medium">
                              {new Date(sign.signDate).toLocaleDateString(
                                "en-US",
                                {
                                  weekday: "long",
                                  year: "numeric",
                                  month: "long",
                                  day: "numeric",
                                }
                              )}
                            </p>
                            {sign.signDate === todayDate && (
                              <p className="text-[#8d25f4] text-sm">Today</p>
                            )}
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-[#ab9cba] text-sm">Streak</p>
                          <p className="text-white font-bold">
                            {sign.consecutiveDays} days
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-[#ab9cba] text-center py-8">
                    No check-in history yet
                  </p>
                )}
              </div>
            </FadeIn>

            {/* Achievements Hint */}
            <FadeIn delay={0.5}>
              <div className="mt-8 bg-[#211b27] border border-[#473b54] rounded-lg p-6 text-center">
                <div className="text-4xl mb-2">🏆</div>
                <h3 className="text-white text-xl font-bold mb-2">
                  Keep Going!
                </h3>
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
          </>
        )}
      </div>

      {/* Error Modal */}
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
