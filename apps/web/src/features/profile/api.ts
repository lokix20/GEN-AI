import type { FarmerProfileDTO, OnboardingInput } from "@haritha/shared-types";
import { apiClient } from "../../lib/apiClient";

export async function fetchFarmerProfile(): Promise<FarmerProfileDTO> {
  const { data } = await apiClient.get("/users/profile");
  return data.profile;
}

export async function completeOnboardingRequest(input: OnboardingInput): Promise<FarmerProfileDTO> {
  const { data } = await apiClient.patch("/users/onboarding", input);
  return data.profile;
}
