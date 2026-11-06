import { Navigate, Outlet, useLocation } from "react-router-dom";
import useAuth from "../hooks/useAuth";

export default function ProtectedRoute() {
  const { user, loading } = useAuth();
  const location = useLocation();

  // Wait for the current-user check before deciding anything
  if (loading) {
    return <p className="p-4 text-gray-400">Loading...</p>;
  }

  // Not logged in: go to login and remember where the user wanted to go
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <Outlet />;
}