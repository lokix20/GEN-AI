import type { Request, Response } from "express";
import axios from "axios";
import { env } from "../../config/env.js";
import { HttpError } from "../../middleware/error.middleware.js";

const RESOURCE_ID = "9ef84268-d588-4dc4-8a26-21b41d930eaa";

const COMMODITY_MAP: Record<string, string> = {
  paddy: "Paddy(Dhan)",
  tomato: "Tomato",
  cotton: "Cotton",
};

export async function getMarketPrices(req: Request, res: Response) {
  const apiKey = env.DATA_GOV_API_KEY;
  if (!apiKey) {
    throw new HttpError(501, "data.gov.in API key is not configured on this server");
  }

  const crop = String(req.query.commodity ?? "paddy").toLowerCase();
  const commodity = COMMODITY_MAP[crop] ?? "Paddy(Dhan)";
  const state = req.query.state ? String(req.query.state) : undefined;
  const district = req.query.district ? String(req.query.district) : undefined;

  let url = `https://api.data.gov.in/resource/${RESOURCE_ID}?api-key=${apiKey}&format=json&limit=150`;

  // Apply filters
  url += `&filters[commodity]=${encodeURIComponent(commodity)}`;
  if (state) {
    url += `&filters[state]=${encodeURIComponent(state)}`;
  }
  if (district) {
    url += `&filters[district]=${encodeURIComponent(district)}`;
  }

  try {
    const response = await axios.get(url);
    res.json(response.data);
  } catch (error: any) {
    // If localized search returns nothing, retry without state/district filters to ensure we have fallback national/regional data
    if (state || district) {
      try {
        let fallbackUrl = `https://api.data.gov.in/resource/${RESOURCE_ID}?api-key=${apiKey}&format=json&limit=150`;
        fallbackUrl += `&filters[commodity]=${encodeURIComponent(commodity)}`;
        const fallbackRes = await axios.get(fallbackUrl);
        return res.json(fallbackRes.data);
      } catch (fallbackError: any) {
        throw new HttpError(502, `Failed to retrieve market prices from data.gov.in: ${fallbackError.message}`);
      }
    }
    throw new HttpError(502, `Failed to retrieve market prices from data.gov.in: ${error.message}`);
  }
}
