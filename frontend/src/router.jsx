import { createBrowserRouter, Navigate } from "react-router-dom";
import Layout from "./components/layout/Layout";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Movies from "./pages/Movies";
import MovieDetail from "./pages/MovieDetail";
import Ratings from "./pages/Ratings";
import SignIn from "./pages/SignIn";
import Achievements from "./pages/Achievements";

// ==================== Protected Route Component ====================
// Will be wrapped with Keycloak check in the component itself
const ProtectedRoute = ({ children }) => {
  // Keycloak authentication check is handled by useKeycloak hook in each component
  return children;
};

// ==================== Router Configuration ====================
export const router = createBrowserRouter([
  // Primary layout route (includes header and footer)
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        index: true, // Default route: /
        element: <Home />,
      },
      {
        path: "movies",
        element: <Movies />,
      },
      {
        path: "movies/:id",
        element: <MovieDetail />,
      },
      {
        path: "ratings",
        element: (
          <ProtectedRoute>
            <Ratings />
          </ProtectedRoute>
        ),
      },
      {
        path: "sign-in",
        element: (
          <ProtectedRoute>
            <SignIn />
          </ProtectedRoute>
        ),
      },
      {
        path: "achievements",
        element: (
          <ProtectedRoute>
            <Achievements />
          </ProtectedRoute>
        ),
      },
    ],
  },

  // Login page (standalone, no layout)
  {
    path: "/login",
    element: <Login />,
  },

  // Catch-all redirect
  {
    path: "*",
    element: <Navigate to="/" replace />,
  },
]);
