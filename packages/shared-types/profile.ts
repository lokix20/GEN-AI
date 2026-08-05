import { z } from "zod";

export const OnboardingSchema = z.object({
  state: z.string().min(2, "State is required"),
  district: z.string().min(2, "District is required"),
  village: z.string().min(2, "Village is required"),
  farmSizeAcres: z.coerce.number().positive("Farm size must be greater than 0"),
  soilType: z.string().min(1, "Select a soil type"),
  waterSource: z.string().min(1, "Select a water source"),
  mainCrops: z.array(z.string()).min(1, "Select at least one crop"),
  preferredLanguage: z.string().min(2),
  experienceYears: z.coerce.number().min(0, "Experience cannot be negative"),
});
export type OnboardingInput = z.infer<typeof OnboardingSchema>;

export const FarmerProfileDTOSchema = OnboardingSchema.extend({
  id: z.string(),
  userId: z.string(),
  name: z.string(),
  onboarded: z.boolean(),
});
export type FarmerProfileDTO = z.infer<typeof FarmerProfileDTOSchema>;

export const FarmerContextDTOSchema = z.object({
  name: z.string(),
  state: z.string().optional(),
  district: z.string().optional(),
  village: z.string().optional(),
  mainCrops: z.array(z.string()).optional(),
  soilType: z.string().optional(),
  preferredLanguage: z.string().optional(),
  experienceYears: z.number().optional(),
});
export type FarmerContextDTO = z.infer<typeof FarmerContextDTOSchema>;
