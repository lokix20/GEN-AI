import { z } from "zod";

export const DiseaseDetectionResultSchema = z.object({
  diseaseName: z.string(),
  confidence: z.number().min(0).max(1),
  affectedArea: z.string(),
  cause: z.string(),
  organicSolution: z.string(),
  chemicalSolution: z.string(),
  preventionTips: z.array(z.string()),
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
