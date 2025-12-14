import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { ReactKeycloakProvider } from "@react-keycloak/web";
import "./index.css";
import App from "./App.jsx";
import keycloak, { keycloakInitOptions } from "./config/keycloak.js";

// Loading component while Keycloak initializes
const LoadingComponent = () => (
  <div className="min-h-screen bg-[#141118] flex items-center justify-center">
    <div className="text-center">
      <div className="w-16 h-16 border-4 border-[#8d25f4] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
      <p className="text-white text-lg">Loading CineQuest...</p>
    </div>
  </div>
);

// Wrap provider to handle initialization errors gracefully
const AppWithKeycloak = () => {
  return (
    <ReactKeycloakProvider
      authClient={keycloak}
      initOptions={keycloakInitOptions}
      LoadingComponent={<LoadingComponent />}
      onEvent={(event, error) => {
        // Ignore known non-critical errors
        if (event === "onInitError") {
          const errorMsg = error?.message || "";
          // Ignore "initialized once" error (happens in React StrictMode development)
          if (errorMsg.includes("initialized once")) {
            return; // Silently ignore
          }
          // Ignore iframe timeout errors (expected when iframe is disabled)
          if (errorMsg.includes("iframe") || errorMsg.includes("Timeout")) {
            return; // Silently ignore
          }
          // Handle CORS errors with helpful message
          if (
            errorMsg.includes("CORS") ||
            errorMsg.includes("Failed to fetch")
          ) {
            console.error(
              "[Keycloak CORS Error]",
              "Backend CORS configuration issue detected.",
              "The API Gateway and Keycloak may both be adding CORS headers.",
              "Please check backend CORS configuration.",
              error
            );
            return;
          }
        }
        // Log other events for debugging (only in development)
        if (import.meta.env.DEV && event !== "onInitError") {
          console.log("[Keycloak Event]", event, error || "");
        }
        // Log actual errors
        if (error && event === "onInitError") {
          console.error("[Keycloak Init Error]", error);
        }
      }}
      onTokens={(tokens) => {
        console.log("[Keycloak Tokens]", tokens);
      }}
    >
      <App />
    </ReactKeycloakProvider>
  );
};

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AppWithKeycloak />
  </StrictMode>
);
