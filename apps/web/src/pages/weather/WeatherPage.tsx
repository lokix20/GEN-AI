import { useNavigate } from "react-router-dom";
import { cn } from "../../lib/utils.js";

export function WeatherPage() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col h-[calc(100vh-1rem)] w-full bg-[#F4F3EC] select-none font-sans overflow-hidden">
      
      {/* Full-width Top Header */}
      <header className="flex items-center justify-between px-6 py-4 border-b border-[#E4E3DA] shrink-0 bg-[#F4F3EC]">
        <div className="flex items-center gap-4">
          <h1 className="text-xl font-extrabold text-[#12261D]" style={{ fontFamily: "'Sora', sans-serif" }}>
            Weather
          </h1>
          <div className="text-[13px] font-semibold text-[#A2ADA5]">
            Kadapa, Andhra Pradesh · IMD + on-farm sensor
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden sm:flex text-[13px] font-bold text-[#5C6B62] items-center gap-1 cursor-pointer hover:text-[#12261D] transition">
            English <span className="text-[10px]">▼</span>
          </div>
          <div 
            onClick={() => navigate("/")}
            className="w-9 h-9 rounded-xl bg-[#0F2419] text-[#9BD96B] flex items-center justify-center font-bold text-[13px] cursor-pointer hover:opacity-90 shadow-sm"
          >
            RF
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <div className="flex-1 p-4 md:p-6 flex flex-col lg:flex-row gap-6 overflow-y-auto no-scrollbar">
        
        {/* Left Column */}
        <div className="flex-1 flex flex-col gap-6">
          
          {/* Top Metric Banner (Dark Green) */}
          <div className="bg-[#0F2419] rounded-[24px] p-6 text-white flex flex-col md:flex-row items-start md:items-center justify-between shadow-sm relative overflow-hidden">
             <div className="flex flex-col z-10">
               <div className="text-[11px] font-bold text-[#A2B8AA] uppercase tracking-widest mb-1">
                 Right now · 2:40 PM
               </div>
               <div className="flex items-baseline gap-3">
                 <div className="text-[52px] font-extrabold leading-none tracking-tighter" style={{ fontFamily: "'Sora', sans-serif" }}>
                   28°
                 </div>
               </div>
               <div className="text-[14px] font-medium text-[#9BD96B] mt-2">
                 Sunny · feels like 31°
               </div>
             </div>

             <div className="flex items-center gap-8 md:gap-12 mt-6 md:mt-0 z-10">
               <div className="flex flex-col">
                 <span className="text-[10.5px] font-bold text-[#A2B8AA] uppercase tracking-widest mb-1">Humidity</span>
                 <span className="text-[20px] font-extrabold" style={{ fontFamily: "'Sora', sans-serif" }}>65%</span>
               </div>
               <div className="flex flex-col">
                 <span className="text-[10.5px] font-bold text-[#A2B8AA] uppercase tracking-widest mb-1">Wind</span>
                 <span className="text-[20px] font-extrabold" style={{ fontFamily: "'Sora', sans-serif" }}>12 km/h</span>
               </div>
               <div className="flex flex-col">
                 <span className="text-[10.5px] font-bold text-[#A2B8AA] uppercase tracking-widest mb-1">Rain Today</span>
                 <span className="text-[20px] font-extrabold" style={{ fontFamily: "'Sora', sans-serif" }}>10%</span>
               </div>
               <div className="flex flex-col">
                 <span className="text-[10.5px] font-bold text-[#A2B8AA] uppercase tracking-widest mb-1">Evapotranspiration</span>
                 <span className="text-[20px] font-extrabold" style={{ fontFamily: "'Sora', sans-serif" }}>4.8 mm</span>
               </div>
             </div>
             
             {/* Decorative subtle sun */}
             <div className="absolute -top-12 -right-12 w-48 h-48 bg-[#9BD96B] rounded-full opacity-[0.03] blur-xl" />
          </div>

          {/* Work Windows Chart */}
          <div className="bg-white border border-[#E4E3DA] rounded-[24px] p-6 shadow-sm flex flex-col gap-5">
            <div>
              <h3 className="text-[18px] font-extrabold text-[#12261D]" style={{ fontFamily: "'Sora', sans-serif" }}>
                Work windows, next 36 hours
              </h3>
              <p className="text-[14px] font-medium text-[#5C6B62] mt-0.5">
                When it's safe to spray, irrigate or harvest
              </p>
            </div>

            <div className="flex gap-2 text-[13px] font-semibold text-center mb-2 overflow-x-auto no-scrollbar">
               <div className="flex-1 min-w-[120px] bg-[#E6F3E4] border border-[#CDE5C8] text-[#1B7A4B] rounded-xl p-3 flex flex-col justify-center">
                 <span className="font-extrabold">Now - 6 PM</span>
                 <span className="text-[12px] opacity-90">Good for irrigation</span>
               </div>
               <div className="flex-1 min-w-[120px] bg-[#FAFAF7] border border-[#E4E3DA] text-[#5C6B62] rounded-xl p-3 flex flex-col justify-center">
                 <span className="font-extrabold">Night</span>
                 <span className="text-[12px] opacity-90">Dew forming</span>
               </div>
               <div className="flex-1 min-w-[120px] bg-[#E6F3E4] border border-[#CDE5C8] text-[#1B7A4B] rounded-xl p-3 flex flex-col justify-center">
                 <span className="font-extrabold">Wed 6-8 AM</span>
                 <span className="text-[12px] opacity-90">Best spray window</span>
               </div>
               <div className="flex-1 min-w-[120px] bg-[#FFF4E5] border border-[#FADEC9] text-[#C27D00] rounded-xl p-3 flex flex-col justify-center">
                 <span className="font-extrabold text-[#D94F4F]">Wed 12-8 PM</span>
                 <span className="text-[12px] text-[#D94F4F] opacity-90">Heavy rain 42 mm — no field work</span>
               </div>
            </div>

            {/* Mock Chart Area */}
            <div className="h-32 flex items-end gap-1 sm:gap-2 px-1 relative">
              {[
                {h: 15, l: "3PM"}, {h: 15, l: "5PM"}, {h: 20, l: "7PM"}, {h: 25, l: "9PM"}, 
                {h: 25, l: "1AM"}, {h: 30, l: "5AM"}, {h: 40, l: "9AM"}, {h: 90, l: "12PM", p: true}, 
                {h: 100, l: "3PM", p: true}, {h: 60, l: "6PM", p: true}, {h: 30, l: "9PM"}, {h: 15, l: "11PM"}
              ].map((bar, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-2 group">
                  <div className="w-full relative flex items-end justify-center h-24">
                     <div 
                       className={cn("w-full max-w-[40px] rounded-t-md transition-all duration-300", bar.p ? "bg-[#3B6FA8]" : "bg-[#B8D4EF]")} 
                       style={{ height: `${bar.h}%` }} 
                     />
                  </div>
                  <span className={cn("text-[10px] font-bold", bar.p ? "text-[#12261D]" : "text-[#A2ADA5]")}>{bar.l}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Next 7 Days */}
          <div className="bg-white border border-[#E4E3DA] rounded-[24px] p-6 shadow-sm flex flex-col gap-6">
            <h3 className="text-[18px] font-extrabold text-[#12261D]" style={{ fontFamily: "'Sora', sans-serif" }}>
              Next 7 days
            </h3>
            
            <div className="flex gap-3 overflow-x-auto no-scrollbar pb-2">
              {[
                {d: "TUE", i: "☀️", t: "28°", c: "10%", bg: "bg-[#FAFAF7]", b: "border-[#E4E3DA]"},
                {d: "WED", i: "🌧️", t: "25°", c: "42 mm", bg: "bg-[#E6F0FA]", b: "border-[#CDE0F5]"},
                {d: "THU", i: "⛅", t: "26°", c: "30%", bg: "bg-[#FAFAF7]", b: "border-[#E4E3DA]"},
                {d: "FRI", i: "☀️", t: "29°", c: "5%", bg: "bg-[#FAFAF7]", b: "border-[#E4E3DA]"},
                {d: "SAT", i: "☀️", t: "30°", c: "5%", bg: "bg-[#FAFAF7]", b: "border-[#E4E3DA]"},
                {d: "SUN", i: "⛅", t: "29°", c: "20%", bg: "bg-[#FAFAF7]", b: "border-[#E4E3DA]"},
                {d: "MON", i: "🌦️", t: "27°", c: "12 mm", bg: "bg-[#FAFAF7]", b: "border-[#E4E3DA]"}
              ].map((day, i) => (
                <div key={i} className={cn("min-w-[70px] flex-1 flex flex-col items-center justify-center p-4 rounded-2xl border", day.bg, day.b)}>
                  <div className="text-[11px] font-extrabold text-[#5C6B62] tracking-wider mb-2">{day.d}</div>
                  <div className="text-2xl mb-2">{day.i}</div>
                  <div className="text-[16px] font-extrabold text-[#12261D]" style={{ fontFamily: "'Sora', sans-serif" }}>{day.t}</div>
                  <div className={cn("text-[11px] font-bold mt-1", day.c.includes("mm") ? "text-[#3B6FA8]" : "text-[#A2ADA5]")}>{day.c}</div>
                </div>
              ))}
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-[#E4E3DA]">
               <div className="text-[13px] font-semibold text-[#5C6B62]">
                 Season rainfall so far: <span className="font-extrabold text-[#12261D]">412 mm</span> · 18% above normal
               </div>
               <button className="text-[#1B7A4B] font-bold text-[13px] hover:underline transition">
                 Compare with last year →
               </button>
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="w-full lg:w-[380px] shrink-0 flex flex-col gap-6">
           
           {/* Alert Card */}
           <div className="bg-[#FFF4E5] border border-[#FADEC9] rounded-[24px] p-6 flex flex-col gap-4">
              <div className="flex items-center gap-3">
                <div className="bg-[#D94F4F] text-white text-[10px] font-extrabold px-2 py-1 rounded-md uppercase tracking-wider">Alert</div>
                <div className="text-[12px] font-semibold text-[#C27D00]">IMD · district</div>
              </div>
              
              <div>
                <h4 className="text-[18px] font-extrabold text-[#D94F4F] leading-tight" style={{ fontFamily: "'Sora', sans-serif" }}>
                  Heavy rain Wednesday, 42 mm
                </h4>
                <p className="text-[14px] font-medium text-[#C27D00] mt-2 leading-relaxed">
                  Drain Plot A and finish spraying before noon. Rain will wash off anything applied after 10 AM.
                </p>
              </div>

              <button className="w-full bg-[#C27D00] hover:bg-[#A66B00] text-white rounded-xl py-3 px-4 font-bold text-[14.5px] transition mt-2">
                See what to do
              </button>
           </div>

           {/* Crop Impacts */}
           <div className="bg-white border border-[#E4E3DA] rounded-[24px] p-6 shadow-sm flex flex-col gap-5">
             <h3 className="text-[16px] font-extrabold text-[#12261D]" style={{ fontFamily: "'Sora', sans-serif" }}>
               What this means for your crops
             </h3>
             <div className="flex flex-col gap-4">
               <div className="flex flex-col gap-1">
                 <div className="flex items-center gap-2">
                   <div className="w-2 h-2 rounded-full bg-[#D94F4F]" />
                   <span className="font-extrabold text-[#12261D] text-[14.5px]">Paddy <span className="font-semibold text-[#A2ADA5]">· Plot A</span></span>
                 </div>
                 <div className="text-[13.5px] text-[#5C6B62] font-medium pl-4">
                   Blight risk rises sharply after rain. Drain today.
                 </div>
               </div>

               <div className="flex flex-col gap-1">
                 <div className="flex items-center gap-2">
                   <div className="w-2 h-2 rounded-full bg-[#1B7A4B]" />
                   <span className="font-extrabold text-[#12261D] text-[14.5px]">Tomato <span className="font-semibold text-[#A2ADA5]">· Plot B</span></span>
                 </div>
                 <div className="text-[13.5px] text-[#5C6B62] font-medium pl-4">
                   Irrigate today; skip Thursday's cycle.
                 </div>
               </div>

               <div className="flex flex-col gap-1">
                 <div className="flex items-center gap-2">
                   <div className="w-2 h-2 rounded-full bg-[#C27D00]" />
                   <span className="font-extrabold text-[#12261D] text-[14.5px]">Cotton <span className="font-semibold text-[#A2ADA5]">· Strip C</span></span>
                 </div>
                 <div className="text-[13.5px] text-[#5C6B62] font-medium pl-4">
                   Delay weeding to Friday — soil too wet.
                 </div>
               </div>
             </div>
           </div>

           {/* Season Rainfall Chart */}
           <div className="bg-white border border-[#E4E3DA] rounded-[24px] p-6 shadow-sm flex flex-col gap-5">
             <h3 className="text-[16px] font-extrabold text-[#12261D]" style={{ fontFamily: "'Sora', sans-serif" }}>
               Rainfall this season
             </h3>
             
             <div className="h-32 flex items-end gap-2 mt-2">
               {[
                 {m: "Apr", h: 20}, {m: "May", h: 30}, {m: "Jun", h: 60}, {m: "Jul", h: 50}, {m: "Aug", h: 90}
               ].map((bar) => (
                 <div key={bar.m} className="flex-1 flex flex-col items-center gap-2">
                   <div className="w-full flex items-end justify-center h-24">
                     <div className="w-full max-w-[40px] bg-[#3B6FA8] rounded-t-md opacity-80" style={{ height: `${bar.h}%` }} />
                   </div>
                   <div className="text-[11px] font-bold text-[#A2ADA5]">{bar.m}</div>
                 </div>
               ))}
             </div>
           </div>

           {/* WhatsApp alerts */}
           <div className="bg-[#0F2419] rounded-[24px] p-6 mt-auto flex flex-col gap-3 text-white relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#9BD96B] rounded-full opacity-[0.03] -translate-y-10 translate-x-10" />
              <h4 className="text-[16px] font-extrabold tracking-tight relative z-10" style={{ fontFamily: "'Sora', sans-serif" }}>
                Get rain alerts on WhatsApp
              </h4>
              <p className="text-[13px] text-[#A2B8AA] font-medium leading-relaxed relative z-10">
                One message the evening before, in Telugu.
              </p>
              <button className="bg-[#9BD96B] hover:bg-[#8ac75c] text-[#0F2419] font-extrabold text-[14px] py-3 px-4 rounded-xl mt-2 w-full transition relative z-10">
                Turn on alerts
              </button>
            </div>
        </div>

      </div>
    </div>
  );
}
