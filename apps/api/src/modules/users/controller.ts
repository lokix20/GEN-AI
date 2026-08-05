import type { Request, Response } from "express";
import { OnboardingSchema } from "@haritha/shared-types";
import * as usersService from "./service.js";

export async function getProfile(req: Request, res: Response) {
  const profile = await usersService.getProfile(req.auth!.userId);
  res.json({ profile });
}

export async function completeOnboarding(req: Request, res: Response) {
  const input = OnboardingSchema.parse(req.body);
  const profile = await usersService.completeOnboarding(req.auth!.userId, input);
  res.json({ profile });
}
