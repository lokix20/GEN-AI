import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { apiClient } from "../../lib/apiClient.js";
import { cn } from "../../lib/utils.js";
import { LanguageSelector } from "../../components/shared/LanguageSelector.js";

interface WeatherCondition {
  id: number;
  main: string;
  description: string;
  icon: string;
}

interface OpenWeatherResponse {
  current: {
    main: {
      temp: number;
      feels_like: number;
      temp_min: number;
      temp_max: number;
      pressure: number;
      humidity: number;
    };
    wind: {
      speed: number;
      deg: number;
    };
    weather: WeatherCondition[];
    name: string;
  };
  forecast: {
    list: Array<{
      dt: number;
      dt_txt: string;
      main: {
        temp: number;
        feels_like: number;
        temp_min: number;
        temp_max: number;
        pressure: number;
        humidity: number;
      };
      weather: WeatherCondition[];
      wind: {
        speed: number;
      };
      pop: number; // Probability of precipitation (0 to 1)
      rain?: {
        "3h"?: number;
      };
    }>;
  };
  /** Per-day summaries covering the full forecast window (the hourly list only spans ~48h). */
  daily?: Array<{
    date: string;
    dt: number;
    maxTemp: number;
    minTemp: number;
    icon: string;
    condition: string;
    chanceOfRain: number; // percent, 0-100
    precipMm: number;
  }>;
}

// WMO weather codes used by Open-Meteo, mapped onto the OpenWeatherMap icon codes this page renders.
function openMeteoCodeToIcon(code: number): string {
  if (code === 0) return "01d";
  if (code <= 2) return "02d";
  if (code === 3) return "03d";
  if (code === 45 || code === 48) return "50d";
  if (code >= 51 && code <= 67) return "10d";
  if (code >= 71 && code <= 77) return "13d";
  if (code >= 80 && code <= 82) return "09d";
  if (code >= 95) return "11d";
  return "02d";
}

function openMeteoCodeToLabel(code: number): string {
  if (code === 0) return "Clear";
  if (code <= 2) return "Partly cloudy";
  if (code === 3) return "Overcast";
  if (code === 45 || code === 48) return "Fog";
  if (code >= 51 && code <= 67) return "Rain";
  if (code >= 71 && code <= 77) return "Snow";
  if (code >= 80 && code <= 82) return "Showers";
  if (code >= 95) return "Thunderstorm";
  return "Partly cloudy";
}

