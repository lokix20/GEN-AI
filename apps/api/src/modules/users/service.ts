import type { FarmerProfileDTO, OnboardingInput } from "@haritha/shared-types";
import { HttpError } from "../../middleware/error.middleware.js";
import * as repo from "./repository.js";

function toFarmerProfileDTO(profile: NonNullable<Awaited<ReturnType<typeof repo.findFarmerProfile>>>, name: string): FarmerProfileDTO {
  return {
    id: profile.id,
    userId: profile.userId,
    name,
    state: profile.state ?? "",
    district: profile.district ?? "",
    village: profile.village ?? "",
    farmSizeAcres: profile.farmSizeAcres ?? 0,
    soilType: profile.soilType ?? "",
    waterSource: profile.waterSource ?? "",
    mainCrops: profile.mainCrops,
    preferredLanguage: profile.preferredLanguage,
    experienceYears: profile.experienceYears ?? 0,
    onboarded: profile.onboarded,
  };
}

export async function getProfile(userId: string): Promise<FarmerProfileDTO> {
  const user = await repo.findUserWithProfile(userId);
  if (!user?.farmerProfile) throw new HttpError(404, "Farmer profile not found");
  return toFarmerProfileDTO(user.farmerProfile, user.name);
}

export async function completeOnboarding(userId: string, input: OnboardingInput): Promise<FarmerProfileDTO> {
  const user = await repo.findUserWithProfile(userId);
  if (!user?.farmerProfile) throw new HttpError(404, "Farmer profile not found");

  const updated = await repo.updateOnboarding(userId, input);
  return toFarmerProfileDTO(updated, user.name);
}
