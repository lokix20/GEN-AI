import type { VerificationPurpose } from "../../types/database.js";

export interface NotificationTarget {
  phone?: string | null;
  email?: string | null;
}

export interface NotificationProvider {
  sendOtp(target: NotificationTarget, code: string, purpose: VerificationPurpose): Promise<void>;
}
