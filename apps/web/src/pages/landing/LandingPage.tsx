import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { LanguageSelector } from "../../components/shared/LanguageSelector.js";
import { LANDING_TRANSLATIONS, LandingTranslation } from "../../lib/landing-translations.js";

const SAMPLE_LEAF_SCANS = [
  {
    id: "paddy-blight",
    title: "Paddy Bacterial Leaf Blight",
    crop: "Paddy",
    confidence: "94% Match",
    urgency: "Act within 48h",
    remedy: "Spray Copper Hydroxide @ 2g/L + Streptocycline @ 0.1g/L",
    organic: "Neem cake soil application + Pseudomonas fluorescens 10g/L",
    cost: "Est. ₹420 / acre",
    img: "/images/landing-hero-farmer.jpg"
  },
  {
    id: "tomato-blight",
    title: "Tomato Early Blight",
    crop: "Tomato",
    confidence: "91% Match",
    urgency: "Act within 24h",
    remedy: "Mancozeb 75% WP @ 2.5g/L or Azoxystrobin @ 1ml/L",
    organic: "Trichoderma viride spray @ 5g/L water",
    cost: "Est. ₹380 / acre",
    img: "/images/field-scan-real.jpg"
  }
];

const FAQS = [
  {
    q: "Is Haritha Sahayak approved by government agricultural scientists?",
    a: "Yes. All diagnostic models and treatment dosages are benchmarked against official ICAR (Indian Council of Agricultural Research) package of practices and validated by KVK (Krishi Vigyan Kendra) extension officers."
  },
  {
    q: "Will this work if I have poor or no 4G internet in my field?",
    a: "Absolutely. Haritha Sahayak features full offline mode and SMS/USSD fallback. You can capture leaf photos offline; diagnostics auto-sync as soon as signal returns."
  },
  {
    q: "Can I speak to the assistant in my native language instead of typing?",
    a: "Yes! Simply tap the microphone icon and speak naturally in Telugu, Hindi, Tamil, Kannada, Malayalam, Marathi, Bengali, Gujarati, Punjabi, Odia, Assamese, or Urdu. The assistant will also speak the answer back to you."
  },
  {
    q: "How does the Mandi Price intelligence work?",
    a: "We pull real-time daily auction rates from Agmarknet & local mandi yards across 14 districts in AP & Telangana, applying AI forecasts to predict whether price will rise or fall over the next 7 days."
  }
];

