import { NavLink } from "react-router-dom";
import { useTranslation } from "react-i18next";

import { cn } from "../../lib/utils.js";
import { NAV_ITEMS } from "../../app/nav-items.js";
import { useAuth } from "../../hooks/useAuth.js";

function initials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

export function SidebarNav({ onNavigate }: { onNavigate?: () => void }) {
  const { t } = useTranslation();
  const { user } = useAuth();
  
  const displayName = user?.name || "Ramesh Farm";

  // Grouping mapping
  const groups = [
    {
      title: "Daily",
      items: ["home", "chat", "diseaseDetection"]
    },
    {
      title: "Plan the season",
      items: ["weather", "irrigation", "cropCalendar", "farmDiary"]
    },
    {
      title: "Money",
      items: ["market", "schemes", "expertConsultation"]
    }
  ];

  return (
    <div className="flex h-full flex-col bg-[#0F2419] p-4 text-[#F4F3EC]">
      {/* Brand logo block */}
      <div className="mb-6 flex items-center gap-3 px-2 py-1">
        <div 
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-[#0F2419] font-serif font-extrabold text-xl shadow-md"
          style={{ background: "linear-gradient(150deg, #9BD96B, #3E9B5F)" }}
        >
          ह
        </div>
        <div className="flex flex-col overflow-hidden text-left">
          <span className="font-sora text-[15px] font-bold tracking-tight text-[#F4F3EC]">Haritha Sahayak</span>
          <span className="text-[11px] text-[#6F8B79] font-medium tracking-wide">AI farming assistant</span>
        </div>
      </div>

      {/* Nav List */}
      <div className="flex-1 space-y-6 overflow-y-auto pr-1">
        {groups.map((group) => (
          <div key={group.title} className="flex flex-col gap-1">
            <span className="text-[10px] font-bold tracking-widest text-[#587263] uppercase px-3 mb-1 text-left">
              {group.title}
            </span>
            {group.items.map((key) => {
              const item = NAV_ITEMS.find((n) => n.key === key);
              if (!item) return null;

              return (
                <NavLink
                  key={item.key}
                  to={item.path}
                  end={item.path === "/"}
                  onClick={onNavigate}
                  className={({ isActive }) =>
                    cn(
                      "flex items-center gap-3 rounded-xl px-3.5 py-3 text-sm font-medium transition-all text-left",
                      isActive
                        ? "bg-[#1C3D2A] text-[#F4F3EC] shadow-[inset_3px_0_0_#9BD96B] font-semibold"
                        : "text-[#A6BBAD] hover:bg-white/5 hover:text-white"
                    )
                  }
                >
                  <item.icon className="h-5 w-5 shrink-0 opacity-80" />
                  <span className="truncate flex-1">{t(item.labelKey)}</span>
                  
                  {/* Badges / Suffixes */}
                  {item.key === "chat" && (
                    <span className="text-[10px] font-bold text-[#0F2419] bg-[#9BD96B] px-2 py-0.5 rounded-full">
                      NEW
                    </span>
                  )}
                  {item.key === "market" && (
                    <span className="text-xs font-bold text-[#9BD96B] ml-auto">
                      ▲2.4%
                    </span>
                  )}
                  {item.key === "schemes" && (
                    <span className="w-2 h-2 rounded-full bg-[#E8A33D] ml-auto" />
                  )}
                </NavLink>
              );
            })}
          </div>
        ))}
      </div>

      {/* Bottom CTA & Profile */}
      <div className="mt-auto pt-4 flex flex-col gap-4">
        {/* Premium Upgrade */}
        <div className="bg-[#17311F] border border-[#2A4735] rounded-2xl p-4 flex flex-col gap-2 text-left">
          <div className="flex items-center gap-2">
            <span className="w-5 h-5 rounded-md bg-[#E8A33D] flex items-center justify-center text-xs">👑</span>
            <h4 className="font-sora text-sm font-bold text-[#F4F3EC]">Premium</h4>
          </div>
          <p className="text-[11.5px] text-[#8FA898] leading-relaxed">
            Expert calls, yield forecasts and unlimited scans.
          </p>
          <button className="w-full rounded-xl bg-[#E8A33D] py-2 text-sm font-bold text-[#3A2703] transition-colors hover:bg-[#d69534]">
            Upgrade — ₹99/mo
          </button>
        </div>

        {/* User Profile */}
        <div className="flex items-center gap-3 px-2 py-1 text-left border-t border-[#1C3D2A] pt-4">
          <div className="w-9 h-9 rounded-xl bg-[#1C3D2A] text-[#9BD96B] flex items-center justify-center font-extrabold text-sm shadow-inner">
            {initials(displayName)}
          </div>
          <div className="flex-1 overflow-hidden">
            <div className="text-sm font-semibold text-[#F4F3EC] truncate">{displayName}</div>
            <div className="text-[11px] text-[#6F8B79] font-medium tracking-wide">HSF12345</div>
          </div>
          <span className="text-[#6F8B79] font-bold text-base cursor-pointer hover:text-white transition">⋯</span>
        </div>
      </div>
    </div>
  );
}
