import { supabase, parseDates } from "../../lib/supabase.js";
import type { OnboardingInput } from "@haritha/shared-types";

export async function findFarmerProfile(userId: string): Promise<any> {
  const { data, error } = await supabase
    .from("FarmerProfile")
    .select("*")
    .eq("userId", userId)
    .maybeSingle();

  if (error) throw error;
  return parseDates<any>(data);
}

export async function updateOnboarding(userId: string, input: OnboardingInput): Promise<any> {
  const { data, error } = await supabase
    .from("FarmerProfile")
    .update({ ...input, onboarded: true })
    .eq("userId", userId)
    .select()
    .single();

  if (error) throw error;
  return parseDates<any>(data);
}

export async function findUserWithProfile(userId: string): Promise<any> {
  const { data, error } = await supabase
    .from("User")
    .select("*, farmerProfile:FarmerProfile(*)")
    .eq("id", userId)
    .maybeSingle();

  if (error) throw error;
  return parseDates<any>(data);
}
