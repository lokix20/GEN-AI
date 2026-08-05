import { Router } from "express";
import { asyncHandler } from "../../middleware/error.middleware.js";
import { requireAuth } from "../../middleware/auth.middleware.js";
import { getWeatherData } from "./controller.js";

const router = Router();

router.get("/", requireAuth, asyncHandler(getWeatherData));

export { router as weatherRoutes };
