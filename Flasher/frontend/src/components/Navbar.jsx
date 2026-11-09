import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import SpecularButton from "./SpecularButton";
import useAuth from "../hooks/useAuth.js";
import Logo from "./Logo";
import Dropdown, { DropdownItem, DropdownSeparator } from "./Dropdown";
import { ChevronDownIcon, LogoutIcon, SettingsIcon, UserIcon } from "./Icons";

export default function Navbar() {
  const { user, loading, logout } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [searchText, setSearchText] = useState(searchParams.get("query") || "");

  const handleSearch = (e) => {
    e.preventDefault();
    const text = searchText.trim();
    // encodeURIComponent keeps spaces and special characters safe in the URL
    navigate(text ? `/?query=${encodeURIComponent(text)}` : "/");
  };

  const handleLogout = async () => {
    try {
      await logout();
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  return (
    <header className="sticky top-0 z-10 flex items-center justify-between gap-4 border-b border-gray-800 bg-black px-4 py-3">
      <Logo />

      <form role="search" onSubmit={handleSearch} className="w-full max-w-xl">
        <input
          type="text"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          placeholder="Search"
          className="w-full rounded-full border border-gray-700 bg-white/5 px-4 py-2 outline-none placeholder:text-gray-500 focus:border-purple-400"
        />
      </form>

      <div className="shrink-0">
        {loading ? (
          <div className="h-9 w-24" />
        ) : user ? (
          <Dropdown
            label="Open user menu"
            trigger={
              <>
                <img
                  src={user.avatar}
                  alt={user.username}
                  className="h-9 w-9 rounded-full bg-gray-700 object-cover"
                />
                <span className="hidden max-w-32 truncate text-sm font-medium sm:block">
                  {user.fullname}
                </span>
                <ChevronDownIcon
                  size={16}
                  className="text-gray-400 transition-transform group-aria-expanded:rotate-180"
                />
              </>
            }
          >
            <div className="px-2 py-2">
              <p className="truncate text-sm font-medium">{user.fullname}</p>
              <p className="truncate text-xs text-gray-400">@{user.username}</p>
            </div>
            <DropdownSeparator />
            <DropdownItem to={`/users/channel/${user.username}`} icon={UserIcon}>
              My channel
            </DropdownItem>
            <DropdownItem to="/settings" icon={SettingsIcon}>
              Settings
            </DropdownItem>
            <DropdownSeparator />
            <DropdownItem icon={LogoutIcon} danger onClick={handleLogout}>
              Log out
            </DropdownItem>
          </Dropdown>
        ) :  (
        <div className="flex items-center gap-2">
          {/* Login: glass button */}
          <SpecularButton
            size="sm"
            radius={999}
            lineColor="#ffffff"
            baseColor="#737373"
            followMouse
            proximity={250}
            onClick={() => navigate("/login")}
          >
            Login
          </SpecularButton>

          {/* Sign Up: purple button */}
          <SpecularButton
            size="sm"
            radius={999}
            tint="#a855f7"
            tintOpacity={0.85}
            baseColor="#d8b4fe"
            lineColor="#ffffff"
            idleIntensity={0.45}
            shineSize={12}
            followMouse
            proximity={250}
            onClick={() => navigate("/register")}
          >
            Sign Up
          </SpecularButton>
        </div>
        )}
      </div>
    </header>
  );
}