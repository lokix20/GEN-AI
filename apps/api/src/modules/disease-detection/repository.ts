import { supabase, parseDates } from "../../lib/supabase.js";
import type { DiseaseDetectionResultDTO } from "@haritha/shared-types";

export async function createReport(input: { userId: string; cropName: string; imageUrl: string } & DiseaseDetectionResultDTO): Promise<any> {
  const { data, error } = await supabase
    .from("DiseaseReport")
    .insert({
      userId: input.userId,
      cropName: input.cropName,
      imageUrl: input.imageUrl,
      diseaseName: input.diseaseName,
      confidence: input.confidence,
      affectedArea: input.affectedArea,
      cause: input.cause,
      organicSolution: input.organicSolution,
      chemicalSolution: input.chemicalSolution,
      preventionTips: input.preventionTips,
    })
    .select()
    .single();

  if (error) throw error;
  return parseDates<any>(data);
}

export async function listReports(userId: string): Promise<any[]> {
  const { data, error } = await supabase
    .from("DiseaseReport")
    .select("*")
    .eq("userId", userId)
    .order("createdAt", { ascending: false });

  if (error) throw error;
  return parseDates<any[]>(data);
}

export async function findReport(userId: string, id: string): Promise<any> {
  const { data, error } = await supabase
    .from("DiseaseReport")
    .select("*")
    .eq("id", id)
    .eq("userId", userId)
    .maybeSingle();

  if (error) throw error;
  return parseDates<any>(data);
}
