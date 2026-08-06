import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

export function LandingPage() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="min-h-screen w-full max-w-full overflow-x-hidden bg-[#F5F4EE] text-[#12261D] font-sans antialiased">
      {/* HEADER / NAV */}
      <header className="bg-[#0E2419] px-6 py-4 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate("/")}>
          <div className="width-[34px] height-[34px] w-9 h-9 rounded-xl bg-[#9BD96B] color-[#0E2419] text-[#0E2419] flex items-center justify-center font-extrabold text-lg">
            ह
          </div>
          <span className="text-[#F5F4EE] text-lg font-bold tracking-tight">Haritha Sahayak</span>
        </div>

        <nav className="hidden md:flex gap-6 text-sm text-[#9DB3A6] font-medium">
          <span className="cursor-pointer hover:text-white transition" onClick={() => scrollToSection("features")}>Features</span>
          <span className="cursor-pointer hover:text-white transition" onClick={() => navigate("/disease-detection")}>Crop diagnosis</span>
          <span className="cursor-pointer hover:text-white transition" onClick={() => scrollToSection("how-it-works")}>How it works</span>
          <span className="cursor-pointer hover:text-white transition" onClick={() => scrollToSection("pricing")}>Pricing</span>
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
          <h1 className="font-ragellan font-extrabold text-4xl md:text-6xl text-[#F5F4EE] leading-[1.1] tracking-tight">
            Expert crop advice,<br />
            market rates, and<br />
            <span className="text-[#9BD96B] italic font-bold font-ragellan">Government scheme aid</span>
          </h1>
          <p className="text-[#B7C9BD] text-lg md:text-xl leading-relaxed">
            Diagnose crop diseases instantly with a photo. Get real-time mandi prices, smart irrigation alerts, and Government scheme guidance, all in your local language.
          </p>
          <div className="flex flex-wrap gap-4 pt-2">
            <button
              onClick={() => navigate(isAuthenticated ? "/dashboard" : "/register")}
              className="bg-[#9BD96B] text-[#0E2419] text-base font-bold px-8 py-4 rounded-xl hover:bg-[#8ac75c] transition shadow-lg transform hover:-translate-y-0.5 active:translate-y-0"
            >
              Start free
            </button>
          </div>
          <div className="flex flex-wrap items-center gap-3 pt-4 text-[#8CA396] text-sm font-medium">
            <span>✓ Works on any phone</span>
            <span className="text-[#34523F]">|</span>
            <span>✓ Low data usage</span>
            <span className="text-[#34523F]">|</span>
            <span>✓ Free forever</span>
          </div>
        </div>

        {/* Hero Image & Floating Cards */}
        <div className="relative w-full max-w-[500px] h-[480px] md:h-[560px] mx-auto z-10">
          <img
            src="/images/landing-hero-farmer.jpg"
            alt="Hero Farmer"
            className="w-full h-full object-cover rounded-[20px] shadow-2xl"
          />
          {/* Mandi float card (Top Left) */}
          <div className="absolute -left-4 md:-left-8 top-8 bg-white rounded-[20px] p-4 md:p-5 shadow-2xl text-left min-w-[210px] transform hover:scale-105 transition duration-300 z-20">
            <div className="text-[11px] font-extrabold tracking-wider text-[#7A877F] uppercase">VIZIANAGARAM MANDI</div>
            <div className="text-2xl font-extrabold text-[#12261D] mt-0.5">
              ₹2,183<span className="text-xs text-[#7A877F] font-semibold">/quintal</span>
            </div>
            <div className="text-xs font-bold text-[#1B7A4B] mt-1 flex items-center gap-1">
              <span>▲ 2.4%</span>
              <span className="text-[#34523F]">·</span>
              <span>good week to sell</span>
            </div>
          </div>
        </div>

        {/* Backdrop radial glow */}
        <div className="absolute right-0 bottom-0 w-[50%] h-[50%] bg-[radial-gradient(circle,rgba(155,217,107,0.06)_0%,transparent_70%)] pointer-events-none" />
      </section>


      {/* FEATURES / WHAT IT DOES */}
      <section id="features" className="px-6 md:px-16 py-20 flex flex-col gap-12 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="max-w-2xl text-left">
            <span className="text-xs font-bold tracking-widest text-[#1B7A4B] uppercase">What it does</span>
            <h2 className="font-ragellan font-extrabold text-4xl md:text-5xl text-[#12261D] mt-2 leading-tight">
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
            <h3 className="text-3xl font-extrabold leading-tight">Scan a leaf, save your crop.</h3>
            <p className="text-[#DCEBD2] text-sm leading-relaxed max-w-xs">
              Take a quick photo of any diseased crop. The assistant identifies the issue instantly, estimates the spread, and gives step-by-step treatment with local fertilizer and pesticide prices.
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
            <span className="text-[10px] font-bold tracking-widest text-[#7A877F] uppercase">Smart Irrigation</span>
            <h3 className="text-2xl font-extrabold text-[#12261D] leading-snug">Water right. Save power and costs.</h3>
            <p className="text-[#5C6B62] text-sm leading-relaxed">
              Track soil moisture and live weather forecasts so you only irrigate when your crops actually need it, automatically skipping cycles when rain is on the way.
            </p>
            <div className="mt-auto bg-[#F1F0E9] rounded-xl p-4 border border-[#E4E3DA]">
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-[#12261D]">Plot B · Tomato</span>
                <span className="text-[10px] font-bold bg-[#E6F3E4] text-[#1B7A4B] px-2 py-0.5 rounded-md">Smart Water</span>
              </div>
              <div className="text-xs text-[#5C6B62] mt-1.5 font-medium">
                <span>💧 Irrigate Today at 6 PM</span>
                <span className="text-[#C27D00] font-semibold block mt-0.5">· Rain expected Thursday (Skip)</span>
              </div>
            </div>
          </div>

          {/* Card 3: Mandi Prices */}
          <div className="bg-white border border-[#E4E3DA] rounded-2xl p-8 flex flex-col gap-4 text-left shadow-sm">
            <span className="text-[10px] font-bold tracking-widest text-[#7A877F] uppercase">Live Market Rates</span>
            <h3 className="text-2xl font-extrabold text-[#12261D] leading-snug">Sell at peak prices, every time.</h3>
            <p className="text-[#5C6B62] text-sm leading-relaxed">
              Get real-time daily prices from your local mandis along with smart hold-or-sell guidance so you never settle for lower trader rates.
            </p>
            <div className="mt-auto flex flex-col gap-2 pt-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-[#12261D]">Vizianagaram Mandi · Paddy</span>
                <span className="font-extrabold text-[#1B7A4B] bg-[#E6F3E4] px-2 py-0.5 rounded">▲ 2.4%</span>
              </div>
              <div className="text-xs text-[#5C6B62]">
                <span className="font-extrabold text-[#12261D]">₹2,183/quintal</span> · High demand, good week to sell
              </div>
              {/* Sparkline chart */}
              <div className="flex items-end gap-1.5 h-12 w-full pt-2">
                <div className="flex-1 h-[40%] bg-[#DCEBD2] rounded-t-sm" />
                <div className="flex-1 h-[56%] bg-[#C4E0B2] rounded-t-sm" />
                <div className="flex-1 h-[48%] bg-[#C4E0B2] rounded-t-sm" />
                <div className="flex-1 h-[70%] bg-[#9BD96B] rounded-t-sm" />
                <div className="flex-1 h-[84%] bg-[#1B7A4B] rounded-t-sm" />
                <div className="flex-1 h-[100%] bg-[#12261D] rounded-t-sm animate-pulse" />
              </div>
            </div>
          </div>
        </div>

        {/* Feature Grid Row 2 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-[1fr_1fr_1.25fr] gap-6">
          {/* Card 4: Govt Schemes */}
          <div className="bg-white border border-[#E4E3DA] rounded-2xl p-8 flex flex-col gap-4 text-left shadow-sm">
            <span className="text-[10px] font-bold tracking-widest text-[#7A877F] uppercase">Schemes & Subsidies</span>
            <h3 className="text-2xl font-extrabold text-[#12261D] leading-snug">Claim the Government funds you’re owed.</h3>
            <p className="text-[#5C6B62] text-sm leading-relaxed">
              Automatically check your land record against active subsidies, get deadline alerts, and download pre-filled application forms in seconds.
            </p>
            <div className="mt-auto flex flex-wrap gap-2 pt-2">
              <span className="text-xs font-semibold text-[#1B7A4B] bg-[#E6F3E4] px-3.5 py-1.5 rounded-full border border-[#CDE5C8]">PM-KISAN</span>
              <span className="text-xs font-semibold text-[#1B7A4B] bg-[#E6F3E4] px-3.5 py-1.5 rounded-full border border-[#CDE5C8]">Fasal Bima Yojana</span>
              <span className="text-xs font-semibold text-[#1B7A4B] bg-[#E6F3E4] px-3.5 py-1.5 rounded-full border border-[#CDE5C8]">Drip Subsidy</span>
            </div>
          </div>

          {/* Card 5: Weather & Forecasts */}
          <div className="bg-white border border-[#E4E3DA] rounded-2xl p-8 flex flex-col gap-4 text-left shadow-sm">
            <span className="text-[10px] font-bold tracking-widest text-[#7A877F] uppercase">Weather & Forecasts</span>
            <h3 className="text-2xl font-extrabold text-[#12261D] leading-snug">Plan spraying and irrigation around the weather.</h3>
            <p className="text-[#5C6B62] text-sm leading-relaxed">
              Get hyper-local rainfall, temperature, and wind alerts. Know the exact best window to apply fertilizers or spray pesticides without risk of rain washing them away.
            </p>
            <div className="mt-auto bg-[#F1F0E9] rounded-xl p-3.5 border border-[#E4E3DA] flex flex-col gap-1.5">
              <div className="flex items-center justify-between text-xs font-bold text-[#12261D]">
                <span>🌤️ 28°C · Vizianagaram</span>
                <span className="text-[10px] font-bold bg-[#E6F3E4] text-[#1B7A4B] px-2 py-0.5 rounded-md">Best Spray Window</span>
              </div>
              <div className="text-[11.5px] text-[#5C6B62] font-medium">
                Wed 6-8 AM · Ideal humidity & low wind speed
              </div>
            </div>
          </div>

          {/* Card 6: Talk, Don't Type */}
          <div className="bg-[#12261D] rounded-2xl p-8 flex flex-col md:flex-row gap-6 items-center text-left text-white shadow-lg overflow-hidden">
            <div className="flex-1 flex flex-col gap-3">
              <span className="text-[10px] font-bold tracking-widest text-[#9BD96B] uppercase">Voice Assistant</span>
              <h3 className="text-2xl font-extrabold leading-snug">Just speak in your own language.</h3>
              <p className="text-[#B7C9BD] text-xs leading-relaxed">
                No typing required. Ask questions out loud using voice inputs and get clear, spoken answers in Telugu, Hindi, Tamil, Kannada, Marathi, Bangla, and more.
              </p>
              <div className="flex flex-col gap-2 pt-2">
                <span className="text-[11.5px] text-[#D7F0C2] bg-[#1E3D2C] border border-[#34523F] px-3 py-1.5 rounded-xl font-medium inline-flex items-center gap-1.5">
                  🗣️ “ఈ వారం వాన పడుతుందా?” <span className="opacity-75 text-[10.5px]">(Will it rain this week?)</span>
                </span>
                <span className="text-[11.5px] text-[#D7F0C2] bg-[#1E3D2C] border border-[#34523F] px-3 py-1.5 rounded-xl font-medium inline-flex items-center gap-1.5">
                  🗣️ “धान कब बेचूँ?” <span className="opacity-75 text-[10.5px]">(When should I sell paddy?)</span>
                </span>
              </div>
            </div>
            <div className="w-full md:w-[220px] h-[200px] shrink-0 rounded-xl overflow-hidden shadow-md">
              <img
                src="/images/landing-feat-voice.jpg"
                alt="Farmer voice assistant"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how-it-works" className="bg-[#E9EDE3] px-6 md:px-16 py-20 text-left">
        <div className="max-w-7xl mx-auto flex flex-col gap-12">
          <div className="flex flex-col gap-2 max-w-2xl">
            <span className="text-xs font-bold tracking-widest text-[#1B7A4B] uppercase">How it works</span>
            <h2 className="font-ragellan font-extrabold text-4xl md:text-5xl text-[#12261D] mt-2">
              Three minutes to set up. One tap a day after that.
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
            <div className="flex flex-col gap-4">
              <div className="w-11 h-11 rounded-full bg-[#12261D] text-[#9BD96B] flex items-center justify-center text-lg font-extrabold">
                1
              </div>
              <h3 className="text-xl font-bold text-[#12261D]">Tell us about your crop</h3>
              <p className="text-[#4B5A52] text-sm leading-relaxed">
                Select your village, crop type, and plot size. Land record details fill automatically to save you time.
              </p>
            </div>
            <div className="flex flex-col gap-4">
              <div className="w-11 h-11 rounded-full bg-[#12261D] text-[#9BD96B] flex items-center justify-center text-lg font-extrabold">
                2
              </div>
              <h3 className="text-xl font-bold text-[#12261D]">Get your daily farm advisory</h3>
              <p className="text-[#4B5A52] text-sm leading-relaxed">
                Receive personalized morning updates with tailored irrigation schedules, weather alerts, and local mandi prices.
              </p>
            </div>
            <div className="flex flex-col gap-4">
              <div className="w-11 h-11 rounded-full bg-[#12261D] text-[#9BD96B] flex items-center justify-center text-lg font-extrabold">
                3
              </div>
              <h3 className="text-xl font-bold text-[#12261D]">Ask whenever you're stuck</h3>
              <p className="text-[#4B5A52] text-sm leading-relaxed">
                Snap a photo, send a voice message, or talk to expert agronomists directly whenever you need guidance.
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
          <blockquote className="font-ragellan text-3xl md:text-4xl text-[#12261D] leading-normal text-wrap font-semibold italic">
            “I just speak to the app in Telugu and take a picture of the leaf. Within seconds, I get clear instructions on what to do. It’s like having a doctor for my crops right in my pocket.”
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
                4.2 acres · Paddy & Tomato · Vizianagaram, Andhra Pradesh
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA SECTION */}
      <section id="pricing" className="bg-[#0E2419] px-6 py-20 text-center flex flex-col items-center gap-6 text-white relative overflow-hidden">
        <h2 className="font-ragellan font-extrabold text-4xl md:text-6xl text-[#F5F4EE] max-w-3xl leading-tight">
          Start with this season’s crop.
        </h2>
        <p className="text-[#B7C9BD] text-base md:text-lg max-w-xl leading-relaxed">
          100% free for farmers, no hidden charges, no commitments. Setup takes less than 3 minutes.
        </p>
        <div className="flex justify-center pt-4">
          <button
            onClick={() => navigate(isAuthenticated ? "/dashboard" : "/register")}
            className="bg-[#9BD96B] text-[#0E2419] text-base font-bold px-8 py-4 rounded-xl hover:bg-[#8ac75c] transition transform hover:-translate-y-0.5"
          >
            Create free account
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
