import { Router } from "express";
import { asyncHandler } from "../../middleware/error.middleware.js";
import { requireAuth } from "../../middleware/auth.middleware.js";
import { getMarketPrices } from "./controller.js";

const router = Router();

router.get("/", requireAuth, asyncHandler(getMarketPrices));

export { router as marketRoutes };
