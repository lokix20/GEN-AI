import { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { cn } from "../../lib/utils.js";
import { NAV_ITEMS } from "../../app/nav-items.js";
import { useAuth } from "../../hooks/useAuth.js";
import { ChevronLeft } from "lucide-react";
import { DASHBOARD_TRANSLATIONS, DashboardTranslation } from "../../lib/dashboard-translations.js";

const GROUPS = [
  {
    title: "TODAY",
    keys: [
      { key: "home", dtKey: "sidebarDashboard" as keyof DashboardTranslation },
      { key: "chat", dtKey: "sidebarAiAssistant" as keyof DashboardTranslation },
      { key: "diseaseDetection", dtKey: "sidebarCropDiagnosis" as keyof DashboardTranslation },
    ],
  },
  {
    title: "PLAN THE SEASON",
    keys: [
      { key: "weather", dtKey: "sidebarWeather" as keyof DashboardTranslation },
      { key: "irrigation", dtKey: "sidebarIrrigation" as keyof DashboardTranslation },
      { key: "cropCalendar", dtKey: "sidebarCropCalendar" as keyof DashboardTranslation },
      { key: "farmDiary", dtKey: "sidebarFarmDiary" as keyof DashboardTranslation },
    ],
  },
  {
    title: "MONEY",
    keys: [
      { key: "market", dtKey: "sidebarMarketPrices" as keyof DashboardTranslation },
      { key: "schemes", dtKey: "sidebarSchemes" as keyof DashboardTranslation },
      { key: "expertConsultation", dtKey: "sidebarExpertHelp" as keyof DashboardTranslation },
    ],
  },
];

export function SidebarNav({ onNavigate, onCollapse }: { onNavigate?: () => void; onCollapse?: () => void }) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [langCode, setLangCode] = useState(() => localStorage.getItem("haritha-language") || "te");

  useEffect(() => {
    const handleLangChange = () => {
      setLangCode(localStorage.getItem("haritha-language") || "te");
    };
    window.addEventListener("haritha-language-change", handleLangChange);
    return () => window.removeEventListener("haritha-language-change", handleLangChange);
  }, []);

  const dt: DashboardTranslation = DASHBOARD_TRANSLATIONS[langCode] || DASHBOARD_TRANSLATIONS["te"] || DASHBOARD_TRANSLATIONS["en"];

  const displayName = user?.name || "Farmer";

  return (
    <div className="flex h-full flex-col bg-[#0F2419] p-5 pb-5 gap-6 text-[#F4F3EC] overflow-y-auto no-scrollbar">
      {/* Top Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate("/")}>
          <div 
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[10px] text-[#0F2419] font-serif font-extrabold text-lg shadow-sm"
            style={{ backgroundColor: '#9BD96B' }}
          >
            ह
          </div>
          <div className="flex flex-col overflow-hidden text-left leading-tight">
            <span className="text-[15px] font-bold text-white">Haritha Sahayak</span>
            <span className="text-[11px] text-[#7F9A88] font-medium tracking-wide mt-0.5">
              {displayName} · HSF12345
            </span>
          </div>
        </div>
        <button 
          onClick={onCollapse}
          className="text-[#7F9A88] hover:text-white transition-colors"
        >
          <ChevronLeft size={18} />
        </button>
      </div>

      {/* Nav Groups */}
      <nav className="flex-1 space-y-6">
        {GROUPS.map((group) => (
          <div key={group.title} className="flex flex-col gap-1.5">
            <div className="text-[10px] font-bold text-[#7F9A88] tracking-[0.1em] px-2 mb-1 text-left">
              {group.title}
            </div>
            {group.keys.map(({ key, dtKey }) => {
              const item = NAV_ITEMS.find((i) => i.key === key);
              if (!item) return null;
              
              const label = (dt[dtKey] as string) || item.key;
              const Icon = item.icon;
              const path = item.path;

              return (
                <NavLink
                  key={key}
                  to={path}
                  end={path === "/"}
                  onClick={onNavigate}
                  className={({ isActive }) =>
                    cn(
                      "flex items-center gap-3 rounded-xl px-2 py-2 text-[13px] font-semibold transition-all text-left group",
                      isActive
                        ? "bg-[#1C3D2A] text-[#F4F3EC]"
                        : "text-[#7F9A88] hover:text-white hover:bg-white/5"
                    )
                  }
                >
                  {({ isActive }) => (
                    <>
                      <Icon size={18} className={isActive ? "text-[#F4F3EC]" : "text-[#7F9A88] group-hover:text-white"} />
                      <span className="flex-1 truncate">{label}</span>
                      
                      {/* Badges/Suffixes */}
                      {key === "chat" && (
                        <span className="bg-[#9BD96B] text-[#0F2419] text-[9px] font-bold px-1.5 py-0.5 rounded-full ml-auto">
                          NEW
                        </span>
                      )}
                      {key === "market" && (
                        <span className="text-[#9BD96B] text-[11px] font-bold ml-auto">
                          ▲2.4%
                        </span>
                      )}
                      {key === "schemes" && (
                        <span className="w-2 h-2 rounded-full bg-[#E8A33D] ml-auto" />
                      )}
                    </>
                  )}
                </NavLink>
              );
            })}
          </div>
        ))}
      </nav>

      {/* Bottom CTA Box */}
      <div className="mt-auto pt-2">
        <div className="bg-[#1C3D2A] rounded-xl p-[18px] flex flex-col gap-2.5 text-left">
          <h4 className="text-[13px] font-bold text-[#E7C56B]">Kharif advisory ready</h4>
          <p className="text-[12px] text-[#9DB3A6] leading-relaxed mb-1">
            Sowing window for paddy closes in 9 days.
          </p>
          <button 
            onClick={() => navigate("/coming-soon/crop-calendar")}
            className="w-full rounded-[9px] bg-[#9BD96B] py-[9px] text-[13px] font-bold text-[#0F2419] transition hover:bg-[#8ac75c]"
          >
            Open advisory
          </button>
        </div>
      </div>
    </div>
  );
}
