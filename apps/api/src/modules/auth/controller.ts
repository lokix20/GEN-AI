import type { Request, Response } from "express";
import {
  ForgotPasswordSchema,
  GoogleLoginSchema,
  LoginSchema,
  RegisterSchema,
  ResetPasswordSchema,
  VerifyOtpSchema,
} from "@haritha/shared-types";
import { env } from "../../config/env.js";
import { HttpError } from "../../middleware/error.middleware.js";
import * as authService from "./service.js";

export const REFRESH_COOKIE_NAME = "harithaRefreshToken";
const REFRESH_COOKIE_MAX_AGE_MS = 30 * 24 * 60 * 60 * 1000;

function setRefreshCookie(res: Response, token: string) {
  res.cookie(REFRESH_COOKIE_NAME, token, {
    httpOnly: true,
    secure: env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: REFRESH_COOKIE_MAX_AGE_MS,
    path: "/api/auth",
  });
}

function clearRefreshCookie(res: Response) {
  res.clearCookie(REFRESH_COOKIE_NAME, { path: "/api/auth" });
}

export async function register(req: Request, res: Response) {
  const input = RegisterSchema.parse(req.body);
  const result = await authService.register(input);
  res.status(201).json(result);
}

export async function verifyOtp(req: Request, res: Response) {
  const input = VerifyOtpSchema.parse(req.body);
  const { refreshToken, ...rest } = await authService.verifyOtp(input);
  setRefreshCookie(res, refreshToken);
  res.json(rest);
}

export async function resendOtp(req: Request, res: Response) {
  const userId = String(req.body?.userId ?? "");
  if (!userId) throw new HttpError(400, "userId is required");
  await authService.resendOtp(userId);
  res.status(204).send();
}

export async function login(req: Request, res: Response) {
  const input = LoginSchema.parse(req.body);
  const { refreshToken, ...rest } = await authService.login(input);
  setRefreshCookie(res, refreshToken);
  res.json(rest);
}

export async function googleLogin(req: Request, res: Response) {
  const input = GoogleLoginSchema.parse(req.body);
  const { refreshToken, ...rest } = await authService.loginWithGoogle(input);
  setRefreshCookie(res, refreshToken);
  res.json(rest);
}

export async function refresh(req: Request, res: Response) {
  const token = req.cookies?.[REFRESH_COOKIE_NAME];
  if (!token) throw new HttpError(401, "No refresh token provided");

  const { refreshToken, ...rest } = await authService.refreshSession(token);
  setRefreshCookie(res, refreshToken);
  res.json(rest);
}

export async function logout(req: Request, res: Response) {
  const token = req.cookies?.[REFRESH_COOKIE_NAME];
  await authService.logout(token);
  clearRefreshCookie(res);
  res.status(204).send();
}

export async function forgotPassword(req: Request, res: Response) {
  const input = ForgotPasswordSchema.parse(req.body);
  await authService.forgotPassword(input);
  res.status(204).send();
}

export async function resetPassword(req: Request, res: Response) {
  const input = ResetPasswordSchema.parse(req.body);
  await authService.resetPassword(input);
  res.status(204).send();
}

export async function me(req: Request, res: Response) {
  const user = await authService.getCurrentUser(req.auth!.userId);
  res.json({ user });
}
