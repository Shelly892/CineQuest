import { useEffect } from "react";
import { useKeycloak } from "@react-keycloak/web";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useUserAchievements } from "../hooks/useAchievements";
import FadeIn from "../components/common/FadeIn";
import StaggerContainer, {
  StaggerItem,
} from "../components/common/StaggerContainer";

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

export default function Achievements() {
  const { keycloak } = useKeycloak();
  const navigate = useNavigate();

  const userId = keycloak.tokenParsed?.sub;
  const { data: achievements, isLoading } = useUserAchievements(userId);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!keycloak.authenticated) {
      navigate("/login");
    }
  }, [keycloak.authenticated, navigate]);

  if (!keycloak.authenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-[#141118] py-10 px-4 md:px-40">
      <div className="max-w-[1200px] mx-auto">
        {/* Header */}
        <FadeIn>
          <h1 className="text-white text-4xl font-bold mb-2">Achievements</h1>
          <p className="text-[#ab9cba] mb-8">
            You have unlocked {achievements?.userAchievements?.length || 0} of{" "}
            {achievements?.allAchievements?.length || 0} achievements
          </p>
        </FadeIn>

        {/* Loading State */}
        {isLoading && (
          <div className="flex justify-center items-center py-20">
            <div className="w-16 h-16 border-4 border-[#8d25f4] border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}

        {!isLoading && achievements && (
          <>
            {/* Unlocked Achievements */}
            {achievements.userAchievements &&
              achievements.userAchievements.length > 0 && (
                <div className="mb-12">
                  <FadeIn delay={0.2}>
                    <h2 className="text-white text-2xl font-bold mb-6 flex items-center gap-2">
                      <span>🏆</span>
                      <span>Unlocked Achievements</span>
                    </h2>
                  </FadeIn>
                  <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {achievements.userAchievements.map((achievement) => (
                      <StaggerItem key={achievement.id}>
                        <motion.div
                          whileHover={{ scale: 1.05, y: -5 }}
                          className={`bg-gradient-to-br ${
                            LEVEL_COLORS[achievement.level] ||
                            LEVEL_COLORS.Bronze
                          } rounded-lg p-6 text-center shadow-lg`}
                        >
                          <div className="text-6xl mb-3">
                            {achievement.icon || LEVEL_ICONS[achievement.level]}
                          </div>
                          <h3 className="text-white text-xl font-bold mb-2">
                            {achievement.name}
                          </h3>
                          <p className="text-white/80 text-sm mb-3">
                            {achievement.description}
                          </p>
                          <div className="flex items-center justify-center gap-2">
                            <span className="px-3 py-1 bg-white/20 rounded-full text-white text-xs font-bold">
                              {achievement.level}
                            </span>
                            <span className="text-white/60 text-xs">
                              {new Date(
                                achievement.earnedAt
                              ).toLocaleDateString()}
                            </span>
                          </div>
                        </motion.div>
                      </StaggerItem>
                    ))}
                  </StaggerContainer>
                </div>
              )}

            {/* All Achievements (Locked + Unlocked) */}
            {achievements.allAchievements &&
              achievements.allAchievements.length > 0 && (
                <div>
                  <FadeIn delay={0.4}>
                    <h2 className="text-white text-2xl font-bold mb-6 flex items-center gap-2">
                      <span>🎯</span>
                      <span>All Achievements</span>
                    </h2>
                  </FadeIn>
                  <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {achievements.allAchievements.map((achievement) => {
                      const isUnlocked = achievements.userAchievements?.some(
                        (ua) => ua.name === achievement.name
                      );

                      return (
                        <StaggerItem key={achievement.id}>
                          <motion.div
                            whileHover={
                              isUnlocked ? { scale: 1.05, y: -5 } : {}
                            }
                            className={`rounded-lg p-6 text-center border-2 ${
                              isUnlocked
                                ? `bg-gradient-to-br ${
                                    LEVEL_COLORS[achievement.level] ||
                                    LEVEL_COLORS.Bronze
                                  } border-transparent`
                                : "bg-[#211b27] border-[#473b54] opacity-60"
                            }`}
                          >
                            <div
                              className={`text-6xl mb-3 ${
                                isUnlocked ? "" : "grayscale"
                              }`}
                            >
                              {achievement.icon ||
                                LEVEL_ICONS[achievement.level]}
                            </div>
                            <h3
                              className={`text-xl font-bold mb-2 ${
                                isUnlocked ? "text-white" : "text-[#ab9cba]"
                              }`}
                            >
                              {achievement.name}
                            </h3>
                            <p
                              className={`text-sm mb-3 ${
                                isUnlocked ? "text-white/80" : "text-[#ab9cba]"
                              }`}
                            >
                              {achievement.description}
                            </p>
                            <div className="flex items-center justify-center gap-2">
                              <span
                                className={`px-3 py-1 rounded-full text-xs font-bold ${
                                  isUnlocked
                                    ? "bg-white/20 text-white"
                                    : "bg-[#473b54] text-[#ab9cba]"
                                }`}
                              >
                                {achievement.level}
                              </span>
                              {!isUnlocked && (
                                <span className="text-[#ab9cba] text-xs">
                                  🔒 Locked
                                </span>
                              )}
                            </div>
                          </motion.div>
                        </StaggerItem>
                      );
                    })}
                  </StaggerContainer>
                </div>
              )}

            {/* Empty State */}
            {(!achievements.userAchievements ||
              achievements.userAchievements.length === 0) &&
              (!achievements.allAchievements ||
                achievements.allAchievements.length === 0) && (
                <FadeIn delay={0.2}>
                  <div className="text-center py-20">
                    <div className="text-6xl mb-4">🏆</div>
                    <p className="text-[#ab9cba] text-lg mb-6">
                      No achievements yet. Start using the app to unlock
                      achievements!
                    </p>
                    <div className="flex gap-4 justify-center">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => navigate("/sign-in")}
                        className="px-6 py-3 bg-[#8d25f4] text-white font-bold rounded-lg hover:bg-[#7a1fd4] transition-colors"
                      >
                        Daily Check-in
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => navigate("/movies")}
                        className="px-6 py-3 bg-[#211b27] text-white font-bold rounded-lg hover:bg-[#302839] transition-colors border border-[#473b54]"
                      >
                        Rate Movies
                      </motion.button>
                    </div>
                  </div>
                </FadeIn>
              )}
          </>
        )}
      </div>
    </div>
  );
}
