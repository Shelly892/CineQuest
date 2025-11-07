import { useState } from "react";
import { useLogin } from "../hooks/useAuth";
import Button from "../components/common/Button";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const { mutate: login, isLoading } = useLogin();

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    // Form validation
    if (!username || !password) {
      setError("Please enter your username and password.");
      return;
    }

    // Trigger login mutation
    login(
      { username, password },
      {
        onError: (err) => {
          setError(
            err.response?.data?.message ||
              "Login failed. Please check your username and password."
          );
        },
      }
    );
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-md">
        <div className="card">
          <div className="text-center mb-8">
            <div className="text-5xl mb-4">🎬</div>
            <h2 className="text-3xl font-bold text-gray-900">Sign in</h2>
            <p className="text-gray-600 mt-2">Welcome to CineQuest</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                {error}
              </div>
            )}

            <div>
              <label
                htmlFor="username"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Username
              </label>
              <input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="input"
                placeholder="Enter your username"
                disabled={isLoading}
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input"
                placeholder="Enter your password"
                disabled={isLoading}
              />
            </div>

            <Button
              type="submit"
              variant="primary"
              className="w-full"
              loading={isLoading}
            >
              Sign in
            </Button>
          </form>

          <div className="mt-6 text-center text-sm text-gray-600">
            <p>Demo account: demo / password123</p>
          </div>
        </div>
      </div>
    </div>
  );
}
