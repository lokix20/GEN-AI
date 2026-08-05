import { useNavigate } from "react-router-dom";

import { motion } from "framer-motion";
import {
  Sun,
  Droplets,
  Wind,
  CloudRain,
  TrendingUp,
  ArrowRight,
  Mic,
  Send,
  ShieldCheck,
  BarChart3,
  Sprout,
  CalendarDays,
  Cloud,
  Newspaper,
  Bug,
  MessageCircle,
  Users,
  Globe,
  CheckCircle2,
  Plus,
} from "lucide-react";
import { useAuthStore } from "../../store/auth.store";

/* ─── helpers ─── */
function getGreeting(): string {
  const h = new Date().getHours();
  if (h < 12) return "Good Morning";
  if (h < 17) return "Good Afternoon";
  return "Good Evening";
}

/* ─── animation variants ─── */
const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.08, duration: 0.45, ease: "easeOut" },
  }),
};

/* ─── sub-components ─── */

function CircularProgress({ value, size = 80, stroke = 7 }: { value: number; size?: number; stroke?: number }) {
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (value / 100) * circumference;
  const color = value >= 70 ? "#22C55E" : value >= 40 ? "#F59E0B" : "#EF4444";

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg className="progress-ring" width={size} height={size}>
        <circle className="progress-ring__circle-bg" cx={size / 2} cy={size / 2} r={radius} strokeWidth={stroke} />
        <circle
          className="progress-ring__circle"
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={stroke}
          stroke={color}
          strokeDasharray={`${circumference} ${circumference}`}
          strokeDashoffset={offset}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-xl font-bold text-foreground">{value}</span>
        <span className="text-[10px] text-muted-foreground">/100</span>
      </div>
    </div>
  );
}

/* ─── Stat Cards ─── */
function WeatherCard() {
  return (
    <div className="stat-card flex flex-col gap-3">
      <div className="flex items-center gap-2">
        <Sun className="h-4 w-4 text-amber-500" />
        <span className="text-xs font-semibold text-muted-foreground">Weather Today</span>
      </div>
      <div className="flex items-end gap-2">
        <span className="text-3xl font-bold text-foreground">28°C</span>
      </div>
      <p className="text-sm text-muted-foreground">Sunny</p>
      <div className="mt-auto flex gap-4 border-t border-border/30 pt-3 text-[11px] text-muted-foreground">
        <span className="flex flex-col items-center gap-0.5">
          <Droplets className="h-3 w-3 text-blue-400" />
          Humidity
          <b className="text-foreground">65%</b>
        </span>
        <span className="flex flex-col items-center gap-0.5">
          <CloudRain className="h-3 w-3 text-blue-400" />
          Rain Chance
          <b className="text-foreground">10%</b>
        </span>
        <span className="flex flex-col items-center gap-0.5">
          <Wind className="h-3 w-3 text-teal-500" />
          Wind
          <b className="text-foreground">12 km/h</b>
        </span>
      </div>
      <button className="mt-1 flex items-center gap-1 text-xs font-semibold text-forest hover:underline">
        View Full Forecast <ArrowRight className="h-3 w-3" />
      </button>
    </div>
  );
}

function CropHealthCard() {
  return (
    <div className="stat-card flex flex-col items-center gap-2 text-center">
      <div className="flex items-center gap-2 self-start">
        <Sprout className="h-4 w-4 text-green-500" />
        <span className="text-xs font-semibold text-muted-foreground">Crop Health Score</span>
      </div>
      <CircularProgress value={82} />
      <p className="text-sm font-semibold text-green-600">Good</p>
      <p className="text-xs text-muted-foreground">Your crops are healthy. Keep it up!</p>
      <button className="mt-auto flex items-center gap-1 text-xs font-semibold text-forest hover:underline">
        View Details <ArrowRight className="h-3 w-3" />
      </button>
    </div>
  );
}

function SoilMoistureCard() {
  return (
    <div className="stat-card flex flex-col gap-3">
      <div className="flex items-center gap-2">
        <Droplets className="h-4 w-4 text-blue-500" />
        <span className="text-xs font-semibold text-muted-foreground">Soil Moisture</span>
      </div>
      <span className="text-3xl font-bold text-foreground">45%</span>
      <p className="text-sm font-semibold text-green-600">Optimal</p>
      <button className="mt-auto flex items-center gap-1 text-xs font-semibold text-forest hover:underline">
        View Details <ArrowRight className="h-3 w-3" />
      </button>
    </div>
  );
}

