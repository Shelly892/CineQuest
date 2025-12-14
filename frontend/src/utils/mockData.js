// ==================== Mock Movies Data ====================
export const mockMovies = {
  popular: {
    results: [
      {
        id: 1,
        title: "The Midnight Echo",
        overview:
          "A thrilling journey through time and space, where echoes of the past shape the future.",
        poster_path:
          "https://via.placeholder.com/240x360/667eea/ffffff?text=Movie+1",
        backdrop_path:
          "https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=1200",
        genre_ids: [28, 12, 878],
        vote_average: 8.5,
        release_date: "2024-01-15",
      },
      {
        id: 2,
        title: "Starlight Symphony",
        overview:
          "A touching drama about love, loss, and the music that connects us all.",
        poster_path:
          "https://via.placeholder.com/240x360/764ba2/ffffff?text=Movie+2",
        backdrop_path:
          "https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=1200",
        genre_ids: [18, 10749],
        vote_average: 9.2,
        release_date: "2024-02-20",
      },
      {
        id: 3,
        title: "Crimson Horizon",
        overview:
          "A psychological thriller that blurs the line between reality and imagination.",
        poster_path:
          "https://via.placeholder.com/240x360/f093fb/ffffff?text=Movie+3",
        backdrop_path:
          "https://images.unsplash.com/photo-1485846234645-a62644f84728?w=1200",
        genre_ids: [53, 9648],
        vote_average: 8.8,
        release_date: "2024-03-10",
      },
      {
        id: 4,
        title: "Whispers of the Past",
        overview:
          "A mystery that spans generations, revealing long-buried secrets.",
        poster_path:
          "https://via.placeholder.com/240x360/4facfe/ffffff?text=Movie+4",
        backdrop_path:
          "https://images.unsplash.com/photo-1440404653325-ab127d49abc1?w=1200",
        genre_ids: [9648, 53],
        vote_average: 7.9,
        release_date: "2024-04-05",
      },
      {
        id: 5,
        title: "Eternal Embers",
        overview:
          "A romantic tale of two souls destined to be together across lifetimes.",
        poster_path:
          "https://via.placeholder.com/240x360/00f2fe/ffffff?text=Movie+5",
        backdrop_path:
          "https://images.unsplash.com/photo-1518676590629-3dcbd9c5a5c9?w=1200",
        genre_ids: [10749, 14],
        vote_average: 8.1,
        release_date: "2024-05-14",
      },
    ],
    page: 1,
    total_pages: 100,
    total_results: 2000,
  },
};

// ==================== Mock Ratings Data ====================
export const mockRatings = {
  userRatings: [
    {
      id: 1,
      movieId: 1,
      movieTitle: "The Midnight Echo",
      rating: 9,
      createdAt: "2024-12-01",
    },
    {
      id: 2,
      movieId: 2,
      movieTitle: "Starlight Symphony",
      rating: 10,
      createdAt: "2024-12-05",
    },
    {
      id: 3,
      movieId: 3,
      movieTitle: "Crimson Horizon",
      rating: 8,
      createdAt: "2024-12-08",
    },
  ],
};

// ==================== Mock Achievements Data ====================
export const mockAchievements = {
  userAchievements: [
    {
      id: 1,
      name: "Sign Novice",
      description: "Signed in 1 day",
      icon: "🌟",
      level: "Bronze",
      earnedAt: "2024-12-01T10:00:00Z",
    },
    {
      id: 2,
      name: "Commentator",
      description: "Posted 1 rating",
      icon: "💬",
      level: "Bronze",
      earnedAt: "2024-12-05T15:30:00Z",
    },
    {
      id: 3,
      name: "Sign Regular",
      description: "Signed in 10 days",
      icon: "⭐",
      level: "Silver",
      earnedAt: "2024-12-10T09:00:00Z",
    },
  ],
  allAchievements: [
    {
      id: 1,
      name: "Sign Novice",
      description: "Sign in 1 day",
      icon: "🌟",
      level: "Bronze",
    },
    {
      id: 2,
      name: "Sign Regular",
      description: "Sign in 10 days",
      icon: "⭐",
      level: "Silver",
    },
    {
      id: 3,
      name: "Sign Master",
      description: "Sign in 50 days",
      icon: "🏆",
      level: "Gold",
    },
    {
      id: 4,
      name: "Sign God",
      description: "Sign in 100 days",
      icon: "👑",
      level: "Platinum",
    },
    {
      id: 5,
      name: "Commentator",
      description: "Post 1 rating",
      icon: "💬",
      level: "Bronze",
    },
    {
      id: 6,
      name: "Critic",
      description: "Post 10 ratings",
      icon: "📝",
      level: "Silver",
    },
    {
      id: 7,
      name: "Opinion Leader",
      description: "Post 50 ratings",
      icon: "🎯",
      level: "Gold",
    },
  ],
};

// ==================== Mock Sign-in Data ====================
export const mockSignHistory = {
  signHistory: [
    { id: 1, signDate: "2024-12-14", consecutiveDays: 5 },
    { id: 2, signDate: "2024-12-13", consecutiveDays: 4 },
    { id: 3, signDate: "2024-12-12", consecutiveDays: 3 },
    { id: 4, signDate: "2024-12-11", consecutiveDays: 2 },
    { id: 5, signDate: "2024-12-10", consecutiveDays: 1 },
  ],
  totalDays: 15,
  consecutiveDays: 5,
  todaySigned: true,
};

// ==================== Mock User Data ====================
export const mockUser = {
  id: "user-123",
  username: "demo_user",
  email: "demo@cinequest.com",
  name: "Demo User",
  avatar: "https://via.placeholder.com/100",
};
