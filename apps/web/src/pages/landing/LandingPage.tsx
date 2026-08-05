import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

export function LandingPage() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen bg-[#F5F4EE] text-[#12261D] font-sans antialiased">
      {/* HEADER / NAV */}
      <header className="bg-[#0E2419] px-6 py-4 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate("/")}>
          <div className="width-[34px] height-[34px] w-9 h-9 rounded-xl bg-[#9BD96B] color-[#0E2419] text-[#0E2419] flex items-center justify-center font-extrabold text-lg">
            ह
          </div>
          <span className="text-[#F5F4EE] text-lg font-bold tracking-tight">Haritha Sahayak</span>
        </div>

        <nav className="hidden md:flex gap-6 text-sm text-[#9DB3A6] font-medium">
          <span className="cursor-pointer hover:text-white transition">Features</span>
          <span className="cursor-pointer hover:text-white transition" onClick={() => navigate("/disease-detection")}>Crop diagnosis</span>
          <span className="cursor-pointer hover:text-white transition" onClick={() => navigate("/coming-soon/market")}>Market prices</span>
          <span className="cursor-pointer hover:text-white transition" onClick={() => navigate("/coming-soon/schemes")}>Schemes</span>
          <span className="cursor-pointer hover:text-white transition">Pricing</span>
        </nav>

        <div className="flex items-center gap-4 text-[#9DB3A6] text-sm">
          <span className="hidden sm:inline cursor-pointer hover:text-white transition">తెలుగు · हिंदी · English ▾</span>
          {isAuthenticated ? (
            <button
              onClick={() => navigate("/dashboard")}
              className="bg-[#9BD96B] text-[#0E2419] text-sm font-bold px-5 py-2.5 rounded-lg hover:bg-[#8ac75c] transition-all transform active:scale-95"
            >
              Go to Dashboard
            </button>
          ) : (
            <>
              <span className="cursor-pointer text-[#F5F4EE] font-semibold hover:underline" onClick={() => navigate("/login")}>
                Log in
              </span>
              <button
                onClick={() => navigate("/register")}
                className="bg-[#9BD96B] text-[#0E2419] text-sm font-bold px-5 py-2.5 rounded-lg hover:bg-[#8ac75c] transition-all transform active:scale-95"
              >
                Start free
              </button>
            </>
          )}
        </div>
      </header>

      {/* HERO SECTION */}
      <section className="bg-[#0E2419] px-6 md:px-16 pt-12 pb-20 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative overflow-hidden">
        <div className="flex flex-col gap-6 text-left max-w-xl z-10">
          <div className="inline-flex items-center gap-2 bg-[#1E3D2C] border border-[#34523F] text-[#D7F0C2] text-xs font-semibold px-4 py-2 rounded-full self-start">
            Used by 42,000 farmers across 6 states
          </div>
          <h1 className="font-serif text-5xl md:text-7xl text-[#F5F4EE] leading-[1.02] tracking-tight">
            An agronomist<br />
            in every farmer's<br />
            <span className="text-[#9BD96B] italic font-normal font-serif">pocket.</span>
          </h1>
          <p className="text-[#B7C9BD] text-lg md:text-xl leading-relaxed">
            Photograph a sick leaf and get a diagnosis in seconds. Know when to irrigate, what the mandi is paying today, and which scheme money you're owed — in your language.
          </p>
          <div className="flex flex-wrap gap-4 pt-2">
            <button
              onClick={() => navigate(isAuthenticated ? "/dashboard" : "/register")}
              className="bg-[#9BD96B] text-[#0E2419] text-base font-bold px-8 py-4 rounded-xl hover:bg-[#8ac75c] transition shadow-lg transform hover:-translate-y-0.5 active:translate-y-0"
            >
              Start free — no card
            </button>
            <button className="border border-[#34523F] text-[#F5F4EE] text-base font-semibold px-7 py-4 rounded-xl hover:bg-white/5 transition">
              Watch 90-sec demo
            </button>
          </div>
          <div className="flex flex-wrap gap-6 pt-4 text-[#8CA396] text-sm font-medium">
            <span>✓ Works on any phone</span>
            <span>✓ Offline-friendly</span>
            <span>✓ Free forever tier</span>
          </div>
        </div>

        {/* Hero Image & Floating Cards */}
        <div className="relative w-full max-w-[500px] h-[480px] md:h-[560px] mx-auto z-10">
          <img
            src="/images/landing-hero-farmer.jpg"
            alt="Hero Farmer"
            className="w-full h-full object-cover rounded-[20px] shadow-2xl"
          />
          {/* Diagnostic float card */}
          <div className="absolute -left-4 md:-left-10 bottom-16 bg-white rounded-2xl p-4 shadow-2xl flex gap-3 items-center max-w-[280px] transform hover:scale-105 transition duration-300">
            <div className="w-11 h-11 rounded-xl bg-[#E6F3E4] flex items-center justify-center text-2xl">🌾</div>
            <div className="text-left">
              <div className="text-sm font-extrabold text-[#12261D]">Leaf blight · 88% sure</div>
              <div className="text-xs text-[#5C6B62] mt-0.5">Spray tomorrow 6 AM, before rain</div>
            </div>
          </div>
          {/* Mandi float card */}
          <div className="absolute -right-4 md:-right-8 top-16 bg-white rounded-2xl p-4 shadow-2xl text-left min-w-[210px] transform hover:scale-105 transition duration-300">
            <div className="text-[10px] font-bold tracking-wider text-[#7A877F] uppercase">Kadapa mandi</div>
            <div className="text-2xl font-extrabold text-[#12261D] mt-0.5">
              ₹2,183<span className="text-xs text-[#7A877F] font-semibold">/quintal</span>
            </div>
            <div className="text-xs font-bold text-[#1B7A4B] mt-1">▲ 2.4% — good week to sell</div>
          </div>
        </div>

        {/* Backdrop radial glow */}
        <div className="absolute right-0 bottom-0 w-[50%] h-[50%] bg-[radial-gradient(circle,rgba(155,217,107,0.06)_0%,transparent_70%)] pointer-events-none" />
      </section>

      {/* PROOF STRIP */}
      <section className="bg-[#12261D] border-t border-[#1E3D2C] px-6 md:px-16 py-6 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex flex-wrap gap-8 md:gap-12">
          <div>
            <div className="text-2xl md:text-3xl font-extrabold text-[#F5F4EE]">42,000+</div>
            <div className="text-xs text-[#8CA396] mt-0.5 font-medium uppercase tracking-wider">farmers</div>
          </div>
          <div>
            <div className="text-2xl md:text-3xl font-extrabold text-[#F5F4EE]">1.9 lakh</div>
            <div className="text-xs text-[#8CA396] mt-0.5 font-medium uppercase tracking-wider">crop scans done</div>
          </div>
          <div>
            <div className="text-2xl md:text-3xl font-extrabold text-[#F5F4EE]">11</div>
            <div className="text-xs text-[#8CA396] mt-0.5 font-medium uppercase tracking-wider">languages</div>
          </div>
          <div>
            <div className="text-2xl md:text-3xl font-extrabold text-[#F5F4EE]">₹18 cr</div>
            <div className="text-xs text-[#8CA396] mt-0.5 font-medium uppercase tracking-wider">scheme money claimed</div>
          </div>
        </div>
        <div className="text-xs text-[#8CA396] md:max-w-[280px] leading-relaxed md:text-right font-medium">
          Advisory reviewed with ICAR-aligned agronomists
        </div>
      </section>

      {/* FEATURES / WHAT IT DOES */}
      <section className="px-6 md:px-16 py-20 flex flex-col gap-12 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="max-w-2xl text-left">
            <span className="text-xs font-bold tracking-widest text-[#1B7A4B] uppercase">What it does</span>
            <h2 className="font-serif text-4xl md:text-5xl text-[#12261D] mt-2 leading-tight">
              Every decision on the farm, answered on the same screen.
            </h2>
          </div>
          <p className="text-base text-[#5C6B62] md:max-w-[320px] leading-relaxed text-left">
            No agent visits, no waiting for the weekly market bulletin.
          </p>
        </div>

        {/* Feature Grid Row 1 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-[1.25fr_1fr_1fr] gap-6">
          {/* Card 1: Crop Diagnosis */}
          <div className="bg-[#1B7A4B] rounded-2xl p-8 flex flex-col gap-4 min-h-[340px] text-left text-white shadow-lg relative overflow-hidden">
            <span className="text-[10px] font-bold tracking-widest text-[#BFE7C6] uppercase">Crop diagnosis</span>
            <h3 className="text-3xl font-extrabold leading-tight">Snap a leaf.<br />Get the answer.</h3>
            <p className="text-[#DCEBD2] text-sm leading-relaxed max-w-xs">
              A photo is enough. The assistant names the disease, tells you how far it has spread and exactly what to do next — with local prices for the input.
            </p>
            <div className="mt-auto rounded-xl overflow-hidden h-[120px] w-full shadow-inner">
              <img
                src="/images/landing-feat-scan.jpg"
                alt="Farmer leaf scan"
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Card 2: Irrigation Planner */}
          <div className="bg-white border border-[#E4E3DA] rounded-2xl p-8 flex flex-col gap-4 text-left shadow-sm">
            <span className="text-[10px] font-bold tracking-widest text-[#7A877F] uppercase">Irrigation planner</span>
            <h3 className="text-2xl font-extrabold text-[#12261D] leading-snug">Water only when it helps</h3>
            <p className="text-[#5C6B62] text-sm leading-relaxed">
              Soil moisture and the forecast decide the schedule — skip a cycle when rain is coming.
            </p>
            <div className="mt-auto bg-[#F1F0E9] rounded-xl p-4">
              <div className="text-sm font-bold text-[#12261D]">Plot B · tomato</div>
              <div className="text-xs text-[#5C6B62] mt-1">Irrigate today 6 PM · skip Thursday</div>
            </div>
          </div>

          {/* Card 3: Mandi Prices */}
          <div className="bg-white border border-[#E4E3DA] rounded-2xl p-8 flex flex-col gap-4 text-left shadow-sm">
            <span className="text-[10px] font-bold tracking-widest text-[#7A877F] uppercase">Mandi prices</span>
            <h3 className="text-2xl font-extrabold text-[#12261D] leading-snug">Sell on the right day</h3>
            <p className="text-[#5C6B62] text-sm leading-relaxed">
              Daily rates from the mandis you actually travel to, plus a hold-or-sell nudge.
            </p>
            {/* Sparkline chart */}
            <div className="mt-auto flex items-end gap-2 h-20 w-full pt-4">
              <div className="flex-1 h-[40%] bg-[#DCEBD2] rounded-t-sm" />
              <div className="flex-1 h-[56%] bg-[#C4E0B2] rounded-t-sm" />
              <div className="flex-1 h-[48%] bg-[#C4E0B2] rounded-t-sm" />
              <div className="flex-1 h-[70%] bg-[#9BD96B] rounded-t-sm" />
              <div className="flex-1 h-[84%] bg-[#1B7A4B] rounded-t-sm" />
              <div className="flex-1 h-[100%] bg-[#12261D] rounded-t-sm animate-pulse" />
            </div>
          </div>
        </div>

        {/* Feature Grid Row 2 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-[1fr_1fr_1.25fr] gap-6">
          {/* Card 4: Govt Schemes */}
          <div className="bg-white border border-[#E4E3DA] rounded-2xl p-8 flex flex-col gap-4 text-left shadow-sm">
            <span className="text-[10px] font-bold tracking-widest text-[#7A877F] uppercase">Government schemes</span>
            <h3 className="text-2xl font-extrabold text-[#12261D] leading-snug">Money you're owed, found for you</h3>
            <p className="text-[#5C6B62] text-sm leading-relaxed">
              Eligibility checked against your land record, with deadline reminders and a filled form.
            </p>
            <div className="mt-auto flex flex-wrap gap-2 pt-2">
              <span className="text-xs font-semibold text-[#1B7A4B] bg-[#E6F3E4] px-3.5 py-1.5 rounded-full">PM-KISAN</span>
              <span className="text-xs font-semibold text-[#1B7A4B] bg-[#E6F3E4] px-3.5 py-1.5 rounded-full">Fasal Bima</span>
              <span className="text-xs font-semibold text-[#1B7A4B] bg-[#E6F3E4] px-3.5 py-1.5 rounded-full">Soil Health</span>
            </div>
          </div>

          {/* Card 5: Farm Diary */}
          <div className="bg-white border border-[#E4E3DA] rounded-2xl p-8 flex flex-col gap-4 text-left shadow-sm">
            <span className="text-[10px] font-bold tracking-widest text-[#7A877F] uppercase">Farm diary</span>
            <h3 className="text-2xl font-extrabold text-[#12261D] leading-snug">A record that pays off next season</h3>
            <p className="text-[#5C6B62] text-sm leading-relaxed">
              Every spray, dose and sale logged by voice — and used to sharpen next year's plan.
            </p>
            <div className="mt-auto border-l-2 border-[#E4E3DA] pl-4 flex flex-col gap-2">
              <div className="text-xs text-[#5C6B62] font-medium">28 Jul · Irrigated 40 mm</div>
              <div className="text-xs text-[#5C6B62] font-medium">14 Jul · Urea 45 kg</div>
            </div>
          </div>

          {/* Card 6: Talk, Don't Type */}
          <div className="bg-[#12261D] rounded-2xl p-8 flex flex-col md:flex-row gap-6 items-center text-left text-white shadow-lg overflow-hidden">
            <div className="flex-1 flex flex-col gap-3">
              <span className="text-[10px] font-bold tracking-widest text-[#9BD96B] uppercase">Talk, don't type</span>
              <h3 className="text-2xl font-extrabold leading-snug">Ask out loud, in your own language</h3>
              <p className="text-[#B7C9BD] text-xs leading-relaxed">
                Telugu, Hindi, Tamil, Kannada, Marathi, Bangla and more — voice in, voice out.
              </p>
              <div className="flex flex-wrap gap-2 pt-1">
                <span className="text-[11px] text-[#D7F0C2] border border-[#34523F] px-3 py-1 rounded-full font-medium">
                  “ఈ వారం వాన పడుతుందా?”
                </span>
                <span className="text-[11px] text-[#D7F0C2] border border-[#34523F] px-3 py-1 rounded-full font-medium">
                  “धान कब बेचूँ?”
                </span>
              </div>
            </div>
            <div className="w-[170px] h-[200px] shrink-0 rounded-xl overflow-hidden shadow-md">
              <img
                src="/images/landing-feat-voice.jpg"
                alt="Farmer on phone"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="bg-[#E9EDE3] px-6 md:px-16 py-20 text-left">
        <div className="max-w-7xl mx-auto flex flex-col gap-12">
          <div className="flex flex-col gap-2 max-w-2xl">
            <span className="text-xs font-bold tracking-widest text-[#1B7A4B] uppercase">How it works</span>
            <h2 className="font-serif text-4xl md:text-5xl text-[#12261D] mt-2">
              Three minutes to set up. One tap a day after that.
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
            <div className="flex flex-col gap-4">
              <div className="w-11 h-11 rounded-full bg-[#12261D] text-[#9BD96B] flex items-center justify-center text-lg font-extrabold">
                1
              </div>
              <h3 className="text-xl font-bold text-[#12261D]">Add your farm</h3>
              <p className="text-[#4B5A52] text-sm leading-relaxed">
                Village, plot size and crops. Land record fetch fills most of it automatically.
              </p>
            </div>
            <div className="flex flex-col gap-4">
              <div className="w-11 h-11 rounded-full bg-[#12261D] text-[#9BD96B] flex items-center justify-center text-lg font-extrabold">
                2
              </div>
              <h3 className="text-xl font-bold text-[#12261D]">Get your daily plan</h3>
              <p className="text-[#4B5A52] text-sm leading-relaxed">
                Each morning: what to do today, what can wait, and what the market is doing.
              </p>
            </div>
            <div className="flex flex-col gap-4">
              <div className="w-11 h-11 rounded-full bg-[#12261D] text-[#9BD96B] flex items-center justify-center text-lg font-extrabold">
                3
              </div>
              <h3 className="text-xl font-bold text-[#12261D]">Ask whenever you're stuck</h3>
              <p className="text-[#4B5A52] text-sm leading-relaxed">
                Photo, voice or text — and a human agronomist on call when it's serious.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* TESTIMONIAL */}
      <section className="px-6 md:px-16 py-20 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-[420px_1fr] gap-12 md:gap-16 items-center text-left">
        <div className="w-full max-w-[420px] aspect-square mx-auto rounded-[18px] overflow-hidden shadow-xl">
          <img
            src="/images/landing-testimonial.jpg"
            alt="Farmer Ramesh Naidu"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="flex flex-col gap-6">
          <blockquote className="font-serif text-3xl md:text-4xl text-[#12261D] leading-normal text-wrap font-normal italic">
            “Last year blight took half my paddy before I knew what it was. This year the app caught it on day two — I sprayed once and saved the crop.”
          </blockquote>
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full overflow-hidden shadow-md">
              <img
                src="/images/landing-avatar.jpg"
                alt="Ramesh Naidu Avatar"
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <div className="text-base font-bold text-[#12261D]">Ramesh Naidu</div>
              <div className="text-sm text-[#5C6B62]">
                4.2 acres · paddy & tomato · Kadapa, Andhra Pradesh
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA SECTION */}
      <section className="bg-[#0E2419] px-6 py-20 text-center flex flex-col items-center gap-6 text-white relative overflow-hidden">
        <h2 className="font-serif text-4xl md:text-6xl text-[#F5F4EE] max-w-3xl leading-tight">
          Start with this season's crop.
        </h2>
        <p className="text-[#B7C9BD] text-base md:text-lg max-w-xl leading-relaxed">
          Free for one farm, forever. Premium adds expert calls and yield forecasting at ₹99 a month.
        </p>
        <div className="flex flex-wrap gap-4 pt-4 justify-center">
          <button
            onClick={() => navigate(isAuthenticated ? "/dashboard" : "/register")}
            className="bg-[#9BD96B] text-[#0E2419] text-base font-bold px-8 py-4 rounded-xl hover:bg-[#8ac75c] transition transform hover:-translate-y-0.5"
          >
            Create free account
          </button>
          <button className="border border-[#34523F] text-[#F5F4EE] text-base font-semibold px-8 py-4 rounded-xl hover:bg-white/5 transition">
            Talk to us on WhatsApp
          </button>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-[#0A1B12] px-6 md:px-16 py-8 flex flex-col md:flex-row justify-between items-center gap-4 text-[#6E8578] text-xs font-semibold">
        <span>© 2026 Haritha Sahayak</span>
        <div className="flex gap-6">
          <span className="hover:underline cursor-pointer">Privacy</span>
          <span className="hover:underline cursor-pointer">Terms</span>
          <span className="hover:underline cursor-pointer">Data & consent</span>
          <span className="hover:underline cursor-pointer">Contact</span>
        </div>
      </footer>
    </div>
  );
}
