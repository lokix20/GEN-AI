import type { LucideIcon } from "lucide-react";
import {
  Bug,
  CalendarDays,
  Cloud,
  Droplets,
  FlaskConical,
  HeadphonesIcon,
  HelpCircle,
  LayoutDashboard,
  LineChart,
  MessageCircle,
  Newspaper,
  Settings,
  ShieldCheck,
  ShoppingBag,
  Sprout,
  TrendingUp,
  Users,
} from "lucide-react";

export interface NavItem {
  key: string;
  labelKey: string;
  path: string;
  icon: LucideIcon;
  status: "ready" | "soon";
  adminOnly?: boolean;
}

export const NAV_ITEMS: NavItem[] = [
  { key: "home", labelKey: "nav.dashboard", path: "/dashboard", icon: LayoutDashboard, status: "ready" },
  { key: "chat", labelKey: "nav.chat", path: "/chat", icon: MessageCircle, status: "ready" },
  { key: "diseaseDetection", labelKey: "nav.diseaseDetection", path: "/disease-detection", icon: Bug, status: "ready" },
  { key: "weather", labelKey: "nav.weather", path: "/weather", icon: Cloud, status: "ready" },
  { key: "irrigation", labelKey: "nav.irrigation", path: "/irrigation", icon: Droplets, status: "ready" },
  { key: "cropCalendar", labelKey: "nav.cropCalendar", path: "/crop-calendar", icon: CalendarDays, status: "ready" },
  { key: "farmDiary", labelKey: "nav.farmDiary", path: "/coming-soon/farm-diary", icon: Sprout, status: "soon" },
  { key: "market", labelKey: "nav.market", path: "/market", icon: TrendingUp, status: "ready" },
  { key: "schemes", labelKey: "nav.schemes", path: "/schemes", icon: Newspaper, status: "ready" },
  { key: "expertConsultation", labelKey: "nav.expertConsultation", path: "/coming-soon/expert-consultation", icon: HeadphonesIcon, status: "soon" },
  { key: "community", labelKey: "nav.community", path: "/coming-soon/community", icon: Users, status: "soon" },
  { key: "marketplace", labelKey: "nav.marketplace", path: "/coming-soon/marketplace", icon: ShoppingBag, status: "soon" },
  { key: "soilAnalysis", labelKey: "nav.soilAnalysis", path: "/coming-soon/soil-analysis", icon: FlaskConical, status: "soon" },
  { key: "yieldPrediction", labelKey: "nav.yieldPrediction", path: "/coming-soon/yield-prediction", icon: LineChart, status: "soon" },
  { key: "analytics", labelKey: "nav.analytics", path: "/coming-soon/analytics", icon: LineChart, status: "soon" },
  { key: "admin", labelKey: "nav.admin", path: "/coming-soon/admin", icon: ShieldCheck, status: "soon", adminOnly: true },
  { key: "settings", labelKey: "nav.settings", path: "/coming-soon/settings", icon: Settings, status: "soon" },
  { key: "help", labelKey: "nav.help", path: "/coming-soon/help", icon: HelpCircle, status: "soon" },
];
