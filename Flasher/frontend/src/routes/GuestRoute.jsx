import { Navigate, Outlet, useLocation } from "react-router-dom";
import useAuth from "../hooks/useAuth";

export default function GuestRoute() {
  const { user, loading } = useAuth();
  const location = useLocation();

    if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-black">
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-white/15 border-t-purple-400" />
      </div>
    );
  }

  // Already logged in: go back to the page the user wanted, or Home
  if (user) {
    const from = location.state?.from?.pathname || "/";
    return <Navigate to={from} replace />;
  }

  return <Outlet />;
}