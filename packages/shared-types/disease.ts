import { z } from "zod";

const AlternativeDiagnosisSchema = z.object({
  diseaseName: z.string(),
  confidence: z.number().min(0).max(1),
});

export const DiseaseDetectionResultSchema = z.object({
  diseaseName: z.string(),
  confidence: z.number().min(0).max(1),
  severity: z.enum(["healthy", "low", "moderate", "high", "critical"]),
  affectedArea: z.string(),
  cause: z.string(),
  organicSolution: z.string(),
  chemicalSolution: z.string(),
  dosageInstructions: z.string(),
  actWithinHours: z.number(),
  preventionTips: z.array(z.string()),
  alternativeDiagnoses: z.array(AlternativeDiagnosisSchema),
});
export type DiseaseDetectionResultDTO = z.infer<typeof DiseaseDetectionResultSchema>;

export const DiseaseReportDTOSchema = DiseaseDetectionResultSchema.extend({
  id: z.string(),
  cropName: z.string(),
  imageUrl: z.string(),
  createdAt: z.string(),
});
export type DiseaseReportDTO = z.infer<typeof DiseaseReportDTOSchema>;

export const CreateDiseaseReportSchema = z.object({
  cropName: z.string().min(1, "Crop name is required"),
});
export type CreateDiseaseReportInput = z.infer<typeof CreateDiseaseReportSchema>;
