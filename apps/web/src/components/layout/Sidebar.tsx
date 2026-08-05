import { NavLink, useNavigate } from "react-router-dom";
import { cn } from "../../lib/utils.js";
import { NAV_ITEMS } from "../../app/nav-items.js";
import { useAuth } from "../../hooks/useAuth.js";

const labelMap: Record<string, string> = {
  dashboard: "Today",
  chat: "AI Assistant",
  diseaseDetection: "Crop Diagnosis",
  irrigation: "Irrigation",
  weather: "Weather",
  market: "Market Prices",
  schemes: "Schemes",
  soilAnalysis: "Soil Analysis",
  yieldPrediction: "Yield Prediction",
  farmDiary: "Farm Diary",
  community: "Community",
  marketplace: "Marketplace",
  expertConsultation: "Experts",
  analytics: "Analytics",
  settings: "Settings",
  help: "Help",
  admin: "Admin",
};

export function SidebarNav({ onNavigate }: { onNavigate?: () => void }) {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const displayName = user?.name || "Ramesh Farm";
  const userRole = user?.role || "FARMER";

  return (
    <div className="flex h-full flex-col bg-[#12261D] p-[22px] py-[22px] px-4 gap-[26px] text-[#F5F4EE]">
      {/* Brand logo block */}
      <div className="flex items-center gap-3 px-1.5">
        <div 
          className="flex h-[34px] w-[34px] shrink-0 items-center justify-center rounded-xl text-[#12261D] font-serif font-extrabold text-base shadow-sm"
          style={{ backgroundColor: '#7DBF57' }}
        >
          ह
        </div>
        <div className="flex flex-col overflow-hidden text-left leading-tight">
          <span className="text-[15px] font-bold text-[#F5F4EE]">Haritha Sahayak</span>
          <span className="text-[11px] text-[#7F9A88] font-medium tracking-wide">
            {displayName} · HSF12345
          </span>
        </div>
      </div>

      {/* Nav List */}
      <nav className="flex-1 space-y-0.5 overflow-y-auto pr-1">
        {NAV_ITEMS.map((item) => {
          // Hide admin only items if user is not admin
          if (item.adminOnly && userRole !== "ADMIN") return null;

          const label = labelMap[item.key] || item.key;

          return (
            <NavLink
              key={item.key}
              to={item.path}
              end={item.path === "/"}
              onClick={onNavigate}
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-semibold transition-all text-left",
                  isActive
                    ? "bg-[#1F4030] text-[#EAF6E0]"
                    : "text-[#9DB3A6] hover:bg-white/5 hover:text-white"
                )
              }
            >
              {({ isActive }) => (
                <>
                  <span 
                    className="w-1.5 h-1.5 rounded-full shrink-0" 
                    style={{ backgroundColor: isActive ? '#9BD96B' : '#3A5748' }} 
                  />
                  <span className="truncate">{label}</span>
                </>
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* Bottom CTA Box */}
      <div className="mt-auto">
        <div className="bg-[#1B3527] border border-[#2C4A38] rounded-xl p-4 flex flex-col gap-2 text-left">
          <h4 className="text-xs font-bold text-[#E7C56B]">Kharif advisory ready</h4>
          <p className="text-[11px] text-[#9DB3A6] leading-relaxed">
            Sowing window for paddy closes in 9 days.
          </p>
          <button 
            onClick={() => navigate("/coming-soon/crop-calendar")}
            className="w-full rounded-lg bg-[#9BD96B] py-2 text-xs font-bold text-[#12261D] transition hover:bg-[#8ac75c]"
          >
            Open advisory
          </button>
        </div>
      </div>
    </div>
  );
}
