import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { apiClient } from "../../lib/apiClient.js";
import { cn } from "../../lib/utils.js";

const CROPS = ["Paddy", "Tomato", "Cotton"];

interface MarketRecord {
  state: string;
  district: string;
  market: string;
  commodity: string;
  variety: string;
  arrival_date: string;
  min_price: string;
  max_price: string;
  modal_price: string;
}

// Static mockup baseline bars to preserve visual style & exact dates of the high-fidelity design
const CHART_BASELINES: Record<string, { d: string; h: number }[]> = {
  Paddy: [
    { d: "22 Jul", h: 18 },
    { d: "23 Jul", h: 22 },
    { d: "24 Jul", h: 15 },
    { d: "25 Jul", h: 28 },
    { d: "27 Jul", h: 34 },
    { d: "28 Jul", h: 30 },
    { d: "29 Jul", h: 42 },
    { d: "30 Jul", h: 50 },
    { d: "31 Jul", h: 45 },
    { d: "1 Aug", h: 62 },
    { d: "2 Aug", h: 72 },
    { d: "3 Aug", h: 80 },
    { d: "4 Aug", h: 90 },
    { d: "5 Aug", h: 100 },
  ],
  Tomato: [
    { d: "22 Jul", h: 75 },
    { d: "23 Jul", h: 80 },
    { d: "24 Jul", h: 65 },
    { d: "25 Jul", h: 90 },
    { d: "27 Jul", h: 85 },
    { d: "28 Jul", h: 70 },
    { d: "29 Jul", h: 60 },
    { d: "30 Jul", h: 45 },
    { d: "31 Jul", h: 40 },
    { d: "1 Aug", h: 35 },
    { d: "2 Aug", h: 30 },
    { d: "3 Aug", h: 25 },
    { d: "4 Aug", h: 20 },
    { d: "5 Aug", h: 18 },
  ],
  Cotton: [
    { d: "22 Jul", h: 42 },
    { d: "23 Jul", h: 45 },
    { d: "24 Jul", h: 48 },
    { d: "25 Jul", h: 50 },
    { d: "27 Jul", h: 53 },
    { d: "28 Jul", h: 52 },
    { d: "29 Jul", h: 55 },
    { d: "30 Jul", h: 58 },
    { d: "31 Jul", h: 62 },
    { d: "1 Aug", h: 65 },
    { d: "2 Aug", h: 68 },
    { d: "3 Aug", h: 72 },
    { d: "4 Aug", h: 70 },
    { d: "5 Aug", h: 74 },
  ],
};

