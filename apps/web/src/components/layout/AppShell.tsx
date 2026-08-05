import { useState } from "react";
import { Outlet } from "react-router-dom";
import { SidebarNav } from "./Sidebar.js";
import { Topbar } from "./Topbar.js";

export function AppShell() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  return (
    <div className="flex min-h-screen" style={{ backgroundColor: '#F4F3EC' }}>
      <aside
        className={`sticky top-0 h-screen w-[220px] shrink-0 overflow-hidden flex-col ${sidebarCollapsed ? "hidden" : "hidden md:flex"}`}
        style={{ backgroundColor: '#0F2419' }}
      >
        <SidebarNav onCollapse={() => setSidebarCollapsed(true)} />
      </aside>

      <div className="flex min-h-screen flex-1 flex-col" style={{ backgroundColor: '#F4F3EC' }}>
        <Topbar 
          onToggleSidebar={() => setSidebarCollapsed(!sidebarCollapsed)} 
          sidebarCollapsed={sidebarCollapsed} 
        />
        <main className="flex-1 overflow-x-hidden p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