function MarketPriceCard() {
  return (
    <div className="stat-card flex flex-col gap-3">
      <div className="flex items-center gap-2">
        <TrendingUp className="h-4 w-4 text-green-500" />
        <span className="text-xs font-semibold text-muted-foreground">Market Price (Paddy)</span>
      </div>
      <span className="text-3xl font-bold text-foreground">₹2,183</span>
      <p className="text-xs text-muted-foreground">/quintal</p>
      <div className="flex items-center gap-1 text-xs text-green-600">
        <TrendingUp className="h-3 w-3" />
        <span>2.4% from yesterday</span>
      </div>
      <button className="mt-auto flex items-center gap-1 text-xs font-semibold text-forest hover:underline">
        View All Prices <ArrowRight className="h-3 w-3" />
      </button>
    </div>
  );
}

/* ─── AI Assistant Section ─── */
function AIAssistantSection() {
  const navigate = useNavigate();
  const chips = [
    "Why are my leaves yellow?",
    "Best fertilizer for rice",
    "Will it rain this week?",
    "Government schemes for farmers",
  ];

  return (
    <div className="ai-assistant-section">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 space-y-3">
          <div className="flex items-center gap-3">
            <h2 className="text-lg font-bold text-white">AI Farming Assistant</h2>
            <span className="rounded-full bg-white/20 px-3 py-0.5 text-[11px] font-semibold text-white/90">
              Beta
            </span>
          </div>
          <p className="text-sm text-white/70">
            Ask me anything about crops, diseases, weather, soil, schemes and more...
          </p>

          {/* Chat input */}
          <div
            className="flex items-center gap-2 rounded-full bg-white/95 px-4 py-2.5 shadow-lg cursor-pointer"
            onClick={() => navigate("/chat")}
          >
            <span className="flex-1 text-sm text-gray-400">Type your question or use voice...</span>
            <button className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 text-gray-500 transition hover:bg-gray-200">
              <Mic className="h-4 w-4" />
            </button>
            <button className="flex h-8 w-8 items-center justify-center rounded-full bg-forest text-white transition hover:bg-forest/80">
              <Send className="h-4 w-4" />
            </button>
          </div>

          {/* Suggestion chips */}
          <div className="flex flex-wrap gap-2 pt-1">
            {chips.map((chip) => (
              <button key={chip} className="suggestion-chip" onClick={() => navigate("/chat")}>
                {chip}
              </button>
            ))}
          </div>
        </div>

        {/* Robot illustration */}
        <div className="hidden shrink-0 lg:block">
          <img
            src="/images/ai-robot.jpg"
            alt="AI Assistant"
            className="h-40 w-40 rounded-2xl object-cover opacity-90"
          />
        </div>
      </div>
    </div>
  );
}

/* ─── My Crops Overview ─── */
const cropsData = [
  { name: "Paddy", emoji: "🌾", health: "Healthy", color: "text-green-600", sowing: "10 Jun 2024" },
  { name: "Tomato", emoji: "🍅", health: "Healthy", color: "text-green-600", sowing: "05 Jul 2024" },
  { name: "Cotton", emoji: "☁️", health: "Moderate", color: "text-amber-500", sowing: "20 Jun 2024" },
];

function MyCropsOverview() {
  return (
    <div className="rounded-2xl border border-border/30 bg-card/80 p-5">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-base font-semibold text-foreground">My Crops Overview</h3>
        <button className="text-xs font-semibold text-forest hover:underline">View All</button>
      </div>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {cropsData.map((crop) => (
          <div key={crop.name} className="crop-card">
            <span className="text-3xl">{crop.emoji}</span>
            <span className="text-sm font-semibold text-foreground">{crop.name}</span>
            <span className={`flex items-center gap-1 text-[11px] font-medium ${crop.color}`}>
              <span className={`inline-block h-1.5 w-1.5 rounded-full ${crop.color === "text-green-600" ? "bg-green-500" : "bg-amber-500"}`} />
              {crop.health}
            </span>
            <span className="text-[10px] text-muted-foreground">Sowing: {crop.sowing}</span>
          </div>
        ))}
        <button className="crop-card border-dashed border-border text-muted-foreground hover:text-forest">
          <div className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-dashed border-current">
            <Plus className="h-5 w-5" />
          </div>
          <span className="text-sm font-medium">Add Crop</span>
        </button>
      </div>
    </div>
  );
}

