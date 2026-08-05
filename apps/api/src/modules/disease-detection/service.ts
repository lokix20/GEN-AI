import type { DiseaseReportDTO } from "@haritha/shared-types";
import { HttpError } from "../../middleware/error.middleware.js";
import { getStorageProvider } from "../../providers/storage/factory.js";
import { getVisionProvider } from "../../providers/vision/factory.js";
import * as repo from "./repository.js";

function toDTO(report: Awaited<ReturnType<typeof repo.createReport>>): DiseaseReportDTO {
  return {
    id: report.id,
    cropName: report.cropName,
    imageUrl: report.imageUrl,
    diseaseName: report.diseaseName,
    confidence: report.confidence,
    affectedArea: report.affectedArea,
    cause: report.cause,
    organicSolution: report.organicSolution,
    chemicalSolution: report.chemicalSolution,
    preventionTips: report.preventionTips,
    createdAt: report.createdAt.toISOString(),
  };
}

export async function analyzeAndSave(
  userId: string,
  file: { buffer: Buffer; mimeType: string; originalName: string },
  cropName: string,
): Promise<DiseaseReportDTO> {
  const [{ url }, result] = await Promise.all([
    getStorageProvider().upload(file, "disease-reports"),
    getVisionProvider().analyzeCropImage({ imageBuffer: file.buffer, cropName }),
  ]);

  const report = await repo.createReport({ userId, cropName, imageUrl: url, ...result });
  return toDTO(report);
}

export async function listHistory(userId: string): Promise<DiseaseReportDTO[]> {
  const reports = await repo.listReports(userId);
  return reports.map(toDTO);
}

export async function getReport(userId: string, id: string): Promise<DiseaseReportDTO> {
  const report = await repo.findReport(userId, id);
  if (!report) throw new HttpError(404, "Report not found");
  return toDTO(report);
}

export async function compareReports(userId: string, beforeId: string, afterId: string) {
  const [before, after] = await Promise.all([repo.findReport(userId, beforeId), repo.findReport(userId, afterId)]);
  if (!before || !after) throw new HttpError(404, "One or both reports were not found");
  return { before: toDTO(before), after: toDTO(after) };
}
