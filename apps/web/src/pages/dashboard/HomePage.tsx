import { useNavigate } from "react-router-dom";
import { Mic } from "lucide-react";
import { useAuthStore } from "../../store/auth.store.js";

export function HomePage() {
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);
  const displayName = user?.name?.split(" ")[0] ?? "Farmer";

  return (
    <div className="flex flex-col gap-6 text-left">
      {/* 1. GREETING ROW */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div className="text-left">
          <h1 className="font-sora text-3xl font-bold tracking-tight text-[#12261D]">
            Good afternoon, {displayName}
          </h1>
          <p className="text-[#5C6B62] text-sm mt-1">
            Tuesday, 5 August · everything on your farm looks steady today.
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => navigate("/disease-detection")}
            className="px-4 py-2.5 rounded-lg bg-[#0F2419] text-[#F4F3EC] text-xs font-semibold hover:bg-opacity-90 transition active:scale-95"
          >
            Scan a crop
          </button>
          <button
            onClick={() => navigate("/coming-soon/farm-diary")}
            className="px-4 py-2.5 rounded-lg bg-white border border-[#DCDBD1] text-[#2B3A32] text-xs font-semibold hover:bg-[#F9F8F3] transition active:scale-95"
          >
            Log activity
          </button>
        </div>
      </div>

      {/* 2. MAIN LAYOUT GRID (LEFT MAIN + RIGHT SIDEBAR) */}
      <div className="grid grid-cols-1 xl:grid-cols-[1fr_344px] gap-6 items-start">
        
        {/* LEFT COLUMN */}
        <div className="flex flex-col gap-6 min-w-0">
          
          {/* STAT CARDS (4 COLUMNS) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            
            {/* CARD 1: Weather */}
            <div className="bg-white border border-[#E4E3DA] rounded-2xl p-[17px] flex flex-col gap-2.5 relative shadow-sm">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-[#7A877F]">Weather today</span>
                <span className="w-[22px] height-[22px] h-[22px] rounded-md bg-[#FBF1DC] flex items-center justify-center text-xs">☀️</span>
              </div>
              <div className="font-sora text-3xl font-bold text-[#12261D] tracking-tight">28°C</div>
              <div className="text-xs text-[#5C6B62] font-medium">Sunny · humidity 65%</div>
              <div className="h-[1px] bg-[#EDECE3] my-0.5" />
              <div className="text-xs font-bold text-[#1B7A4B] leading-tight">Rain 10% · wind 12 km/h</div>
            </div>

            {/* CARD 2: Crop Health */}
            <div className="bg-white border border-[#E4E3DA] rounded-2xl p-[17px] flex flex-col gap-2.5 relative shadow-sm">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-[#7A877F]">Crop health</span>
                <span className="w-[22px] height-[22px] h-[22px] rounded-md bg-[#E6F3E4] flex items-center justify-center text-xs">🌱</span>
              </div>
              <div className="flex items-baseline gap-1.5">
                <div className="font-sora text-3xl font-bold text-[#12261D] tracking-tight">82</div>
                <div className="text-[13px] text-[#8B978F] font-semibold">/100</div>
              </div>
              <div className="h-1.5 rounded-full bg-[#EDECE3] overflow-hidden my-0.5">
                <div className="w-[82%] h-full bg-[#1B7A4B]" />
              </div>
              <div className="text-xs font-bold text-[#1B7A4B] leading-tight">Good · up 4 since last week</div>
            </div>

            {/* CARD 3: Soil Moisture */}
            <div className="bg-white border border-[#E4E3DA] rounded-2xl p-[17px] flex flex-col gap-2.5 relative shadow-sm">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-[#7A877F]">Soil moisture</span>
                <span className="w-[22px] height-[22px] h-[22px] rounded-md bg-[#E4EEF6] flex items-center justify-center text-xs">💧</span>
              </div>
              <div className="font-sora text-3xl font-bold text-[#12261D] tracking-tight">45%</div>
              
              {/* Range slider indicator */}
              <div className="h-1.5 rounded-full bg-[#EDECE3] relative my-0.5">
                {/* Target optimal range band (40%-55%) */}
                <div className="absolute left-[40%] right-[45%] top-0 bottom-0 bg-[#C4E0B2] rounded-full" />
                {/* Current value pin (45%) */}
                <div className="absolute left-[45%] w-1 h-3 -top-[3px] bg-[#12261D] rounded-full" />
              </div>

              <div className="text-xs font-bold text-[#1B7A4B] leading-tight">Optimal band 40–55%</div>
            </div>

            {/* CARD 4: Paddy Price */}
            <div className="bg-white border border-[#E4E3DA] rounded-2xl p-[17px] flex flex-col gap-2.5 relative shadow-sm">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-[#7A877F]">Paddy price</span>
                <span className="w-[22px] height-[22px] h-[22px] rounded-md bg-[#EFE9F7] flex items-center justify-center text-xs">🌾</span>
              </div>
              <div className="font-sora text-3xl font-bold text-[#12261D] tracking-tight">₹2,183</div>
              
              {/* Mini vertical bar chart */}
              <div className="flex items-end gap-1 h-5 pt-1 my-0.5">
                <div className="flex-1 h-[40%] bg-[#DCEBD2] rounded-t-sm" />
                <div className="flex-1 h-[55%] bg-[#C4E0B2] rounded-t-sm" />
                <div className="flex-1 h-[45%] bg-[#C4E0B2] rounded-t-sm" />
                <div className="flex-1 h-[70%] bg-[#9BD96B] rounded-t-sm" />
                <div className="flex-1 h-[86%] bg-[#1B7A4B] rounded-t-sm" />
                <div className="flex-1 h-[100%] bg-[#12261D] rounded-t-sm" />
              </div>

              <div className="text-xs font-bold text-[#1B7A4B] leading-tight">▲ 2.4% /quintal · Kadapa</div>
            </div>
          </div>

          {/* AI ASSISTANT ROW */}
          <div className="bg-[#0F2419] rounded-2xl p-6 grid grid-cols-1 md:grid-cols-[1fr_210px] gap-6 items-center shadow-lg relative overflow-hidden">
            <div className="flex flex-col gap-3.5 text-left text-[#F4F3EC]">
              <div className="flex items-center gap-2.5">
                <span className="font-sora text-xl font-bold">Ask the farming assistant</span>
                <span className="text-[10px] font-bold tracking-wider text-[#0F2419] bg-[#9BD96B] px-2 py-0.5 rounded-md">
                  BETA
                </span>
              </div>
              <p className="text-[#9DB3A6] text-sm leading-relaxed">
                Crops, diseases, weather, soil, schemes — ask by voice in your language.
              </p>
              
              {/* Voice chat box mockup */}
              <div 
                onClick={() => navigate("/chat")}
                className="bg-white rounded-xl p-3 flex items-center justify-between gap-3 shadow-inner cursor-pointer hover:bg-opacity-95 transition"
              >
                <span className="text-[#8B978F] text-sm truncate">Type your question or use voice…</span>
                <div className="flex items-center gap-3.5 text-[#5C6B62]">
                  <Mic className="h-4.5 w-4.5 shrink-0" />
                  <div className="w-8 h-8 rounded-lg bg-[#0F2419] text-[#9BD96B] flex items-center justify-center text-sm font-bold">
                    ↑
                  </div>
                </div>
              </div>

              {/* Suggestion Chips */}
              <div className="flex flex-wrap gap-2 pt-1">
                <span className="text-xs text-[#D7F0C2] border border-[#34523F] px-3 py-1.5 rounded-full cursor-pointer hover:bg-[#1E3D2C] transition">
                  Why are my leaves yellow?
                </span>
                <span className="text-xs text-[#D7F0C2] border border-[#34523F] px-3 py-1.5 rounded-full cursor-pointer hover:bg-[#1E3D2C] transition">
                  Best fertilizer for rice
                </span>
                <span className="text-xs text-[#D7F0C2] border border-[#34523F] px-3 py-1.5 rounded-full cursor-pointer hover:bg-[#1E3D2C] transition">
                  Will it rain this week?
                </span>
                <span className="text-xs text-[#D7F0C2] border border-[#34523F] px-3 py-1.5 rounded-full cursor-pointer hover:bg-[#1E3D2C] transition">
                  Schemes for small farmers
                </span>
              </div>
            </div>

            {/* Mascot art slot */}
            <div className="w-[210px] h-[190px] mx-auto rounded-xl overflow-hidden shadow-md shrink-0 bg-[#17311F]">
              <img
                src="/images/ai-robot.jpg"
                alt="AI Robot Assistant"
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* CROPS & RECOMMENDATIONS SPLIT ROW */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            
            {/* Card Left: My Crops */}
            <div className="bg-white border border-[#E4E3DA] rounded-2xl p-5 flex flex-col gap-4 text-left shadow-sm">
              <div className="flex items-center justify-between">
                <span className="font-sora text-[17px] font-bold text-[#12261D]">My crops</span>
                <span className="text-[12.5px] font-semibold text-[#1B7A4B] cursor-pointer hover:underline">
                  View all
                </span>
              </div>
              <div className="grid grid-cols-3 gap-2.5">
                <div className="border border-[#E4E3DA] rounded-xl p-3 flex flex-col items-center gap-2">
                  <div className="w-11 h-11 rounded-full bg-[#E6F3E4] flex items-center justify-center text-xl shadow-inner">🌾</div>
                  <div className="text-xs font-bold text-[#12261D]">Paddy</div>
                  <span className="text-[10px] font-bold text-[#1B7A4B] bg-[#E6F3E4] px-2 py-0.5 rounded-full">
                    Healthy
                  </span>
                  <span className="text-[10px] text-[#8B978F] font-medium mt-0.5">Sown 10 Jun</span>
                </div>
                <div className="border border-[#E4E3DA] rounded-xl p-3 flex flex-col items-center gap-2">
                  <div className="w-11 h-11 rounded-full bg-[#FFEAE5] flex items-center justify-center text-xl shadow-inner">🍅</div>
                  <div className="text-xs font-bold text-[#12261D]">Tomato</div>
                  <span className="text-[10px] font-bold text-[#1B7A4B] bg-[#E6F3E4] px-2 py-0.5 rounded-full">
                    Healthy
                  </span>
                  <span className="text-[10px] text-[#8B978F] font-medium mt-0.5">Sown 05 Jul</span>
                </div>
                <div className="border border-[#E4E3DA] rounded-xl p-3 flex flex-col items-center gap-2">
                  <div className="w-11 h-11 rounded-full bg-[#FBF1DC] flex items-center justify-center text-xl shadow-inner">☁️</div>
                  <div className="text-xs font-bold text-[#12261D]">Cotton</div>
                  <span className="text-[10px] font-bold text-[#8A6412] bg-[#FBF1DC] px-2 py-0.5 rounded-full">
                    Moderate
                  </span>
                  <span className="text-[10px] text-[#8B978F] font-medium mt-0.5">Sown 20 Jun</span>
                </div>
              </div>
            </div>

            {/* Card Right: Today's Recommendations */}
            <div className="bg-white border border-[#E4E3DA] rounded-2xl p-5 flex flex-col gap-3.5 text-left shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <span className="font-sora text-[17px] font-bold text-[#12261D]">Today's recommendations</span>
                  <div className="text-[11px] text-[#8B978F] font-medium">Based on weather & crop stage</div>
                </div>
                <span className="text-[12.5px] font-semibold text-[#1B7A4B] cursor-pointer hover:underline shrink-0">
                  View all
                </span>
              </div>
              
              <div className="flex flex-col gap-2.5">
                <div className="flex gap-3 items-start">
                  <span className="w-4.5 h-4.5 rounded-full bg-[#E6F3E4] flex items-center justify-center text-[10px] text-[#1B7A4B] shrink-0 mt-0.5 font-bold">✓</span>
                  <span className="text-xs text-[#22322A] leading-relaxed">No irrigation needed today — soil is in band.</span>
                </div>
                <div className="flex gap-3 items-start">
                  <span className="w-4.5 h-4.5 rounded-full bg-[#E6F3E4] flex items-center justify-center text-[10px] text-[#1B7A4B] shrink-0 mt-0.5 font-bold">✓</span>
                  <span className="text-xs text-[#22322A] leading-relaxed">Apply urea in the paddy field before Thursday's rain.</span>
                </div>
                <div className="flex gap-3 items-start">
                  <span className="w-4.5 h-4.5 rounded-full bg-[#FBF1DC] flex items-center justify-center text-[10px] text-[#8A6412] shrink-0 mt-0.5 font-bold">!</span>
                  <span className="text-xs text-[#22322A] leading-relaxed">Monitor for leaf folder in rice — neighbours reported cases.</span>
                </div>
                <div className="flex gap-3 items-start">
                  <span className="w-4.5 h-4.5 rounded-full bg-[#E6F3E4] flex items-center justify-center text-[10px] text-[#1B7A4B] shrink-0 mt-0.5 font-bold">✓</span>
                  <span className="text-xs text-[#22322A] leading-relaxed">Ideal window for weeding cotton this week.</span>
                </div>
              </div>
            </div>
          </div>

          {/* BOTTOM STATS STRIP */}
          <div className="bg-white border border-[#E4E3DA] rounded-2xl p-5 flex flex-wrap items-center justify-between gap-4 shadow-sm text-center">
            <div className="flex-1 min-w-[120px]">
              <div className="font-sora text-xl font-bold text-[#12261D]">25K+</div>
              <div className="text-[11px] text-[#7A877F] font-semibold mt-0.5 uppercase tracking-wider">Farmers helped</div>
            </div>
            <div className="hidden sm:block w-px h-8 bg-[#EDECE3]" />
            <div className="flex-1 min-w-[120px]">
              <div className="font-sora text-xl font-bold text-[#12261D]">1.2M+</div>
              <div className="text-[11px] text-[#7A877F] font-semibold mt-0.5 uppercase tracking-wider">Questions answered</div>
            </div>
            <div className="hidden md:block w-px h-8 bg-[#EDECE3]" />
            <div className="flex-1 min-w-[120px]">
              <div className="font-sora text-xl font-bold text-[#12261D]">98%</div>
              <div className="text-[11px] text-[#7A877F] font-semibold mt-0.5 uppercase tracking-wider">Accuracy rate</div>
            </div>
            <div className="hidden sm:block w-px h-8 bg-[#EDECE3]" />
            <div className="flex-1 min-w-[120px]">
              <div className="font-sora text-xl font-bold text-[#12261D]">15+</div>
              <div className="text-[11px] text-[#7A877F] font-semibold mt-0.5 uppercase tracking-wider">Languages</div>
            </div>
            <div className="hidden md:block w-px h-8 bg-[#EDECE3]" />
            <div className="flex-1 min-w-[120px]">
              <div className="font-sora text-xl font-bold text-[#12261D]">50+</div>
              <div className="text-[11px] text-[#7A877F] font-semibold mt-0.5 uppercase tracking-wider">Expert advisors</div>
            </div>
          </div>
        </div>

        {/* RIGHT SIDEBAR COLUMN */}
        <div className="flex flex-col gap-6">
          
          {/* NOTIFICATIONS CARD */}
          <div className="bg-white border border-[#E4E3DA] rounded-2xl p-5 flex flex-col gap-4 text-left shadow-sm">
            <div className="flex items-center justify-between">
              <span className="font-sora text-base font-bold text-[#12261D]">Notifications</span>
              <span className="text-[12.5px] font-semibold text-[#1B7A4B] cursor-pointer hover:underline">
                View all
              </span>
            </div>
            <div className="flex flex-col gap-4">
              <div className="flex gap-3 items-start">
                <span className="w-8 h-8 rounded-lg bg-[#E4EEF6] flex items-center justify-center text-sm shrink-0">🌧️</span>
                <div className="flex-1 leading-normal">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-bold text-[#12261D]">Rain alert</span>
                    <span className="text-[10px] text-[#A9B3AC]">2h</span>
                  </div>
                  <p className="text-xs text-[#5C6B62] mt-0.5 leading-relaxed">Heavy rain expected tomorrow afternoon.</p>
                </div>
              </div>
              <div className="flex gap-3 items-start">
                <span className="w-8 h-8 rounded-lg bg-[#E6F3E4] flex items-center justify-center text-sm shrink-0">💧</span>
                <div className="flex-1 leading-normal">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-bold text-[#12261D]">Irrigation reminder</span>
                    <span className="text-[10px] text-[#A9B3AC]">5h</span>
                  </div>
                  <p className="text-xs text-[#5C6B62] mt-0.5 leading-relaxed">Tomato needs water in 2 days.</p>
                </div>
              </div>
              <div className="flex gap-3 items-start">
                <span className="w-8 h-8 rounded-lg bg-[#FBF1DC] flex items-center justify-center text-sm shrink-0">🌾</span>
                <div className="flex-1 leading-normal">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-bold text-[#12261D]">Scheme update</span>
                    <span className="text-[10px] text-[#A9B3AC]">1d</span>
                  </div>
                  <p className="text-xs text-[#5C6B62] mt-0.5 leading-relaxed">PM-KISAN 16th instalment released.</p>
                </div>
              </div>
              <div className="flex gap-3 items-start">
                <span className="w-8 h-8 rounded-lg bg-[#EFE9F7] flex items-center justify-center text-sm shrink-0">📈</span>
                <div className="flex-1 leading-normal">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-bold text-[#12261D]">Market update</span>
                    <span className="text-[10px] text-[#A9B3AC]">1d</span>
                  </div>
                  <p className="text-xs text-[#5C6B62] mt-0.5 leading-relaxed">Paddy prices rose in your mandi.</p>
                </div>
              </div>
            </div>
          </div>

          {/* QUICK ACTIONS CARD */}
          <div className="bg-white border border-[#E4E3DA] rounded-2xl p-5 flex flex-col gap-3.5 text-left shadow-sm">
            <span className="font-sora text-base font-bold text-[#12261D]">Quick actions</span>
            <div className="grid grid-cols-3 gap-2.5">
              <div 
                onClick={() => navigate("/disease-detection")}
                className="border border-[#E4E3DA] rounded-xl p-3 flex flex-col items-center gap-2 cursor-pointer hover:bg-[#F9F8F3] transition"
              >
                <span className="w-[26px] h-[26px] rounded-lg bg-[#E6F3E4] flex items-center justify-center text-xs">📷</span>
                <span className="text-[11px] font-bold text-[#2B3A32] text-center leading-tight">Scan crop</span>
              </div>
              <div 
                onClick={() => navigate("/chat")}
                className="border border-[#E4E3DA] rounded-xl p-3 flex flex-col items-center gap-2 cursor-pointer hover:bg-[#F9F8F3] transition"
              >
                <span className="w-[26px] h-[26px] rounded-lg bg-[#E4EEF6] flex items-center justify-center text-xs">💬</span>
                <span className="text-[11px] font-bold text-[#2B3A32] text-center leading-tight">Ask AI</span>
              </div>
              <div 
                onClick={() => navigate("/coming-soon/crop-calendar")}
                className="border border-[#E4E3DA] rounded-xl p-3 flex flex-col items-center gap-2 cursor-pointer hover:bg-[#F9F8F3] transition"
              >
                <span className="w-[26px] h-[26px] rounded-lg bg-[#FBF1DC] flex items-center justify-center text-xs">📅</span>
                <span className="text-[11px] font-bold text-[#2B3A32] text-center leading-tight">Calendar</span>
              </div>
              <div 
                onClick={() => navigate("/coming-soon/market")}
                className="border border-[#E4E3DA] rounded-xl p-3 flex flex-col items-center gap-2 cursor-pointer hover:bg-[#F9F8F3] transition"
              >
                <span className="w-[26px] h-[26px] rounded-lg bg-[#EFE9F7] flex items-center justify-center text-xs">📈</span>
                <span className="text-[11px] font-bold text-[#2B3A32] text-center leading-tight">Prices</span>
              </div>
              <div 
                onClick={() => navigate("/coming-soon/weather")}
                className="border border-[#E4E3DA] rounded-xl p-3 flex flex-col items-center gap-2 cursor-pointer hover:bg-[#F9F8F3] transition"
              >
                <span className="w-[26px] h-[26px] rounded-lg bg-[#E4EEF6] flex items-center justify-center text-xs">⛅</span>
                <span className="text-[11px] font-bold text-[#2B3A32] text-center leading-tight">Weather</span>
              </div>
              <div 
                onClick={() => navigate("/coming-soon/schemes")}
                className="border border-[#E4E3DA] rounded-xl p-3 flex flex-col items-center gap-2 cursor-pointer hover:bg-[#F9F8F3] transition"
              >
                <span className="w-[26px] h-[26px] rounded-lg bg-[#E6F3E4] flex items-center justify-center text-xs">📰</span>
                <span className="text-[11px] font-bold text-[#2B3A32] text-center leading-tight">Schemes</span>
              </div>
            </div>
          </div>

          {/* EXPERT CONSULTATION CARD */}
          <div className="bg-[#12261D] rounded-2xl p-5 flex flex-col gap-3 text-left shadow-lg text-white">
            <span className="font-sora text-base font-bold text-[#F4F3EC]">Need an expert?</span>
            <p className="text-[12.5px] text-[#9DB3A6] leading-relaxed">
              Free 15-minute call with an agronomist, 9 AM – 7 PM.
            </p>
            <div className="flex items-center gap-3 pt-1">
              <div className="flex -space-x-2">
                <div className="w-8 h-8 rounded-full border-2 border-[#12261D] bg-[#FFEAE5] flex items-center justify-center text-xs">🧑‍⚕️</div>
                <div className="w-8 h-8 rounded-full border-2 border-[#12261D] bg-[#E6F3E4] flex items-center justify-center text-xs">👩‍🌾</div>
              </div>
              <span className="text-xs text-[#8CA396] font-medium">4 advisors online now</span>
            </div>
            <button 
              onClick={() => navigate("/coming-soon/expert-consultation")}
              className="w-full rounded-xl bg-[#9BD96B] py-3 text-sm font-extrabold text-[#0F2419] transition hover:bg-[#8ac75c] active:scale-[0.98]"
            >
              Book consultation
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
