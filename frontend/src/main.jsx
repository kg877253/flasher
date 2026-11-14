import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { Toaster } from "sonner";
import "./index.css";
import App from "./App.jsx";
import AuthProvider from "./context/AuthProvider.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
      <AuthProvider>
        <App />
      </AuthProvider>
      <Toaster
        theme="dark"
        position="bottom-center"
        closeButton
        toastOptions={{
          duration: 3500,
          style: {
            background: "#1c1c1c",
            border: "1px solid rgba(255,255,255,0.1)",
            color: "#f3f4f6",
            fontFamily: "inherit",
          },
        }}
      />
    </GoogleOAuthProvider>
  </StrictMode>,
);