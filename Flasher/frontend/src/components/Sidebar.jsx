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

export default function Sidebar() {
  const { pathname } = useLocation();

  // On the video page the sidebar shrinks to icons only
  const collapsed = pathname.startsWith("/videos/");

  const asideClass = `hidden md:flex shrink-0 flex-col justify-between border-r border-gray-700 p-4 ${
    collapsed ? "w-25" : "w-60"
  }`;

  const linkClass = ({ isActive }) =>
    `flex items-center gap-3 border p-2 font-semibold ${
      collapsed ? "justify-center" : ""
    } ${
      isActive
        ? "border-purple-400 bg-purple-400 text-black"
        : "border-white hover:bg-white/10"
    }`;

  const renderLink = ({ label, to, icon: Icon }) => (
    <NavLink
      key={to}
      to={to}
      end={to === "/"}
      title={label}
      className={linkClass}
    >
      <Icon size={20} />
      {!collapsed && <span>{label}</span>}
    </NavLink>
  );

  return (
    <aside className={asideClass}>
      <nav className="flex flex-col gap-1">{topLinks.map(renderLink)}</nav>
      <nav className="flex flex-col gap-1">{bottomLinks.map(renderLink)}</nav>
    </aside>
  );
}