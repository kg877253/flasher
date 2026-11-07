import { Link } from "react-router-dom";
import useAuth from "../hooks/useAuth.js";

export default function Navbar() {
  const { user, loading, logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  return (
    <header className="sticky top-0 z-10 flex items-center justify-between gap-4 border-b border-gray-800 bg-black px-4 py-3">
      <Link to="/" className="shrink-0 text-2xl font-bold tracking-tight text-purple-400">
        Flasher
      </Link>

      <form role="search" className="w-full max-w-xl">
        <input
          type="text"
          placeholder="Search"
          className="w-full rounded-full border border-gray-700 bg-white/5 px-4 py-2 outline-none placeholder:text-gray-500 focus:border-purple-400"
        />
      </form>

      <div className="shrink-0">
        {loading ? (
          <div className="h-9 w-24" />
        ) : user ? (
          <div className="flex items-center gap-3">
            <span className="hidden text-sm text-gray-300 sm:block">{user.username}</span>
            <img
              src={user.avatar}
              alt={user.username}
              className="h-9 w-9 rounded-full bg-gray-700 object-cover"
            />
            <button
              onClick={handleLogout}
              className="cursor-pointer rounded-full bg-white/10 px-4 py-1.5 text-sm font-medium hover:bg-white/20"
            >
              Logout
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-3">
            <Link to="/login" className="text-sm hover:underline">
              Login
            </Link>
            <Link
              to="/register"
              className="rounded-full bg-purple-500 px-4 py-1.5 text-sm font-medium hover:bg-purple-600"
            >
              Sign Up
            </Link>
          </div>
        )}
      </div>
    </header>
  );
}