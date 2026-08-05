import { Outlet } from "react-router-dom";
import { SidebarNav } from "./Sidebar";
import { Topbar } from "./Topbar";

export function AppShell() {
  return (
    <div className="flex min-h-screen bg-background">
      <aside
        className="sticky top-0 hidden h-screen w-72 shrink-0 overflow-y-auto p-4 pt-6 md:block"
        style={{ backgroundColor: '#1B4332' }}
      >
        <SidebarNav />
      </aside>

      <div className="flex min-h-screen flex-1 flex-col">
        <Topbar />
        <main className="flex-1 overflow-x-hidden p-4 md:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