/* ─── Today's Recommendation ─── */
const recommendations = [
  "No irrigation needed today.",
  "Apply Urea fertilizer in paddy field.",
  "Monitor for leaf folder in rice.",
  "Ideal time for weeding in cotton.",
];

function TodaysRecommendation() {
  return (
    <div className="rounded-2xl border border-border/30 bg-card/80 p-5">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-base font-semibold text-foreground">Today's Recommendation</h3>
        <button className="text-xs font-semibold text-forest hover:underline">View All</button>
      </div>
      <p className="mb-3 text-xs text-muted-foreground">Based on weather & crop stage</p>
      <div className="space-y-1">
        {recommendations.map((rec) => (
          <div key={rec} className="recommendation-item">
            <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-green-500" />
            <span>{rec}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── Bottom Stats Bar ─── */
const statsData = [
  { icon: Users, value: "25K+", label: "Farmers Helped" },
  { icon: MessageCircle, value: "1.2M+", label: "Questions Answered" },
  { icon: ShieldCheck, value: "98%", label: "Accuracy Rate" },
  { icon: Globe, value: "15+", label: "Languages Supported" },
  { icon: Users, value: "50+", label: "Expert Advisors" },
];

function StatsBar() {
  return (
    <div className="stats-bar">
      {statsData.map((stat) => (
        <div key={stat.label} className="flex items-center gap-3">
          <stat.icon className="h-5 w-5 text-forest" />
          <div className="flex flex-col">
            <span className="text-lg font-bold text-foreground">{stat.value}</span>
            <span className="text-[11px] text-muted-foreground">{stat.label}</span>
          </div>
        </div>
      ))}
    </div>
  );
}

/* ─── Right Sidebar: Smart Notifications ─── */
const notifications = [
  {
    icon: CloudRain,
    iconBg: "bg-blue-100 text-blue-600",
    title: "Rain alert",
    desc: "Heavy rain expected in your area tomorrow.",
    time: "2h ago",
  },
  {
    icon: Droplets,
    iconBg: "bg-cyan-100 text-cyan-600",
    title: "Irrigation Reminder",
    desc: "Tomato crop needs irrigation in 2 days.",
    time: "5h ago",
  },
  {
    icon: ShieldCheck,
    iconBg: "bg-green-100 text-green-600",
    title: "Scheme Update",
    desc: "PM-KISAN 16th installment released. Check now.",
    time: "1d ago",
  },
  {
    icon: BarChart3,
    iconBg: "bg-purple-100 text-purple-600",
    title: "Market Update",
    desc: "Paddy prices increased in your local market.",
    time: "1d ago",
  },
];

function SmartNotifications() {
  return (
    <div className="rounded-2xl border border-border/30 bg-card/80 p-4">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-sm font-semibold text-foreground">Smart Notifications</h3>
        <button className="text-xs font-semibold text-forest hover:underline">View All</button>
      </div>
      <div className="space-y-1">
        {notifications.map((n) => (
          <div key={n.title} className="notification-item">
            <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${n.iconBg}`}>
              <n.icon className="h-4 w-4" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-foreground">{n.title}</span>
                <span className="text-[10px] text-muted-foreground">{n.time}</span>
              </div>
              <p className="truncate text-[11px] leading-snug text-muted-foreground">{n.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── Right Sidebar: Quick Actions ─── */
const quickActions = [
  { icon: Bug, label: "Scan Crop", path: "/disease-detection" },
  { icon: MessageCircle, label: "Ask AI", path: "/chat" },
  { icon: CalendarDays, label: "Crop Calendar", path: "/coming-soon/crop-calendar" },
  { icon: TrendingUp, label: "Market Prices", path: "/coming-soon/market" },
  { icon: Cloud, label: "Weather", path: "/coming-soon/weather" },
  { icon: Newspaper, label: "Government\nSchemes", path: "/coming-soon/schemes" },
];

function QuickActions() {
  const navigate = useNavigate();
  return (
    <div className="rounded-2xl border border-border/30 bg-card/80 p-4">
      <h3 className="mb-3 text-sm font-semibold text-foreground">Quick Actions</h3>
      <div className="grid grid-cols-3 gap-2">
        {quickActions.map((action) => (
          <button key={action.label} className="quick-action-btn" onClick={() => navigate(action.path)}>
            <div className="icon-wrapper">
              <action.icon className="h-5 w-5" />
            </div>
            <span className="whitespace-pre-line text-[11px] font-medium leading-tight text-foreground/80">
              {action.label}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}

/* ─── Right Sidebar: Expert Help CTA ─── */
function ExpertHelpCTA() {
  return (
    <div className="expert-help-card">
      <div className="relative z-10 space-y-2">
        <h3 className="text-base font-bold text-white">Need Expert Help?</h3>
        <p className="text-xs leading-relaxed text-white/80">
          Connect with our agriculture experts and get personalized advice.
        </p>
        <button className="mt-2 rounded-lg bg-white px-4 py-2 text-xs font-semibold text-red-600 shadow transition hover:bg-white/90 hover:shadow-md">
          Book Consultation
        </button>
      </div>
      <div className="absolute bottom-0 right-0 opacity-20">
        <img src="/images/ai-robot.jpg" alt="" className="h-24 w-24 rounded-br-2xl object-cover" />
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════
   MAIN HOME PAGE COMPONENT
   ═══════════════════════════════════════════════ */
export function HomePage() {
  const user = useAuthStore((s) => s.user);
  const displayName = user?.name?.split(" ")[0] ?? "Farmer";

  return (
    <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1fr_320px]">
      {/* ─── MAIN CONTENT ─── */}
      <div className="space-y-6">
        {/* Greeting */}
        <motion.div
          initial="hidden"
          animate="visible"
          custom={0}
          variants={fadeUp}
        >
          <h1 className="text-2xl font-bold text-foreground">
            {getGreeting()}, {displayName}! 👋
          </h1>
          <p className="text-sm text-muted-foreground">
            Here's what's happening in your farm today.
          </p>
        </motion.div>

        {/* Hero Banner + Stat Cards */}
        <motion.div initial="hidden" animate="visible" custom={1} variants={fadeUp}>
          <div className="hero-banner p-6 md:p-8">
            <div className="relative z-10 flex items-center justify-between">
              <div className="max-w-md" />
              <img
                src="/images/hero-banner.jpg"
                alt="Farm landscape"
                className="absolute inset-0 h-full w-full rounded-2xl object-cover opacity-30 mix-blend-overlay"
              />
            </div>
            {/* Spacer for the overlapping cards */}
            <div className="h-16 md:h-20" />
          </div>

          {/* Stat cards overlapping the banner */}
          <div className="-mt-16 grid grid-cols-1 gap-4 px-2 sm:grid-cols-2 lg:grid-cols-4 md:-mt-20 md:px-4">
            <WeatherCard />
            <CropHealthCard />
            <SoilMoistureCard />
            <MarketPriceCard />
          </div>
        </motion.div>

        {/* AI Assistant */}
        <motion.div initial="hidden" animate="visible" custom={2} variants={fadeUp}>
          <AIAssistantSection />
        </motion.div>

        {/* Crops + Recommendations */}
        <motion.div
          initial="hidden"
          animate="visible"
          custom={3}
          variants={fadeUp}
          className="grid grid-cols-1 gap-6 lg:grid-cols-2"
        >
          <MyCropsOverview />
          <TodaysRecommendation />
        </motion.div>

        {/* Bottom Stats */}
        <motion.div initial="hidden" animate="visible" custom={4} variants={fadeUp}>
          <StatsBar />
        </motion.div>
      </div>

      {/* ─── RIGHT SIDEBAR ─── */}
      <motion.aside
        initial="hidden"
        animate="visible"
        custom={2}
        variants={fadeUp}
        className="hidden space-y-5 xl:block"
      >
        <SmartNotifications />
        <QuickActions />
        <ExpertHelpCTA />
      </motion.aside>
    </div>
  );
}
