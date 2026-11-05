import { NavLink } from "react-router-dom";

const topLinks = [
  { label: "Home", to: "/" },
  { label: "Liked Videos", to: "/liked" },
  { label: "History", to: "/history" },
  { label: "My Content", to: "/my-content" },
  { label: "Collection", to: "/collection" },
  { label: "Subscribers", to: "/subscribers" },
];
const bottomLinks = [
  { label: "Support", to: "/support" },
  { label: "Settings", to: "/settings" },
];

const linkClass = ({ isActive }) =>
  `block border p-2 font-semibold ${
    isActive ? "border-purple-400 bg-purple-400 text-black" : "border-white hover:bg-white/10"
  }`;

export default function Sidebar() {
  return (
    <aside className="hidden md:flex w-60 shrink-0 flex-col justify-between border-r border-gray-700 p-4">
      <nav className="flex flex-col gap-1">
        {topLinks.map((l) => (
          <NavLink key={l.to} to={l.to} end={l.to === "/"} className={linkClass}>
            {l.label}
          </NavLink>
        ))}
      </nav>
      <nav className="flex flex-col gap-1">
        {bottomLinks.map((l) => (
          <NavLink key={l.to} to={l.to} className={linkClass}>
            {l.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}