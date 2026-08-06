import { createHash } from "node:crypto";
import bcrypt from "bcryptjs";
import { OAuth2Client } from "google-auth-library";
import type {
  AuthResponse,
  ForgotPasswordInput,
  GoogleLoginInput,
  LoginInput,
  RegisterInput,
  ResetPasswordInput,
  UserDTO,
  VerifyOtpInput,
} from "@haritha/shared-types";
import { env } from "../../config/env.js";
import { HttpError } from "../../middleware/error.middleware.js";
import { signAccessToken, signRefreshToken, verifyRefreshToken } from "../../lib/jwt.js";
import { getNotificationProvider } from "../../providers/notification/factory.js";
import { compareCode, generateOtpCode, hashCode, OTP_TTL_MINUTES } from "./otp.util.js";
import * as repo from "./repository.js";

const REFRESH_TOKEN_TTL_DAYS = 30;

function toUserDTO(user: { id: string; name: string; email: string; phone: string | null; role: UserDTO["role"]; emailVerified: boolean; createdAt: Date }, onboarded: boolean): UserDTO {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    phone: user.phone,
    role: user.role,
    onboarded,
    emailVerified: user.emailVerified,
    createdAt: user.createdAt.toISOString(),
  };
}

function hashToken(token: string): string {
  return createHash("sha256").update(token).digest("hex");
}

async function issueTokens(user: { id: string; role: UserDTO["role"] }): Promise<{ accessToken: string; refreshToken: string }> {
  const accessToken = signAccessToken({ sub: user.id, role: user.role });
  const refreshToken = signRefreshToken({ sub: user.id, role: user.role });

  await repo.storeRefreshToken({
    userId: user.id,
    tokenHash: hashToken(refreshToken),
    expiresAt: new Date(Date.now() + REFRESH_TOKEN_TTL_DAYS * 24 * 60 * 60 * 1000),
  });

  return { accessToken, refreshToken };
}

export async function register(input: RegisterInput): Promise<AuthResponse & { refreshToken: string }> {
  if (input.role === "ADMIN") {
    throw new HttpError(403, "Admin accounts cannot self-register");
  }

  const existing = await repo.findUserByEmail(input.email);
  if (existing) throw new HttpError(409, "An account with this email already exists");

  const passwordHash = await bcrypt.hash(input.password, 10);
  const user = await repo.createUser({
    name: input.name,
    email: input.email,
    phone: input.phone,
    passwordHash,
    role: input.role,
  });

  // Automatically mark email as verified to bypass OTP
  await repo.markEmailVerified(user.id);
  user.emailVerified = true;

  const { accessToken, refreshToken } = await issueTokens(user);
  return {
    user: toUserDTO(user, false),
    accessToken,
    refreshToken,
  };
}

async function sendVerificationOtp(userId: string, target: { email?: string | null; phone?: string | null }) {
  const code = generateOtpCode();
  const codeHash = await hashCode(code);
  await repo.createVerificationToken({
    userId,
    codeHash,
    purpose: "EMAIL_VERIFY",
    expiresAt: new Date(Date.now() + OTP_TTL_MINUTES * 60 * 1000),
  });
  await getNotificationProvider().sendOtp(target, code, "EMAIL_VERIFY");
}

export async function resendOtp(userId: string): Promise<void> {
  const user = await repo.findUserById(userId);
  if (!user) throw new HttpError(404, "User not found");
  if (user.emailVerified) throw new HttpError(400, "Account is already verified");
  await sendVerificationOtp(user.id, { email: user.email, phone: user.phone });
}

export async function verifyOtp(input: VerifyOtpInput): Promise<AuthResponse & { refreshToken: string }> {
  const user = await repo.findUserById(input.userId);
  if (!user) throw new HttpError(404, "User not found");

  const token = await repo.findLatestActiveToken(input.userId, input.purpose);
  if (!token) throw new HttpError(400, "Code has expired, please request a new one");

  const valid = await compareCode(input.code, token.codeHash);
  if (!valid) throw new HttpError(400, "Incorrect code");

  await repo.consumeVerificationToken(token.id);

  if (input.purpose === "EMAIL_VERIFY" || input.purpose === "PHONE_VERIFY") {
    await repo.markEmailVerified(input.userId);
    user.emailVerified = true;
  }

  const { accessToken, refreshToken } = await issueTokens(user);
  return {
    user: toUserDTO(user, user.farmerProfile?.onboarded ?? true),
    accessToken,
    refreshToken,
  };
}

