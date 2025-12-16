import { Toaster } from "react-hot-toast";

/**
 * Toast Provider Component
 * Provides consistent toast notifications across the app
 */
export default function ToastProvider() {
  return (
    <Toaster
      position="top-center"
      toastOptions={{
        duration: 2000,
        style: {
          background: "#211b27",
          color: "#fff",
          border: "1px solid #473b54",
        },
        success: {
          iconTheme: {
            primary: "#8d25f4",
            secondary: "#fff",
          },
        },
        error: {
          iconTheme: {
            primary: "#ef4444",
            secondary: "#fff",
          },
        },
      }}
    />
  );
}
