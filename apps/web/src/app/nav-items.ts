import type { LucideIcon } from "lucide-react";
import {
  Bug,
  CalendarDays,
  Cloud,
  Droplets,
  FlaskConical,
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
  { key: "dashboard", labelKey: "nav.dashboard", path: "/", icon: LayoutDashboard, status: "ready" },
  { key: "chat", labelKey: "nav.chat", path: "/chat", icon: MessageCircle, status: "ready" },
  { key: "diseaseDetection", labelKey: "nav.diseaseDetection", path: "/disease-detection", icon: Bug, status: "ready" },
  { key: "weather", labelKey: "nav.weather", path: "/coming-soon/weather", icon: Cloud, status: "soon" },
  { key: "market", labelKey: "nav.market", path: "/coming-soon/market", icon: TrendingUp, status: "soon" },
  { key: "schemes", labelKey: "nav.schemes", path: "/coming-soon/schemes", icon: Newspaper, status: "soon" },
  { key: "cropCalendar", labelKey: "nav.cropCalendar", path: "/coming-soon/crop-calendar", icon: CalendarDays, status: "soon" },
  { key: "irrigation", labelKey: "nav.irrigation", path: "/coming-soon/irrigation", icon: Droplets, status: "soon" },
  { key: "soilAnalysis", labelKey: "nav.soilAnalysis", path: "/coming-soon/soil-analysis", icon: FlaskConical, status: "soon" },
  { key: "yieldPrediction", labelKey: "nav.yieldPrediction", path: "/coming-soon/yield-prediction", icon: LineChart, status: "soon" },
  { key: "farmDiary", labelKey: "nav.farmDiary", path: "/coming-soon/farm-diary", icon: Sprout, status: "soon" },
  { key: "community", labelKey: "nav.community", path: "/coming-soon/community", icon: Users, status: "soon" },
  { key: "marketplace", labelKey: "nav.marketplace", path: "/coming-soon/marketplace", icon: ShoppingBag, status: "soon" },
  { key: "expertConsultation", labelKey: "nav.expertConsultation", path: "/coming-soon/expert-consultation", icon: Users, status: "soon" },
  { key: "analytics", labelKey: "nav.analytics", path: "/coming-soon/analytics", icon: LineChart, status: "soon" },
  { key: "admin", labelKey: "nav.admin", path: "/coming-soon/admin", icon: ShieldCheck, status: "soon", adminOnly: true },
  { key: "settings", labelKey: "nav.settings", path: "/coming-soon/settings", icon: Settings, status: "soon" },
  { key: "help", labelKey: "nav.help", path: "/coming-soon/help", icon: HelpCircle, status: "soon" },
];
