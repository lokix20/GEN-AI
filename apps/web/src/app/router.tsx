import { lazy, Suspense } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { RouteGuard, GuestOnlyRoute } from "../components/layout/RouteGuard.js";
import { AppShell } from "../components/layout/AppShell.js";

const LandingPage = lazy(() => import("../pages/landing/LandingPage").then((m) => ({ default: m.LandingPage })));
const LoginPage = lazy(() => import("../pages/auth/LoginPage").then((m) => ({ default: m.LoginPage })));
const RegisterPage = lazy(() => import("../pages/auth/RegisterPage").then((m) => ({ default: m.RegisterPage })));
const VerifyOtpPage = lazy(() => import("../pages/auth/VerifyOtpPage").then((m) => ({ default: m.VerifyOtpPage })));
const ForgotPasswordPage = lazy(() =>
  import("../pages/auth/ForgotPasswordPage").then((m) => ({ default: m.ForgotPasswordPage })),
);
const ResetPasswordPage = lazy(() =>
  import("../pages/auth/ResetPasswordPage").then((m) => ({ default: m.ResetPasswordPage })),
);
const OnboardingPage = lazy(() => import("../pages/onboarding/OnboardingPage").then((m) => ({ default: m.OnboardingPage })));
const DashboardPage = lazy(() => import("../pages/dashboard/DashboardPage").then((m) => ({ default: m.DashboardPage })));
const ChatPage = lazy(() => import("../pages/chat/ChatPage").then((m) => ({ default: m.ChatPage })));
const DiseaseDetectionPage = lazy(() =>
  import("../pages/disease-detection/DiseaseDetectionPage").then((m) => ({ default: m.DiseaseDetectionPage })),
);
const WeatherPage = lazy(() => import("../pages/weather/WeatherPage").then((m) => ({ default: m.WeatherPage })));
const IrrigationPage = lazy(() => import("../pages/irrigation/IrrigationPage").then((m) => ({ default: m.IrrigationPage })));
const CropCalendarPage = lazy(() => import("../pages/crop-calendar/CropCalendarPage").then((m) => ({ default: m.CropCalendarPage })));
const ComingSoonPage = lazy(() => import("../pages/coming-soon/ComingSoonPage").then((m) => ({ default: m.ComingSoonPage })));

function RouteFallback() {
  return (
    <div className="flex h-[60vh] items-center justify-center">
      <div className="h-8 w-8 animate-spin rounded-full border-4 border-forest/30 border-t-forest" />
    </div>
  );
}

export function AppRouter() {
  return (
    <Suspense fallback={<RouteFallback />}>
      <Routes>
        {/* Public landing page */}
        <Route path="/" element={<LandingPage />} />

        {/* Guest-only auth pages */}
        <Route element={<GuestOnlyRoute />}>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/verify-otp" element={<VerifyOtpPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />
        </Route>

        {/* Protected routes */}
        <Route element={<RouteGuard />}>
          <Route path="/onboarding" element={<OnboardingPage />} />
          <Route element={<AppShell />}>
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/chat" element={<ChatPage />} />
            <Route path="/chat/:sessionId" element={<ChatPage />} />
            <Route path="/disease-detection" element={<DiseaseDetectionPage />} />
            <Route path="/weather" element={<WeatherPage />} />
            <Route path="/irrigation" element={<IrrigationPage />} />
            <Route path="/crop-calendar" element={<CropCalendarPage />} />
            <Route path="/coming-soon/:key" element={<ComingSoonPage />} />
          </Route>
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  );
}
