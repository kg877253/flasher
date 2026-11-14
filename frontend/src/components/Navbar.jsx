import { useNavigate } from "react-router-dom";
import SpecularButton from "./SpecularButton";
import useAuth from "../hooks/useAuth.js";
import Logo from "./Logo";
import NavSearch from "./NavSearch";
import Dropdown, { DropdownItem, DropdownSeparator } from "./Dropdown";
import { ChevronDownIcon, LogoutIcon, MenuIcon, SettingsIcon, UserIcon } from "./Icons";
import { imgAvatar } from "../utils/image";
import { toast } from "sonner";

export default function Navbar({ onMenuClick }) {
  const { user, loading, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      toast.success("Logged out");
    } catch (err) {
      console.error("Logout failed:", err);
      toast.error("Could not log out. Please try again.");
    }
  };

  return (
    <header className="sticky top-0 z-20 flex items-center gap-2 border-b border-gray-800 bg-black/80 px-3 py-3 backdrop-blur-md sm:px-4 md:gap-4">
      <div className="flex shrink-0 items-center gap-1 sm:gap-2">
        <button
          type="button"
          onClick={onMenuClick}
          aria-label="Open navigation menu"
          className="rounded-lg p-2 text-gray-300 hover:bg-white/10 md:hidden"
        >
          <MenuIcon size={22} />
        </button>
        <Logo />
      </div>

      {/* Desktop: centered bar. Mobile: icon pushed to the right */}
      <div className="flex flex-1 justify-end md:justify-center">
        <NavSearch />
      </div>

      <div className="shrink-0">
        {loading ? (
          <div className="h-9 w-24" />
        ) : user ? (
          <Dropdown
            label="Open user menu"
            trigger={
              <>
                <img
                  src={imgAvatar(user.avatar)}
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
        ) : (
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