import { Router } from "express";
import { requireAuth } from "../../middleware/auth.middleware.js";
import { asyncHandler } from "../../middleware/error.middleware.js";
import { rateLimit } from "../../middleware/rateLimiter.js";
import { upload } from "../../middleware/upload.middleware.js";
import * as controller from "./controller.js";

const router = Router();
router.use(requireAuth);

router.post("/analyze", rateLimit({ windowMs: 60_000, max: 20 }), upload.single("image"), asyncHandler(controller.analyze));
router.get("/reports", asyncHandler(controller.history));
router.get("/reports/compare", asyncHandler(controller.compare));
router.get("/reports/:id", asyncHandler(controller.getOne));

export { router as diseaseDetectionRoutes };
