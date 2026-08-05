import type { VerificationPurpose } from "../../types/database.js";
import { env } from "../../config/env.js";
import type { NotificationProvider, NotificationTarget } from "./notification-provider.interface.js";

/** Real Twilio SMS integration, active once TWILIO_* env vars are set. Uses the REST API directly to avoid an extra SDK dependency. */
export class TwilioNotificationProvider implements NotificationProvider {
  constructor(
    private readonly accountSid: string,
    private readonly authToken: string,
    private readonly fromNumber: string,
  ) {}

  async sendOtp(target: NotificationTarget, code: string, purpose: VerificationPurpose): Promise<void> {
    if (!target.phone) return;
    await this.send(target.phone, `Haritha Sahayak: your ${purpose.replace("_", " ").toLowerCase()} code is ${code}`);
  }

  private async send(to: string, body: string): Promise<void> {
    const url = `https://api.twilio.com/2010-04-01/Accounts/${this.accountSid}/Messages.json`;
    const auth = Buffer.from(`${this.accountSid}:${this.authToken}`).toString("base64");
    const res = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Basic ${auth}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({ To: to, From: this.fromNumber, Body: body }),
    });
    if (!res.ok) throw new Error(`Twilio send failed: ${res.status} ${await res.text()}`);
  }
}

export function buildTwilioProvider(): TwilioNotificationProvider | undefined {
  if (!env.TWILIO_ACCOUNT_SID || !env.TWILIO_AUTH_TOKEN || !env.TWILIO_FROM_NUMBER) return undefined;
  return new TwilioNotificationProvider(env.TWILIO_ACCOUNT_SID, env.TWILIO_AUTH_TOKEN, env.TWILIO_FROM_NUMBER);
}
