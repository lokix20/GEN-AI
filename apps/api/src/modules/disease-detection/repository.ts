import { randomUUID } from "node:crypto";
import { query, queryOne } from "../../lib/db.js";
import { env } from "../../config/env.js";
import type { DiseaseDetectionResultDTO } from "@haritha/shared-types";

const MOCK_REPORTS: any[] = [
  {
    id: "report-sample-1001",
    userId: "guest-user",
    cropName: "Paddy",
    imageUrl: "/images/landing-hero-farmer.jpg",
    diseaseName: "Bacterial Leaf Blight",
    confidence: 0.88,
    severity: "moderate",
    affectedArea: "20 - 30% of leaf surface showing yellow lesions",
    cause: "Xanthomonas oryzae bacteria, favored by high humidity & rain forecast",
    organicSolution: "Drain standing water, apply neem oil (5ml/L) and remove heavily infected leaves.",
    chemicalSolution: "Spray Copper Oxychloride 50% WP (3g per litre of water) before rain.",
    dosageInstructions: "Mix 600g Copper Oxychloride in 200L water per acre. Repeat after 7-10 days if needed.",
    actWithinHours: 48,
    preventionTips: [
      "Avoid excessive nitrogen fertilizer application",
      "Maintain proper field drainage between watering cycles",
      "Use certified disease-resistant seed varieties for next sowing",
    ],
    alternativeDiagnoses: [
      { diseaseName: "Rice Blast", confidence: 0.1 },
      { diseaseName: "Brown Leaf Spot", confidence: 0.02 },
    ],
    createdAt: new Date().toISOString(),
  }
];

async function syncToSupabase(report: any) {
  if (!env.SUPABASE_URL || !env.SUPABASE_SERVICE_KEY) return;
  try {
    await fetch(`${env.SUPABASE_URL}/rest/v1/disease_reports`, {
      method: "POST",
      headers: {
        apikey: env.SUPABASE_SERVICE_KEY,
        Authorization: `Bearer ${env.SUPABASE_SERVICE_KEY}`,
        "Content-Type": "application/json",
        Prefer: "return=minimal",
      },
      body: JSON.stringify({
        id: report.id,
        user_id: report.userId || "guest-user",
        crop_name: report.cropName,
        image_url: report.imageUrl,
        disease_name: report.diseaseName,
        confidence: report.confidence,
        severity: report.severity,
        affected_area: report.affectedArea,
        cause: report.cause,
        organic_solution: report.organicSolution,
        chemical_solution: report.chemicalSolution,
        dosage_instructions: report.dosageInstructions,
        act_within_hours: report.actWithinHours,
        prevention_tips: report.preventionTips,
        alternative_diagnoses: report.alternativeDiagnoses,
        created_at: report.createdAt || new Date().toISOString(),
      }),
    });
  } catch (err) {
    // Non-blocking background sync warning
    console.warn("Supabase database sync note:", err);
  }
}

export async function createReport(input: { userId: string; cropName: string; imageUrl: string } & DiseaseDetectionResultDTO): Promise<any> {
  const id = randomUUID();
  const createdAt = new Date().toISOString();
  const reportObj = {
    id,
    userId: input.userId || "guest-user",
    cropName: input.cropName,
    imageUrl: input.imageUrl,
    diseaseName: input.diseaseName,
    confidence: input.confidence,
    severity: input.severity,
    affectedArea: input.affectedArea,
    cause: input.cause,
    organicSolution: input.organicSolution,
    chemicalSolution: input.chemicalSolution,
    dosageInstructions: input.dosageInstructions,
    actWithinHours: input.actWithinHours,
    preventionTips: input.preventionTips,
    alternativeDiagnoses: input.alternativeDiagnoses,
    createdAt,
  };

  MOCK_REPORTS.unshift(reportObj);
  syncToSupabase(reportObj);

  try {
    const dbRes = await queryOne(
      `INSERT INTO "DiseaseReport" (
        id, "userId", "cropName", "imageUrl", "diseaseName", confidence, severity,
        "affectedArea", cause, "organicSolution", "chemicalSolution", "dosageInstructions",
        "actWithinHours", "preventionTips", "alternativeDiagnoses", "createdAt"
       )
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, NOW())
       RETURNING *`,
      [
        id,
        input.userId || "guest-user",
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
    return dbRes || reportObj;
  } catch (err) {
    return reportObj;
  }
}

export async function listReports(userId: string): Promise<any[]> {
  try {
    const dbRes = await query(
      `SELECT * FROM "DiseaseReport" WHERE "userId" = $1 ORDER BY "createdAt" DESC`,
      [userId || "guest-user"]
    );
    if (dbRes && dbRes.length > 0) return dbRes;
  } catch (err) {
    // fallback
  }

  // Also check Supabase DB if available
  if (env.SUPABASE_URL && env.SUPABASE_SERVICE_KEY) {
    try {
      const res = await fetch(`${env.SUPABASE_URL}/rest/v1/disease_reports?order=created_at.desc`, {
        headers: {
          apikey: env.SUPABASE_SERVICE_KEY,
          Authorization: `Bearer ${env.SUPABASE_SERVICE_KEY}`,
        },
      });
      if (res.ok) {
        const supabaseData = await res.json();
        if (supabaseData && supabaseData.length > 0) {
          return supabaseData.map((item: any) => ({
            id: item.id,
            userId: item.user_id,
            cropName: item.crop_name,
            imageUrl: item.image_url,
            diseaseName: item.disease_name,
            confidence: item.confidence,
            severity: item.severity,
            affectedArea: item.affected_area,
            cause: item.cause,
            organicSolution: item.organic_solution,
            chemicalSolution: item.chemical_solution,
            dosageInstructions: item.dosage_instructions,
            actWithinHours: item.act_within_hours,
            preventionTips: item.prevention_tips || [],
            alternativeDiagnoses: item.alternative_diagnoses || [],
            createdAt: item.created_at,
          }));
        }
      }
    } catch (err) {
      // fallback
    }
  }

  return MOCK_REPORTS;
}

export async function findReport(userId: string, id: string): Promise<any> {
  try {
    const dbRes = await queryOne(
      `SELECT * FROM "DiseaseReport" WHERE id = $1 AND "userId" = $2`,
      [id, userId || "guest-user"]
    );
    if (dbRes) return dbRes;
  } catch (err) {
    // fallback
  }
  return MOCK_REPORTS.find((r) => r.id === id) || null;
}
