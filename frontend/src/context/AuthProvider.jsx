import { useEffect, useState } from "react";
import { refreshSession } from "../api/axios";
import { getCurrentUser, loginUser, logoutUser } from "../api/user.api";
import { AuthContext } from "./context";

export default function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // On app load, ask the server who the logged-in user is
  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        setUser(await getCurrentUser());
      } catch {
        try {
          await refreshSession();
          setUser(await getCurrentUser());
        } catch {
          setUser(null);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchCurrentUser();
  }, []);

  useEffect(() => {
    const handleExpiredSession = () => {
      setUser(null);

      if (!["/login", "/register"].includes(window.location.pathname)) {
        window.location.assign("/login");
      }
    };

    window.addEventListener("auth:expired", handleExpiredSession);
    return () => window.removeEventListener("auth:expired", handleExpiredSession);
  }, []);

  const login = async (credentials) => {
    const data = await loginUser(credentials);
    setUser(data.user);
  };

  const logout = async () => {
    await logoutUser();
    setUser(null);
  };

  const updateUser = (updatedUser) => {
    setUser(updatedUser);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
}