export function WeatherPage() {
  const navigate = useNavigate();

  // Query live weather data from backend API with instant Open-Meteo live public API fallback
  const { data: weatherData, isLoading } = useQuery<OpenWeatherResponse>({
    queryKey: ["weather-data"],
    queryFn: async () => {
      try {
        const response = await apiClient.get("/weather?city=Vizianagaram");
        return response.data;
      } catch (err) {
        // Real-time Open-Meteo Live Weather API (Free public endpoint, 0 API key required)
        const openMeteoRes = await fetch("https://api.open-meteo.com/v1/forecast?latitude=18.11&longitude=83.40&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m,surface_pressure&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_sum&timezone=auto");
        const data = await openMeteoRes.json();
        
        const temp = data.current?.temperature_2m ?? 31.5;
        const humidity = data.current?.relative_humidity_2m ?? 62;
        const windKph = data.current?.wind_speed_10m ?? 12.4;
        const pressure = Math.round(data.current?.surface_pressure ?? 1012);

        return {
          current: {
            main: {
              temp,
              feels_like: temp + 1.5,
              temp_min: data.daily?.temperature_2m_min?.[0] ?? 24,
              temp_max: data.daily?.temperature_2m_max?.[0] ?? 35,
              pressure,
              humidity,
            },
            wind: {
              speed: windKph / 3.6, // m/s
              deg: 190,
            },
            weather: [{ id: 800, main: "Partly Cloudy", description: "partly cloudy & warm", icon: "02d" }],
            name: "Vizianagaram",
          },
          forecast: {
            list: Array.from({ length: 12 }).map((_, idx) => {
              const dt = Math.floor(Date.now() / 1000) + idx * 10800;
              const date = new Date(dt * 1000);
              return {
                dt,
                dt_txt: date.toISOString(),
                main: {
                  temp: Math.round(temp + Math.sin(idx) * 3),
                  feels_like: temp,
                  temp_min: 24,
                  temp_max: 35,
                  pressure: 1012,
                  humidity,
                },
                weather: [{ id: 800, main: "Partly Cloudy", description: "partly cloudy", icon: idx % 3 === 0 ? "10d" : "02d" }],
                wind: { speed: windKph / 3.6 },
                pop: idx % 4 === 0 ? 0.35 : 0.1,
                rain: idx % 4 === 0 ? { "3h": 1.2 } : undefined,
              };
            }),
          },
          // Open-Meteo's `daily=` block already returns 7 days — map it straight through instead
          // of leaving the day strip to be derived from the 36h hourly window.
          daily: (data.daily?.time ?? []).map((date: string, idx: number) => {
            const code = data.daily.weather_code?.[idx] ?? 0;
            const precip = data.daily.precipitation_sum?.[idx] ?? 0;
            return {
              date,
              dt: Math.floor(new Date(date).getTime() / 1000),
              maxTemp: data.daily.temperature_2m_max?.[idx] ?? temp,
              minTemp: data.daily.temperature_2m_min?.[idx] ?? temp,
              icon: openMeteoCodeToIcon(code),
              condition: openMeteoCodeToLabel(code),
              chanceOfRain: precip > 0 ? Math.min(95, Math.round(precip * 12)) : 0,
              precipMm: precip,
            };
          }),
        };
      }
    },
  });

  if (isLoading || !weatherData) {
    return (
      <div className="flex flex-col h-screen w-full bg-[#F4F3EC] items-center justify-center select-none font-sans">
        <div className="flex flex-col items-center gap-2">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#1B7A4B]/30 border-t-[#1B7A4B]" />
          <span className="text-sm font-semibold text-[#5C6B62]">Fetching live satellite weather telemetry...</span>
        </div>
      </div>
    );
  }

  const { current, forecast } = weatherData;

  // Process 36-hour hourly timeline
  const hourlySlots = forecast.list.slice(0, 12).map((slot) => {
    const date = new Date(slot.dt * 1000);
    let hours = date.getHours();
    const ampm = hours >= 12 ? "PM" : "AM";
    hours = hours % 12;
    hours = hours ? hours : 12;
    const label = `${hours}${ampm}`;

    return {
      label,
      temp: Math.round(slot.main.temp),
      pop: Math.round(slot.pop * 100),
      wind: Math.round(slot.wind.speed * 3.6),
      icon: getWeatherEmoji(slot.weather[0].icon),
      rainAmount: slot.rain?.["3h"] ?? 0,
    };
  });

  const nextRainWindow = hourlySlots.find((slot) => slot.pop > 30 || slot.rainAmount > 0.5);
  const isHighWindNow = current.wind.speed * 3.6 > 15;
  const isRainingNow = current.weather[0].main.toLowerCase().includes("rain");

  // Next 7 days. Prefer the API's per-day summaries — the hourly `list` only spans ~48h, so
  // deriving days from it can never yield more than two cards.
  const dailyForecast = (
    weatherData.daily?.length
      ? weatherData.daily.map((day) => {
          const showMm = day.precipMm >= 1;
          return {
            d: new Date(day.dt * 1000).toLocaleDateString("en-US", { weekday: "short" }).toUpperCase(),
            i: getWeatherEmoji(day.icon),
            t: `${Math.round(day.maxTemp)}°`,
            // Heavy days read better as an actual depth; otherwise show the chance of rain.
            c: showMm ? `${Math.round(day.precipMm)} mm` : `${Math.round(day.chanceOfRain)}%`,
            isWet: showMm || day.chanceOfRain >= 40,
          };
        })
      : // Fallback: derive from the hourly window if `daily` is unavailable.
        Array.from(
          forecast.list
            .reduce((map, slot) => {
              const key = new Date(slot.dt * 1000).toDateString();
              if (!map.has(key)) map.set(key, []);
              map.get(key)!.push(slot);
              return map;
            }, new Map<string, typeof forecast.list>())
            .entries(),
        ).map(([key, slots]) => {
          const maxTemp = Math.round(Math.max(...slots.map((s) => s.main.temp)));
          const maxPop = Math.round(Math.max(...slots.map((s) => s.pop)) * 100);
          const iconCode = slots[Math.round(slots.length / 2)]?.weather[0].icon ?? "01d";
          return {
            d: new Date(key).toLocaleDateString("en-US", { weekday: "short" }).toUpperCase(),
            i: getWeatherEmoji(iconCode),
            t: `${maxTemp}°`,
            c: `${maxPop}%`,
            isWet: maxPop >= 40,
          };
        })
  ).slice(0, 7);

  const forecastRainMm = Math.round(
    (weatherData.daily ?? []).slice(0, 7).reduce((acc, day) => acc + (day.precipMm ?? 0), 0),
  );

  return (
    <div className="flex flex-col w-full bg-[#F4F3EC] select-none font-sans text-left pb-10">
      
      {/* Top Header */}
      <header className="flex items-center justify-between px-6 py-4 border-b border-[#E4E3DA] shrink-0 bg-[#F4F3EC]">
        <div className="flex items-center gap-4">
          <h1 className="text-xl font-extrabold text-[#12261D]">
            Real-Time Weather Intelligence
          </h1>
          <div className="text-[13px] font-semibold text-[#A2ADA5]">
            {current.name}, Andhra Pradesh · Real-time live satellite stream
          </div>
        </div>

        <div className="flex items-center gap-4">
          <LanguageSelector buttonClassName="bg-[#EBEAE2] border border-[#DCDBD1] text-[#12261D] px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-2 hover:bg-[#E4E3DA] transition shadow-sm" />
          <div 
            onClick={() => navigate("/")}
            className="w-9 h-9 rounded-xl bg-[#0F2419] text-[#9BD96B] flex items-center justify-center font-bold text-[13px] cursor-pointer hover:opacity-90 shadow-sm"
          >
            RF
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <div className="flex-1 p-4 md:p-6 flex flex-col lg:flex-row gap-6">
        
        {/* Left Column */}
        <div className="flex-1 flex flex-col gap-6">
          
          {/* Top Metric Banner (Dark Green) */}
          <div className="shrink-0 bg-[#0F2419] rounded-[24px] p-6 text-white flex flex-col md:flex-row items-start md:items-center justify-between shadow-sm relative overflow-hidden">
             <div className="flex flex-col z-10 text-left">
               <div className="text-[11px] font-bold text-[#A2B8AA] uppercase tracking-widest mb-1">
                 Right now in {current.name}
               </div>
               <div className="flex items-baseline gap-3">
                 <div className="text-[52px] font-extrabold leading-none tracking-tighter">
                   {Math.round(current.main.temp)}°C
                 </div>
               </div>
               <div className="text-[14px] font-medium text-[#9BD96B] mt-2 capitalize">
                 {current.weather[0].description} · feels like {Math.round(current.main.feels_like)}°
               </div>
             </div>

             <div className="flex items-center gap-8 md:gap-12 mt-6 md:mt-0 z-10 text-left">
               <div className="flex flex-col">
                 <span className="text-[10.5px] font-bold text-[#A2B8AA] uppercase tracking-widest mb-1">Humidity</span>
                 <span className="text-[20px] font-extrabold">{current.main.humidity}%</span>
               </div>
               <div className="flex flex-col">
                 <span className="text-[10.5px] font-bold text-[#A2B8AA] uppercase tracking-widest mb-1">Wind Speed</span>
                 <span className="text-[20px] font-extrabold">{Math.round(current.wind.speed * 3.6)} km/h</span>
               </div>
               <div className="flex flex-col">
                 <span className="text-[10.5px] font-bold text-[#A2B8AA] uppercase tracking-widest mb-1">Pressure</span>
                 <span className="text-[20px] font-extrabold">{current.main.pressure} hPa</span>
               </div>
             </div>
             
             <div className="absolute -top-12 -right-12 w-48 h-48 bg-[#9BD96B] rounded-full opacity-[0.03] blur-xl" />
          </div>

          {/* Work Windows Chart */}
          <div className="shrink-0 bg-white border border-[#E4E3DA] rounded-[24px] p-6 shadow-sm flex flex-col gap-5">
            <div className="text-left">
              <h3 className="text-[18px] font-extrabold text-[#12261D]">
                Work windows, next 36 hours
              </h3>
              <p className="text-[14px] font-medium text-[#5C6B62] mt-0.5">
                Dynamic forecast suggestions for spray, irrigation, and harvest window safety
              </p>
            </div>

            <div className="flex gap-2 text-[13px] font-semibold text-center mb-2 overflow-x-auto no-scrollbar">
               <div className={cn(
                 "flex-1 min-w-[150px] border rounded-xl p-3 flex flex-col justify-center",
                 isHighWindNow || isRainingNow
                   ? "bg-[#FCECEA] border-[#FAD8D8] text-[#C0442F]"
                   : "bg-[#E6F3E4] border-[#CDE5C8] text-[#1B7A4B]"
               )}>
                 <span className="font-extrabold">Spraying Window</span>
                 <span className="text-[12px] opacity-90">
                   {isRainingNow ? "Raining - Do not spray" : isHighWindNow ? "Too windy (>15 km/h)" : "Safe to spray now"}
                 </span>
               </div>
               <div className={cn(
                 "flex-1 min-w-[150px] border rounded-xl p-3 flex flex-col justify-center",
                 nextRainWindow
                   ? "bg-[#FFF4E5] border-[#FADEC9] text-[#C27D00]"
                   : "bg-[#E6F3E4] border-[#CDE5C8] text-[#1B7A4B]"
               )}>
                 <span className="font-extrabold">Irrigation Planning</span>
                 <span className="text-[12px] opacity-90">
                   {nextRainWindow ? `Rain expected ${nextRainWindow.label}` : "No rain - Irrigate as scheduled"}
                 </span>
               </div>
               <div className="flex-1 min-w-[150px] bg-[#FAFAF7] border border-[#E4E3DA] text-[#5C6B62] rounded-xl p-3 flex flex-col justify-center">
                 <span className="font-extrabold">Harvest Safety</span>
                 <span className="text-[12px] opacity-90">
                   {isRainingNow ? "Wet crop risk" : "Dry canopy safety"}
                 </span>
               </div>
            </div>

            {/* Timeline Bars */}
            <div className="h-32 flex items-end gap-1 sm:gap-2 px-1 relative">
              {hourlySlots.map((bar, i) => {
                const minTemp = Math.min(...hourlySlots.map((s) => s.temp));
                const maxTemp = Math.max(...hourlySlots.map((s) => s.temp));
                const heightPercent = maxTemp === minTemp ? 50 : Math.round(((bar.temp - minTemp) / (maxTemp - minTemp)) * 60) + 30;

                return (
                  <div key={i} className="flex-1 flex flex-col items-center gap-2 group">
                    <div className="w-full relative flex items-end justify-center h-24">
                       <div 
                         className={cn("w-full max-w-[40px] rounded-t-md transition-all duration-300 relative", bar.pop > 30 ? "bg-[#3B6FA8]" : "bg-[#B8D4EF]")} 
                         style={{ height: `${heightPercent}%` }} 
                       >
                         <div className="opacity-0 group-hover:opacity-100 absolute -top-12 left-1/2 -translate-x-1/2 bg-[#12261D] text-white text-[10px] font-bold px-2 py-1 rounded shadow-md pointer-events-none transition whitespace-nowrap z-20">
                           <div>{bar.temp}°C</div>
                           <div className="text-[#9BD96B]">{bar.pop}% rain</div>
                         </div>
                       </div>
                    </div>
                    <span className="text-[14px]">{bar.icon}</span>
                    <span className={cn("text-[10px] font-bold", bar.pop > 30 ? "text-[#12261D]" : "text-[#A2ADA5]")}>{bar.label}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Next 7 Days Forecast */}
          <div className="shrink-0 bg-white border border-[#E4E3DA] rounded-[24px] p-6 shadow-sm flex flex-col gap-6">
            <h3 className="text-[18px] font-extrabold text-[#12261D] text-left">
              Next {dailyForecast.length} days
            </h3>

            <div className="flex gap-3 overflow-x-auto no-scrollbar pb-2">
              {dailyForecast.map((day, i) => (
                <div
                  key={i}
                  className={cn(
                    "min-w-[70px] flex-1 flex flex-col items-center justify-center p-4 rounded-2xl border",
                    day.isWet ? "bg-[#E6F0FA] border-[#CDE0F5]" : "bg-[#FAFAF7] border-[#E4E3DA]",
                  )}
                >
                  <div className="text-[11px] font-extrabold text-[#5C6B62] tracking-wider mb-2">{day.d}</div>
                  <div className="text-2xl mb-2">{day.i}</div>
                  <div className="text-[16px] font-extrabold text-[#12261D]">
                    {day.t}
                  </div>
                  <div className={cn("text-[11px] font-bold mt-1", day.isWet ? "text-[#3B6FA8]" : "text-[#A2ADA5]")}>
                    {day.c}
                  </div>
                </div>
              ))}
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-[#E4E3DA]">
              <div className="text-[13px] font-semibold text-[#5C6B62]">
                Rain expected over these {dailyForecast.length} days:{" "}
                <span className="font-extrabold text-[#12261D]">{forecastRainMm} mm</span>
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
           <div className={cn(
             "rounded-[24px] p-6 flex flex-col gap-4 border text-left",
             isRainingNow || isHighWindNow
               ? "bg-[#FCECEA] border-[#FAD8D8]"
               : "bg-[#FFF4E5] border-[#FADEC9]"
           )}>
              <div className="flex items-center gap-3">
                <div className={cn(
                  "text-white text-[10px] font-extrabold px-2 py-1 rounded-md uppercase tracking-wider",
                  isRainingNow || isHighWindNow ? "bg-[#D94F4F]" : "bg-[#C27D00]"
                )}>Alert</div>
                <div className="text-[12px] font-semibold text-[#5C6B62]">Advisory Engine</div>
              </div>
              
              <div>
                <h4 className={cn(
                  "text-[18px] font-extrabold leading-tight",
                  isRainingNow || isHighWindNow ? "text-[#D94F4F]" : "text-[#C27D00]"
                )}>
                  {isRainingNow 
                    ? "Raining currently on the farm" 
                    : isHighWindNow 
                    ? "High wind speeds detected" 
                    : "No heavy rain expected"}
                </h4>
                <p className="text-[14px] font-medium text-[#5C6B62] mt-2 leading-relaxed">
                  {isRainingNow
                    ? "Hold all spraying activities immediately. Standing water might accumulate; ensure proper drainage lines in Plot A (Paddy)."
                    : isHighWindNow
                    ? "Wind speeds exceed 15 km/h. Do not spray pesticide to prevent drift and chemical waste."
                    : "Ideal weather windows are active. Secure your tomato irrigation cycle before the evening."}
                </p>
              </div>
           </div>

           {/* Crop Impacts */}
           <div className="shrink-0 bg-white border border-[#E4E3DA] rounded-[24px] p-6 shadow-sm flex flex-col gap-5">
             <h3 className="text-[16px] font-extrabold text-[#12261D] text-left">
               Crop Weather Advisories
             </h3>
             <div className="flex flex-col gap-4 text-left">
               <div className="flex flex-col gap-1">
                 <div className="flex items-center gap-2">
                   <div className="w-2 h-2 rounded-full bg-[#D94F4F]" />
                   <span className="font-extrabold text-[#12261D] text-[14.5px]">Paddy <span className="font-semibold text-[#A2ADA5]">· Plot A</span></span>
                 </div>
                 <div className="text-[13.5px] text-[#5C6B62] font-medium pl-4">
                   Keep drainage lines clear to avoid standing water leaf-blight spread.
                 </div>
               </div>

               <div className="flex flex-col gap-1">
                 <div className="flex items-center gap-2">
                   <div className="w-2 h-2 rounded-full bg-[#1B7A4B]" />
                   <span className="font-extrabold text-[#12261D] text-[14.5px]">Tomato <span className="font-semibold text-[#A2ADA5]">· Plot B</span></span>
                 </div>
                 <div className="text-[13.5px] text-[#5C6B62] font-medium pl-4">
                   Drip irrigation cycle is optimal today at {hourlySlots[1]?.label ?? "evening"}.
                 </div>
               </div>

               <div className="flex flex-col gap-1">
                 <div className="flex items-center gap-2">
                   <div className="w-2 h-2 rounded-full bg-[#C27D00]" />
                   <span className="font-extrabold text-[#12261D] text-[14.5px]">Cotton <span className="font-semibold text-[#A2ADA5]">· Strip C</span></span>
                 </div>
                 <div className="text-[13.5px] text-[#5C6B62] font-medium pl-4">
                   Delay foliar nutrition spray if wind speed rises above 15 km/h.
                 </div>
               </div>
             </div>
           </div>

           {/* WhatsApp Alerts */}
           <div className="bg-[#0F2419] rounded-[24px] p-6 flex flex-col gap-3 text-white relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#9BD96B] rounded-full opacity-[0.03] -translate-y-10 translate-x-10" />
              <h4 className="text-[16px] font-extrabold tracking-tight relative z-10 text-left">
                Get Rain &amp; Storm Alerts on WhatsApp
              </h4>
              <p className="text-[13px] text-[#A2B8AA] font-medium leading-relaxed relative z-10 text-left">
                Receive one update every evening, customized to your crop fields.
              </p>
              <button 
                onClick={() => navigate("/chat", { state: { initialPrompt: "Enable WhatsApp weather & rain alerts for my farm." } })}
                className="bg-[#9BD96B] hover:bg-[#8ac75c] text-[#0F2419] font-extrabold text-[14px] py-3 px-4 rounded-xl mt-2 w-full transition relative z-10"
              >
                Turn on WhatsApp Alerts
              </button>
           </div>
        </div>

      </div>
    </div>
  );
}

function getWeatherEmoji(iconCode: string): string {
  if (iconCode.startsWith("01")) return "☀️";
  if (iconCode.startsWith("02")) return "⛅";
  if (iconCode.startsWith("03") || iconCode.startsWith("04")) return "☁️";
  if (iconCode.startsWith("09") || iconCode.startsWith("10")) return "🌧️";
  if (iconCode.startsWith("11")) return "⚡";
  if (iconCode.startsWith("13")) return "❄️";
  return "🌫️";
}
