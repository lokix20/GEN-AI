import type { Request, Response } from "express";
import { CreateDiseaseReportSchema } from "@haritha/shared-types";
import { HttpError } from "../../middleware/error.middleware.js";
import * as service from "./service.js";

export async function analyze(req: Request, res: Response) {
  if (!req.file) throw new HttpError(400, "No image uploaded");
  const { cropName } = CreateDiseaseReportSchema.parse(req.body);

  const report = await service.analyzeAndSave(
    req.auth!.userId,
    { buffer: req.file.buffer, mimeType: req.file.mimetype, originalName: req.file.originalname },
    cropName,
  );

  res.status(201).json({ report });
}

export async function history(req: Request, res: Response) {
  const reports = await service.listHistory(req.auth!.userId);
  res.json({ reports });
}

export async function getOne(req: Request, res: Response) {
  const report = await service.getReport(req.auth!.userId, req.params.id);
  res.json({ report });
}

export async function compare(req: Request, res: Response) {
  const beforeId = String(req.query.beforeId ?? "");
  const afterId = String(req.query.afterId ?? "");
  if (!beforeId || !afterId) throw new HttpError(400, "beforeId and afterId are required");

  const result = await service.compareReports(req.auth!.userId, beforeId, afterId);
  res.json(result);
}