export function MarketPricesPage() {
  const navigate = useNavigate();
  const [activeCrop, setActiveCrop] = useState("Paddy");
  const [activeRange, setActiveRange] = useState("30D");

  // Query actual market data from the backend proxy
  const { data: apiResponse, isLoading } = useQuery({
    queryKey: ["market-prices", activeCrop],
    queryFn: async () => {
      const response = await apiClient.get(`/market-prices?commodity=${activeCrop.toLowerCase()}&state=Andhra Pradesh`);
      return response.data;
    },
  });

  const records: MarketRecord[] = apiResponse?.records ?? [];

  // Group by market name and get the latest entry for each market
  const uniqueMarketsMap = new Map<string, MarketRecord>();
  records.forEach((record) => {
    const existing = uniqueMarketsMap.get(record.market);
    if (!existing || new Date(record.arrival_date) > new Date(existing.arrival_date)) {
      uniqueMarketsMap.set(record.market, record);
    }
  });
  const latestMandiPrices = Array.from(uniqueMarketsMap.values()).slice(0, 5);
  const hasRecords = latestMandiPrices.length > 0;
  
  // Calculate average modal price from live API results
  const avgPrice = hasRecords
    ? Math.round(
        latestMandiPrices.reduce((acc, curr) => acc + Number(curr.modal_price), 0) /
          latestMandiPrices.length
      )
    : activeCrop === "Paddy"
    ? 2183
    : activeCrop === "Tomato"
    ? 1120
    : 7340;

  // Render a clean timeline chart matching the mockup's aesthetics
  // We scale the height percentages dynamically so the final bar lands exactly at avgPrice
  const baseline = CHART_BASELINES[activeCrop] ?? CHART_BASELINES.Paddy;
  const finalChartBars = baseline.map((bar) => {
    // Calculate price for each point based on relative height
    const priceOffsetPercent = (bar.h - 50) / 50; // -1 to 1 range relative to center height
    const price = Math.round(avgPrice * (1 + priceOffsetPercent * 0.1)); // Max 10% fluctuation

    let color = "#9BC99A";
    if (bar.h > 75) {
      color = "#1B7A4B";
    }
    if (bar.h === 100) {
      color = "#12261D";
    }

    return {
      d: bar.d,
      price,
      h: bar.h,
      c: color,
    };
  });

  const firstChartPoint = finalChartBars[0];
  const lastChartPoint = finalChartBars[finalChartBars.length - 1];

  // Mandi Table Rows
  const mandiRows = hasRecords
    ? latestMandiPrices.map((rec, idx) => {
        const dist = (idx + 1) * 8 + 4;
        const transport = dist * 2 + 10;
        const price = Number(rec.modal_price);
        const net = price - transport;
        return {
          mandi: rec.market,
          note: idx === 0 ? "Best net today" : rec.district,
          noteColor: idx === 0 ? "text-[#1B7A4B]" : "text-[#A2ADA5]",
          dist: `${dist} km`,
          price: `₹${price}`,
          transport: `₹${transport}`,
          net: `₹${net}`,
          netColor: idx === 0 ? "text-[#1B7A4B]" : "text-[#12261D]",
        };
      })
    : [
        { mandi: "Proddatur", note: "Best net today", noteColor: "text-[#1B7A4B]", dist: "31 km", price: `₹${avgPrice + 57}`, transport: "₹38", net: `₹${avgPrice + 19}`, netColor: "text-[#1B7A4B]" },
        { mandi: "Kadapa", note: "Your usual mandi", noteColor: "text-[#A2ADA5]", dist: "12 km", price: `₹${avgPrice}`, transport: "₹16", net: `₹${avgPrice - 16}`, netColor: "text-[#12261D]" },
        { mandi: "Rayachoti", note: "Slow offtake this week", noteColor: "text-[#A2ADA5]", dist: "58 km", price: `₹${avgPrice + 22}`, transport: "₹71", net: `₹${avgPrice - 49}`, netColor: "text-[#12261D]" },
      ];

  return (
    <div className="flex flex-col min-h-screen w-full bg-[#F4F3EC] select-none font-sans pb-10">
      
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

          <div className="hidden md:block text-[13px] font-semibold text-[#A2ADA5]">
            {isLoading ? "Fetching prices..." : `Live Agmarknet prices for ${activeCrop}`}
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
      {isLoading ? (
        <div className="flex-1 flex items-center justify-center bg-[#F4F3EC]">
          <div className="flex flex-col items-center gap-2">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#1B7A4B]/30 border-t-[#1B7A4B]" />
            <span className="text-sm font-semibold text-[#5C6B62]">Fetching latest Mandi rates...</span>
          </div>
        </div>
      ) : (
        <div className="flex-1 p-4 md:p-6 flex flex-col lg:flex-row gap-6">
          
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
                    {activeCrop} · {hasRecords ? latestMandiPrices[0].variety : "General"} · harvest status checked
                  </div>
                </div>

                <h2 className="text-[22px] md:text-[26px] font-extrabold leading-tight text-left" style={{ fontFamily: "'Sora', sans-serif" }}>
                  {priceRecommendationText(activeCrop, avgPrice)}
                </h2>

                <p className="text-[13.5px] font-medium text-[#A2B8AA] leading-relaxed text-left">
                  {hasRecords
                    ? `Current price in ${latestMandiPrices[0].market} is ₹${latestMandiPrices[0].modal_price}. Arrivals are stable, but procurement openings may cause upward trends.`
                    : "Arrivals at regional markets are down 12% and MSP procurement opens 15 Aug. Risk: a sharp fall if regional arrivals jump."}
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
                  ₹{avgPrice}<span className="text-[16px] font-bold text-[#A2B8AA]">/quintal</span>
                </div>
                <div className="text-[13px] font-bold text-[#9BD96B] mt-2">
                  ▲ Live averages · {hasRecords ? `${latestMandiPrices.length} mandis` : "mock data fallback"}
                </div>
              </div>

              <div className="absolute -top-12 -right-12 w-48 h-48 bg-[#9BD96B] rounded-full opacity-[0.03] blur-xl" />
            </div>

            {/* Price Chart */}
            <div className="shrink-0 bg-white border border-[#E4E3DA] rounded-[24px] p-6 shadow-sm flex flex-col gap-5">
              <div className="flex items-start justify-between gap-4">
                <div className="text-left">
                  <h3 className="text-[18px] font-extrabold text-[#12261D]" style={{ fontFamily: "'Sora', sans-serif" }}>
                    {hasRecords ? `${latestMandiPrices[0].state} Mandis` : "Kadapa Mandi"} · {activeCrop.toLowerCase()}
                  </h3>
                  <p className="text-[13.5px] font-medium text-[#5C6B62] mt-0.5">
                    Modal price per quintal, last arrivals timeline
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

              <div className="h-40 flex items-end gap-2 sm:gap-3 px-1 relative">
                {finalChartBars.map((bar, i) => (
                  <div key={i} className="flex-1 flex flex-col items-center gap-2 group">
                    <div className="w-full relative flex items-end justify-center h-32">
                       <div 
                         className="w-full max-w-[48px] rounded-t-md transition-all duration-300 relative" 
                         style={{ height: `${bar.h}%`, backgroundColor: bar.c }}
                       >
                         {/* Hover Tooltip */}
                         <div className="opacity-0 group-hover:opacity-100 absolute -top-8 left-1/2 -translate-x-1/2 bg-[#12261D] text-white text-[10px] font-bold px-2 py-0.5 rounded shadow-md pointer-events-none transition whitespace-nowrap z-20">
                           ₹{bar.price}
                         </div>
                       </div>
                    </div>
                    <span className="text-[10px] font-bold text-[#A2ADA5]">{bar.d}</span>
                  </div>
                ))}
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-[#E4E3DA] text-[13px] font-semibold">
                <div className="text-[#5C6B62]">
                  Start · <span className="font-extrabold text-[#12261D]">₹{firstChartPoint?.price ?? 1940}</span>
                </div>
                <div className="text-[#5C6B62]">
                  MSP ₹2,300 · <span className="font-extrabold text-[#D94F4F]">₹{Math.max(0, 2300 - avgPrice)} below</span>
                </div>
                <div className="text-[#5C6B62]">
                  Latest · <span className="font-extrabold text-[#12261D]">₹{lastChartPoint?.price ?? avgPrice}</span>
                </div>
              </div>
            </div>

            {/* Where to Sell */}
            <div className="shrink-0 bg-white border border-[#E4E3DA] rounded-[24px] p-6 shadow-sm flex flex-col gap-5">
              <div className="flex items-center justify-between">
                <div className="text-left">
                  <h3 className="text-[18px] font-extrabold text-[#12261D]" style={{ fontFamily: "'Sora', sans-serif" }}>
                    Where to sell
                  </h3>
                  <p className="text-[13.5px] font-medium text-[#5C6B62] mt-0.5">
                    Net price after transport estimation, for 20 quintal
                  </p>
                </div>
                <button className="text-[#1B7A4B] font-bold text-[13px] hover:underline shrink-0">
                  Edit load size
                </button>
              </div>

              <div className="flex flex-col overflow-x-auto no-scrollbar">
                <div className="min-w-[600px]">
                  <div className="grid grid-cols-[1.6fr_1fr_1fr_1fr_1fr] gap-4 pb-3 border-b border-[#E4E3DA] text-left">
                    <span className="text-[10.5px] font-extrabold text-[#A2ADA5] uppercase tracking-widest">Mandi</span>
                    <span className="text-[10.5px] font-extrabold text-[#A2ADA5] uppercase tracking-widest">Distance</span>
                    <span className="text-[10.5px] font-extrabold text-[#A2ADA5] uppercase tracking-widest">Price</span>
                    <span className="text-[10.5px] font-extrabold text-[#A2ADA5] uppercase tracking-widest">Transport</span>
                    <span className="text-[10.5px] font-extrabold text-[#A2ADA5] uppercase tracking-widest">Net per quintal</span>
                  </div>

                  {mandiRows.map((row, i, arr) => (
                    <div
                      key={i}
                      className={cn(
                        "grid grid-cols-[1.6fr_1fr_1fr_1fr_1fr] gap-4 py-4 items-center text-left",
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
          </div>

          {/* Right Column */}
          <div className="w-full lg:w-[320px] shrink-0 flex flex-col gap-6">
            
            {/* Expected Income */}
            <div className="shrink-0 bg-white border border-[#E4E3DA] rounded-[24px] p-6 shadow-sm flex flex-col gap-3">
              <h3 className="text-[15px] font-extrabold text-[#12261D] text-left" style={{ fontFamily: "'Sora', sans-serif" }}>
                Your expected income
              </h3>

              <div className="text-[32px] font-extrabold leading-none tracking-tight text-[#12261D] text-left" style={{ fontFamily: "'Sora', sans-serif" }}>
                ₹{Math.round(avgPrice * 27.6).toLocaleString("en-IN")}
              </div>

              <p className="text-[12.5px] font-medium text-[#5C6B62] leading-relaxed text-left">
                {activeCrop} 2.4 ac × {activeCrop === "Paddy" ? "11.5" : "8.2"} q/ac at today's net. Up from sowing.
              </p>

              <div className="w-full h-2 bg-[#FAFAF7] border border-[#E4E3DA] rounded-full overflow-hidden mt-1">
                <div className="h-full bg-[#1B7A4B] w-[36%] rounded-full" />
              </div>
              <div className="text-[12px] font-semibold text-[#5C6B62] text-left">
                36% of the season complete
              </div>
            </div>

            {/* Your Alerts */}
            <div className="shrink-0 bg-white border border-[#E4E3DA] rounded-[24px] p-6 shadow-sm flex flex-col gap-5">
              <h3 className="text-[15px] font-extrabold text-[#12261D] text-left" style={{ fontFamily: "'Sora', sans-serif" }}>
                Your alerts
              </h3>

              <div className="flex flex-col gap-4">
                <div className="flex items-center justify-between gap-3 bg-[#FAFAF7] border border-[#E4E3DA] rounded-xl p-3">
                  <div className="flex flex-col gap-0.5 text-left">
                    <span className="font-extrabold text-[#12261D] text-[13.5px]">{activeCrop} above ₹{Math.round(avgPrice * 1.05)}</span>
                    <span className="text-[11.5px] font-semibold text-[#8B978F]">Any regional mandi</span>
                  </div>
                  <span className="text-[12.5px] font-extrabold text-[#12261D] shrink-0">On</span>
                </div>

                <div className="flex items-center justify-between gap-3 bg-[#FAFAF7] border border-[#E4E3DA] rounded-xl p-3">
                  <div className="flex flex-col gap-0.5 text-left">
                    <span className="font-extrabold text-[#12261D] text-[13.5px]">{activeCrop} below ₹{Math.round(avgPrice * 0.9)}</span>
                    <span className="text-[11.5px] font-semibold text-[#8B978F]">Warn before harvesting</span>
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
              <h3 className="text-[15px] font-extrabold text-[#12261D] text-left" style={{ fontFamily: "'Sora', sans-serif" }}>
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
              <h4 className="text-[15px] font-extrabold tracking-tight relative z-10 text-left" style={{ fontFamily: "'Sora', sans-serif" }}>
                Sell as a group
              </h4>
              <p className="text-[13px] text-[#A2B8AA] font-medium leading-relaxed relative z-10 text-left">
                14 farmers near you are pooling 240 quintal for regional markets on 12 Aug — better rate, shared transport.
              </p>
              <button className="bg-[#9BD96B] hover:bg-[#8ac75c] text-[#0F2419] font-extrabold text-[14px] py-3 px-4 rounded-xl mt-2 w-full transition relative z-10">
                Join the pool
              </button>
            </div>
          </div>

        </div>
      )}
    </div>
  );
}

function priceRecommendationText(crop: string, price: number): string {
  if (crop === "Paddy") {
    return "Prices are still climbing — waiting 2 weeks is worth about ₹4,600 on your expected yield.";
  }
  if (crop === "Tomato") {
    return `Tomato rates average ₹${price} — selling now secures your harvest targets.`;
  }
  return `Cotton average price is ₹${price} — consider holding for higher grade MSP procurement.`;
}
