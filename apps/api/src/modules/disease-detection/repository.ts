import { randomUUID } from "node:crypto";
import { query, queryOne } from "../../lib/db.js";
import type { DiseaseDetectionResultDTO } from "@haritha/shared-types";

export async function createReport(input: { userId: string; cropName: string; imageUrl: string } & DiseaseDetectionResultDTO): Promise<any> {
  const id = randomUUID();
  return queryOne(
    `INSERT INTO "DiseaseReport" (
      id, "userId", "cropName", "imageUrl", "diseaseName", confidence, severity,
      "affectedArea", cause, "organicSolution", "chemicalSolution", "dosageInstructions",
      "actWithinHours", "preventionTips", "alternativeDiagnoses", "createdAt"
     )
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, NOW())
     RETURNING *`,
    [
      id,
      input.userId,
      input.cropName,
      input.imageUrl,
      input.diseaseName,
      input.confidence,
      input.severity,
      input.affectedArea,
      input.cause,
      input.organicSolution,
      input.chemicalSolution,
      input.dosageInstructions,
      input.actWithinHours,
      input.preventionTips,
      JSON.stringify(input.alternativeDiagnoses),
    ]
  );
}

export async function listReports(userId: string): Promise<any[]> {
  return query(
    `SELECT * FROM "DiseaseReport" WHERE "userId" = $1 ORDER BY "createdAt" DESC`,
    [userId]
  );
}

export async function findReport(userId: string, id: string): Promise<any> {
  return queryOne(
    `SELECT * FROM "DiseaseReport" WHERE id = $1 AND "userId" = $2`,
    [id, userId]
  );
}
