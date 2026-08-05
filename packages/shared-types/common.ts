import { z } from "zod";

export const RoleSchema = z.enum(["FARMER", "EXPERT", "ADMIN"]);
export type Role = z.infer<typeof RoleSchema>;

export const LANGUAGES = [
  { code: "en", label: "English" },
  { code: "hi", label: "Hindi / हिन्दी" },
] as const;
export type LanguageCode = (typeof LANGUAGES)[number]["code"];

export const SOIL_TYPES = [
  "Alluvial",
  "Black (Regur)",
  "Red",
  "Laterite",
  "Clay",
  "Sandy",
  "Loamy",
  "Silty",
] as const;

export const WATER_SOURCES = [
  "Canal",
  "Borewell",
  "Open Well",
  "River",
  "Rainfed",
  "Pond/Tank",
  "Drip Irrigation",
] as const;

export const ApiErrorSchema = z.object({
  message: z.string(),
  code: z.string().optional(),
  fieldErrors: z.record(z.string(), z.array(z.string())).optional(),
});
export type ApiError = z.infer<typeof ApiErrorSchema>;
