import { useEffect } from "react";
import { useKeycloak } from "@react-keycloak/web";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useUserAchievements } from "../hooks/useAchievements";
import FadeIn from "../components/common/FadeIn";
import StaggerContainer, {
  StaggerItem,
} from "../components/common/StaggerContainer";

// ✅ Badge 配置
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

// ✅ Badge 类型图标
const TYPE_ICONS = {
  SIGN: "📅",
  RATING: "⭐",
};

// ✅ 所有可能的成就（用于显示未解锁）
const ALL_ACHIEVEMENTS = {
  SIGN: [
    {
      name: "Sign Novice",
      level: "Bronze",
      count: 1,
      description: "Signed in 1 day",
    },
    {
      name: "Sign Regular",
      level: "Silver",
      count: 10,
      description: "Signed in 10 days",
    },
    {
      name: "Sign Master",
      level: "Gold",
      count: 50,
      description: "Signed in 50 days",
    },
    {
      name: "Sign God",
      level: "Platinum",
      count: 100,
      description: "Signed in 100 days",
    },
  ],
  RATING: [
    {
      name: "Commentator",
      level: "Bronze",
      count: 1,
      description: "Posted 1 rating",
    },
    {
      name: "Critic",
      level: "Silver",
      count: 10,
      description: "Posted 10 ratings",
    },
    {
      name: "Opinion Leader",
      level: "Gold",
      count: 50,
      description: "Posted 50 ratings",
    },
  ],
};

