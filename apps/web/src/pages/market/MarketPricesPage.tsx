import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { cn } from "../../lib/utils.js";

const CROPS = ["Paddy", "Tomato", "Cotton"];

const CHART_BARS = [
  { d: "6 Jul", price: 1940, h: 18, c: "#CDE5C8" },
  { d: "9 Jul", price: 1955, h: 22, c: "#CDE5C8" },
  { d: "12 Jul", price: 1920, h: 15, c: "#CDE5C8" },
  { d: "15 Jul", price: 1985, h: 28, c: "#CDE5C8" },
  { d: "18 Jul", price: 2010, h: 34, c: "#9BC99A" },
  { d: "21 Jul", price: 1995, h: 30, c: "#9BC99A" },
  { d: "24 Jul", price: 2045, h: 42, c: "#9BC99A" },
  { d: "27 Jul", price: 2070, h: 50, c: "#4C8F53" },
  { d: "29 Jul", price: 2055, h: 45, c: "#4C8F53" },
  { d: "31 Jul", price: 2100, h: 62, c: "#4C8F53" },
  { d: "2 Aug", price: 2130, h: 72, c: "#1B7A4B" },
  { d: "3 Aug", price: 2150, h: 80, c: "#1B7A4B" },
  { d: "4 Aug", price: 2170, h: 90, c: "#12261D" },
  { d: "5 Aug", price: 2183, h: 100, c: "#12261D" },
];

