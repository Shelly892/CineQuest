import { createBrowserRouter, Navigate } from "react-router-dom";
import Layout from "./components/layout/Layout";
import Home from "./pages/Home";
import Login from "./pages/Login";
import { authApi } from "./api";

// ==================== Protected routes ====================
// Require authentication before rendering
const ProtectedRoute = ({ children }) => {
  const isAuthenticated = authApi.isAuthenticated();

  if (!isAuthenticated) {
    // Redirect unauthenticated users to the login screen
    return <Navigate to="/login" replace />;
  }

  return children;
};

// ==================== Public routes ====================
// Redirect authenticated users back to the home page
const PublicRoute = ({ children }) => {
  const isAuthenticated = authApi.isAuthenticated();

  if (isAuthenticated) {
    // Already signed in; send the user home
    return <Navigate to="/" replace />;
  }

  return children;
};

// ==================== Router configuration ====================
export const router = createBrowserRouter([
  // Primary layout route (includes header and footer)
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        index: true, // Default route: /
        element: (
          <ProtectedRoute>
            <Home />
          </ProtectedRoute>
        ),
      },
      // Additional routes can be added here
      // {
      //   path: 'movies',
      //   element: (
      //     <ProtectedRoute>
      //       <Movies />
      //     </ProtectedRoute>
      //   ),
      // },
      // {
      //   path: 'movies/:id',
      //   element: (
      //     <ProtectedRoute>
      //       <MovieDetail />
      //     </ProtectedRoute>
      //   ),
      // },
    ],
  },

  // Login page (standalone, no layout)
  {
    path: "/login",
    element: (
      <PublicRoute>
        <Login />
      </PublicRoute>
    ),
  },

  // 404 page (optional, add later)
  // {
  //   path: '*',
  //   element: <NotFound />,
  // },
]);
