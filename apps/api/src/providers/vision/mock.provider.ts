import { createHash } from "node:crypto";
import { findClosestDiseaseEntry } from "../../seed-data/disease-reference.js";
import type { AnalyzeCropImageInput, VisionProvider } from "./vision-provider.interface.js";
import type { DiseaseDetectionResultDTO } from "@haritha/shared-types";

/**
 * Dev fallback used when no OPENAI_API_KEY/GEMINI_API_KEY is configured. Not a trained CNN —
 * deterministically maps the image (hashed, not random) to a plausible entry from the seeded
 * disease reference dataset so results are stable per image instead of flaky.
 */
export class MockVisionProvider implements VisionProvider {
  async analyzeCropImage({ imageBuffer, cropName }: AnalyzeCropImageInput): Promise<DiseaseDetectionResultDTO> {
    const hash = createHash("sha256")
      .update(imageBuffer)
      .update(cropName ?? "")
      .digest();

    const seedIndex = hash.readUInt32BE(0);
    const entry = findClosestDiseaseEntry(cropName ?? "", seedIndex);
    const confidence = 0.75 + (hash.readUInt8(4) / 255) * 0.22; // 0.75 - 0.97, deterministic per image

    return {
      diseaseName: entry.diseaseName,
      confidence: Math.round(confidence * 100) / 100,
      affectedArea: entry.affectedArea,
      cause: entry.cause,
      organicSolution: entry.organicSolution,
      chemicalSolution: entry.chemicalSolution,
      preventionTips: entry.preventionTips,
    };
  }
}
