import { NavLink, useLocation } from "react-router-dom";
import {
  HomeIcon,
  LikeIcon,
  HistoryIcon,
  VideoIcon,
  FolderIcon,
  SubscribersIcon,
  SupportIcon,
  SettingsIcon,
  CloseIcon,
} from "./Icons";

const topLinks = [
  { label: "Home", to: "/", icon: HomeIcon },
  { label: "Liked Videos", to: "/liked", icon: LikeIcon },
  { label: "History", to: "/history", icon: HistoryIcon },
  { label: "My Content", to: "/my-content", icon: VideoIcon },
  { label: "Collection", to: "/collection", icon: FolderIcon },
  { label: "Subscribers", to: "/subscribers", icon: SubscribersIcon },
];

const bottomLinks = [
  { label: "Support", to: "/support", icon: SupportIcon },
  { label: "Settings", to: "/settings", icon: SettingsIcon },
];

export default function Sidebar({ mobileOpen, onMobileClose }) {
  const { pathname } = useLocation();

  // On the video page the sidebar shrinks to icons only
  const collapsed = pathname.startsWith("/videos/");

  const asideClass = `hidden shrink-0 flex-col justify-between overflow-y-auto border-r border-gray-800 p-2 md:flex ${collapsed ? "w-20" : "w-56"
    }`;
  const linkClass = ({ isActive }) =>
    `flex items-center gap-4 rounded-lg px-3 py-2.5 text-sm ${collapsed ? "justify-center" : ""
    } ${isActive ? "bg-white/15 font-semibold" : "hover:bg-white/10"}`;

  const renderLink = ({ label, to, icon: Icon }) => (
    <NavLink
      key={to}
      to={to}
      end={to === "/"}
      title={label}
      onClick={onMobileClose}
      className={linkClass}
    >
      <Icon size={22} />
      {!collapsed && <span>{label}</span>}
    </NavLink>
  );

  return (
    <>
      <aside className={asideClass}>
        <nav className="flex flex-col gap-1">{topLinks.map(renderLink)}</nav>
        <nav className="flex flex-col gap-1">{bottomLinks.map(renderLink)}</nav>
      </aside>

      {mobileOpen && (
        <div className="fixed inset-0 z-30 md:hidden">
          <button
            type="button"
            aria-label="Close navigation menu"
            onClick={onMobileClose}
            className="absolute inset-0 bg-black/70"
          />
          <aside className="relative flex h-full w-72 max-w-[85vw] flex-col justify-between overflow-y-auto border-r border-gray-800 bg-black p-3 shadow-2xl">
            <div>
              <div className="mb-4 flex items-center justify-between border-b border-gray-800 pb-3">
                <span className="text-sm font-semibold text-gray-300">Navigation</span>
                <button
                  type="button"
                  onClick={onMobileClose}
                  aria-label="Close navigation menu"
                  className="rounded-lg p-2 text-gray-300 hover:bg-white/10"
                >
                  <CloseIcon size={20} />
                </button>
              </div>
              <nav className="flex flex-col gap-1">{topLinks.map(renderLink)}</nav>
            </div>
            <nav className="flex flex-col gap-1">{bottomLinks.map(renderLink)}</nav>
          </aside>
        </div>
      )}
    </>
  );
}