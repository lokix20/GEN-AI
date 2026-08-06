import { useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { SidebarNav } from "./Sidebar.js";
import { Topbar } from "./Topbar.js";

export function AppShell() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const location = useLocation();
  const isCustomHeaderRoute = 
    location.pathname.startsWith("/chat") || 
    location.pathname.startsWith("/disease-detection") ||
    location.pathname.startsWith("/weather") ||
    location.pathname.startsWith("/irrigation") ||
    location.pathname.startsWith("/crop-calendar") ||
    location.pathname.startsWith("/market") ||
    location.pathname.startsWith("/schemes");

  // Deliberately no `overflow-*` on the outer wrapper: `overflow-x: hidden` makes `overflow-y`
  // compute to `auto`, which turns it into a scroll container and breaks `position: sticky` on the
  // <aside> — the sidebar scrolls away instead of staying put. Horizontal overflow is contained by
  // `min-w-0` on the content column instead, the real fix for a flex child forcing the row wider.
  return (
    <div className="flex min-h-screen w-full" style={{ backgroundColor: '#F4F3EC' }}>
      <aside
        className={`sticky top-0 h-screen w-[220px] shrink-0 overflow-hidden flex-col ${sidebarCollapsed ? "hidden" : "hidden md:flex"}`}
        style={{ backgroundColor: '#0F2419' }}
      >
        <SidebarNav onCollapse={() => setSidebarCollapsed(true)} />
      </aside>

      <div className="flex min-h-screen flex-1 flex-col min-w-0 overflow-x-hidden" style={{ backgroundColor: '#F4F3EC' }}>
        {!isCustomHeaderRoute && (
          <Topbar 
            onToggleSidebar={() => setSidebarCollapsed(!sidebarCollapsed)} 
            sidebarCollapsed={sidebarCollapsed} 
          />
        )}
        <main className={`flex-1 overflow-x-hidden flex flex-col ${isCustomHeaderRoute ? "" : "p-6"}`}>
          <Outlet />
        </main>
      </div>
    </div>
  );
}
