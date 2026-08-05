import { NavLink } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Leaf } from "lucide-react";
import { cn } from "../../lib/utils";
import { NAV_ITEMS } from "../../app/nav-items";


export function SidebarNav({ onNavigate }: { onNavigate?: () => void }) {
  const { t } = useTranslation();

  return (
    <div className="flex h-full flex-col">
      <div className="mb-8 flex items-center gap-3 px-2">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/20 text-white">
          <Leaf className="h-6 w-6" />
        </div>
        <div className="flex flex-col overflow-hidden">
          <span className="truncate text-lg font-bold leading-tight text-white">Haritha Sahayak</span>
          <span className="truncate text-[10px] text-white/70">AI-Powered Farming Assistant</span>
        </div>
      </div>

      <nav className="sidebar-scrollbar flex-1 space-y-1 overflow-y-auto pr-2">
        {NAV_ITEMS.map((item) => (
          <NavLink
            key={item.key}
            to={item.path}
            end={item.path === "/"}
            onClick={onNavigate}
            className={({ isActive }) =>
              cn(
                "flex items-center gap-3 rounded-full px-4 py-3 text-sm font-medium text-white transition-colors",
                isActive ? "bg-white/15" : "hover:bg-white/10"
              )
            }
          >
            <item.icon className="h-5 w-5 shrink-0" />
            <span className="truncate">{t(item.labelKey)}</span>
          </NavLink>
        ))}
      </nav>

      <div className="mt-4 rounded-2xl bg-white/10 p-4">
        <div className="mb-2 text-2xl">👑</div>
        <h4 className="mb-1 font-semibold text-amber-400">Upgrade to Premium</h4>
        <p className="mb-3 text-xs text-white/70">Unlock advanced AI insights, expert support and more.</p>
        <button className="w-full rounded-full bg-amber-500 py-2 text-sm font-semibold text-white transition-colors hover:bg-amber-600">
          Upgrade Now
        </button>
      </div>
    </div>
  );
}
