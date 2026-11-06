import { useEffect, useState } from "react";
import api from "../api/axios";
import { AuthContext } from "./context";

export default function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // On app load, ask the server who the logged-in user is
  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const res = await api.get("/users/current-user");
        setUser(res.data.data);
      } catch {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    fetchCurrentUser();
  }, []);

  const login = async (credentials) => {
    const res = await api.post("/users/login", credentials);
    setUser(res.data.data.user);
  };

  const logout = async () => {
    await api.post("/users/logout");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}