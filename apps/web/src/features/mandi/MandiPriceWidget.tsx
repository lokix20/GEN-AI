import { useState } from "react";
import { TrendingUp, ArrowUpRight, ArrowDownRight, MapPin, CheckCircle2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";

interface PricePoint {
  day: string;
  price: number;
  isForecast?: boolean;
}

const MANDI_DATA: Record<string, {
  crop: string;
  mandi: string;
  currentPrice: number;
  change: string;
  isPositive: boolean;
  unit: string;
  recommendation: string;
  predictedPeak: string;
  prices: PricePoint[];
  distanceKm: number;
}> = {
  paddy: {
    crop: "Paddy (Rice)",
    mandi: "Kadapa Main Mandi",
    currentPrice: 2183,
    change: "+2.4%",
    isPositive: true,
    unit: "quintal",
    recommendation: "Hold for 2 days. Demand from mills is rising ahead of festival weekend.",
    predictedPeak: "₹2,240 on Friday",
    distanceKm: 14,
    prices: [
      { day: "Fri", price: 2090 },
      { day: "Sat", price: 2110 },
      { day: "Sun", price: 2125 },
      { day: "Mon", price: 2150 },
      { day: "Today", price: 2183 },
      { day: "Thu (FC)", price: 2210, isForecast: true },
      { day: "Fri (FC)", price: 2240, isForecast: true },
    ]
  },
  tomato: {
    crop: "Tomato (Hybrid)",
    mandi: "Madanapalle Yard",
    currentPrice: 1450,
    change: "-1.8%",
    isPositive: false,
    unit: "quintal",
    recommendation: "Sell today. Incoming arrivals from Kolar expected to depress rates by Thursday.",
    predictedPeak: "₹1,450 (Today)",
    distanceKm: 32,
    prices: [
      { day: "Fri", price: 1520 },
      { day: "Sat", price: 1500 },
      { day: "Sun", price: 1480 },
      { day: "Mon", price: 1470 },
      { day: "Today", price: 1450 },
      { day: "Thu (FC)", price: 1390, isForecast: true },
      { day: "Fri (FC)", price: 1350, isForecast: true },
    ]
  },
  chilli: {
    crop: "Red Chilli (Teja)",
    mandi: "Guntur Yard",
    currentPrice: 18200,
    change: "+4.1%",
    isPositive: true,
    unit: "quintal",
    recommendation: "Strong export demand. Price likely to stay high over next 5 days.",
    predictedPeak: "₹18,750 next week",
    distanceKm: 85,
    prices: [
      { day: "Fri", price: 17200 },
      { day: "Sat", price: 17450 },
      { day: "Sun", price: 17600 },
      { day: "Mon", price: 17900 },
      { day: "Today", price: 18200 },
      { day: "Thu (FC)", price: 18500, isForecast: true },
      { day: "Fri (FC)", price: 18750, isForecast: true },
    ]
  }
};

export function MandiPriceWidget() {
  const [selectedCrop, setSelectedCrop] = useState<"paddy" | "tomato" | "chilli">("paddy");
  const data = MANDI_DATA[selectedCrop];

  const maxPrice = Math.max(...data.prices.map((p) => p.price));
  const minPrice = Math.min(...data.prices.map((p) => p.price));

  return (
    <Card className="border-[#D6E4DB] shadow-sm bg-white overflow-hidden text-left">
      <CardHeader className="bg-[#EDF5EF] border-b border-[#D6E4DB] py-3.5 px-4 flex flex-row items-center justify-between">
        <div className="flex items-center gap-2">
          <TrendingUp className="h-4 w-4 text-[#236A43]" />
          <CardTitle className="text-sm font-bold text-[#0A1C13]">Mandi Rate Intelligence & AI Forecast</CardTitle>
        </div>
        <Badge variant="outline" className="text-[10px] border-[#236A43] text-[#236A43] bg-white font-bold">
          Live Updates
        </Badge>
      </CardHeader>

      <CardContent className="p-4 space-y-4">
        {/* Crop Selector Tabs */}
        <div className="flex gap-1.5 bg-[#F7FAF6] p-1 rounded-xl border border-[#D6E4DB]">
          {[
            { key: "paddy", label: "🌾 Paddy" },
            { key: "tomato", label: "🍅 Tomato" },
            { key: "chilli", label: "🌶️ Red Chilli" },
          ].map((item) => (
            <button
              key={item.key}
              onClick={() => setSelectedCrop(item.key as any)}
              className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition ${
                selectedCrop === item.key
                  ? "bg-[#236A43] text-white shadow-sm"
                  : "text-[#4A6354] hover:text-[#0A1C13]"
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>

        {/* Current Rate Header */}
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-1.5 text-xs text-[#5C7866] font-medium">
              <MapPin className="h-3.5 w-3.5 text-[#236A43]" />
              <span>{data.mandi} ({data.distanceKm} km away)</span>
            </div>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-2xl font-extrabold text-[#0A1C13]">
                ₹{data.currentPrice.toLocaleString("en-IN")}
              </span>
              <span className="text-xs text-[#5C7866]">/ {data.unit}</span>
            </div>
          </div>

          <div
            className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold ${
              data.isPositive ? "bg-[#E4F2E9] text-[#1B5434]" : "bg-red-50 text-red-600 border border-red-200"
            }`}
          >
            {data.isPositive ? <ArrowUpRight className="h-4 w-4" /> : <ArrowDownRight className="h-4 w-4" />}
            <span>{data.change}</span>
          </div>
        </div>

        {/* Chart / Bar Visualization with Forecast Highlight */}
        <div className="space-y-1 bg-[#F7FAF6] p-3 rounded-xl border border-[#D6E4DB]">
          <div className="flex justify-between items-center text-[10px] text-[#5C7866] font-semibold mb-2">
            <span>Historical (5 Days)</span>
            <span className="text-[#236A43] font-bold">✨ AI 3-Day Forecast</span>
          </div>

          <div className="flex items-end gap-2 h-28 pt-4 pb-1">
            {data.prices.map((p, i) => {
              const heightPercent = Math.max(25, Math.round(((p.price - minPrice) / (maxPrice - minPrice || 1)) * 70 + 30));
              return (
                <div key={i} className="flex-1 flex flex-col items-center gap-1 h-full justify-end group relative">
                  {/* Tooltip on hover */}
                  <div className="absolute -top-7 opacity-0 group-hover:opacity-100 transition bg-[#0F2B1D] text-white text-[10px] px-1.5 py-0.5 rounded font-bold whitespace-nowrap pointer-events-none z-10">
                    ₹{p.price.toLocaleString("en-IN")}
                  </div>
                  <div
                    style={{ height: `${heightPercent}%` }}
                    className={`w-full rounded-t-sm transition-all ${
                      p.isForecast
                        ? "bg-[#236A43] border-t-2 border-dashed border-[#A8D4B7] animate-pulse"
                        : i === 4
                        ? "bg-[#0F2B1D]"
                        : "bg-[#A8D4B7]"
                    }`}
                  />
                  <span className={`text-[10px] font-medium ${p.isForecast ? "text-[#236A43] font-bold" : "text-[#5C7866]"}`}>
                    {p.day}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Actionable Nudge Card */}
        <div className="bg-[#E4F2E9] border border-[#A8D4B7] p-3 rounded-xl flex items-start gap-2.5 text-xs text-[#0A1C13]">
          <CheckCircle2 className="h-4 w-4 text-[#236A43] shrink-0 mt-0.5" />
          <div>
            <span className="font-bold block text-[#1B5434]">Sell Advice & Timing</span>
            <p className="text-[#4A6354] mt-0.5 leading-relaxed">{data.recommendation}</p>
            <div className="mt-1 text-[11px] font-bold text-[#236A43]">
              Predicted Peak: {data.predictedPeak}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
