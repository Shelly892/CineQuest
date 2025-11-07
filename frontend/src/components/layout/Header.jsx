import { Link } from "react-router-dom";
import { useAuth, useLogout } from "../../hooks/useAuth";

export default function Header() {
  const { user, isAuthenticated } = useAuth();
  const { mutate: logout } = useLogout();

  const handleLogout = () => {
    if (window.confirm("Are you sure you want to sign out?")) {
      logout();
    }
  };

  return (
    <header className="bg-white shadow-sm">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="text-2xl">🎬</div>
            <span className="text-xl font-bold text-primary-600">
              CineQuest
            </span>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link
              to="/"
              className="text-gray-700 hover:text-primary-600 transition-colors"
            >
              Home
            </Link>
            <Link
              to="/movies"
              className="text-gray-700 hover:text-primary-600 transition-colors"
            >
              Movies
            </Link>
          </nav>

          {/* User Menu */}
          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <>
                <span className="text-gray-700">
                  Welcome, {user?.username || "Guest"}
                </span>
                <button
                  onClick={handleLogout}
                  className="btn btn-secondary text-sm"
                >
                  Sign out
                </button>
              </>
            ) : (
              <Link to="/login" className="btn btn-primary text-sm">
                Sign in
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
