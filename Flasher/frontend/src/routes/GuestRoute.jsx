import { Navigate, Outlet, useLocation } from "react-router-dom";
import useAuth from "../hooks/useAuth";

export default function GuestRoute() {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <p className="p-4 text-gray-400">Loading...</p>;
  }

  // Already logged in: go back to the page the user wanted, or Home
  if (user) {
    const from = location.state?.from?.pathname || "/";
    return <Navigate to={from} replace />;
  }

  return <Outlet />;
}