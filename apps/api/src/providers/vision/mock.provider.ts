import { createHash } from "node:crypto";
import { findClosestDiseaseEntry } from "../../seed-data/disease-reference.js";
import type { AnalyzeCropImageInput, VisionProvider } from "./vision-provider.interface.js";
import type { DiseaseDetectionResultDTO } from "@haritha/shared-types";

/**
 * Dev fallback — deterministically maps the image (by hash) to a plausible disease
 * reference entry so results are stable per image. Used when no AI key is configured.
 */
export class MockVisionProvider implements VisionProvider {
  async analyzeCropImage({ imageBuffer, cropName }: AnalyzeCropImageInput): Promise<DiseaseDetectionResultDTO> {
    const hash = createHash("sha256")
      .update(imageBuffer)
      .update(cropName ?? "")
      .digest();

    const seedIndex = hash.readUInt32BE(0);
    const entry = findClosestDiseaseEntry(cropName ?? "", seedIndex);
    const confidence = Math.round((0.75 + (hash.readUInt8(4) / 255) * 0.22) * 100) / 100;

    const isHealthy = entry.diseaseName === "Healthy";
    const severity = isHealthy
      ? ("healthy" as const)
      : confidence > 0.9
      ? ("high" as const)
      : confidence > 0.8
      ? ("moderate" as const)
      : ("low" as const);

    const actWithinHours = isHealthy ? 720 : severity === "high" ? 48 : severity === "moderate" ? 72 : 168;

    // Pick 2 other entries as alternative diagnoses
    const alt1 = findClosestDiseaseEntry(cropName ?? "", seedIndex + 1);
    const alt2 = findClosestDiseaseEntry(cropName ?? "", seedIndex + 2);
    const remaining = Math.max(0, 1 - confidence);
    const altConf1 = Math.round(remaining * 0.6 * 100) / 100;
    const altConf2 = Math.round(remaining * 0.3 * 100) / 100;

    return {
      diseaseName: entry.diseaseName,
      confidence,
      severity,
      affectedArea: entry.affectedArea,
      cause: entry.cause,
      organicSolution: entry.organicSolution,
      chemicalSolution: entry.chemicalSolution,
      dosageInstructions: "Refer to label instructions for specific crop dilution ratios.",
      actWithinHours,
      preventionTips: entry.preventionTips,
      alternativeDiagnoses: [
        { diseaseName: alt1.diseaseName, confidence: altConf1 },
        { diseaseName: alt2.diseaseName, confidence: altConf2 },
      ],
    };
  }
}
