import { useEffect } from "react";
import { useKeycloak } from "@react-keycloak/web";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useCheckIn, useSignHistory } from "../hooks/useSign";
import FadeIn from "../components/common/FadeIn";

export default function SignIn() {
  const { keycloak } = useKeycloak();
  const navigate = useNavigate();

  const userId = keycloak.tokenParsed?.sub;
  const { data: signData, isLoading } = useSignHistory(userId);
  const { mutate: checkIn, isLoading: checkingIn } = useCheckIn();

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!keycloak.authenticated) {
      navigate("/login");
    }
  }, [keycloak.authenticated, navigate]);

  if (!keycloak.authenticated) {
    return null;
  }

  const handleCheckIn = () => {
    checkIn({ userId });
  };

  const todayDate = new Date().toISOString().split("T")[0];
  const hasSignedToday = signData?.todaySigned || false;

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

        {!isLoading && signData && (
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
                    {signData.consecutiveDays || 0}
                  </p>
                  <p className="text-[#ab9cba] text-sm mt-1">days</p>
                </div>
                <div className="bg-[#211b27] border border-[#473b54] rounded-lg p-6 text-center">
                  <div className="text-4xl mb-2">📊</div>
                  <p className="text-[#ab9cba] text-sm mb-1">Total Check-ins</p>
                  <p className="text-white text-4xl font-bold">
                    {signData.totalDays || 0}
                  </p>
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
                {signData.signHistory && signData.signHistory.length > 0 ? (
                  <div className="space-y-2">
                    {signData.signHistory.slice(0, 7).map((sign) => (
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
    </div>
  );
}
