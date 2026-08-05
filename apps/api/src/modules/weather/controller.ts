import type { Request, Response } from "express";
import axios from "axios";
import { env } from "../../config/env.js";
import { HttpError } from "../../middleware/error.middleware.js";

// 15-minute in-memory cache for weather results
interface CacheEntry {
  timestamp: number;
  data: any;
}
const weatherCache = new Map<string, CacheEntry>();
const CACHE_TTL_MS = 15 * 60 * 1000;

export async function getWeatherData(req: Request, res: Response) {
  const apiKey = env.WEATHER_API_KEY;
  if (!apiKey) {
    throw new HttpError(501, "Weather API key is not configured on this server");
  }

  const city = req.query.city ? String(req.query.city) : "Kadapa";
  const cacheKey = city.toLowerCase();

  // Check cache first
  const cached = weatherCache.get(cacheKey);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL_MS) {
    return res.json(cached.data);
  }

  try {
    // 1. Fetch Current Weather
    const currentWeatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(
      city
    )}&appid=${apiKey}&units=metric`;
    const currentWeatherRes = await axios.get(currentWeatherUrl, { timeout: 3000 });

    // 2. Fetch 5-Day / 3-Hour Forecast
    const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${encodeURIComponent(
      city
    )}&appid=${apiKey}&units=metric`;
    const forecastRes = await axios.get(forecastUrl, { timeout: 3000 });

    const combinedData = {
      current: currentWeatherRes.data,
      forecast: forecastRes.data,
    };

    // Cache the combined response
    weatherCache.set(cacheKey, {
      timestamp: Date.now(),
      data: combinedData,
    });

    res.json(combinedData);
  } catch (error: any) {
    console.error("OpenWeatherMap query failed:", error.message);
    throw new HttpError(
      502,
      `Failed to retrieve weather data from OpenWeatherMap: ${
        error.response?.data?.message ?? error.message
      }`
    );
  }
}