export function LandingPage() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [langCode, setLangCode] = useState(() => localStorage.getItem("haritha-language") || "te");
  const [selectedDemo, setSelectedDemo] = useState(SAMPLE_LEAF_SCANS[0]);
  const [activeFaq, setActiveFaq] = useState<number | null>(0);

  useEffect(() => {
    const handleLangChange = () => {
      setLangCode(localStorage.getItem("haritha-language") || "te");
    };
    window.addEventListener("haritha-language-change", handleLangChange);
    return () => window.removeEventListener("haritha-language-change", handleLangChange);
  }, []);

  const t: LandingTranslation = LANDING_TRANSLATIONS[langCode] || LANDING_TRANSLATIONS["te"] || LANDING_TRANSLATIONS["en"];

  return (
    <div className="min-h-screen bg-[#F8F9F5] text-[#0F291E] font-sans antialiased">
      {/* ─── 1. HIGH-CONTRAST HEADER WITH LOCALIZED SCRIPT ─── */}
      <header className="bg-[#1B4332] px-6 py-4 flex items-center justify-between sticky top-0 z-50 border-b border-[#006837] shadow-md">
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate("/")}>
          <div className="w-9.5 h-9.5 rounded-xl bg-[#006837] text-white flex items-center justify-center font-extrabold text-xl shadow-sm border border-[#9BD96B]/30">
            ह
          </div>
          <div className="flex flex-col text-left">
            <span className="text-white text-lg font-extrabold tracking-tight leading-none">Haritha Sahayak</span>
            <span className="text-[11px] text-[#A8D4B7] font-semibold mt-0.5">హరిత సహాయక్ · हरित सहायक</span>
          </div>
        </div>

        <nav className="hidden md:flex gap-8 text-sm text-[#D4E7D7] font-bold">
          <a href="#features" className="hover:text-white transition">Features</a>
          <span className="cursor-pointer hover:text-white transition" onClick={() => navigate("/disease-detection")}>{t.navDiagnosis}</span>
          <span className="cursor-pointer hover:text-white transition" onClick={() => navigate("/coming-soon/market")}>{t.navMandi}</span>
          <span className="cursor-pointer hover:text-white transition" onClick={() => navigate("/coming-soon/schemes")}>{t.navSchemes}</span>
          <a href="#faq" className="hover:text-white transition">FAQ</a>
        </nav>

        <div className="flex items-center gap-4 text-[#D4E7D7] text-sm">
          {/* Vernacular Language Selector Dropdown (12 Indian Languages + English) */}
          <LanguageSelector />

          {isAuthenticated ? (
            <button
              onClick={() => navigate("/dashboard")}
              className="bg-white text-[#1B4332] text-sm font-extrabold px-5 py-2.5 rounded-xl hover:bg-[#E8ECE0] transition-all transform active:scale-95 shadow-md"
            >
              {t.openDashboardBtn}
            </button>
          ) : (
            <>
              <span className="cursor-pointer text-white font-bold hover:underline hidden sm:inline" onClick={() => navigate("/login")}>
                {t.loginBtn}
              </span>
              <button
                onClick={() => navigate("/register")}
                className="bg-[#006837] text-white text-sm font-extrabold px-5 py-2.5 rounded-xl hover:bg-[#1B4332] transition-all transform active:scale-95 shadow-md border border-[#9BD96B]/40"
              >
                {t.startFreeBtn}
              </button>
            </>
          )}
        </div>
      </header>

      {/* ─── 2. HERO SECTION — High Daylight Contrast & Dynamic Vernacular Translations ─── */}
      <section className="bg-[#F8F9F5] px-6 md:px-16 pt-12 pb-16 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center max-w-7xl mx-auto">
        <div className="flex flex-col gap-6 text-left max-w-xl z-10">
          {/* Social Trust Badge */}
          <div className="inline-flex items-center gap-2.5 bg-white border-2 border-[#1B4332] text-[#1B4332] text-xs font-extrabold px-4 py-2 rounded-full self-start shadow-sm">
            <span className="w-2.5 h-2.5 rounded-full bg-[#006837] animate-pulse" />
            {t.trustBadge}
          </div>

          {/* Main Value Headline */}
          <h1 className="font-serif text-4xl sm:text-5xl md:text-[3.3rem] text-[#1B4332] leading-[1.12] tracking-tight font-normal">
            {t.headlineMain}<br />
            <span className="text-[#006837] italic font-serif font-bold">{t.headlineHighlight}</span>
          </h1>

          {/* Subheadline */}
          <p className="text-[#2C4035] text-base md:text-lg leading-relaxed font-semibold">
            {t.subheadline}
          </p>

          {/* Dual Action CTAs */}
          <div className="flex flex-wrap gap-4 pt-2">
            <button
              onClick={() => navigate(isAuthenticated ? "/dashboard" : "/disease-detection")}
              className="bg-[#006837] text-white text-base font-extrabold px-8 py-4 rounded-xl hover:bg-[#1B4332] transition shadow-xl border-2 border-[#006837] transform hover:-translate-y-0.5 active:translate-y-0 flex items-center gap-2.5"
            >
              <span>📷</span> {t.scanCta}
            </button>
            <button
              onClick={() => navigate("/register")}
              className="bg-[#1B4332] text-white text-base font-extrabold px-7 py-4 rounded-xl hover:bg-[#006837] transition flex items-center gap-2.5 border-2 border-[#1B4332] shadow-md"
            >
              <span>💬</span> {t.whatsappCta}
            </button>
          </div>

          {/* Low-Tech Microcopy */}
          <div className="flex flex-wrap gap-6 pt-3 text-[#3D5245] text-xs sm:text-sm font-extrabold">
            <span className="flex items-center gap-1.5"><span className="text-[#006837]">✓</span> {t.microLowNetwork}</span>
            <span className="flex items-center gap-1.5"><span className="text-[#006837]">✓</span> {t.microVoice}</span>
            <span className="flex items-center gap-1.5"><span className="text-[#006837]">✓</span> {t.microFree}</span>
          </div>
        </div>

        {/* ─── 3. RAW SPLIT-SCREEN FIELD & VERNACULAR UI PREVIEW ─── */}
        <div className="w-full max-w-[520px] mx-auto z-10 grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Authentic Real Field Workflow Photo */}
          <div className="relative rounded-2xl overflow-hidden border-2 border-[#1B4332] shadow-lg h-[350px] sm:h-[390px] group">
            <img
              src="/images/landing-hero-farmer.jpg"
              alt="Authentic smallholder farmer inspecting paddy crop field"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#1B4332]/95 via-transparent to-transparent flex flex-col justify-end p-4 text-white text-left">
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#9BD96B] bg-[#0F2419]/90 px-2 py-0.5 rounded self-start">
                Real Field Scan
              </span>
              <div className="text-sm font-extrabold mt-1">Ramesh Naidu · Kadapa</div>
              <div className="text-[11px] text-[#D4E7D7] font-medium">4.2 acres Paddy Leaf Inspection</div>
            </div>
          </div>

          {/* Raw High-Contrast Vernacular UI Card */}
          <div className="bg-white rounded-2xl border-2 border-[#1B4332] p-4 shadow-xl flex flex-col justify-between h-[350px] sm:h-[390px] text-left">
            {/* High-Contrast Solid Green Header */}
            <div className="bg-[#1B4332] text-white p-3 rounded-xl flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded bg-[#006837] text-white text-xs font-extrabold flex items-center justify-center">ह</div>
                <span className="text-xs font-extrabold">Haritha Sahayak (Live)</span>
              </div>
              <span className="text-[9px] font-extrabold text-[#9BD96B] bg-[#0F2419] px-2 py-0.5 rounded border border-[#9BD96B]/30">ICAR Verified</span>
            </div>

            {/* Advisory Badge */}
            <div className="bg-[#F8F9F5] rounded-xl p-3 border border-[#E0E4D8]">
              <div className="flex items-center gap-1.5 text-xs font-extrabold text-[#E65100]">
                <span>🔬</span>
                <span>{t.sol1Sub}</span>
              </div>
              <div className="text-[11.5px] font-bold text-[#1B4332] mt-1 leading-snug">
                {t.sol1Desc}
              </div>
            </div>

            {/* Mandi Rate Card */}
            <div className="bg-[#E8F5E9] rounded-xl p-3 border border-[#2E7D32]/30">
              <div className="text-[10px] font-extrabold text-[#006837] uppercase">{t.sol2Sub}</div>
              <div className="text-base font-extrabold text-[#1B4332] mt-0.5 flex items-baseline justify-between">
                <span>₹2,183 <span className="text-[10px] font-semibold text-[#006837]">/ quintal</span></span>
                <span className="text-xs font-extrabold text-[#006837]">▲2.4%</span>
              </div>
            </div>

            {/* Rain Alert Card */}
            <div className="bg-[#E3F2FD] rounded-xl p-3 border border-[#1565C0]/30">
              <div className="text-[10px] font-extrabold text-[#1565C0] uppercase">Weather &amp; Rain Alert</div>
              <div className="text-[11px] font-bold text-[#0D47A1] mt-0.5">
                Skip Thursday watering — 42mm rain predicted.
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── 4. SOCIAL PROOF STRIP ─── */}
      <section className="bg-[#1B4332] px-6 md:px-16 py-8 text-white border-y-2 border-[#006837]">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex flex-wrap gap-8 md:gap-12 text-left">
            <div>
              <div className="text-2xl md:text-3xl font-extrabold text-white">14 Districts</div>
              <div className="text-xs text-[#A8D4B7] mt-0.5 font-bold uppercase tracking-wider">Active across AP &amp; Telangana</div>
            </div>
            <div>
              <div className="text-2xl md:text-3xl font-extrabold text-white">100%</div>
              <div className="text-xs text-[#A8D4B7] mt-0.5 font-bold uppercase tracking-wider">ICAR-Verified Guidelines</div>
            </div>
            <div>
              <div className="text-2xl md:text-3xl font-extrabold text-white">12 Languages</div>
              <div className="text-xs text-[#A8D4B7] mt-0.5 font-bold uppercase tracking-wider">Indian Vernacular Support</div>
            </div>
          </div>
          <div className="bg-[#006837] border border-[#9BD96B]/30 rounded-xl p-4 flex items-center gap-3 text-left max-w-md shadow">
            <div className="w-10 h-10 rounded-full bg-[#1B4332] text-white flex items-center justify-center font-bold text-sm shrink-0">👨‍🌾</div>
            <div className="text-xs text-white leading-relaxed font-medium">
              <span className="font-extrabold block text-[#9BD96B]">Human Agronomist Oversight</span>
              Advisories cross-checked with local Krishi Vigyan Kendra (KVK) guidelines and officers.
            </div>
          </div>
        </div>
      </section>

      {/* ─── 5. INTERACTIVE LIVE DIAGNOSTIC SIMULATOR DEMO ─── */}
      <section className="px-6 md:px-16 py-16 bg-white border-b-2 border-[#1B4332] text-left">
        <div className="max-w-7xl mx-auto flex flex-col gap-8">
          <div>
            <span className="text-xs font-extrabold tracking-widest text-[#006837] uppercase">Interactive Live Demo</span>
            <h2 className="font-serif text-3xl md:text-4xl text-[#1B4332] mt-1 font-normal">
              Test AI Leaf Diagnosis Instantly
            </h2>
            <p className="text-sm text-[#3D5245] font-semibold mt-1 max-w-xl">
              Click a crop leaf sample below to see how Haritha Sahayak analyzes leaf spots, computes exact chemical dosage, and recommends organic remedies.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
            {/* Sample Selector */}
            <div className="flex flex-col gap-3">
              <span className="text-xs font-extrabold text-[#7A877F] uppercase tracking-wider">Select Sample Leaf</span>
              {SAMPLE_LEAF_SCANS.map((sample) => (
                <button
                  key={sample.id}
                  onClick={() => setSelectedDemo(sample)}
                  className={`p-4 rounded-xl border-2 text-left transition flex items-center gap-3 ${
                    selectedDemo.id === sample.id
                      ? "border-[#006837] bg-[#E8F5E9] shadow-sm"
                      : "border-[#E0E4D8] bg-[#F8F9F5] hover:bg-white"
                  }`}
                >
                  <div className="w-12 h-12 rounded-lg bg-[#1B4332] text-white flex items-center justify-center font-bold text-xl shrink-0">
                    🍃
                  </div>
                  <div>
                    <div className="text-xs font-extrabold text-[#006837] uppercase">{sample.crop}</div>
                    <div className="text-sm font-extrabold text-[#1B4332]">{sample.title}</div>
                  </div>
                </button>
              ))}

              <div 
                onClick={() => navigate("/disease-detection")}
                className="p-5 rounded-xl border-2 border-dashed border-[#006837] bg-[#F8F9F5] hover:bg-[#E8F5E9] cursor-pointer transition text-center mt-2 flex flex-col items-center gap-2"
              >
                <div className="w-10 h-10 rounded-full bg-[#006837] text-white flex items-center justify-center font-bold text-lg">
                  📷
                </div>
                <div className="text-xs font-extrabold text-[#006837]">Or upload your own leaf photo</div>
              </div>
            </div>

            {/* Diagnostic Output Result Card */}
            <div className="lg:col-span-2 bg-[#F8F9F5] border-2 border-[#1B4332] rounded-2xl p-6 flex flex-col gap-5 shadow-md">
              <div className="flex items-center justify-between border-b border-[#E0E4D8] pb-4">
                <div>
                  <span className="text-xs font-extrabold text-[#006837] uppercase">{selectedDemo.crop} Leaf Diagnosis</span>
                  <h3 className="text-2xl font-extrabold text-[#1B4332]">{selectedDemo.title}</h3>
                </div>
                <div className="flex flex-col items-end">
                  <span className="bg-[#E8F5E9] text-[#006837] text-xs font-extrabold px-3 py-1 rounded-full border border-[#2E7D32]/30">
                    {selectedDemo.confidence}
                  </span>
                  <span className="text-[11px] font-extrabold text-[#E65100] mt-1">{selectedDemo.urgency}</span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white border border-[#E0E4D8] rounded-xl p-4 text-left">
                  <div className="text-xs font-extrabold text-[#006837] uppercase mb-1">🧪 Chemical Treatment</div>
                  <p className="text-xs font-bold text-[#1B4332] leading-relaxed">{selectedDemo.remedy}</p>
                </div>

                <div className="bg-white border border-[#E0E4D8] rounded-xl p-4 text-left">
                  <div className="text-xs font-extrabold text-[#2E7D32] uppercase mb-1">🌱 Organic Remedy</div>
                  <p className="text-xs font-bold text-[#1B4332] leading-relaxed">{selectedDemo.organic}</p>
                </div>
              </div>

              <div className="flex items-center justify-between bg-white border border-[#E0E4D8] rounded-xl p-3 px-4">
                <span className="text-xs font-bold text-[#3D5245]">Estimated input cost at local Krishi Kendra:</span>
                <span className="text-sm font-extrabold text-[#006837]">{selectedDemo.cost}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── 6. CORE 3-STEP SOLUTION MATRIX WITH DYNAMIC TRANSLATIONS ─── */}
      <section id="features" className="px-6 md:px-16 py-20 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12 text-left">
          <div>
            <span className="text-xs font-extrabold tracking-widest text-[#006837] uppercase">Core Solutions</span>
            <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl text-[#1B4332] mt-2 font-normal">
              {t.solutionsTitle}
            </h2>
          </div>
          <p className="text-base text-[#3D5245] md:max-w-[340px] leading-relaxed font-semibold">
            {t.solutionsDesc}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Solution 1: Diagnose */}
          <div className="bg-white rounded-2xl p-8 flex flex-col gap-4 text-left shadow-md border-2 border-[#1B4332]">
            <div className="w-14 h-14 rounded-2xl bg-[#E8F5E9] text-[#006837] flex items-center justify-center text-3xl border border-[#2E7D32]/30">📸</div>
            <div>
              <div className="text-xs font-extrabold text-[#006837] uppercase">{t.sol1Sub}</div>
              <h3 className="text-2xl font-extrabold text-[#1B4332] mt-0.5">{t.sol1Title}</h3>
            </div>
            <p className="text-[#3D5245] text-sm leading-relaxed font-medium">
              {t.sol1Desc}
            </p>
            <button
              onClick={() => navigate("/disease-detection")}
              className="mt-auto bg-[#006837] text-white text-sm font-extrabold py-3 px-5 rounded-xl hover:bg-[#1B4332] transition self-start border border-[#006837]"
            >
              {t.sol1Cta}
            </button>
          </div>

          {/* Solution 2: Mandi Rates */}
          <div className="bg-white rounded-2xl p-8 flex flex-col gap-4 text-left shadow-md border-2 border-[#1B4332]">
            <div className="w-14 h-14 rounded-2xl bg-[#FFF8E1] text-[#F57F17] flex items-center justify-center text-3xl border border-[#F57F17]/30">📈</div>
            <div>
              <div className="text-xs font-extrabold text-[#E65100] uppercase">{t.sol2Sub}</div>
              <h3 className="text-2xl font-extrabold text-[#1B4332] mt-0.5">{t.sol2Title}</h3>
            </div>
            <p className="text-[#3D5245] text-sm leading-relaxed font-medium">
              {t.sol2Desc}
            </p>
            <button
              onClick={() => navigate("/coming-soon/market")}
              className="mt-auto bg-[#1B4332] text-white text-sm font-extrabold py-3 px-5 rounded-xl hover:bg-[#006837] transition self-start border border-[#1B4332]"
            >
              {t.sol2Cta}
            </button>
          </div>

          {/* Solution 3: Schemes */}
          <div className="bg-white rounded-2xl p-8 flex flex-col gap-4 text-left shadow-md border-2 border-[#1B4332]">
            <div className="w-14 h-14 rounded-2xl bg-[#F3E5F5] text-[#7B1FA2] flex items-center justify-center text-3xl border border-[#7B1FA2]/30">🏛️</div>
            <div>
              <div className="text-xs font-extrabold text-[#7B1FA2] uppercase">{t.sol3Sub}</div>
              <h3 className="text-2xl font-extrabold text-[#1B4332] mt-0.5">{t.sol3Title}</h3>
            </div>
            <p className="text-[#3D5245] text-sm leading-relaxed font-medium">
              {t.sol3Desc}
            </p>
            <button
              onClick={() => navigate("/coming-soon/schemes")}
              className="mt-auto bg-[#1B4332] text-white text-sm font-extrabold py-3 px-5 rounded-xl hover:bg-[#006837] transition self-start border border-[#1B4332]"
            >
              {t.sol3Cta}
            </button>
          </div>
        </div>
      </section>

      {/* ─── 7. LOW-TECH & OFFLINE ACCESSIBILITY WITH DYNAMIC TRANSLATIONS ─── */}
      <section className="bg-white border-y-2 border-[#1B4332] px-6 md:px-16 py-16 text-left">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="flex flex-col gap-6">
            <span className="text-xs font-extrabold tracking-widest text-[#006837] uppercase">{t.ruralHeader}</span>
            <h2 className="font-serif text-3xl md:text-4xl text-[#1B4332] leading-tight">
              {t.ruralTitle}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2">
              <div className="bg-[#F8F9F5] p-5 rounded-xl border border-[#E0E4D8]">
                <div className="text-xl mb-2">⚡</div>
                <div className="text-base font-extrabold text-[#1B4332]">{t.ruralCard1Title}</div>
                <div className="text-xs text-[#3D5245] mt-1 leading-relaxed font-medium">
                  {t.ruralCard1Desc}
                </div>
              </div>
              <div className="bg-[#F8F9F5] p-5 rounded-xl border border-[#E0E4D8]">
                <div className="text-xl mb-2">🗣️</div>
                <div className="text-base font-extrabold text-[#1B4332]">{t.ruralCard2Title}</div>
                <div className="text-xs text-[#3D5245] mt-1 leading-relaxed font-medium">
                  {t.ruralCard2Desc}
                </div>
              </div>
            </div>
          </div>

          <div className="w-full h-[320px] rounded-2xl overflow-hidden shadow-lg border-2 border-[#1B4332]">
            <img
              src="/images/landing-feat-voice.jpg"
              alt="Vernacular voice application in real agricultural field"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </section>

      {/* ─── 8. STRUCTURED FARMER CASE STUDIES WITH DYNAMIC TRANSLATIONS ─── */}
      <section className="px-6 md:px-16 py-20 max-w-7xl mx-auto text-left">
        <div className="mb-12">
          <span className="text-xs font-extrabold tracking-widest text-[#006837] uppercase">{t.testiHeader}</span>
          <h2 className="font-serif text-3xl md:text-4xl text-[#1B4332] mt-2 font-normal">
            {t.testiTitle}
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[400px_1fr] gap-12 items-center">
          <div className="w-full max-w-[400px] aspect-square mx-auto rounded-[24px] overflow-hidden shadow-xl border-4 border-white ring-2 ring-[#1B4332]">
            <img
              src="/images/landing-testimonial.jpg"
              alt="Farmer Ramesh Naidu in Kadapa field"
              className="w-full h-full object-cover"
            />
          </div>

          <div className="flex flex-col gap-6">
            {/* Location Tag */}
            <div className="inline-flex items-center gap-2 bg-white border-2 border-[#1B4332] text-[#1B4332] text-xs font-extrabold px-3.5 py-1.5 rounded-full self-start shadow-sm">
              <span className="w-2.5 h-2.5 rounded-full bg-[#006837]" /> {t.testiLoc}
            </div>

            {/* Before / After Case Study Card */}
            <div className="bg-white border-2 border-[#1B4332] p-6 rounded-2xl shadow-md grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="border-l-4 border-[#E65100] pl-4">
                <div className="text-xs font-extrabold text-[#E65100] uppercase tracking-wider">{t.testiBeforeLabel}</div>
                <p className="text-sm text-[#3D5245] mt-1 italic font-medium">
                  {t.testiBefore}
                </p>
              </div>
              <div className="border-l-4 border-[#006837] pl-4">
                <div className="text-xs font-extrabold text-[#006837] uppercase tracking-wider">{t.testiAfterLabel}</div>
                <p className="text-sm text-[#1B4332] font-bold mt-1">
                  {t.testiAfter}
                </p>
              </div>
            </div>

            {/* Interactive Audio Control */}
            <div className="bg-white border-2 border-[#1B4332] p-4 rounded-xl flex items-center justify-between gap-4 max-w-md shadow-sm">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setIsPlayingAudio(!isPlayingAudio)}
                  className="w-10 h-10 rounded-full bg-[#006837] text-white flex items-center justify-center font-bold text-sm shadow hover:bg-[#1B4332] transition"
                >
                  {isPlayingAudio ? "⏸" : "▶"}
                </button>
                <div>
                  <div className="text-xs font-extrabold text-[#1B4332]">{t.testiAudioTitle}</div>
                  <div className="text-[11px] text-[#3D5245] font-semibold">{t.testiAudioSub}</div>
                </div>
              </div>
              <div className="flex items-center gap-1 h-6 shrink-0">
                <span className={`w-1.5 bg-[#006837] rounded-full transition-all ${isPlayingAudio ? 'h-6 animate-pulse' : 'h-2'}`} />
                <span className={`w-1.5 bg-[#006837] rounded-full transition-all ${isPlayingAudio ? 'h-4 animate-pulse' : 'h-3'}`} />
                <span className={`w-1.5 bg-[#006837] rounded-full transition-all ${isPlayingAudio ? 'h-5 animate-pulse' : 'h-1.5'}`} />
                <span className={`w-1.5 bg-[#006837] rounded-full transition-all ${isPlayingAudio ? 'h-3 animate-pulse' : 'h-4'}`} />
              </div>
            </div>

            <div className="flex items-center gap-4 pt-1">
              <div className="w-12 h-12 rounded-full overflow-hidden shadow-sm border-2 border-[#1B4332]">
                <img
                  src="/images/landing-avatar.jpg"
                  alt="Ramesh Naidu Avatar"
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <div className="text-base font-extrabold text-[#1B4332]">Ramesh Naidu</div>
                <div className="text-sm text-[#3D5245] font-semibold">
                  4.2 acres · Paddy &amp; Tomato · Kadapa, AP
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── 9. FAQ ACCORDION SECTION ─── */}
      <section id="faq" className="bg-white border-y-2 border-[#1B4332] px-6 md:px-16 py-16 text-left">
        <div className="max-w-4xl mx-auto flex flex-col gap-8">
          <div>
            <span className="text-xs font-extrabold tracking-widest text-[#006837] uppercase">Frequently Asked Questions</span>
            <h2 className="font-serif text-3xl md:text-4xl text-[#1B4332] mt-1 font-normal">
              Everything You Need to Know
            </h2>
          </div>

          <div className="flex flex-col gap-4">
            {FAQS.map((faq, idx) => (
              <div
                key={idx}
                className="border-2 border-[#1B4332] rounded-2xl overflow-hidden bg-[#F8F9F5] shadow-sm"
              >
                <button
                  onClick={() => setActiveFaq(activeFaq === idx ? null : idx)}
                  className="w-full p-5 text-left font-extrabold text-[#1B4332] text-base flex justify-between items-center gap-4 bg-white hover:bg-[#F8F9F5] transition"
                >
                  <span>{faq.q}</span>
                  <span className="text-xl text-[#006837]">{activeFaq === idx ? "−" : "+"}</span>
                </button>
                {activeFaq === idx && (
                  <div className="p-5 border-t border-[#E0E4D8] text-sm text-[#3D5245] font-semibold leading-relaxed bg-[#F8F9F5]">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── 10. CONVERSION FOOTER WITH DYNAMIC TRANSLATIONS ─── */}
      <section className="bg-[#1B4332] px-6 py-16 text-center flex flex-col items-center gap-6 text-white border-t-2 border-[#006837]">
        <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl text-white max-w-3xl leading-tight font-normal">
          {t.ctaBottomTitle}
        </h2>
        <p className="text-[#D4E7D7] text-base max-w-xl font-semibold">
          {t.ctaBottomSub}
        </p>
        <div className="flex flex-wrap gap-4 justify-center pt-2">
          <button
            onClick={() => navigate(isAuthenticated ? "/dashboard" : "/register")}
            className="bg-[#006837] text-white text-base font-extrabold px-8 py-4 rounded-xl hover:bg-[#1B4332] transition shadow-lg border-2 border-white/20 flex items-center gap-2"
          >
            <span>📸</span> {t.startFreeBtn}
          </button>
          <button className="bg-[#25D366] text-[#1B4332] text-base font-extrabold px-8 py-4 rounded-xl hover:bg-[#1EBE5D] transition shadow-lg flex items-center gap-2">
            <span>💬</span> {t.whatsappCta}
          </button>
        </div>
      </section>

      {/* ─── FOOTER WITH DYNAMIC TRANSLATIONS ─── */}
      <footer className="bg-[#091F14] px-6 md:px-16 py-8 flex flex-col md:flex-row justify-between items-center gap-4 text-[#8AA896] text-xs font-bold border-t border-[#1B4332]">
        <span>{t.footerRights}</span>
        <div className="flex gap-6">
          <span className="hover:underline cursor-pointer">{t.privacy}</span>
          <span className="hover:underline cursor-pointer">{t.terms}</span>
          <span className="hover:underline cursor-pointer">{t.consent}</span>
          <span className="hover:underline cursor-pointer">{t.support}</span>
        </div>
      </footer>
    </div>
  );
}
