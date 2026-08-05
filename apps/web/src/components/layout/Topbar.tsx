import { useState } from "react";
import { useTranslation } from "react-i18next";
import { LogOut, Menu, Search, Bell, Globe, ChevronDown } from "lucide-react";
import { Avatar, AvatarFallback } from "../ui/avatar.js";
import { Button } from "../ui/button.js";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu.js";
import { Dialog, DialogContent } from "../ui/dialog.js";
import { SidebarNav } from "./Sidebar.js";
import { useAuth } from "../../hooks/useAuth.js";

function initials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

export function Topbar() {
  const { t } = useTranslation();
  const { user, logout } = useAuth();
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  const displayName = user?.name || "Ramesh Farm";

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between border-b border-[#E4E3DA] bg-white/80 backdrop-blur-md px-4 py-3 md:px-6">
      <Button variant="ghost" size="icon" className="md:hidden text-[#4B5A52]" onClick={() => setMobileNavOpen(true)} aria-label="Open menu">
        <Menu className="h-5 w-5" />
      </Button>

      {/* Search Input */}
      <div className="hidden flex-1 items-center justify-start max-w-md md:flex">
        <div className="flex w-full items-center rounded-xl bg-[#F1F0E9] border border-[#E1E0D6] px-4 py-2 text-sm text-[#8B978F]">
          <Search className="mr-2 h-4 w-4 text-[#8B978F] shrink-0" />
          <input 
            type="text" 
            placeholder="Search crops, diseases, schemes…" 
            className="w-full bg-transparent outline-none placeholder:text-[#8B978F] text-[#12261D]"
            readOnly
          />
          <span className="ml-2 font-mono text-[10px] text-[#A9B3AC] border border-[#DCDBD1] rounded px-1.5 py-0.5 shrink-0 bg-white">
            ⌘K
          </span>
        </div>
      </div>

      {/* Right Actions */}
      <div className="ml-auto flex items-center gap-4 md:ml-0">
        <div className="hidden cursor-pointer items-center gap-1 text-sm font-medium text-[#4B5A52] hover:text-[#12261D] sm:flex transition">
          <Globe className="h-4.5 w-4.5" />
          <span>English</span>
          <ChevronDown className="h-3.5 w-3.5 opacity-70" />
        </div>

        {/* Bell Alerts */}
        <div className="relative cursor-pointer rounded-full p-2 text-[#4B5A52] hover:bg-muted transition">
          <Bell className="h-5 w-5" />
          <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-[#C0442F]" />
        </div>

        {/* Divider */}
        <div className="hidden sm:block h-6 w-px bg-[#E1E0D6]" />

        {/* User Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center gap-3 rounded-xl p-1 pr-2 transition-colors hover:bg-muted text-left">
              <Avatar className="h-[34px] w-[34px] rounded-xl overflow-hidden">
                <AvatarFallback className="bg-[#0F2419] font-bold text-xs text-[#9BD96B] rounded-xl">
                  {initials(displayName)}
                </AvatarFallback>
              </Avatar>
              <div className="hidden flex-col items-start sm:flex leading-tight">
                <span className="text-xs font-bold text-[#12261D]">{displayName}</span>
                <span className="text-[10px] text-[#8B978F] font-medium">Kadapa, AP</span>
              </div>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="rounded-xl border border-[#E4E3DA] bg-white">
            <DropdownMenuItem onClick={() => logout()} className="rounded-lg hover:bg-muted cursor-pointer">
              <LogOut className="mr-2 h-4 w-4" />
              {t("common.logout")}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <Dialog open={mobileNavOpen} onOpenChange={setMobileNavOpen}>
        <DialogContent 
          className="max-w-xs border-none p-0 overflow-hidden" 
          style={{ backgroundColor: '#0F2419' }}
        >
          <SidebarNav onNavigate={() => setMobileNavOpen(false)} />
        </DialogContent>
      </Dialog>
    </header>
  );
}
