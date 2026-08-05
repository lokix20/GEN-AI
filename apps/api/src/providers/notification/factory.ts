import type { VerificationPurpose } from "../../types/database.js";
import { logger } from "../../lib/logger.js";
import { ConsoleNotificationProvider } from "./console.provider.js";
import { buildSendgridProvider } from "./sendgrid.provider.js";
import { buildTwilioProvider } from "./twilio.provider.js";
import type { NotificationProvider, NotificationTarget } from "./notification-provider.interface.js";

class CompositeNotificationProvider implements NotificationProvider {
  private readonly fallback = new ConsoleNotificationProvider();
  private readonly sms = buildTwilioProvider();
  private readonly email = buildSendgridProvider();

  async sendOtp(target: NotificationTarget, code: string, purpose: VerificationPurpose): Promise<void> {
    if (target.phone && this.sms) return this.sms.sendOtp(target, code, purpose);
    if (target.email && this.email) return this.email.sendOtp(target, code, purpose);
    return this.fallback.sendOtp(target, code, purpose);
  }
}

let instance: NotificationProvider | undefined;

export function getNotificationProvider(): NotificationProvider {
  if (!instance) {
    instance = new CompositeNotificationProvider();
    logger.info("Notification provider ready (real channels used where configured, console fallback otherwise)");
  }
  return instance;
}