export async function login(input: LoginInput): Promise<AuthResponse & { refreshToken: string }> {
  const found = await repo.findUserByEmail(input.email);
  if (!found || !found.passwordHash) throw new HttpError(401, "Invalid email or password");

  const validPassword = await bcrypt.compare(input.password, found.passwordHash);
  if (!validPassword) throw new HttpError(401, "Invalid email or password");

  const user = await repo.findUserById(found.id);
  if (!user) throw new HttpError(401, "Invalid email or password");

  const { accessToken, refreshToken } = await issueTokens(user);
  return {
    user: toUserDTO(user, user.farmerProfile?.onboarded ?? true),
    accessToken,
    refreshToken,
  };
}

export async function loginWithGoogle(input: GoogleLoginInput): Promise<AuthResponse & { refreshToken: string }> {
  if (!env.GOOGLE_CLIENT_ID) {
    throw new HttpError(501, "Google login is not configured on this server");
  }

  const client = new OAuth2Client(env.GOOGLE_CLIENT_ID);
  const ticket = await client.verifyIdToken({ idToken: input.idToken, audience: env.GOOGLE_CLIENT_ID });
  const payload = ticket.getPayload();
  if (!payload?.email || !payload.sub) throw new HttpError(401, "Invalid Google token");

  let user = await repo.findUserByGoogleId(payload.sub);
  if (!user) {
    const existingByEmail = await repo.findUserByEmail(payload.email);
    if (existingByEmail) throw new HttpError(409, "An account with this email already exists, please log in with a password instead");
    user = await repo.createGoogleUser({ name: payload.name ?? payload.email, email: payload.email, googleId: payload.sub });
  }

  const fullUser = await repo.findUserById(user.id);
  if (!fullUser) throw new HttpError(500, "Failed to load user");

  const { accessToken, refreshToken } = await issueTokens(fullUser);
  return {
    user: toUserDTO(fullUser, fullUser.farmerProfile?.onboarded ?? true),
    accessToken,
    refreshToken,
  };
}

export async function refreshSession(rawRefreshToken: string): Promise<AuthResponse & { refreshToken: string }> {
  let payload;
  try {
    payload = verifyRefreshToken(rawRefreshToken);
  } catch {
    throw new HttpError(401, "Invalid or expired refresh token");
  }

  const tokenHash = hashToken(rawRefreshToken);
  const stored = await repo.findActiveRefreshToken(tokenHash);
  if (!stored || stored.revokedAt || stored.expiresAt < new Date()) {
    throw new HttpError(401, "Refresh token is no longer valid");
  }

  await repo.revokeRefreshToken(tokenHash);

  const user = await repo.findUserById(payload.sub);
  if (!user) throw new HttpError(401, "User not found");

  const { accessToken, refreshToken } = await issueTokens(user);
  return {
    user: toUserDTO(user, user.farmerProfile?.onboarded ?? true),
    accessToken,
    refreshToken,
  };
}

export async function logout(rawRefreshToken: string | undefined): Promise<void> {
  if (!rawRefreshToken) return;
  await repo.revokeRefreshToken(hashToken(rawRefreshToken));
}

export async function forgotPassword(input: ForgotPasswordInput): Promise<void> {
  const user = await repo.findUserByEmail(input.email);
  if (!user) return; // don't leak account existence

  const code = generateOtpCode();
  const codeHash = await hashCode(code);
  await repo.createVerificationToken({
    userId: user.id,
    codeHash,
    purpose: "PASSWORD_RESET",
    expiresAt: new Date(Date.now() + OTP_TTL_MINUTES * 60 * 1000),
  });
  await getNotificationProvider().sendOtp({ email: user.email, phone: user.phone }, code, "PASSWORD_RESET");
}

export async function resetPassword(input: ResetPasswordInput): Promise<void> {
  const user = await repo.findUserByEmail(input.email);
  if (!user) throw new HttpError(400, "Incorrect code");

  const token = await repo.findLatestActiveToken(user.id, "PASSWORD_RESET");
  if (!token) throw new HttpError(400, "Code has expired, please request a new one");

  const valid = await compareCode(input.code, token.codeHash);
  if (!valid) throw new HttpError(400, "Incorrect code");

  await repo.consumeVerificationToken(token.id);
  const passwordHash = await bcrypt.hash(input.newPassword, 10);
  await repo.updatePasswordHash(user.id, passwordHash);
}

export async function getCurrentUser(userId: string): Promise<UserDTO> {
  const user = await repo.findUserById(userId);
  if (!user) throw new HttpError(404, "User not found");
  return toUserDTO(user, user.farmerProfile?.onboarded ?? true);
}