export default function Achievements() {
  const { keycloak } = useKeycloak();
  const navigate = useNavigate();

  const userId = keycloak.tokenParsed?.sub;
  const { data: achievements, isLoading, error } = useUserAchievements(userId);

  useEffect(() => {
    if (!keycloak.authenticated) {
      navigate("/login");
    }
  }, [keycloak.authenticated, navigate]);

  if (!keycloak.authenticated) {
    return null;
  }

  // ✅ 分组 badges
  const unlockedBadges = achievements || [];
  const signBadges = unlockedBadges.filter((b) => b.badgeType === "SIGN");
  const ratingBadges = unlockedBadges.filter((b) => b.badgeType === "RATING");

  // ✅ 检查是否已解锁
  const isUnlocked = (badgeName) => {
    return unlockedBadges.some((b) => b.badgeName === badgeName);
  };

  // ✅ Badge 卡片组件
  const BadgeCard = ({ badge, unlocked, type }) => (
    <motion.div
      whileHover={unlocked ? { scale: 1.05, y: -5 } : {}}
      className={`rounded-lg p-6 text-center shadow-lg ${
        unlocked
          ? `bg-gradient-to-br ${LEVEL_COLORS[badge.badgeLevel || badge.level]}`
          : "bg-[#211b27] border-2 border-dashed border-[#473b54] opacity-60"
      }`}
    >
      <div className="text-6xl mb-3">
        {unlocked ? LEVEL_ICONS[badge.badgeLevel || badge.level] : "🔒"}
      </div>
      <h3
        className={`text-xl font-bold mb-2 ${
          unlocked ? "text-white" : "text-[#ab9cba]"
        }`}
      >
        {badge.badgeName || badge.name}
      </h3>
      <p
        className={`text-sm mb-3 ${
          unlocked ? "text-white/80" : "text-[#ab9cba]"
        }`}
      >
        {badge.description}
      </p>
      <div className="flex flex-col items-center gap-2">
        <div className="flex items-center gap-2">
          <span
            className={`px-3 py-1 rounded-full text-xs font-bold ${
              unlocked
                ? "bg-white/20 text-white"
                : "bg-[#473b54] text-[#ab9cba]"
            }`}
          >
            {badge.badgeLevel || badge.level}
          </span>
          <span
            className={`px-2 py-1 rounded-full text-xs flex items-center gap-1 ${
              unlocked
                ? "bg-white/10 text-white"
                : "bg-[#473b54] text-[#ab9cba]"
            }`}
          >
            {TYPE_ICONS[type]} {type}
          </span>
        </div>
        {unlocked && badge.earnedAt && (
          <span className="text-white/60 text-xs">
            Earned on{" "}
            {new Date(badge.earnedAt).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </span>
        )}
        {!unlocked && <span className="text-[#ab9cba] text-xs">🔒 Locked</span>}
      </div>
    </motion.div>
  );

  return (
    <div className="min-h-screen bg-[#141118] py-10 px-4 md:px-40">
      <div className="max-w-[1200px] mx-auto">
        {/* Header */}
        <FadeIn>
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-white text-4xl font-bold mb-2">
                Achievements
              </h1>
              <p className="text-[#ab9cba]">
                You have unlocked{" "}
                <span className="text-white font-bold">
                  {unlockedBadges.length}
                </span>{" "}
                out of{" "}
                <span className="text-white font-bold">
                  {ALL_ACHIEVEMENTS.SIGN.length +
                    ALL_ACHIEVEMENTS.RATING.length}
                </span>{" "}
                badges
              </p>
            </div>
            <div className="text-6xl">
              {unlockedBadges.length === 0 ? "🏆" : "🎖️"}
            </div>
          </div>
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
                Failed to load achievements
              </p>
              <p className="text-[#ab9cba] text-sm mb-6">
                {error.message || "Please try again later"}
              </p>
            </div>
          </FadeIn>
        )}

        {!isLoading && !error && (
          <>
            {/* Sign Badges Section */}
            <FadeIn delay={0.2}>
              <div className="mb-12">
                <div className="flex items-center gap-3 mb-6">
                  <span className="text-4xl">📅</span>
                  <div>
                    <h2 className="text-white text-2xl font-bold">
                      Daily Check-in Badges
                    </h2>
                    <p className="text-[#ab9cba] text-sm">
                      Unlocked {signBadges.length} /{" "}
                      {ALL_ACHIEVEMENTS.SIGN.length}
                    </p>
                  </div>
                </div>
                <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {ALL_ACHIEVEMENTS.SIGN.map((badge) => {
                    const unlockedBadge = unlockedBadges.find(
                      (b) => b.badgeName === badge.name
                    );
                    return (
                      <StaggerItem key={badge.name}>
                        <BadgeCard
                          badge={unlockedBadge || badge}
                          unlocked={!!unlockedBadge}
                          type="SIGN"
                        />
                      </StaggerItem>
                    );
                  })}
                </StaggerContainer>
              </div>
            </FadeIn>

            {/* Rating Badges Section */}
            <FadeIn delay={0.4}>
              <div className="mb-12">
                <div className="flex items-center gap-3 mb-6">
                  <span className="text-4xl">⭐</span>
                  <div>
                    <h2 className="text-white text-2xl font-bold">
                      Movie Rating Badges
                    </h2>
                    <p className="text-[#ab9cba] text-sm">
                      Unlocked {ratingBadges.length} /{" "}
                      {ALL_ACHIEVEMENTS.RATING.length}
                    </p>
                  </div>
                </div>
                <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {ALL_ACHIEVEMENTS.RATING.map((badge) => {
                    const unlockedBadge = unlockedBadges.find(
                      (b) => b.badgeName === badge.name
                    );
                    return (
                      <StaggerItem key={badge.name}>
                        <BadgeCard
                          badge={unlockedBadge || badge}
                          unlocked={!!unlockedBadge}
                          type="RATING"
                        />
                      </StaggerItem>
                    );
                  })}
                </StaggerContainer>
              </div>
            </FadeIn>

            {/* Call to Action */}
            {unlockedBadges.length === 0 && (
              <FadeIn delay={0.6}>
                <div className="text-center py-12 bg-[#211b27] border border-[#473b54] rounded-lg">
                  <div className="text-6xl mb-4">🚀</div>
                  <h3 className="text-white text-2xl font-bold mb-3">
                    Start Your Journey!
                  </h3>
                  <p className="text-[#ab9cba] mb-6">
                    Check in daily and rate movies to unlock amazing badges
                  </p>
                  <div className="flex gap-4 justify-center">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => navigate("/sign-in")}
                      className="px-6 py-3 bg-[#8d25f4] text-white font-bold rounded-lg hover:bg-[#7a1fd4] transition-colors"
                    >
                      📅 Daily Check-in
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => navigate("/movies")}
                      className="px-6 py-3 bg-[#211b27] text-white font-bold rounded-lg hover:bg-[#302839] transition-colors border border-[#473b54]"
                    >
                      ⭐ Rate Movies
                    </motion.button>
                  </div>
                </div>
              </FadeIn>
            )}

            {/* Progress Hint */}
            {unlockedBadges.length > 0 && unlockedBadges.length < 7 && (
              <FadeIn delay={0.6}>
                <div className="bg-gradient-to-r from-[#8d25f4] to-[#667eea] rounded-lg p-6 text-center">
                  <h3 className="text-white text-xl font-bold mb-2">
                    Keep Going!
                  </h3>
                  <p className="text-white/80">
                    You're on your way to collecting all badges. Stay
                    consistent!
                  </p>
                </div>
              </FadeIn>
            )}
          </>
        )}
      </div>
    </div>
  );
}
