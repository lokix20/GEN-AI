import { useNavigate } from "react-router-dom";
import { cn } from "../../lib/utils.js";

export function CropCalendarPage() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col h-[calc(100vh-1rem)] w-full bg-[#F4F3EC] select-none font-sans overflow-hidden">
      
      {/* Full-width Top Header */}
      <header className="flex items-center justify-between px-6 py-4 border-b border-[#E4E3DA] shrink-0 bg-[#F4F3EC]">
        <div className="flex items-center gap-6">
          <h1 className="text-xl font-extrabold text-[#12261D]" style={{ fontFamily: "'Sora', sans-serif" }}>
            Crop Calendar
          </h1>
          
          <div className="hidden sm:flex items-center gap-1 bg-[#EBEAE2] p-1 rounded-xl border border-[#E4E3DA]">
            {['Season', 'Month', 'Tasks'].map((tab) => (
              <button
                key={tab}
                className={cn(
                  "px-4 py-1.5 rounded-lg text-[13px] font-bold transition duration-150",
                  tab === 'Season'
                    ? "bg-white text-[#12261D] shadow-sm border border-[#DCDBD1]"
                    : "text-[#5C6B62] hover:text-[#12261D]"
                )}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="hidden md:block text-[13px] font-semibold text-[#8B978F]">
            Kharif 2026 · Jun - Nov
          </div>
        </div>

        <div className="flex items-center gap-4">
          <button className="bg-white border border-[#DCDBD1] hover:bg-[#FAFAF7] text-[#12261D] text-[13px] font-bold px-4 py-2 rounded-xl transition shadow-sm hidden sm:block">
            + Add crop
          </button>
          <div 
            onClick={() => navigate("/")}
            className="w-9 h-9 rounded-xl bg-[#0F2419] text-[#9BD96B] flex items-center justify-center font-bold text-[13px] cursor-pointer hover:opacity-90 shadow-sm"
          >
            RF
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <div className="flex-1 p-4 md:p-6 flex flex-col xl:flex-row gap-6 overflow-y-auto no-scrollbar">
        
        {/* Left Column (Timeline & Calendar Grid) */}
        <div className="flex-1 flex flex-col gap-6">
          
          {/* Season Timeline */}
          <div className="bg-white border border-[#E4E3DA] rounded-[24px] p-6 shadow-sm flex flex-col gap-6 relative overflow-hidden">
             
             <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
               <div>
                 <h3 className="text-[18px] font-extrabold text-[#12261D]" style={{ fontFamily: "'Sora', sans-serif" }}>
                   Season timeline
                 </h3>
                 <p className="text-[13.5px] font-medium text-[#5C6B62] mt-0.5">
                   Each bar is one crop from sowing to harvest
                 </p>
               </div>
               <div className="flex items-center gap-4 text-[12px] font-bold">
                 <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded-full bg-[#CDE5C8]"/> <span className="text-[#5C6B62]">Vegetative</span></div>
                 <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded-full bg-[#1B7A4B]"/> <span className="text-[#5C6B62]">Reproductive</span></div>
                 <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded-full bg-[#E0A838]"/> <span className="text-[#5C6B62]">Harvest</span></div>
               </div>
             </div>

             {/* Timeline Visual */}
             <div className="flex flex-col gap-6 relative pl-[100px] sm:pl-[120px] pt-6 pb-2 overflow-x-auto no-scrollbar min-w-[600px]">
                
                {/* Month Headers */}
                <div className="absolute top-0 left-[120px] right-0 flex text-[11px] font-bold text-[#A2ADA5] uppercase tracking-widest justify-between px-4">
                  <span>Jun</span>
                  <span>Jul</span>
                  <span className="text-[#12261D]">Aug</span>
                  <span>Sep</span>
                  <span>Oct</span>
                  <span>Nov</span>
                </div>

                {/* "TODAY" Line */}
                <div className="absolute top-4 bottom-0 left-[45%] w-px bg-[#12261D] z-10">
                   <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-[#12261D] text-[#9BD96B] text-[9px] font-extrabold px-1.5 py-0.5 rounded uppercase tracking-wider">
                     Today
                   </div>
                </div>

                {/* Paddy Row */}
                <div className="relative flex items-center h-10">
                  <div className="absolute left-[-120px] w-[100px] flex flex-col justify-center">
                    <div className="text-[14px] font-extrabold text-[#12261D]">Paddy</div>
                    <div className="text-[12px] font-medium text-[#5C6B62]">Plot A · 2.4 ac</div>
                  </div>
                  {/* Timeline Bar Container */}
                  <div className="relative flex-1 h-3 rounded-full bg-[#FAFAF7] mx-4 flex items-center">
                    <div className="absolute left-[15%] w-[35%] h-4 bg-[#CDE5C8] rounded-l-full" />
                    <div className="absolute left-[50%] w-[25%] h-4 bg-[#1B7A4B]" />
                    <div className="absolute left-[75%] w-[10%] h-4 bg-[#E0A838] rounded-r-full" />
                  </div>
                </div>

                {/* Tomato Row */}
                <div className="relative flex items-center h-10">
                  <div className="absolute left-[-120px] w-[100px] flex flex-col justify-center">
                    <div className="text-[14px] font-extrabold text-[#12261D]">Tomato</div>
                    <div className="text-[12px] font-medium text-[#5C6B62]">Plot B · 1.8 ac</div>
                  </div>
                  {/* Timeline Bar Container */}
                  <div className="relative flex-1 h-3 rounded-full bg-[#FAFAF7] mx-4 flex items-center">
                    <div className="absolute left-[25%] w-[20%] h-4 bg-[#CDE5C8] rounded-l-full" />
                    <div className="absolute left-[45%] w-[25%] h-4 bg-[#1B7A4B]" />
                    <div className="absolute left-[70%] w-[15%] h-4 bg-[#E0A838] rounded-r-full" />
                  </div>
                </div>

                {/* Cotton Row */}
                <div className="relative flex items-center h-10">
                  <div className="absolute left-[-120px] w-[100px] flex flex-col justify-center">
                    <div className="text-[14px] font-extrabold text-[#12261D]">Cotton</div>
                    <div className="text-[12px] font-medium text-[#5C6B62]">Strip C · 0.4 ac</div>
                  </div>
                  {/* Timeline Bar Container */}
                  <div className="relative flex-1 h-3 rounded-full bg-[#FAFAF7] mx-4 flex items-center">
                    <div className="absolute left-[20%] w-[35%] h-4 bg-[#CDE5C8] rounded-l-full" />
                    <div className="absolute left-[55%] w-[20%] h-4 bg-[#1B7A4B]" />
                    <div className="absolute left-[75%] w-[15%] h-4 bg-[#E0A838] rounded-r-full" />
                  </div>
                </div>

             </div>
          </div>

          {/* August Operations Calendar Grid */}
          <div className="bg-white border border-[#E4E3DA] rounded-[24px] p-6 shadow-sm flex flex-col gap-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-[18px] font-extrabold text-[#12261D]" style={{ fontFamily: "'Sora', sans-serif" }}>
                  August operations
                </h3>
                <p className="text-[13.5px] font-medium text-[#5C6B62] mt-0.5">
                  Generated from crop stage, adjusted for weather
                </p>
              </div>
              <button className="text-[#1B7A4B] font-bold text-[13px] hover:underline hidden sm:block">
                Export to phone calendar
              </button>
            </div>

            <div className="grid grid-cols-7 gap-1 md:gap-3">
              {/* Header Days */}
              {['M','T','W','T','F','S','S'].map((d, i) => (
                <div key={i} className="text-center text-[10px] font-extrabold text-[#A2ADA5] uppercase pb-2">
                  {d}
                </div>
              ))}

              {/* Row 1 (Aug 4 - 10) */}
              <div className="aspect-square bg-[#FAFAF7] border border-[#E4E3DA] rounded-xl p-2 md:p-3 relative opacity-50">
                <span className="text-[12px] font-bold text-[#A2ADA5]">4</span>
              </div>
              
              <div className="aspect-square bg-white border-2 border-[#12261D] rounded-xl p-2 md:p-3 relative shadow-sm">
                <span className="text-[12px] font-extrabold text-[#12261D]">5</span>
                <div className="mt-2 text-[11px] md:text-[13px] font-bold text-[#D94F4F] leading-tight">Drain A</div>
              </div>

              <div className="aspect-square bg-[#FAFAF7] border border-[#E4E3DA] rounded-xl p-2 md:p-3 relative">
                <span className="text-[12px] font-bold text-[#5C6B62]">6</span>
                <div className="mt-2 text-[11px] md:text-[13px] font-bold text-[#C27D00] leading-tight">Spray</div>
              </div>

              <div className="aspect-square bg-[#FAFAF7] border border-[#E4E3DA] rounded-xl p-2 md:p-3 relative">
                <span className="text-[12px] font-bold text-[#5C6B62]">7</span>
              </div>

              <div className="aspect-square bg-[#FAFAF7] border border-[#E4E3DA] rounded-xl p-2 md:p-3 relative">
                <span className="text-[12px] font-bold text-[#5C6B62]">8</span>
                <div className="mt-2 text-[11px] md:text-[13px] font-bold text-[#1B7A4B] leading-tight">Weed C</div>
              </div>

              <div className="aspect-square bg-[#FAFAF7] border border-[#E4E3DA] rounded-xl p-2 md:p-3 relative">
                <span className="text-[12px] font-bold text-[#5C6B62]">9</span>
                <div className="mt-2 text-[11px] md:text-[13px] font-bold text-[#3B6FA8] leading-tight">Mandi</div>
              </div>

              <div className="aspect-square bg-[#FAFAF7] border border-[#E4E3DA] rounded-xl p-2 md:p-3 relative">
                <span className="text-[12px] font-bold text-[#5C6B62]">10</span>
              </div>

              {/* Row 2 (Aug 11 - 17) */}
              <div className="aspect-square bg-[#FAFAF7] border border-[#E4E3DA] rounded-xl p-2 md:p-3 relative">
                <span className="text-[12px] font-bold text-[#5C6B62]">11</span>
                <div className="mt-2 text-[11px] md:text-[13px] font-bold text-[#1B7A4B] leading-tight">Flood A</div>
              </div>

              <div className="aspect-square bg-[#FAFAF7] border border-[#E4E3DA] rounded-xl p-2 md:p-3 relative">
                <span className="text-[12px] font-bold text-[#5C6B62]">12</span>
              </div>

              <div className="aspect-square bg-[#FAFAF7] border border-[#E4E3DA] rounded-xl p-2 md:p-3 relative">
                <span className="text-[12px] font-bold text-[#5C6B62]">13</span>
              </div>

              <div className="aspect-square bg-[#FAFAF7] border border-[#E4E3DA] rounded-xl p-2 md:p-3 relative">
                <span className="text-[12px] font-bold text-[#5C6B62]">14</span>
                <div className="mt-2 text-[11px] md:text-[13px] font-bold text-[#C27D00] leading-tight">Urea A</div>
              </div>

              <div className="aspect-square bg-[#FAFAF7] border border-[#E4E3DA] rounded-xl p-2 md:p-3 relative">
                <span className="text-[12px] font-bold text-[#5C6B62]">15</span>
              </div>

              <div className="aspect-square bg-[#FAFAF7] border border-[#E4E3DA] rounded-xl p-2 md:p-3 relative">
                <span className="text-[12px] font-bold text-[#5C6B62]">16</span>
              </div>

              <div className="aspect-square bg-[#FAFAF7] border border-[#E4E3DA] rounded-xl p-2 md:p-3 relative">
                <span className="text-[12px] font-bold text-[#5C6B62]">17</span>
              </div>

            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="w-full xl:w-[320px] shrink-0 flex flex-col gap-6">
           
           {/* Current Stage Highlight (Dark Green) */}
           <div className="bg-[#0F2419] rounded-[24px] p-6 text-white flex flex-col shadow-sm relative overflow-hidden">
             <div className="text-[11px] font-extrabold text-[#A2B8AA] uppercase tracking-widest mb-3 relative z-10">
               Stage Now
             </div>
             
             <div className="text-[24px] font-extrabold leading-tight relative z-10" style={{ fontFamily: "'Sora', sans-serif" }}>
               Paddy · tillering, day 48
             </div>
             
             <p className="text-[14px] font-medium text-[#A2B8AA] mt-3 leading-relaxed relative z-10">
               Panicle initiation starts in about 12 days — that's when the second urea dose matters most.
             </p>

             <div className="h-px w-full bg-white/10 my-4 relative z-10" />

             <div className="text-[12.5px] font-semibold text-[#9BD96B] relative z-10">
               Day 48 of ~135 · harvest around 30 Oct
             </div>

             <div className="absolute top-0 right-0 w-48 h-48 bg-[#9BD96B] rounded-full opacity-[0.03] blur-xl" />
           </div>

           {/* Coming Up List */}
           <div className="bg-white border border-[#E4E3DA] rounded-[24px] p-6 shadow-sm flex flex-col gap-5">
             <h3 className="text-[16px] font-extrabold text-[#12261D]" style={{ fontFamily: "'Sora', sans-serif" }}>
               Coming up
             </h3>
             
             <div className="flex flex-col gap-5">
               {/* Item 1 */}
               <div className="flex gap-4">
                 <div className="flex flex-col items-center min-w-[32px]">
                   <span className="text-[10px] font-extrabold text-[#A2ADA5] uppercase leading-none mb-1">Aug</span>
                   <span className="text-[18px] font-extrabold text-[#12261D] leading-none" style={{ fontFamily: "'Sora', sans-serif" }}>14</span>
                 </div>
                 <div className="flex flex-col gap-0.5 mt-0.5">
                   <span className="text-[14px] font-extrabold text-[#12261D]">Urea top-dress, Plot A</span>
                   <span className="text-[12.5px] font-medium text-[#5C6B62]">45 kg · hold if blight persists</span>
                 </div>
               </div>
               
               {/* Item 2 */}
               <div className="flex gap-4">
                 <div className="flex flex-col items-center min-w-[32px]">
                   <span className="text-[10px] font-extrabold text-[#A2ADA5] uppercase leading-none mb-1">Aug</span>
                   <span className="text-[18px] font-extrabold text-[#12261D] leading-none" style={{ fontFamily: "'Sora', sans-serif" }}>22</span>
                 </div>
                 <div className="flex flex-col gap-0.5 mt-0.5">
                   <span className="text-[14px] font-extrabold text-[#12261D]">PM-KISAN claim closes</span>
                   <span className="text-[12.5px] font-medium text-[#D94F4F]">₹2,000 · 1 document pending</span>
                 </div>
               </div>

               {/* Item 3 */}
               <div className="flex gap-4">
                 <div className="flex flex-col items-center min-w-[32px]">
                   <span className="text-[10px] font-extrabold text-[#A2ADA5] uppercase leading-none mb-1">Sep</span>
                   <span className="text-[18px] font-extrabold text-[#12261D] leading-none" style={{ fontFamily: "'Sora', sans-serif" }}>02</span>
                 </div>
                 <div className="flex flex-col gap-0.5 mt-0.5">
                   <span className="text-[14px] font-extrabold text-[#12261D]">Tomato first picking</span>
                   <span className="text-[12.5px] font-medium text-[#5C6B62]">Est. 1.4 t · book transport early</span>
                 </div>
               </div>

               {/* Item 4 */}
               <div className="flex gap-4">
                 <div className="flex flex-col items-center min-w-[32px]">
                   <span className="text-[10px] font-extrabold text-[#A2ADA5] uppercase leading-none mb-1">Oct</span>
                   <span className="text-[18px] font-extrabold text-[#12261D] leading-none" style={{ fontFamily: "'Sora', sans-serif" }}>30</span>
                 </div>
                 <div className="flex flex-col gap-0.5 mt-0.5">
                   <span className="text-[14px] font-extrabold text-[#12261D]">Paddy harvest window opens</span>
                   <span className="text-[12.5px] font-medium text-[#5C6B62]">Est. 11.5 quintal/acre</span>
                 </div>
               </div>

             </div>
           </div>

           {/* Plan Rabi Info Card */}
           <div className="bg-[#E6F3E4] border border-[#CDE5C8] rounded-[24px] p-6 flex flex-col gap-3 mt-auto">
              <h4 className="text-[15px] font-extrabold text-[#12261D] tracking-tight" style={{ fontFamily: "'Sora', sans-serif" }}>
                Plan Rabi already?
              </h4>
              <p className="text-[13px] text-[#1B7A4B] font-semibold leading-relaxed">
                Bengal gram after paddy fits your soil and last year's rainfall. Sowing window opens 5 Nov.
              </p>
              <button className="bg-[#12261D] hover:bg-[#1C3D2A] text-white font-bold text-[13.5px] py-3 px-4 rounded-xl mt-2 transition">
                See Rabi plan
              </button>
           </div>
        </div>

      </div>
    </div>
  );
}
