import { createClient } from "@supabase/supabase-js";
import { env } from "../config/env.js";

if (!env.SUPABASE_URL || !env.SUPABASE_SERVICE_KEY) {
  throw new Error("SUPABASE_URL and SUPABASE_SERVICE_KEY must be set in env");
}

export const supabase = createClient(env.SUPABASE_URL, env.SUPABASE_SERVICE_KEY, {
  auth: {
    persistSession: false,
  },
});

export function parseDates<T>(obj: any): T {
  if (!obj) return obj;
  if (Array.isArray(obj)) {
    return obj.map(item => parseDates(item)) as any;
  }
  const result = { ...obj };
  const dateFields = ["createdAt", "updatedAt", "expiresAt", "consumedAt", "revokedAt"];
  for (const field of dateFields) {
    if (result[field]) {
      result[field] = new Date(result[field]);
    }
  }
  if (result.farmerProfile) {
    result.farmerProfile = parseDates(result.farmerProfile);
  }
  if (result.messages && Array.isArray(result.messages)) {
    result.messages = result.messages.map((m: any) => parseDates(m));
  }
  return result;
}
