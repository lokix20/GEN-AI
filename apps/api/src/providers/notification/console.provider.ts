import type { VerificationPurpose } from "../../types/database.js";
import { logger } from "../../lib/logger.js";
import type { NotificationProvider, NotificationTarget } from "./notification-provider.interface.js";

/** Dev fallback: logs the OTP/reset link instead of sending real SMS/email, so auth flows are fully testable with zero external accounts. */
export class ConsoleNotificationProvider implements NotificationProvider {
  async sendOtp(target: NotificationTarget, code: string, purpose: VerificationPurpose): Promise<void> {
    logger.info(`[DEV OTP] ${purpose} code for ${target.email ?? target.phone}: ${code}`);
  }

  async sendPasswordResetLink(email: string, link: string): Promise<void> {
    logger.info(`[DEV RESET LINK] for ${email}: ${link}`);
  }
}
