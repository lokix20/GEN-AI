import type { DiseaseDetectionResultDTO } from "@haritha/shared-types";

export interface AnalyzeCropImageInput {
  imageBuffer: Buffer;
  mimeType?: string;
  cropName?: string;
}

export interface VisionProvider {
  analyzeCropImage(input: AnalyzeCropImageInput): Promise<DiseaseDetectionResultDTO>;
}
