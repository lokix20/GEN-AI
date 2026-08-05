import { randomInt } from "node:crypto";
import bcrypt from "bcryptjs";

export function generateOtpCode(): string {
  return randomInt(0, 1_000_000).toString().padStart(6, "0");
}

export function hashCode(code: string): Promise<string> {
  return bcrypt.hash(code, 10);
}

export function compareCode(code: string, hash: string): Promise<boolean> {
  return bcrypt.compare(code, hash);
}

export const OTP_TTL_MINUTES = 10;
