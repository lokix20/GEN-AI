import type { DiseaseReportDTO } from "@haritha/shared-types";
import { apiClient } from "../../lib/apiClient";

export async function analyzeCropImage(file: File, cropName: string): Promise<DiseaseReportDTO> {
  const formData = new FormData();
  formData.append("image", file);
  formData.append("cropName", cropName);
  const { data } = await apiClient.post("/disease-detection/analyze", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data.report;
}

export async function listDiseaseReports(): Promise<DiseaseReportDTO[]> {
  const { data } = await apiClient.get("/disease-detection/reports");
  return data.reports;
}

export async function compareDiseaseReports(beforeId: string, afterId: string): Promise<{ before: DiseaseReportDTO; after: DiseaseReportDTO }> {
  const { data } = await apiClient.get("/disease-detection/reports/compare", { params: { beforeId, afterId } });
  return data;
}
