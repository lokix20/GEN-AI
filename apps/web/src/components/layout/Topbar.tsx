import { useState } from "react";
import { useTranslation } from "react-i18next";
import { LogOut, Menu, Search, Bell, Globe, ChevronDown } from "lucide-react";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Dialog, DialogContent } from "../ui/dialog";

import { SidebarNav } from "./Sidebar";
import { useAuth } from "../../hooks/useAuth";

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
    <header className="sticky top-0 z-30 flex items-center justify-between border-b bg-background px-4 py-3 md:px-6">
      <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setMobileNavOpen(true)} aria-label="Open menu">
        <Menu className="h-5 w-5" />
      </Button>

      <div className="hidden flex-1 items-center justify-center px-6 md:flex">
        <div className="flex w-full max-w-2xl items-center rounded-full bg-muted px-4 py-2">
          <Search className="mr-2 h-5 w-5 text-muted-foreground" />
          <input 
            type="text" 
            placeholder="Search anything (crops, diseases, schemes, etc...)" 
            className="w-full bg-transparent outline-none placeholder:text-muted-foreground"
            readOnly
          />
        </div>
      </div>

      <div className="ml-auto flex items-center gap-4 md:ml-0">
        <div className="hidden cursor-pointer items-center gap-1 text-sm font-medium sm:flex">
          <Globe className="h-5 w-5" />
          <span>English</span>
          <ChevronDown className="h-4 w-4" />
        </div>

        <div className="relative cursor-pointer rounded-full p-2 hover:bg-muted">
          <Bell className="h-5 w-5" />
          <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-red-500" />
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center gap-3 rounded-full p-1 pr-2 transition-colors hover:bg-muted">
              <Avatar className="h-10 w-10">
                <AvatarFallback className="bg-primary/10 font-semibold text-primary">
                  {initials(displayName)}
                </AvatarFallback>
              </Avatar>
              <div className="hidden flex-col items-start sm:flex">
                <span className="text-sm font-semibold">{displayName}</span>
                <span className="text-xs text-muted-foreground">Farm ID: HSF12345</span>
              </div>
              <ChevronDown className="hidden h-4 w-4 text-muted-foreground sm:block" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => logout()}>
              <LogOut className="mr-2 h-4 w-4" />
              {t("common.logout")}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <Dialog open={mobileNavOpen} onOpenChange={setMobileNavOpen}>
        <DialogContent 
          className="max-w-xs border-none p-4 pt-6" 
          style={{ backgroundColor: '#1B4332' }}
        >
          <SidebarNav onNavigate={() => setMobileNavOpen(false)} />
        </DialogContent>
      </Dialog>
    </header>
  );
}