export function MarketPricesPage() {
  const navigate = useNavigate();
  const [activeCrop, setActiveCrop] = useState("Paddy");
  const [activeRange, setActiveRange] = useState("30D");

  return (
    <div className="flex flex-col h-[calc(100vh-1rem)] w-full bg-[#F4F3EC] select-none font-sans overflow-hidden">

      {/* Full-width Top Header */}
      <header className="flex items-center justify-between px-6 py-4 border-b border-[#E4E3DA] shrink-0 bg-[#F4F3EC]">
        <div className="flex items-center gap-4">
          <h1 className="text-xl font-extrabold text-[#12261D]" style={{ fontFamily: "'Sora', sans-serif" }}>
            Market Prices
          </h1>

          <div className="hidden sm:flex items-center gap-2">
            {CROPS.map((crop) => (
              <button
                key={crop}
                onClick={() => setActiveCrop(crop)}
                className={cn(
                  "px-3.5 py-1.5 rounded-full text-[13px] font-bold transition",
                  activeCrop === crop
                    ? "bg-[#E6F3E4] border border-[#CDE5C8] text-[#1B7A4B]"
                    : "bg-white border border-[#DCDBD1] text-[#5C6B62] hover:border-[#1B7A4B]"
                )}
              >
                {crop}
              </button>
            ))}
          </div>

          <div className="hidden md:block text-[13px] font-medium text-[#A2ADA5]">
            Updated 2:10 PM · Agmarknet
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

          {/* Hold Recommendation Banner */}
          <div className="shrink-0 bg-[#0F2419] rounded-[24px] p-6 text-white flex flex-col md:flex-row items-start justify-between gap-6 shadow-sm relative overflow-hidden">
            <div className="flex flex-col gap-3 z-10 max-w-[560px]">
              <div className="flex items-center gap-3">
                <div className="bg-[#9BD96B] text-[#0F2419] text-[10.5px] font-extrabold px-3 py-1.5 rounded-lg uppercase tracking-widest">
                  Hold
                </div>
                <div className="text-[12.5px] font-semibold text-[#A2B8AA]">
                  Paddy · BPT 5204 · your harvest starts 30 Oct
                </div>
              </div>

              <h2 className="text-[22px] md:text-[26px] font-extrabold leading-tight" style={{ fontFamily: "'Sora', sans-serif" }}>
                Prices are still climbing — waiting 2 weeks is worth about ₹4,600 on your expected yield.
              </h2>

              <p className="text-[13.5px] font-medium text-[#A2B8AA] leading-relaxed">
                Arrivals at Kadapa are down 12% and MSP procurement opens 15 Aug. Risk: a sharp fall if regional arrivals jump.
              </p>

              <div className="flex items-center gap-3 mt-2">
                <button className="bg-[#9BD96B] hover:bg-[#8ac75c] text-[#0F2419] font-extrabold text-[14.5px] py-3 px-5 rounded-xl transition">
                  Set price alert
                </button>
                <button className="bg-transparent border border-[#5C6B62] hover:bg-white/10 text-white font-bold text-[14.5px] py-3 px-5 rounded-xl transition">
                  Log a sale
                </button>
              </div>
            </div>

            <div className="flex flex-col items-start md:items-end shrink-0 z-10">
              <div className="text-[36px] md:text-[42px] font-extrabold leading-none tracking-tight" style={{ fontFamily: "'Sora', sans-serif" }}>
                ₹2,183<span className="text-[16px] font-bold text-[#A2B8AA]">/quintal</span>
              </div>
              <div className="text-[13px] font-bold text-[#9BD96B] mt-2">
                ▲ 2.4% today · ▲ 12.5% this month
              </div>
            </div>

            <div className="absolute -top-12 -right-12 w-48 h-48 bg-[#9BD96B] rounded-full opacity-[0.03] blur-xl" />
          </div>

          {/* Price Chart */}
          <div className="shrink-0 bg-white border border-[#E4E3DA] rounded-[24px] p-6 shadow-sm flex flex-col gap-5">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="text-[18px] font-extrabold text-[#12261D]" style={{ fontFamily: "'Sora', sans-serif" }}>
                  Kadapa mandi · paddy
                </h3>
                <p className="text-[13.5px] font-medium text-[#5C6B62] mt-0.5">
                  Modal price per quintal, last 30 days
                </p>
              </div>

              <div className="flex items-center gap-1 bg-[#EBEAE2] p-1 rounded-xl border border-[#E4E3DA] shrink-0">
                {["30D", "3M", "1Y"].map((r) => (
                  <button
                    key={r}
                    onClick={() => setActiveRange(r)}
                    className={cn(
                      "px-3.5 py-1.5 rounded-lg text-[12.5px] font-bold transition duration-150",
                      activeRange === r
                        ? "bg-white text-[#12261D] shadow-sm border border-[#DCDBD1]"
                        : "text-[#5C6B62] hover:text-[#12261D]"
                    )}
                  >
                    {r}
                  </button>
                ))}
              </div>
            </div>

            <div className="h-40 flex items-end gap-2 sm:gap-3 px-1">
              {CHART_BARS.map((bar, i) => (
                <div key={i} className="flex-1 flex items-end h-full">
                  <div
                    className="w-full max-w-[48px] mx-auto rounded-t-md transition-all duration-300"
                    style={{ height: `${bar.h}%`, backgroundColor: bar.c }}
                  />
                </div>
              ))}
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-[#E4E3DA] text-[13px] font-semibold">
              <div className="text-[#5C6B62]">
                6 Jul · <span className="font-extrabold text-[#12261D]">₹1,940</span>
              </div>
              <div className="text-[#5C6B62]">
                MSP ₹2,300 · <span className="font-extrabold text-[#D94F4F]">₹117 below</span>
              </div>
              <div className="text-[#5C6B62]">
                5 Aug · <span className="font-extrabold text-[#12261D]">₹2,183</span>
              </div>
            </div>
          </div>

          {/* Where to Sell */}
          <div className="shrink-0 bg-white border border-[#E4E3DA] rounded-[24px] p-6 shadow-sm flex flex-col gap-5">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-[18px] font-extrabold text-[#12261D]" style={{ fontFamily: "'Sora', sans-serif" }}>
                  Where to sell
                </h3>
                <p className="text-[13.5px] font-medium text-[#5C6B62] mt-0.5">
                  Net price after transport, for 20 quintal
                </p>
              </div>
              <button className="text-[#1B7A4B] font-bold text-[13px] hover:underline shrink-0">
                Edit load size
              </button>
            </div>

            <div className="flex flex-col">
              <div className="grid grid-cols-[1.6fr_1fr_1fr_1fr_1fr] gap-4 pb-3 border-b border-[#E4E3DA]">
                <span className="text-[10.5px] font-extrabold text-[#A2ADA5] uppercase tracking-widest">Mandi</span>
                <span className="text-[10.5px] font-extrabold text-[#A2ADA5] uppercase tracking-widest">Distance</span>
                <span className="text-[10.5px] font-extrabold text-[#A2ADA5] uppercase tracking-widest">Price</span>
                <span className="text-[10.5px] font-extrabold text-[#A2ADA5] uppercase tracking-widest">Transport</span>
                <span className="text-[10.5px] font-extrabold text-[#A2ADA5] uppercase tracking-widest">Net per quintal</span>
              </div>

              {[
                { mandi: "Proddatur", note: "Best net today", noteColor: "text-[#1B7A4B]", dist: "31 km", price: "₹2,240", transport: "₹38", net: "₹2,202", netColor: "text-[#1B7A4B]" },
                { mandi: "Kadapa", note: "Your usual mandi", noteColor: "text-[#A2ADA5]", dist: "12 km", price: "₹2,183", transport: "₹16", net: "₹2,167", netColor: "text-[#12261D]" },
                { mandi: "Rayachoti", note: "Slow offtake this week", noteColor: "text-[#A2ADA5]", dist: "58 km", price: "₹2,205", transport: "₹71", net: "₹2,134", netColor: "text-[#12261D]" },
              ].map((row, i, arr) => (
                <div
                  key={row.mandi}
                  className={cn(
                    "grid grid-cols-[1.6fr_1fr_1fr_1fr_1fr] gap-4 py-4 items-center",
                    i !== arr.length - 1 && "border-b border-[#F4F3EC]"
                  )}
                >
                  <div className="flex flex-col">
                    <span className="text-[14.5px] font-extrabold text-[#12261D]">{row.mandi}</span>
                    <span className={cn("text-[12px] font-semibold", row.noteColor)}>{row.note}</span>
                  </div>
                  <span className="text-[14px] font-semibold text-[#5C6B62]">{row.dist}</span>
                  <span className="text-[14px] font-semibold text-[#12261D]">{row.price}</span>
                  <span className="text-[14px] font-semibold text-[#5C6B62]">{row.transport}</span>
                  <span className={cn("text-[15px] font-extrabold", row.netColor)}>{row.net}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="w-full lg:w-[320px] shrink-0 flex flex-col gap-6">

          {/* Expected Income */}
          <div className="shrink-0 bg-white border border-[#E4E3DA] rounded-[24px] p-6 shadow-sm flex flex-col gap-3">
            <h3 className="text-[15px] font-extrabold text-[#12261D]" style={{ fontFamily: "'Sora', sans-serif" }}>
              Your expected income
            </h3>

            <div className="text-[32px] font-extrabold leading-none tracking-tight text-[#12261D]" style={{ fontFamily: "'Sora', sans-serif" }}>
              ₹1,52,000
            </div>

            <p className="text-[12.5px] font-medium text-[#5C6B62] leading-relaxed">
              Paddy 2.4 ac × 11.5 q/ac at today&apos;s net. Up ₹16,800 since sowing.
            </p>

            <div className="w-full h-2 bg-[#FAFAF7] border border-[#E4E3DA] rounded-full overflow-hidden mt-1">
              <div className="h-full bg-[#1B7A4B] w-[36%] rounded-full" />
            </div>
            <div className="text-[12px] font-semibold text-[#5C6B62]">
              36% of the season complete
            </div>
          </div>

          {/* Your Alerts */}
          <div className="shrink-0 bg-white border border-[#E4E3DA] rounded-[24px] p-6 shadow-sm flex flex-col gap-5">
            <h3 className="text-[15px] font-extrabold text-[#12261D]" style={{ fontFamily: "'Sora', sans-serif" }}>
              Your alerts
            </h3>

            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between gap-3 bg-[#FAFAF7] border border-[#E4E3DA] rounded-xl p-3">
                <div className="flex flex-col gap-0.5">
                  <span className="font-extrabold text-[#12261D] text-[13.5px]">Paddy above ₹2,250</span>
                  <span className="text-[11.5px] font-semibold text-[#8B978F]">Kadapa or Proddatur</span>
                </div>
                <span className="text-[12.5px] font-extrabold text-[#12261D] shrink-0">On</span>
              </div>

              <div className="flex items-center justify-between gap-3 bg-[#FAFAF7] border border-[#E4E3DA] rounded-xl p-3">
                <div className="flex flex-col gap-0.5">
                  <span className="font-extrabold text-[#12261D] text-[13.5px]">Tomato below ₹900</span>
                  <span className="text-[11.5px] font-semibold text-[#8B978F]">Warn before picking</span>
                </div>
                <span className="text-[12.5px] font-extrabold text-[#12261D] shrink-0">On</span>
              </div>
            </div>

            <button className="text-[#1B7A4B] font-bold text-[13px] hover:underline text-left">
              + Add an alert
            </button>
          </div>

          {/* Other Crops Today */}
          <div className="shrink-0 bg-white border border-[#E4E3DA] rounded-[24px] p-6 shadow-sm flex flex-col gap-4">
            <h3 className="text-[15px] font-extrabold text-[#12261D]" style={{ fontFamily: "'Sora', sans-serif" }}>
              Other crops today
            </h3>

            <div className="flex flex-col gap-3">
              {[
                { crop: "Tomato", price: "₹1,120", change: "▲6%", up: true },
                { crop: "Cotton", price: "₹7,340", change: "▼1.2%", up: false },
                { crop: "Groundnut", price: "₹6,050", change: "▲0.8%", up: true },
              ].map((row) => (
                <div key={row.crop} className="flex items-center justify-between">
                  <span className="text-[14px] font-extrabold text-[#12261D]">{row.crop}</span>
                  <div className="text-[13.5px] font-bold flex items-center gap-1.5">
                    <span className="text-[#12261D]">{row.price}</span>
                    <span className={row.up ? "text-[#1B7A4B]" : "text-[#D94F4F]"}>{row.change}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Sell as a Group */}
          <div className="shrink-0 bg-[#0F2419] rounded-[24px] p-6 mt-auto flex flex-col gap-3 text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#9BD96B] rounded-full opacity-[0.03] -translate-y-10 translate-x-10" />
            <h4 className="text-[15px] font-extrabold tracking-tight relative z-10" style={{ fontFamily: "'Sora', sans-serif" }}>
              Sell as a group
            </h4>
            <p className="text-[13px] text-[#A2B8AA] font-medium leading-relaxed relative z-10">
              14 farmers near you are pooling 240 quintal for Proddatur on 12 Aug — better rate, shared transport.
            </p>
            <button className="bg-[#9BD96B] hover:bg-[#8ac75c] text-[#0F2419] font-extrabold text-[14px] py-3 px-4 rounded-xl mt-2 w-full transition relative z-10">
              Join the pool
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
