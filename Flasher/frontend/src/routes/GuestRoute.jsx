import { Navigate, Outlet, useLocation } from "react-router-dom";
import useAuth from "../hooks/useAuth";

export default function GuestRoute() {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-black">
        <div className="flex w-full max-w-sm animate-pulse flex-col gap-4 rounded-lg border border-gray-700 p-6">
          <div className="h-7 w-2/3 rounded bg-gray-800" />
          <div className="h-11 rounded-md bg-gray-800" />
          <div className="h-11 rounded-md bg-gray-800" />
          <div className="h-10 rounded-md bg-gray-800" />
        </div>
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