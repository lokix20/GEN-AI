import { useNavigate } from "react-router-dom";
import { cn } from "../../lib/utils.js";

export function IrrigationPage() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col w-full bg-[#F4F3EC] select-none font-sans text-left pb-10">
      
      {/* Full-width Top Header */}
      <header className="flex items-center justify-between px-6 py-4 border-b border-[#E4E3DA] shrink-0 bg-[#F4F3EC]">
        <div className="flex items-center gap-6">
          <h1 className="text-xl font-extrabold text-[#12261D]" style={{ fontFamily: "'Sora', sans-serif" }}>
            Irrigation Planner
          </h1>
          
          <div className="hidden sm:flex items-center gap-1 bg-[#EBEAE2] p-1 rounded-xl border border-[#E4E3DA]">
            {['Schedule', 'Water use', 'Sensors'].map((tab) => (
              <button
                key={tab}
                className={cn(
                  "px-4 py-1.5 rounded-lg text-[13px] font-bold transition duration-150",
                  tab === 'Schedule'
                    ? "bg-white text-[#12261D] shadow-sm border border-[#DCDBD1]"
                    : "text-[#5C6B62] hover:text-[#12261D]"
                )}
              >
                {tab}
              </button>
            ))}
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
          
          {/* Next Run Banner */}
          <div className="shrink-0 bg-[#0F2419] rounded-[24px] p-6 text-white flex flex-col md:flex-row md:items-center justify-between shadow-sm relative overflow-hidden">
             <div className="flex flex-col z-10 gap-3">
               <div className="flex items-center gap-3">
                 <div className="bg-[#1B7A4B] text-white text-[10.5px] font-extrabold px-3 py-1.5 rounded-lg uppercase tracking-widest">
                   Next Run
                 </div>
                 <div className="text-[12.5px] font-semibold text-[#A2B8AA]">
                   Plot B · tomato · drip
                 </div>
               </div>
               
               <div className="text-[28px] md:text-[34px] font-extrabold tracking-tight leading-tight" style={{ fontFamily: "'Sora', sans-serif" }}>
                 Today 6:00 PM · run 55 minutes
               </div>
               
               <div className="text-[14px] font-medium text-[#A2B8AA]">
                 Soil at 31%, target 48% · ~4,200 L · no rain before Wednesday noon
               </div>
             </div>

             <div className="flex items-center gap-3 mt-6 md:mt-0 z-10">
               <button className="bg-[#9BD96B] hover:bg-[#8ac75c] text-[#0F2419] font-extrabold text-[15px] py-3.5 px-6 rounded-xl transition">
                 Start now
               </button>
               <button className="bg-transparent border border-[#5C6B62] hover:bg-white/10 text-white font-bold text-[15px] py-3.5 px-6 rounded-xl transition">
                 Reschedule
               </button>
             </div>
             
             {/* Decorative subtle element */}
             <div className="absolute top-0 right-1/4 w-64 h-64 bg-[#9BD96B] rounded-full opacity-[0.02] blur-2xl pointer-events-none" />
          </div>

          {/* Plot by Plot Tracking */}
          <div className="shrink-0 bg-white border border-[#E4E3DA] rounded-[24px] p-6 shadow-sm flex flex-col gap-8">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-[18px] font-extrabold text-[#12261D]" style={{ fontFamily: "'Sora', sans-serif" }}>
                  Plot by plot
                </h3>
                <p className="text-[14px] font-medium text-[#5C6B62] mt-0.5">
                  Moisture now vs the band this crop needs
                </p>
              </div>
              <button className="text-[#1B7A4B] font-bold text-[13.5px] hover:underline">
                Sensor settings
              </button>
            </div>

            <div className="flex flex-col gap-8">
              
              {/* Plot B - Tomato */}
              <div className="flex flex-col md:flex-row gap-4 md:items-center">
                <div className="w-[160px] shrink-0">
                  <div className="text-[15px] font-extrabold text-[#12261D]">Plot B · Tomato</div>
                  <div className="text-[12.5px] font-medium text-[#5C6B62]">1.8 ac · drip · fruiting</div>
                </div>
                
                <div className="flex-1 relative h-2 bg-[#F4F3EC] rounded-full my-4 md:my-0 flex items-center mx-4">
                   {/* Target Band (green area in middle) */}
                   <div className="absolute left-[42%] right-[38%] h-3 bg-[#E6F3E4] rounded-sm top-1/2 -translate-y-1/2 flex items-center justify-center">
                     <span className="absolute -bottom-6 text-[11px] font-bold text-[#A2ADA5] whitespace-nowrap">Target band 42-62%</span>
                   </div>
                   {/* Current Moisture Marker (red, low) */}
                   <div className="absolute left-[31%] h-5 w-1 bg-[#D94F4F] top-1/2 -translate-y-1/2 z-10" />
                   <span className="absolute left-[31%] -top-6 text-[12px] font-extrabold text-[#D94F4F] -translate-x-1/2">Now 31%</span>
                </div>

                <div className="w-[120px] shrink-0 text-right">
                  <div className="text-[13px] font-extrabold text-[#D94F4F]">Irrigate today</div>
                  <div className="text-[12.5px] font-semibold text-[#5C6B62]">55 min · 6 PM</div>
                </div>
              </div>

              <div className="h-px bg-[#F4F3EC] w-full" />

              {/* Plot A - Paddy */}
              <div className="flex flex-col md:flex-row gap-4 md:items-center">
                <div className="w-[160px] shrink-0">
                  <div className="text-[15px] font-extrabold text-[#12261D]">Plot A · Paddy</div>
                  <div className="text-[12.5px] font-medium text-[#5C6B62]">2.4 ac · flood · tillering</div>
                </div>
                
                <div className="flex-1 relative h-2 bg-[#F4F3EC] rounded-full my-4 md:my-0 flex items-center mx-4">
                   {/* Target Band */}
                   <div className="absolute left-[40%] right-[35%] h-3 bg-[#E6F3E4] rounded-sm top-1/2 -translate-y-1/2 flex items-center justify-center">
                     <span className="absolute -bottom-6 text-[11px] font-bold text-[#A2ADA5] whitespace-nowrap">Target band 40-65%</span>
                   </div>
                   {/* Current Moisture Marker (green, good) */}
                   <div className="absolute left-[52%] h-5 w-1 bg-[#1B7A4B] top-1/2 -translate-y-1/2 z-10" />
                   <span className="absolute left-[52%] -top-6 text-[12px] font-extrabold text-[#1B7A4B] -translate-x-1/2">Now 52%</span>
                </div>

                <div className="w-[120px] shrink-0 text-right">
                  <div className="text-[13px] font-extrabold text-[#C27D00]">Drain, don't water</div>
                  <div className="text-[12.5px] font-semibold text-[#5C6B62]">Blight risk</div>
                </div>
              </div>

              <div className="h-px bg-[#F4F3EC] w-full" />

              {/* Strip C - Cotton */}
              <div className="flex flex-col md:flex-row gap-4 md:items-center">
                <div className="w-[160px] shrink-0">
                  <div className="text-[15px] font-extrabold text-[#12261D]">Strip C · Cotton</div>
                  <div className="text-[12.5px] font-medium text-[#5C6B62]">0.4 ac · drip · boll</div>
                </div>
                
                <div className="flex-1 relative h-2 bg-[#F4F3EC] rounded-full my-4 md:my-0 flex items-center mx-4">
                   {/* Target Band */}
                   <div className="absolute left-[35%] right-[40%] h-3 bg-[#E6F3E4] rounded-sm top-1/2 -translate-y-1/2 flex items-center justify-center">
                     <span className="absolute -bottom-6 text-[11px] font-bold text-[#A2ADA5] whitespace-nowrap">Target band 35-60%</span>
                   </div>
                   {/* Current Moisture Marker (green, good) */}
                   <div className="absolute left-[47%] h-5 w-1 bg-[#12261D] top-1/2 -translate-y-1/2 z-10" />
                   <span className="absolute left-[47%] -top-6 text-[12px] font-extrabold text-[#12261D] -translate-x-1/2">Now 47%</span>
                </div>

                <div className="w-[120px] shrink-0 text-right">
                  <div className="text-[13px] font-extrabold text-[#1B7A4B]">No action</div>
                  <div className="text-[12.5px] font-semibold text-[#5C6B62]">Next check Fri</div>
                </div>
              </div>

            </div>
          </div>

          {/* Next 7 Days Schedule */}
          <div className="shrink-0 bg-white border border-[#E4E3DA] rounded-[24px] p-6 shadow-sm flex flex-col gap-6">
            <div className="flex items-center justify-between">
              <h3 className="text-[18px] font-extrabold text-[#12261D]" style={{ fontFamily: "'Sora', sans-serif" }}>
                Next 7 days
              </h3>
              <div className="text-[12.5px] font-medium text-[#5C6B62]">
                Rain-aware — cycles auto-skip after 20 mm
              </div>
            </div>
            
            <div className="flex gap-3 overflow-x-auto no-scrollbar pb-2 items-stretch min-h-[140px]">
              
              {/* TUE 5 */}
              <div className="min-w-[90px] flex-1 flex flex-col p-4 rounded-2xl border border-[#E4E3DA] bg-[#FAFAF7]">
                <div className="text-[11px] font-extrabold text-[#12261D] tracking-wider mb-3 uppercase">TUE 5</div>
                <div className="text-[13px] font-bold text-[#1B7A4B]">Plot B - 55 min</div>
              </div>

              {/* WED 6 (Rain skipped) */}
              <div className="min-w-[100px] flex-1 flex flex-col p-4 rounded-2xl border border-[#CDE0F5] bg-[#E6F0FA]">
                <div className="text-[11px] font-extrabold text-[#3B6FA8] tracking-wider mb-2 uppercase">WED 6</div>
                <div className="text-[14px] font-bold text-[#3B6FA8] mb-1">Rain 42 mm</div>
                <div className="text-[12.5px] font-semibold text-[#5C6B62]">All cycles skipped</div>
              </div>

              {/* THU 7 */}
              <div className="min-w-[90px] flex-1 flex flex-col p-4 rounded-2xl border border-[#E4E3DA] bg-[#FAFAF7]">
                <div className="text-[11px] font-extrabold text-[#12261D] tracking-wider mb-3 uppercase">THU 7</div>
                <div className="text-[12.5px] font-semibold text-[#5C6B62]">Skipped — soil full</div>
              </div>

              {/* FRI 8 */}
              <div className="min-w-[90px] flex-1 flex flex-col p-4 rounded-2xl border border-[#E4E3DA] bg-[#FAFAF7]">
                <div className="text-[11px] font-extrabold text-[#12261D] tracking-wider mb-3 uppercase">FRI 8</div>
                <div className="text-[13px] font-bold text-[#1B7A4B]">Strip C - 25 min</div>
              </div>

              {/* SAT 9 */}
              <div className="min-w-[90px] flex-1 flex flex-col p-4 rounded-2xl border border-[#E4E3DA] bg-[#FAFAF7]">
                <div className="text-[11px] font-extrabold text-[#12261D] tracking-wider mb-3 uppercase">SAT 9</div>
                <div className="text-[13px] font-bold text-[#1B7A4B]">Plot B - 45 min</div>
              </div>

              {/* SUN 10 */}
              <div className="min-w-[90px] flex-1 flex flex-col p-4 rounded-2xl border border-[#E4E3DA] bg-[#FAFAF7]">
                <div className="text-[11px] font-extrabold text-[#12261D] tracking-wider mb-3 uppercase">SUN 10</div>
                <div className="text-[12.5px] font-semibold text-[#A2ADA5]">Nothing due</div>
              </div>

              {/* MON 11 */}
              <div className="min-w-[90px] flex-1 flex flex-col p-4 rounded-2xl border border-[#E4E3DA] bg-[#FAFAF7]">
                <div className="text-[11px] font-extrabold text-[#12261D] tracking-wider mb-3 uppercase">MON 11</div>
                <div className="text-[13px] font-bold text-[#1B7A4B]">Plot A - flood</div>
              </div>

            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="w-full lg:w-[320px] shrink-0 flex flex-col gap-6">
           
           {/* Monthly Water */}
           <div className="shrink-0 bg-white border border-[#E4E3DA] rounded-[24px] p-6 shadow-sm flex flex-col gap-4">
              <h3 className="text-[15px] font-extrabold text-[#12261D]" style={{ fontFamily: "'Sora', sans-serif" }}>
                This month's water
              </h3>
              
              <div>
                <div className="text-[42px] font-extrabold leading-none tracking-tight text-[#12261D]" style={{ fontFamily: "'Sora', sans-serif" }}>
                  86,400 <span className="text-[16px] font-bold text-[#5C6B62] tracking-normal">litres</span>
                </div>
              </div>

              <div className="w-full h-2 bg-[#FAFAF7] border border-[#E4E3DA] rounded-full overflow-hidden mt-2">
                 <div className="h-full bg-[#3B6FA8] w-[64%] rounded-full" />
              </div>
              
              <div className="text-[12px] font-medium text-[#5C6B62] leading-relaxed mt-1">
                64% of your monthly budget · <span className="font-extrabold text-[#3B6FA8]">18% less</span> than the same week last year, thanks to 3 skipped cycles.
              </div>
           </div>

           {/* Sensors List */}
           <div className="shrink-0 bg-white border border-[#E4E3DA] rounded-[24px] p-6 shadow-sm flex flex-col gap-5">
             <h3 className="text-[15px] font-extrabold text-[#12261D]" style={{ fontFamily: "'Sora', sans-serif" }}>
               Sensors
             </h3>
             
             <div className="flex flex-col gap-5">
               <div className="flex gap-3 items-center">
                 <div className="w-2 h-2 rounded-full bg-[#1B7A4B]" />
                 <div className="flex flex-col gap-0.5">
                   <span className="font-extrabold text-[#12261D] text-[13.5px]">Plot B probe</span>
                   <span className="text-[11.5px] font-semibold text-[#8B978F]">Reporting · battery 78%</span>
                 </div>
               </div>
               
               <div className="flex gap-3 items-center">
                 <div className="w-2 h-2 rounded-full bg-[#1B7A4B]" />
                 <div className="flex flex-col gap-0.5">
                   <span className="font-extrabold text-[#12261D] text-[13.5px]">Plot A probe</span>
                   <span className="text-[11.5px] font-semibold text-[#8B978F]">Reporting · battery 54%</span>
                 </div>
               </div>

               <div className="flex gap-3 items-center">
                 <div className="w-2 h-2 rounded-full bg-[#C27D00]" />
                 <div className="flex flex-col gap-0.5">
                   <span className="font-extrabold text-[#12261D] text-[13.5px]">Strip C probe</span>
                   <span className="text-[11.5px] font-semibold text-[#8B978F]">Last seen 6h ago</span>
                 </div>
               </div>
             </div>

             <button className="text-[#1B7A4B] font-bold text-[12.5px] hover:underline text-left mt-2">
               No sensor? Use crop-stage estimates →
             </button>
           </div>

           {/* Saved this season */}
           <div className="shrink-0 bg-[#E6F3E4] border border-[#CDE5C8] rounded-[24px] p-6 flex flex-col gap-2 mt-auto">
              <div className="text-[12.5px] font-extrabold text-[#1B7A4B] uppercase tracking-widest">
                Saved this season
              </div>
              <div className="text-[32px] font-extrabold text-[#12261D] tracking-tight" style={{ fontFamily: "'Sora', sans-serif" }}>
                ₹3,180
              </div>
              <div className="text-[12px] font-semibold text-[#5C6B62] leading-relaxed">
                11 cycles skipped on rain forecasts — about 62,000 litres and pump diesel.
              </div>
           </div>
        </div>

      </div>
    </div>
  );
}
