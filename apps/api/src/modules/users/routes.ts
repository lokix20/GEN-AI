import { Router } from "express";
import { requireAuth, requireRole } from "../../middleware/auth.middleware.js";
import { asyncHandler } from "../../middleware/error.middleware.js";
import * as controller from "./controller.js";

const router = Router();

router.get("/profile", requireAuth, requireRole("FARMER"), asyncHandler(controller.getProfile));
router.patch("/onboarding", requireAuth, requireRole("FARMER"), asyncHandler(controller.completeOnboarding));

export { router as usersRoutes };
