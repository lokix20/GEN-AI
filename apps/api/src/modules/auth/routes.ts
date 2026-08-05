import { Router } from "express";
import { asyncHandler } from "../../middleware/error.middleware.js";
import { requireAuth } from "../../middleware/auth.middleware.js";
import { rateLimit } from "../../middleware/rateLimiter.js";
import * as controller from "./controller.js";

const router = Router();
const authLimiter = rateLimit({ windowMs: 60_000, max: 10 });

router.post("/register", authLimiter, asyncHandler(controller.register));
router.post("/verify-otp", authLimiter, asyncHandler(controller.verifyOtp));
router.post("/resend-otp", authLimiter, asyncHandler(controller.resendOtp));
router.post("/login", authLimiter, asyncHandler(controller.login));
router.post("/google", authLimiter, asyncHandler(controller.googleLogin));
router.post("/refresh", asyncHandler(controller.refresh));
router.post("/logout", asyncHandler(controller.logout));
router.post("/forgot-password", authLimiter, asyncHandler(controller.forgotPassword));
router.post("/reset-password", authLimiter, asyncHandler(controller.resetPassword));
router.get("/me", requireAuth, asyncHandler(controller.me));

export { router as authRoutes };
