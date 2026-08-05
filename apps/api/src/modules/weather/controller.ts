import type { Request, Response } from "express";
import axios from "axios";
import { env } from "../../config/env.js";
import { HttpError } from "../../middleware/error.middleware.js";

// 15-minute in-memory cache
interface CacheEntry {
  timestamp: number;
  data: any;
}
const weatherCache = new Map<string, CacheEntry>();
const CACHE_TTL_MS = 15 * 60 * 1000;

// Maps WeatherAPI.com icon URL to OpenWeatherMap icon prefix (01, 02, etc.)
function mapIconCode(iconUrl: string): string {
  const url = iconUrl.toLowerCase();
  const isNight = url.includes("/night/");
  const suffix = isNight ? "n" : "d";

  if (url.includes("113")) return `01${suffix}`; // Sunny / Clear
  if (url.includes("116")) return `02${suffix}`; // Partly cloudy
  if (url.includes("119") || url.includes("122")) return `03${suffix}`; // Cloudy / Overcast
  if (url.includes("143") || url.includes("248") || url.includes("260")) return `50${suffix}`; // Mist / Fog
  if (url.includes("176") || url.includes("263") || url.includes("266") || url.includes("293") || url.includes("296")) return `10${suffix}`; // Patchy/light rain
  if (url.includes("302") || url.includes("305") || url.includes("308") || url.includes("353") || url.includes("356") || url.includes("359")) return `09${suffix}`; // Heavy rain / showers
  if (url.includes("386") || url.includes("389") || url.includes("392") || url.includes("395")) return `11${suffix}`; // Thunder
  if (url.includes("227") || url.includes("323") || url.includes("326") || url.includes("329") || url.includes("332") || url.includes("335")) return `13${suffix}`; // Snow
  
  return `02${suffix}`; // Default to partly cloudy
}

export async function getWeatherData(req: Request, res: Response) {
  const apiKey = env.WEATHER_API_KEY;
  if (!apiKey) {
    throw new HttpError(501, "Weather API key is not configured on this server");
  }

  const city = req.query.city ? String(req.query.city) : "Vizianagaram";
  const cacheKey = city.toLowerCase();

  // Check cache first
  const cached = weatherCache.get(cacheKey);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL_MS) {
    return res.json(cached.data);
  }

  try {
    // WeatherAPI.com forecast endpoint returns both current and 5 days forecast
    const url = `https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${encodeURIComponent(city)}&days=5&aqi=no&alerts=no`;
    
    console.log("Fetching live weather from WeatherAPI.com...");
    const response = await axios.get(url, { timeout: 3000 });
    const data = response.data;

    // Flat list of hours from today and tomorrow
    const hours: any[] = [];
    const today = data.forecast?.forecastday?.[0]?.hour ?? [];
    const tomorrow = data.forecast?.forecastday?.[1]?.hour ?? [];
    
    // Concat hourly slots
    [...today, ...tomorrow].forEach((h: any) => {
      hours.push({
        dt: h.time_epoch,
        dt_txt: h.time,
        main: {
          temp: h.temp_c,
          feels_like: h.feelslike_c,
          temp_min: h.temp_c,
          temp_max: h.temp_c,
          pressure: h.pressure_mb,
          humidity: h.humidity,
        },
        weather: [{
          id: h.condition.code,
          main: h.condition.text,
          description: h.condition.text,
          icon: mapIconCode(h.condition.icon),
        }],
        wind: {
          speed: h.wind_kph / 3.6, // Convert km/h to m/s to align with OpenWeatherMap speed unit
        },
        pop: (h.chance_of_rain ?? 0) / 100, // Convert percentage (0-100) to ratio (0-1)
        rain: h.precip_mm > 0 ? { "3h": h.precip_mm } : undefined,
      });
    });

    // Map WeatherAPI.com payload format to align with the frontend OpenWeatherMap expectation schema
    const mappedResponse = {
      current: {
        main: {
          temp: data.current.temp_c,
          feels_like: data.current.feelslike_c,
          temp_min: data.forecast?.forecastday?.[0]?.day?.mintemp_c ?? data.current.temp_c,
          temp_max: data.forecast?.forecastday?.[0]?.day?.maxtemp_c ?? data.current.temp_c,
          pressure: data.current.pressure_mb,
          humidity: data.current.humidity,
        },
        wind: {
          speed: data.current.wind_kph / 3.6, // Convert to m/s
          deg: data.current.wind_degree,
        },
        weather: [{
          id: data.current.condition.code,
          main: data.current.condition.text,
          description: data.current.condition.text,
          icon: mapIconCode(data.current.condition.icon),
        }],
        name: data.location.name,
      },
      forecast: {
        list: hours,
      },
    };

    // Cache the mapped data
    weatherCache.set(cacheKey, {
      timestamp: Date.now(),
      data: mappedResponse,
    });

    res.json(mappedResponse);
  } catch (error: any) {
    console.error("WeatherAPI.com query failed:", error.message);
    throw new HttpError(
      502,
      `Failed to retrieve weather data from WeatherAPI.com: ${
        error.response?.data?.error?.message ?? error.message
      }`
    );
  }
}
