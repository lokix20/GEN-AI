import { Router } from "express";
import { requireAuth } from "../../middleware/auth.middleware.js";
import { asyncHandler } from "../../middleware/error.middleware.js";
import { rateLimit } from "../../middleware/rateLimiter.js";
import * as controller from "./controller.js";

const router = Router();
router.use(requireAuth);

router.get("/sessions", asyncHandler(controller.listSessions));
router.get("/sessions/:sessionId/messages", asyncHandler(controller.listMessages));
router.patch("/sessions/:sessionId", asyncHandler(controller.updateSession));
router.delete("/sessions/:sessionId", asyncHandler(controller.deleteSession));
router.post("/stream", rateLimit({ windowMs: 60_000, max: 30 }), asyncHandler(controller.streamReply));

export { router as chatRoutes };
