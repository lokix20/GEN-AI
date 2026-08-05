import type { VerificationPurpose } from "../../types/database.js";
import { env } from "../../config/env.js";
import type { NotificationProvider, NotificationTarget } from "./notification-provider.interface.js";

/** Real SendGrid email integration, active once SENDGRID_API_KEY + SENDGRID_FROM_EMAIL are set. */
export class SendgridNotificationProvider implements NotificationProvider {
  constructor(
    private readonly apiKey: string,
    private readonly fromEmail: string,
  ) {}

  async sendOtp(target: NotificationTarget, code: string, purpose: VerificationPurpose): Promise<void> {
    if (!target.email) return;
    await this.send(target.email, "Your Haritha Sahayak verification code", `Your ${purpose.replace("_", " ").toLowerCase()} code is ${code}`);
  }

  private async send(to: string, subject: string, text: string): Promise<void> {
    const res = await fetch("https://api.sendgrid.com/v3/mail/send", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${this.apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        personalizations: [{ to: [{ email: to }] }],
        from: { email: this.fromEmail },
        subject,
        content: [{ type: "text/plain", value: text }],
      }),
    });
    if (!res.ok) throw new Error(`SendGrid send failed: ${res.status} ${await res.text()}`);
  }
}

export function buildSendgridProvider(): SendgridNotificationProvider | undefined {
  if (!env.SENDGRID_API_KEY || !env.SENDGRID_FROM_EMAIL) return undefined;
  return new SendgridNotificationProvider(env.SENDGRID_API_KEY, env.SENDGRID_FROM_EMAIL);
}
