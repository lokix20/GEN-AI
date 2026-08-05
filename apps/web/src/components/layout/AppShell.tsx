import { Outlet } from "react-router-dom";
import { SidebarNav } from "./Sidebar";
import { Topbar } from "./Topbar";

export function AppShell() {
  return (
    <div className="flex min-h-screen" style={{ backgroundColor: '#F4F3EC' }}>
      <aside
        className="sticky top-0 hidden h-screen w-[220px] shrink-0 overflow-hidden md:flex md:flex-col"
        style={{ backgroundColor: '#0F2419' }}
      >
        <SidebarNav />
      </aside>

      <div className="flex min-h-screen flex-1 flex-col" style={{ backgroundColor: '#F4F3EC' }}>
        <Topbar />
        <main className="flex-1 overflow-x-hidden p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
