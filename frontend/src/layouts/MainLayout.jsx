import { useEffect, useRef, useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";

export default function MainLayout() {
  const mainRef = useRef(null);
  const { pathname } = useLocation();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // The main area scrolls (not the window), so go back to the top on every page change
  useEffect(() => {
    mainRef.current?.scrollTo(0, 0);
  }, [pathname]);

  return (
    <div className="flex h-dvh flex-col overflow-hidden bg-black text-white">
      <Navbar onMenuClick={() => setMobileSidebarOpen(true)} />
      <div className="flex min-h-0 flex-1">
        <Sidebar
          mobileOpen={mobileSidebarOpen}
          onMobileClose={() => setMobileSidebarOpen(false)}
        />
        <main ref={mainRef} className="min-w-0 flex-1 overflow-y-auto p-2">
          <Outlet />
        </main>
      </div>
    </div>
  );
}