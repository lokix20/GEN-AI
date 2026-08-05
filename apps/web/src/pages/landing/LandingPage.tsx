import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

export function LandingPage() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  return (
    <div className="min-h-screen bg-[#F8F9F5] text-[#0F291E] font-sans antialiased">
      {/* ─── 1. HIGH-CONTRAST HEADER WITH LOCALIZED SCRIPT ─── */}
      <header className="bg-[#1B4332] px-6 py-4 flex items-center justify-between sticky top-0 z-50 border-b border-[#006837]">
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate("/")}>
          <div className="w-9 h-9 rounded-xl bg-[#006837] text-white flex items-center justify-center font-extrabold text-lg shadow-sm">
            ह
          </div>
          <div className="flex flex-col text-left">
            <span className="text-white text-lg font-extrabold tracking-tight leading-none">Haritha Sahayak</span>
            <span className="text-[11px] text-[#A8D4B7] font-semibold">హరిత సహాయక్ · हरित सहायक</span>
          </div>
        </div>

        <nav className="hidden md:flex gap-6 text-sm text-[#D4E7D7] font-medium">
          <span className="cursor-pointer hover:text-white transition">Features</span>
          <span className="cursor-pointer hover:text-white transition" onClick={() => navigate("/disease-detection")}>Crop diagnosis</span>
          <span className="cursor-pointer hover:text-white transition" onClick={() => navigate("/coming-soon/market")}>Market prices</span>
          <span className="cursor-pointer hover:text-white transition" onClick={() => navigate("/coming-soon/schemes")}>Government schemes</span>
        </nav>

        <div className="flex items-center gap-4 text-[#D4E7D7] text-sm">
          {/* Vernacular Language Selector + Voice Icon */}
          <div className="hidden sm:flex items-center gap-2 bg-[#006837]/60 border border-[#2E7D32] px-3 py-1.5 rounded-lg text-xs">
            <span className="font-bold text-white">తెలుగు · हिंदी · English</span>
            <button
              className="w-6 h-6 rounded-full bg-[#1B4332] text-white flex items-center justify-center hover:bg-[#006837] transition"
              title="Voice accessibility active"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" x2="12" y1="19" y2="22"/></svg>
            </button>
          </div>

          {isAuthenticated ? (
            <button
              onClick={() => navigate("/dashboard")}
              className="bg-white text-[#1B4332] text-sm font-extrabold px-5 py-2.5 rounded-lg hover:bg-[#E8ECE0] transition-all transform active:scale-95 shadow-md"
            >
              Open Dashboard
            </button>
          ) : (
            <>
              <span className="cursor-pointer text-white font-semibold hover:underline" onClick={() => navigate("/login")}>
                Log in
              </span>
              <button
                onClick={() => navigate("/register")}
                className="bg-[#006837] text-white text-sm font-extrabold px-5 py-2.5 rounded-lg hover:bg-[#1B4332] transition-all transform active:scale-95 shadow-md border border-[#2E7D32]"
              >
                Start free
              </button>
            </>
          )}
        </div>
      </header>

      {/* ─── 2. HERO SECTION — High Daylight Contrast & Raw Split-Screen Preview ─── */}
      <section className="bg-[#F8F9F5] px-6 md:px-16 pt-12 pb-16 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center max-w-7xl mx-auto">
        <div className="flex flex-col gap-6 text-left max-w-xl z-10">
          {/* Social Trust Badge */}
          <div className="inline-flex items-center gap-2 bg-white border-2 border-[#1B4332] text-[#1B4332] text-xs font-extrabold px-4 py-2 rounded-full self-start shadow-sm">
            <span className="w-2.5 h-2.5 rounded-full bg-[#006837] animate-pulse" />
            Active across 14 AP &amp; Telangana districts · ICAR Verified
          </div>

          {/* Headline */}
          <h1 className="font-serif text-4xl sm:text-5xl md:text-[3.4rem] text-[#1B4332] leading-[1.1] tracking-tight font-normal">
            Clear answers for your crops,<br />
            <span className="text-[#006837] italic font-serif font-bold">right when you need them.</span>
          </h1>

          {/* Subheadline */}
          <p className="text-[#2C4035] text-base md:text-lg leading-relaxed font-normal">
            Scan leaf symptoms for immediate treatment steps, track local mandi prices, receive rain alerts, and check government scheme eligibility in your regional language.
          </p>

          {/* Dual Solid Green Action CTAs (Outdoor Visibility) */}
          <div className="flex flex-wrap gap-4 pt-2">
            <button
              onClick={() => navigate(isAuthenticated ? "/dashboard" : "/register")}
              className="bg-[#006837] text-white text-base font-extrabold px-8 py-4 rounded-xl hover:bg-[#1B4332] transition shadow-lg border-2 border-[#006837] transform hover:-translate-y-0.5 active:translate-y-0 flex items-center gap-2"
            >
              <span className="text-xl">📸</span> 📸 Scan Leaf / ఉచితంగా ప్రారంభించండి
            </button>
            <button
              onClick={() => navigate("/register")}
              className="bg-[#1B4332] text-white text-base font-extrabold px-7 py-4 rounded-xl hover:bg-[#006837] transition flex items-center gap-2 border-2 border-[#1B4332] shadow-md"
            >
              <span className="text-xl">💬</span> WhatsApp ఫ్రీ సేవ
            </button>
          </div>

          {/* Low-Tech Microcopy */}
          <div className="flex flex-wrap gap-6 pt-4 text-[#3D5245] text-sm font-bold">
            <span>✓ Works on 2G / low network</span>
            <span>✓ 100% Vernacular Voice Support</span>
            <span>✓ 100% Free for farmers</span>
          </div>
        </div>

        {/* ─── 3. RAW SPLIT-SCREEN FIELD & VERNACULAR UI PREVIEW (NO PHONE FRAME) ─── */}
        <div className="w-full max-w-[500px] mx-auto z-10 grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Authentic Real Field Workflow Photo */}
          <div className="relative rounded-2xl overflow-hidden border-2 border-[#1B4332] shadow-md h-[340px] sm:h-[380px] group">
            <img
              src="/images/landing-hero-farmer.jpg"
              alt="Authentic smallholder farmer inspecting paddy crop field"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#1B4332]/90 via-transparent to-transparent flex flex-col justify-end p-4 text-white text-left">
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#A8D4B7] bg-[#1B4332]/80 px-2 py-0.5 rounded self-start">
                Real Field Scan
              </span>
              <div className="text-sm font-extrabold mt-1">Ramesh Naidu · Kadapa</div>
              <div className="text-[11px] text-[#D4E7D7]">4.2 acres Paddy Leaf Inspection</div>
            </div>
          </div>

          {/* Raw High-Contrast Vernacular UI Card */}
          <div className="bg-white rounded-2xl border-2 border-[#1B4332] p-4 shadow-xl flex flex-col justify-between h-[340px] sm:h-[380px] text-left">
            {/* High-Contrast Solid Green Header */}
            <div className="bg-[#1B4332] text-white p-3 rounded-xl flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded bg-[#006837] text-white text-xs font-bold flex items-center justify-center">హ</div>
                <span className="text-xs font-extrabold">హరిత సహాయక్ (Live)</span>
              </div>
              <span className="text-[9px] font-extrabold text-white bg-[#006837] px-2 py-0.5 rounded">ICAR Verified</span>
            </div>

            {/* Telugu Direct Script Advisory Badge */}
            <div className="bg-[#F8F9F5] rounded-xl p-3 border border-[#E0E4D8]">
              <div className="flex items-center gap-1.5 text-xs font-extrabold text-[#E65100]">
                <span>🔬</span>
                <span>వ్యాధి: ఆకు మచ్చల తెగులు (Leaf Blight)</span>
              </div>
              <div className="text-[11px] font-bold text-[#1B4332] mt-1 leading-snug">
                కాపర్ ఆక్సీక్లోరైడ్ 3గ్రా/లీటర్ నీటిలో కలిపి పిచికారీ చేయండి.
              </div>
            </div>

            {/* Mandi Rate Telugu Script Card */}
            <div className="bg-[#E8F5E9] rounded-xl p-3 border border-[#2E7D32]/30">
              <div className="text-[10px] font-extrabold text-[#006837] uppercase">కడప మండి ధాన్యం ధర (Kadapa Paddy)</div>
              <div className="text-base font-extrabold text-[#1B4332] mt-0.5">
                ₹2,183 <span className="text-[10px] font-semibold text-[#006837]">/ క్వింటా (Hold 2 days)</span>
              </div>
            </div>

            {/* Hindi Rain Alert Card */}
            <div className="bg-[#E3F2FD] rounded-xl p-3 border border-[#1565C0]/30">
              <div className="text-[10px] font-extrabold text-[#1565C0] uppercase">मौसम अलर्ट (Irrigation Rain Alert)</div>
              <div className="text-[11px] font-bold text-[#0D47A1] mt-0.5">
                गुरुवार सिंचाई रोकें — 42 मिमी बारिश की संभावना।
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── 4. SOCIAL PROOF STRIP — HIGH CONTRAST ─── */}
      <section className="bg-[#1B4332] px-6 md:px-16 py-8 text-white border-y border-[#006837]">
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
              <div className="text-2xl md:text-3xl font-extrabold text-white">11 Languages</div>
              <div className="text-xs text-[#A8D4B7] mt-0.5 font-bold uppercase tracking-wider">Telugu · Hindi · Vernacular</div>
            </div>
          </div>
          <div className="bg-[#006837] border border-[#2E7D32] rounded-xl p-4 flex items-center gap-3 text-left max-w-md">
            <div className="w-10 h-10 rounded-full bg-[#1B4332] text-white flex items-center justify-center font-bold text-sm shrink-0">👨‍🌾</div>
            <div className="text-xs text-white leading-relaxed">
              <span className="font-bold block text-[#A8D4B7]">Human Extension Oversight</span>
              Advisories cross-checked with local Krishi Vigyan Kendra (KVK) guidelines and officers.
            </div>
          </div>
        </div>
      </section>

      {/* ─── 5. CORE 3-STEP SOLUTION MATRIX WITH DIRECT VERNACULAR LABELS ─── */}
      <section className="px-6 md:px-16 py-20 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12 text-left">
          <div>
            <span className="text-xs font-extrabold tracking-widest text-[#006837] uppercase">Core Solutions</span>
            <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl text-[#1B4332] mt-2 font-normal">
              Three pillars for your daily farm decisions.
            </h2>
          </div>
          <p className="text-base text-[#3D5245] md:max-w-[340px] leading-relaxed font-semibold">
            Actionable answers in your mother tongue without relying on delayed agent visits.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Solution 1: Diagnose */}
          <div className="bg-white rounded-2xl p-8 flex flex-col gap-4 text-left shadow-md border-2 border-[#1B4332]">
            <div className="w-14 h-14 rounded-2xl bg-[#E8F5E9] text-[#006837] flex items-center justify-center text-3xl border border-[#2E7D32]/30">📸</div>
            <div>
              <div className="text-xs font-extrabold text-[#006837] uppercase">పంట ఆకు వ్యాధి నిర్ధారణ</div>
              <h3 className="text-2xl font-extrabold text-[#1B4332] mt-0.5">1. Diagnose Crop Health</h3>
            </div>
            <p className="text-[#3D5245] text-sm leading-relaxed font-medium">
              Snap leaf photos for instant spray dosage and verified treatment steps. No guessing.
            </p>
            <button
              onClick={() => navigate("/disease-detection")}
              className="mt-auto bg-[#006837] text-white text-sm font-extrabold py-3 px-5 rounded-xl hover:bg-[#1B4332] transition self-start border border-[#006837]"
            >
              ఫోటో తీసి పరీక్షించండి →
            </button>
          </div>

          {/* Solution 2: Mandi Rates */}
          <div className="bg-white rounded-2xl p-8 flex flex-col gap-4 text-left shadow-md border-2 border-[#1B4332]">
            <div className="w-14 h-14 rounded-2xl bg-[#FFF8E1] text-[#F57F17] flex items-center justify-center text-3xl border border-[#F57F17]/30">📈</div>
            <div>
              <div className="text-xs font-extrabold text-[#E65100] uppercase">నేటి మండి ధరలు &amp; అంచనా</div>
              <h3 className="text-2xl font-extrabold text-[#1B4332] mt-0.5">2. Track Live Mandi Rates</h3>
            </div>
            <p className="text-[#3D5245] text-sm leading-relaxed font-medium">
              Daily rates &amp; 3-day AI forecasts for Kadapa, Madanapalle, and Guntur mandis to decide when to sell.
            </p>
            <button
              onClick={() => navigate("/coming-soon/market")}
              className="mt-auto bg-[#1B4332] text-white text-sm font-extrabold py-3 px-5 rounded-xl hover:bg-[#006837] transition self-start border border-[#1B4332]"
            >
              మండి ధరలు చూడండి →
            </button>
          </div>

          {/* Solution 3: Schemes */}
          <div className="bg-white rounded-2xl p-8 flex flex-col gap-4 text-left shadow-md border-2 border-[#1B4332]">
            <div className="w-14 h-14 rounded-2xl bg-[#F3E5F5] text-[#7B1FA2] flex items-center justify-center text-3xl border border-[#7B1FA2]/30">🏛️</div>
            <div>
              <div className="text-xs font-extrabold text-[#7B1FA2] uppercase">ప్రభుత్వ పథకాల అర్హత</div>
              <h3 className="text-2xl font-extrabold text-[#1B4332] mt-0.5">3. Access Schemes &amp; Subsidies</h3>
            </div>
            <p className="text-[#3D5245] text-sm leading-relaxed font-medium">
              Automated eligibility checks for PM-KISAN, Rythu Bharosa, and Fasal Bima Yojna in minutes.
            </p>
            <button
              onClick={() => navigate("/coming-soon/schemes")}
              className="mt-auto bg-[#1B4332] text-white text-sm font-extrabold py-3 px-5 rounded-xl hover:bg-[#006837] transition self-start border border-[#1B4332]"
            >
              పథకాల అర్హత తనిఖీ →
            </button>
          </div>
        </div>
      </section>

      {/* ─── 6. LOW-TECH & OFFLINE ACCESSIBILITY ─── */}
      <section className="bg-white border-y-2 border-[#1B4332] px-6 md:px-16 py-16 text-left">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="flex flex-col gap-6">
            <span className="text-xs font-extrabold tracking-widest text-[#006837] uppercase">Built for Rural India</span>
            <h2 className="font-serif text-3xl md:text-4xl text-[#1B4332] leading-tight">
              Designed for low connectivity, simple phones, and direct voice interaction.
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2">
              <div className="bg-[#F8F9F5] p-5 rounded-xl border border-[#E0E4D8]">
                <div className="text-xl mb-2">⚡</div>
                <div className="text-base font-extrabold text-[#1B4332]">Ultra Low Data Usage</div>
                <div className="text-xs text-[#3D5245] mt-1 leading-relaxed font-medium">
                  Optimized lightweight payloads work reliably even on weak 2G network signals.
                </div>
              </div>
              <div className="bg-[#F8F9F5] p-5 rounded-xl border border-[#E0E4D8]">
                <div className="text-xl mb-2">🗣️</div>
                <div className="text-base font-extrabold text-[#1B4332]">మాట్లాడి తెలుసుకోండి (Voice First)</div>
                <div className="text-xs text-[#3D5245] mt-1 leading-relaxed font-medium">
                  Speak questions out loud in Telugu or Hindi and listen to clear responses in local accents.
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

      {/* ─── 7. STRUCTURED FARMER CASE STUDIES ─── */}
      <section className="px-6 md:px-16 py-20 max-w-7xl mx-auto text-left">
        <div className="mb-12">
          <span className="text-xs font-extrabold tracking-widest text-[#006837] uppercase">Verified Farmer Results</span>
          <h2 className="font-serif text-3xl md:text-4xl text-[#1B4332] mt-2 font-normal">
            Real before-and-after results from local farmers.
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
              <span className="w-2.5 h-2.5 rounded-full bg-[#006837]" /> వల్లాపురం గ్రామము, కడప జిల్లా (Kadapa, AP)
            </div>

            {/* Before / After Case Study Card */}
            <div className="bg-white border-2 border-[#1B4332] p-6 rounded-2xl shadow-md grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="border-l-4 border-[#E65100] pl-4">
                <div className="text-xs font-extrabold text-[#E65100] uppercase tracking-wider">మొదటి అనుభవం (Before)</div>
                <p className="text-sm text-[#3D5245] mt-1 italic font-medium">
                  "In 2024, leaf blight damaged 50% of my paddy crop before I recognized what spray was needed."
                </p>
              </div>
              <div className="border-l-4 border-[#006837] pl-4">
                <div className="text-xs font-extrabold text-[#006837] uppercase tracking-wider">హరిత సహాయక్ తర్వాత (After)</div>
                <p className="text-sm text-[#1B4332] font-bold mt-1">
                  "App caught early symptoms on day 2. Sprayed once as recommended and saved ₹45,000 in crop yield."
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
                  <div className="text-xs font-extrabold text-[#1B4332]">తెలుగు ఆడియో వినండి (Listen in Telugu 0:45)</div>
                  <div className="text-[11px] text-[#3D5245] font-semibold">రమేష్ నాయుడు పంట సంరక్షణ అనుభవం</div>
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
                <div className="text-base font-extrabold text-[#1B4332]">Ramesh Naidu (రమేష్ నాయుడు)</div>
                <div className="text-sm text-[#3D5245] font-semibold">
                  4.2 acres · Paddy &amp; Tomato · Kadapa, Andhra Pradesh
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── 8. CONVERSION FOOTER WITH HIGH-CONTRAST SOLID BUTTONS ─── */}
      <section className="bg-[#1B4332] px-6 py-16 text-center flex flex-col items-center gap-6 text-white border-t-2 border-[#006837]">
        <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl text-white max-w-3xl leading-tight font-normal">
          Protect your crop yield for this season.
        </h2>
        <p className="text-[#D4E7D7] text-base max-w-xl font-semibold">
          Get started in under 2 minutes in your regional language.
        </p>
        <div className="flex flex-wrap gap-4 justify-center pt-2">
          <button
            onClick={() => navigate(isAuthenticated ? "/dashboard" : "/register")}
            className="bg-[#006837] text-white text-base font-extrabold px-8 py-4 rounded-xl hover:bg-[#1B4332] transition shadow-lg border-2 border-white/20 flex items-center gap-2"
          >
            <span>📸</span> Create Free Account
          </button>
          <button className="bg-[#25D366] text-[#1B4332] text-base font-extrabold px-8 py-4 rounded-xl hover:bg-[#1EBE5D] transition shadow-lg flex items-center gap-2">
            <span>💬</span> WhatsApp ఫ్రీ సేవ (Start Free on WhatsApp)
          </button>
        </div>
      </section>

      {/* ─── FOOTER ─── */}
      <footer className="bg-[#091F14] px-6 md:px-16 py-8 flex flex-col md:flex-row justify-between items-center gap-4 text-[#8AA896] text-xs font-bold border-t border-[#1B4332]">
        <span>© 2026 Haritha Sahayak · Supported by ICAR-aligned guidelines</span>
        <div className="flex gap-6">
          <span className="hover:underline cursor-pointer">Privacy</span>
          <span className="hover:underline cursor-pointer">Terms</span>
          <span className="hover:underline cursor-pointer">Data &amp; consent</span>
          <span className="hover:underline cursor-pointer">Support</span>
        </div>
      </footer>
    </div>
  );
}
