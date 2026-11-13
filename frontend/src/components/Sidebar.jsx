import { useEffect } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { LogoMark } from "./Logo";
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

const topGroups = [
  { links: [{ label: "Home", to: "/", icon: HomeIcon }] },
  {
    title: "Library",
    links: [
      { label: "Liked Videos", to: "/liked", icon: LikeIcon },
      { label: "History", to: "/history", icon: HistoryIcon },
      { label: "Collection", to: "/collection", icon: FolderIcon },
    ],
  },
  {
    title: "Creator",
    links: [
      { label: "My Content", to: "/my-content", icon: VideoIcon },
      { label: "Subscribers", to: "/subscribers", icon: SubscribersIcon },
    ],
  },
];

const bottomGroups = [
  {
    links: [
      { label: "Support", to: "/support", icon: SupportIcon },
      { label: "Settings", to: "/settings", icon: SettingsIcon },
    ],
  },
];

// compact = icons only (video page on desktop)
function SidebarLink({ label, to, icon: Icon, compact, onClick }) {
  return (
    <NavLink
      to={to}
      end={to === "/"}
      title={label}
      onClick={onClick}
      className={({ isActive }) =>
        `group relative flex items-center rounded-xl px-3 py-2.5 text-sm outline-none transition-colors duration-200 focus-visible:ring-2 focus-visible:ring-purple-400 ${
          compact ? "justify-center" : ""
        } ${
          isActive
            ? "bg-white/10 font-semibold text-white"
            : "text-gray-400 hover:bg-white/5 hover:text-white"
        }`
      }
    >
      {({ isActive }) => (
        <>
          {/* Active marker */}
          <span
            aria-hidden="true"
            className={`absolute left-0 top-1/2 h-5 w-1 -translate-y-1/2 rounded-r-full bg-purple-400 transition-all duration-300 ${
              isActive ? "scale-y-100 opacity-100" : "scale-y-0 opacity-0"
            }`}
          />
          <Icon
            size={22}
            className={`shrink-0 transition duration-200 group-hover:scale-110 ${
              isActive ? "text-purple-300" : ""
            }`}
          />
          <span
            className={`overflow-hidden whitespace-nowrap transition-all duration-300 ${
              compact ? "ml-0 max-w-0 opacity-0" : "ml-4 max-w-40 opacity-100"
            }`}
          >
            {label}
          </span>
        </>
      )}
    </NavLink>
  );
}

function LinkGroups({ groups, compact, onNavigate }) {
  return (
    <nav className="flex flex-col gap-1">
      {groups.map((group, i) => (
        <div key={group.title || i} className="flex flex-col gap-1">
          {group.title &&
            (compact ? (
              <div className="mx-3 my-2 h-px bg-white/10" />
            ) : (
              <p className="px-3 pb-1 pt-4 text-[11px] font-semibold uppercase tracking-[0.14em] text-gray-500">
                {group.title}
              </p>
            ))}
          {group.links.map((link) => (
            <SidebarLink key={link.to} {...link} compact={compact} onClick={onNavigate} />
          ))}
        </div>
      ))}
    </nav>
  );
}

export default function Sidebar({ mobileOpen, onMobileClose }) {
  const { pathname } = useLocation();

  // On the video page the desktop sidebar shrinks to icons only
  const collapsed = pathname.startsWith("/videos/");

  // Escape closes the mobile drawer
  useEffect(() => {
    if (!mobileOpen) return;
    const handleKey = (e) => {
      if (e.key === "Escape") onMobileClose();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [mobileOpen, onMobileClose]);

  return (
    <>
      <aside
        className={`hidden shrink-0 flex-col justify-between overflow-y-auto overflow-x-hidden border-r border-white/10 p-2 transition-[width] duration-300 ease-out md:flex ${
          collapsed ? "w-20" : "w-56"
        }`}
      >
        <LinkGroups groups={topGroups} compact={collapsed} />
        <LinkGroups groups={bottomGroups} compact={collapsed} />
      </aside>

      {mobileOpen && (
        <div className="fixed inset-0 z-30 md:hidden">
          <button
            type="button"
            aria-label="Close navigation menu"
            onClick={onMobileClose}
            className="fade-in absolute inset-0 bg-black/70 backdrop-blur-sm"
          />
          <aside className="slide-in-left relative flex h-full w-72 max-w-[85vw] flex-col justify-between overflow-y-auto border-r border-white/10 bg-black p-3 shadow-2xl">
            <div>
              <div className="mb-3 flex items-center justify-between border-b border-white/10 pb-3">
                <div className="flex items-center gap-2 pl-1">
                  <LogoMark size={28} />
                  <span className="text-lg font-extrabold tracking-tight">Flasher</span>
                </div>
                <button
                  type="button"
                  onClick={onMobileClose}
                  aria-label="Close navigation menu"
                  className="cursor-pointer rounded-full p-2 text-gray-300 transition hover:bg-white/10"
                >
                  <CloseIcon size={20} />
                </button>
              </div>
              <LinkGroups groups={topGroups} compact={false} onNavigate={onMobileClose} />
            </div>
            <LinkGroups groups={bottomGroups} compact={false} onNavigate={onMobileClose} />
          </aside>
        </div>
      )}
    </>
  );
}