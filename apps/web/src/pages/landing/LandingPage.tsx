import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

export function LandingPage() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  return (
    <div className="min-h-screen bg-[#F7FAF6] text-[#0A1C13] font-sans antialiased">
      {/* HEADER / NAV */}
      <header className="bg-[#0F2B1D] px-6 py-4 flex items-center justify-between sticky top-0 z-50 border-b border-[#1A3B2A]">
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate("/")}>
          <div className="w-9 h-9 rounded-xl bg-[#236A43] text-white flex items-center justify-center font-extrabold text-lg shadow-sm">
            ह
          </div>
          <span className="text-[#F7FAF6] text-lg font-bold tracking-tight">Haritha Sahayak</span>
        </div>

        <nav className="hidden md:flex gap-6 text-sm text-[#A8C7B5] font-medium">
          <span className="cursor-pointer hover:text-white transition">Features</span>
          <span className="cursor-pointer hover:text-white transition" onClick={() => navigate("/disease-detection")}>Crop diagnosis</span>
          <span className="cursor-pointer hover:text-white transition" onClick={() => navigate("/coming-soon/market")}>Market prices</span>
          <span className="cursor-pointer hover:text-white transition" onClick={() => navigate("/coming-soon/schemes")}>Schemes</span>
          <span className="cursor-pointer hover:text-white transition">Pricing</span>
        </nav>

        <div className="flex items-center gap-4 text-[#A8C7B5] text-sm">
          <span className="hidden sm:inline cursor-pointer hover:text-white transition">తెలుగు · हिंदी · English ▾</span>
          {isAuthenticated ? (
            <button
              onClick={() => navigate("/dashboard")}
              className="bg-[#236A43] text-white text-sm font-bold px-5 py-2.5 rounded-lg hover:bg-[#1B5434] transition-all transform active:scale-95 shadow-md"
            >
              Go to Dashboard
            </button>
          ) : (
            <>
              <span className="cursor-pointer text-[#F7FAF6] font-semibold hover:underline" onClick={() => navigate("/login")}>
                Log in
              </span>
              <button
                onClick={() => navigate("/register")}
                className="bg-[#236A43] text-white text-sm font-bold px-5 py-2.5 rounded-lg hover:bg-[#1B5434] transition-all transform active:scale-95 shadow-md"
              >
                Start free
              </button>
            </>
          )}
        </div>
      </header>

      {/* HERO SECTION */}
      <section className="bg-[#0F2B1D] px-6 md:px-16 pt-12 pb-20 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative overflow-hidden">
        <div className="flex flex-col gap-6 text-left max-w-xl z-10">
          <div className="inline-flex items-center gap-2 bg-[#1A3B2A] border border-[#2B543D] text-[#D4E7D7] text-xs font-semibold px-4 py-2 rounded-full self-start">
            <span className="w-2 h-2 rounded-full bg-[#236A43]"></span>
            Active across 14 districts in AP & Telangana · ICAR verified
          </div>
          <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl text-[#F7FAF6] leading-[1.08] tracking-tight">
            Clear answers for your crops,<br />
            <span className="text-[#8FB397] italic font-normal font-serif">right when you need them.</span>
          </h1>
          <p className="text-[#B5D1C1] text-base md:text-lg leading-relaxed">
            Photograph a sick leaf for instant guidance, check local mandi rates, and verify government scheme eligibility in minutes — backed by local agricultural extension experts.
          </p>
          <div className="flex flex-wrap gap-4 pt-2">
            <button
              onClick={() => navigate(isAuthenticated ? "/dashboard" : "/register")}
              className="bg-[#236A43] text-white text-base font-bold px-8 py-4 rounded-xl hover:bg-[#1B5434] transition shadow-lg transform hover:-translate-y-0.5 active:translate-y-0"
            >
              Start free — no card needed
            </button>
            <button className="border border-[#2B543D] text-[#F7FAF6] text-base font-semibold px-7 py-4 rounded-xl hover:bg-white/5 transition flex items-center gap-2">
              <span>▶ Watch 90-sec demo</span>
            </button>
          </div>
          <div className="flex flex-wrap gap-6 pt-4 text-[#8AA896] text-sm font-medium">
            <span>✓ Works offline on low network</span>
            <span>✓ Available in 11 Indian languages</span>
            <span>✓ Free tier forever</span>
          </div>
        </div>

        {/* Real Product Mockup in Smartphone Frame */}
        <div className="relative w-full max-w-[440px] mx-auto z-10 flex justify-center">
          <div className="relative w-[340px] sm:w-[380px] bg-[#091F14] rounded-[44px] p-4 shadow-2xl border-4 border-[#1A3B2A] ring-1 ring-white/10">
            {/* Phone Notch / Speaker */}
            <div className="w-32 h-4 bg-[#091F14] rounded-b-xl mx-auto absolute top-4 left-1/2 -translate-x-1/2 z-20 flex items-center justify-center gap-2">
              <div className="w-3 h-3 rounded-full bg-[#0F2B1D]" />
              <div className="w-10 h-1.5 rounded-full bg-[#0F2B1D]" />
            </div>

            {/* Screen Content */}
            <div className="bg-[#F7FAF6] rounded-[32px] overflow-hidden pt-8 pb-4 px-4 flex flex-col gap-3 text-left">
              {/* App Status Header */}
              <div className="flex items-center justify-between pb-2 border-b border-[#D6E4DB]">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-md bg-[#236A43] text-white text-xs font-bold flex items-center justify-center">ह</div>
                  <span className="text-xs font-bold text-[#0A1C13]">Haritha Mobile</span>
                </div>
                <span className="text-[10px] font-semibold text-[#1B5434] bg-[#E4F2E9] px-2 py-0.5 rounded-full">✓ Verified ICAR</span>
              </div>

              {/* Mockup Leaf Image & Scan Output */}
              <div className="relative rounded-2xl overflow-hidden h-[180px] border border-[#D6E4DB] group">
                <img
                  src="/images/landing-hero-farmer.jpg"
                  alt="Farmer in field with mobile app"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent flex flex-col justify-end p-3 text-white">
                  <span className="text-[10px] uppercase font-bold tracking-wider text-[#D4E7D7]">Real-time scan</span>
                  <div className="text-xs font-bold">Paddy Leaf Blight · Early Stage</div>
                </div>
              </div>

              {/* Integrated Diagnostic Result Card */}
              <div className="bg-white rounded-xl p-3 border border-[#D6E4DB] shadow-sm flex items-start gap-3">
                <div className="w-9 h-9 rounded-lg bg-[#E4F2E9] text-[#236A43] flex items-center justify-center text-lg shrink-0">🔬</div>
                <div>
                  <div className="text-xs font-bold text-[#0A1C13]">Diagnosis: Leaf Blight (88% certainty)</div>
                  <div className="text-[11px] text-[#4A6354] mt-0.5">Spray Copper Oxychloride 3g/L before rain tomorrow.</div>
                </div>
              </div>

              {/* Integrated Mandi Card */}
              <div className="bg-[#EDF5EF] rounded-xl p-3 border border-[#D6E4DB] flex items-center justify-between">
                <div>
                  <div className="text-[10px] font-bold text-[#5C7866] uppercase">Kadapa Mandi · Paddy</div>
                  <div className="text-sm font-extrabold text-[#0A1C13]">₹2,183 <span className="text-[10px] font-normal text-[#4A6354]">/ quintal</span></div>
                </div>
                <span className="text-xs font-bold text-[#1B5434] bg-[#E4F2E9] px-2.5 py-1 rounded-lg">▲ 2.4% Good price</span>
              </div>
            </div>
          </div>
        </div>

        {/* Ambient radial backdrop */}
        <div className="absolute right-0 bottom-0 w-[50%] h-[50%] bg-[radial-gradient(circle,rgba(35,106,67,0.12)_0%,transparent_70%)] pointer-events-none" />
      </section>

      {/* HUMAN CREDIBILITY & VERIFIABLE PROOF STRIP */}
      <section className="bg-[#143622] border-t border-[#1A3B2A] px-6 md:px-16 py-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex flex-wrap gap-8 md:gap-12 text-left">
            <div>
              <div className="text-2xl md:text-3xl font-extrabold text-[#F7FAF6]">14 Districts</div>
              <div className="text-xs text-[#B5D1C1] mt-0.5 font-medium uppercase tracking-wider">Active across AP & Telangana</div>
            </div>
            <div>
              <div className="text-2xl md:text-3xl font-extrabold text-[#F7FAF6]">100%</div>
              <div className="text-xs text-[#B5D1C1] mt-0.5 font-medium uppercase tracking-wider">ICAR-Aligned Guidelines</div>
            </div>
            <div>
              <div className="text-2xl md:text-3xl font-extrabold text-[#F7FAF6]">11 Languages</div>
              <div className="text-xs text-[#B5D1C1] mt-0.5 font-medium uppercase tracking-wider">Local Dialect Voice Support</div>
            </div>
          </div>
          <div className="bg-[#0F2B1D] border border-[#2B543D] rounded-xl p-4 flex items-center gap-3 text-left max-w-md">
            <div className="w-10 h-10 rounded-full bg-[#236A43] text-white flex items-center justify-center font-bold text-sm shrink-0">👨‍🌾</div>
            <div className="text-xs text-[#B5D1C1] leading-relaxed">
              <span className="font-bold text-white block">Human Agronomist Oversight</span>
              AI advisories are cross-checked with local Krishi Vigyan Kendra (KVK) guidelines and on-call extension officers.
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES / WHAT IT DOES */}
      <section className="px-6 md:px-16 py-20 flex flex-col gap-12 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="max-w-2xl text-left">
            <span className="text-xs font-bold tracking-widest text-[#236A43] uppercase">What it does</span>
            <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl text-[#0A1C13] mt-2 leading-tight">
              Practical guidance for your daily farm decisions.
            </h2>
          </div>
          <p className="text-base text-[#4A6354] md:max-w-[340px] leading-relaxed text-left">
            Clear, actionable answers without relying on delayed agent visits or static bulletin boards.
          </p>
        </div>

        {/* Feature Grid Row 1 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-[1.25fr_1fr_1fr] gap-6">
          {/* Card 1: Crop Diagnosis */}
          <div className="bg-[#0F2B1D] rounded-2xl p-8 flex flex-col gap-4 min-h-[340px] text-left text-white shadow-lg relative overflow-hidden border border-[#1A3B2A]">
            <span className="text-[10px] font-bold tracking-widest text-[#D4E7D7] uppercase">Crop diagnosis</span>
            <h3 className="text-3xl font-extrabold leading-tight text-[#F7FAF6]">Snap a leaf.<br />Get clear advice.</h3>
            <p className="text-[#B5D1C1] text-sm leading-relaxed max-w-xs">
              Take a photo of any crop issue. The app identifies symptoms, assesses severity, and recommends verified dosage steps.
            </p>
            <div className="mt-auto rounded-xl overflow-hidden h-[130px] w-full shadow-inner border border-[#1A3B2A]">
              <img
                src="/images/landing-feat-scan.jpg"
                alt="Farmer leaf scan in agricultural field"
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Card 2: Irrigation Planner */}
          <div className="bg-[#EDF5EF] border border-[#D6E4DB] rounded-2xl p-8 flex flex-col gap-4 text-left shadow-sm">
            <span className="text-[10px] font-bold tracking-widest text-[#5C7866] uppercase">Irrigation planner</span>
            <h3 className="text-2xl font-extrabold text-[#0A1C13] leading-snug">Irrigate based on soil & weather</h3>
            <p className="text-[#4A6354] text-sm leading-relaxed">
              Real-time soil moisture checks combined with local rain forecasts mean you never waste water or diesel.
            </p>
            <div className="mt-auto bg-white border border-[#D6E4DB] rounded-xl p-4">
              <div className="text-sm font-bold text-[#0A1C13]">Plot B · Paddy Field</div>
              <div className="text-xs text-[#1B5434] font-semibold mt-1">✓ Irrigation scheduled 6:00 PM · Skip Thursday (Rain)</div>
            </div>
          </div>

          {/* Card 3: Mandi Prices */}
          <div className="bg-[#EDF5EF] border border-[#D6E4DB] rounded-2xl p-8 flex flex-col gap-4 text-left shadow-sm">
            <span className="text-[10px] font-bold tracking-widest text-[#5C7866] uppercase">Mandi prices</span>
            <h3 className="text-2xl font-extrabold text-[#0A1C13] leading-snug">Track nearby mandis daily</h3>
            <p className="text-[#4A6354] text-sm leading-relaxed">
              Updated market rates for nearby mandis in AP & Telangana with trend highlights to help you choose when to sell.
            </p>
            {/* Sparkline chart */}
            <div className="mt-auto flex items-end gap-2 h-20 w-full pt-4">
              <div className="flex-1 h-[40%] bg-[#CDE6D7] rounded-t-sm" />
              <div className="flex-1 h-[56%] bg-[#A8D4B7] rounded-t-sm" />
              <div className="flex-1 h-[48%] bg-[#A8D4B7] rounded-t-sm" />
              <div className="flex-1 h-[70%] bg-[#5CA37B] rounded-t-sm" />
              <div className="flex-1 h-[84%] bg-[#236A43] rounded-t-sm" />
              <div className="flex-1 h-[100%] bg-[#0F2B1D] rounded-t-sm" />
            </div>
          </div>
        </div>

        {/* Feature Grid Row 2 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-[1fr_1fr_1.25fr] gap-6">
          {/* Card 4: Govt Schemes */}
          <div className="bg-[#EDF5EF] border border-[#D6E4DB] rounded-2xl p-8 flex flex-col gap-4 text-left shadow-sm">
            <span className="text-[10px] font-bold tracking-widest text-[#5C7866] uppercase">Government schemes</span>
            <h3 className="text-2xl font-extrabold text-[#0A1C13] leading-snug">Check scheme eligibility in minutes</h3>
            <p className="text-[#4A6354] text-sm leading-relaxed">
              Compare your land size and crop profile against active state & central schemes to view eligible subsidies and application steps.
            </p>
            <div className="mt-auto flex flex-wrap gap-2 pt-2">
              <span className="text-xs font-semibold text-[#0A1C13] bg-[#E4F2E9] border border-[#A8D4B7]/40 px-3.5 py-1.5 rounded-full">PM-KISAN</span>
              <span className="text-xs font-semibold text-[#0A1C13] bg-[#E4F2E9] border border-[#A8D4B7]/40 px-3.5 py-1.5 rounded-full">Fasal Bima Yojna</span>
              <span className="text-xs font-semibold text-[#0A1C13] bg-[#E4F2E9] border border-[#A8D4B7]/40 px-3.5 py-1.5 rounded-full">Rythu Bharosa</span>
            </div>
          </div>

          {/* Card 5: Farm Diary */}
          <div className="bg-[#EDF5EF] border border-[#D6E4DB] rounded-2xl p-8 flex flex-col gap-4 text-left shadow-sm">
            <span className="text-[10px] font-bold tracking-widest text-[#5C7866] uppercase">Farm diary</span>
            <h3 className="text-2xl font-extrabold text-[#0A1C13] leading-snug">Simple record-keeping by voice</h3>
            <p className="text-[#4A6354] text-sm leading-relaxed">
              Log fertilizers, spray dates, and harvests using simple voice commands in your native language.
            </p>
            <div className="mt-auto border-l-2 border-[#236A43] pl-4 flex flex-col gap-2">
              <div className="text-xs text-[#4A6354] font-medium">28 Jul · Irrigated 40 mm (Paddy)</div>
              <div className="text-xs text-[#4A6354] font-medium">14 Jul · Applied Urea 45 kg</div>
            </div>
          </div>

          {/* Card 6: Native Voice Input */}
          <div className="bg-[#0F2B1D] rounded-2xl p-8 flex flex-col md:flex-row gap-6 items-center text-left text-white shadow-lg border border-[#1A3B2A] overflow-hidden">
            <div className="flex-1 flex flex-col gap-3">
              <span className="text-[10px] font-bold tracking-widest text-[#8FB397] uppercase">Voice-First Interface</span>
              <h3 className="text-2xl font-extrabold leading-snug text-[#F7FAF6]">Ask questions in your mother tongue</h3>
              <p className="text-[#B5D1C1] text-xs leading-relaxed">
                Speak naturally in Telugu, Hindi, Tamil, or Kannada. Clear audio responses delivered in local accents.
              </p>
              <div className="flex flex-wrap gap-2 pt-1">
                <span className="text-[11px] text-[#F7FAF6] bg-[#1A3B2A] border border-[#2B543D] px-3 py-1 rounded-full font-medium">
                  “ఈ వారంలో వర్షం పడుతుందా?”
                </span>
                <span className="text-[11px] text-[#F7FAF6] bg-[#1A3B2A] border border-[#2B543D] px-3 py-1 rounded-full font-medium">
                  “धान का मंडी भाव क्या है?”
                </span>
              </div>
            </div>
            <div className="w-[170px] h-[190px] shrink-0 rounded-xl overflow-hidden shadow-md border border-[#1A3B2A]">
              <img
                src="/images/landing-feat-voice.jpg"
                alt="Indian farmer using voice app in field"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="bg-[#EDF5EF] border-y border-[#D6E4DB] px-6 md:px-16 py-20 text-left">
        <div className="max-w-7xl mx-auto flex flex-col gap-12">
          <div className="flex flex-col gap-2 max-w-2xl">
            <span className="text-xs font-bold tracking-widest text-[#236A43] uppercase">How it works</span>
            <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl text-[#0A1C13] mt-2">
              Three simple steps to get started.
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
            <div className="flex flex-col gap-4 bg-white p-6 rounded-2xl border border-[#D6E4DB]">
              <div className="w-11 h-11 rounded-full bg-[#236A43] text-white flex items-center justify-center text-lg font-extrabold shadow-sm">
                1
              </div>
              <h3 className="text-xl font-bold text-[#0A1C13]">Select your village & crops</h3>
              <p className="text-[#4A6354] text-sm leading-relaxed">
                Set up your profile with your location, acres, and crop types in under two minutes.
              </p>
            </div>
            <div className="flex flex-col gap-4 bg-white p-6 rounded-2xl border border-[#D6E4DB]">
              <div className="w-11 h-11 rounded-full bg-[#236A43] text-white flex items-center justify-center text-lg font-extrabold shadow-sm">
                2
              </div>
              <h3 className="text-xl font-bold text-[#0A1C13]">Receive daily crop advisories</h3>
              <p className="text-[#4A6354] text-sm leading-relaxed">
                Check morning weather alerts, irrigation timing, and local mandi price updates.
              </p>
            </div>
            <div className="flex flex-col gap-4 bg-white p-6 rounded-2xl border border-[#D6E4DB]">
              <div className="w-11 h-11 rounded-full bg-[#236A43] text-white flex items-center justify-center text-lg font-extrabold shadow-sm">
                3
              </div>
              <h3 className="text-xl font-bold text-[#0A1C13]">Get expert confirmation</h3>
              <p className="text-[#4A6354] text-sm leading-relaxed">
                For complex pest outbreaks, request a review from local agricultural extension staff.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* AUTHENTIC TESTIMONIAL WITH AUDIO PLAYER */}
      <section className="px-6 md:px-16 py-20 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-[400px_1fr] gap-12 md:gap-16 items-center text-left">
        <div className="w-full max-w-[400px] aspect-square mx-auto rounded-[24px] overflow-hidden shadow-xl border-4 border-white ring-1 ring-[#D6E4DB]">
          <img
            src="/images/landing-testimonial.jpg"
            alt="Farmer Ramesh Naidu in Kadapa"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="flex flex-col gap-6">
          <div className="inline-flex items-center gap-2 bg-[#E4F2E9] border border-[#A8D4B7]/40 text-[#0A1C13] text-xs font-semibold px-3.5 py-1.5 rounded-full self-start">
            <span className="w-2 h-2 rounded-full bg-[#236A43]"></span> Verified Farmer Experience
          </div>
          <blockquote className="font-serif text-2xl sm:text-3xl md:text-4xl text-[#0A1C13] leading-normal font-normal italic">
            “Last year leaf blight damaged half my paddy crop before I recognized it. This year the app detected early symptoms on day two — I sprayed once as recommended and saved my harvest.”
          </blockquote>

          {/* Interactive Audio Snippet Control */}
          <div className="bg-[#EDF5EF] border border-[#D6E4DB] p-4 rounded-xl flex items-center justify-between gap-4 max-w-md">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsPlayingAudio(!isPlayingAudio)}
                className="w-10 h-10 rounded-full bg-[#236A43] text-white flex items-center justify-center font-bold text-sm shadow hover:bg-[#1B5434] transition"
              >
                {isPlayingAudio ? "⏸" : "▶"}
              </button>
              <div>
                <div className="text-xs font-bold text-[#0A1C13]">Listen in Telugu (0:45)</div>
                <div className="text-[11px] text-[#4A6354]">Ramesh Naidu explains crop recovery</div>
              </div>
            </div>
            {/* Waveform indicator */}
            <div className="flex items-center gap-1 h-6 shrink-0">
              <span className={`w-1 bg-[#236A43] rounded-full transition-all ${isPlayingAudio ? 'h-6 animate-pulse' : 'h-2'}`} />
              <span className={`w-1 bg-[#236A43] rounded-full transition-all ${isPlayingAudio ? 'h-4 animate-pulse' : 'h-3'}`} />
              <span className={`w-1 bg-[#236A43] rounded-full transition-all ${isPlayingAudio ? 'h-5 animate-pulse' : 'h-1.5'}`} />
              <span className={`w-1 bg-[#236A43] rounded-full transition-all ${isPlayingAudio ? 'h-3 animate-pulse' : 'h-4'}`} />
            </div>
          </div>

          <div className="flex items-center gap-4 pt-2">
            <div className="w-12 h-12 rounded-full overflow-hidden shadow-sm border border-[#D6E4DB]">
              <img
                src="/images/landing-avatar.jpg"
                alt="Ramesh Naidu Avatar"
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <div className="text-base font-bold text-[#0A1C13]">Ramesh Naidu</div>
              <div className="text-sm text-[#4A6354]">
                4.2 acres · Paddy & Tomato · Kadapa, Andhra Pradesh
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CALL TO ACTION */}
      <section className="bg-[#0F2B1D] px-6 py-20 text-center flex flex-col items-center gap-6 text-white relative overflow-hidden border-t border-[#1A3B2A]">
        <h2 className="font-serif text-3xl sm:text-4xl md:text-6xl text-[#F7FAF6] max-w-3xl leading-tight">
          Try Haritha Sahayak for this season's crop.
        </h2>
        <p className="text-[#B5D1C1] text-base md:text-lg max-w-xl leading-relaxed">
          Free for one farm. Optional premium offers direct extension officer calls and yield estimation.
        </p>
        <div className="flex flex-wrap gap-4 pt-4 justify-center">
          <button
            onClick={() => navigate(isAuthenticated ? "/dashboard" : "/register")}
            className="bg-[#236A43] text-white text-base font-bold px-8 py-4 rounded-xl hover:bg-[#1B5434] transition shadow-lg"
          >
            Create free account
          </button>
          <button className="border border-[#2B543D] text-[#F7FAF6] text-base font-semibold px-8 py-4 rounded-xl hover:bg-white/5 transition">
            Contact local support on WhatsApp
          </button>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-[#091F14] px-6 md:px-16 py-8 flex flex-col md:flex-row justify-between items-center gap-4 text-[#8AA896] text-xs font-semibold border-t border-[#0F2B1D]">
        <span>© 2026 Haritha Sahayak · Supported by ICAR-aligned guidelines</span>
        <div className="flex gap-6">
          <span className="hover:underline cursor-pointer">Privacy</span>
          <span className="hover:underline cursor-pointer">Terms</span>
          <span className="hover:underline cursor-pointer">Data & consent</span>
          <span className="hover:underline cursor-pointer">Support</span>
        </div>
      </footer>
    </div>
  );
}
