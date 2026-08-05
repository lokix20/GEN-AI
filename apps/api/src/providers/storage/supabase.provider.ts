import { randomUUID } from "node:crypto";
import { env } from "../../config/env.js";
import type { StorageProvider, UploadFileInput, UploadFileResult } from "./storage-provider.interface.js";

const BUCKET = "haritha-uploads";

/**
 * Real Supabase Storage integration, active once SUPABASE_URL + SUPABASE_SERVICE_KEY are set.
 * Uses the REST Storage API directly (no SDK dependency) to keep this provider self-contained.
 */
export class SupabaseStorageProvider implements StorageProvider {
  private readonly baseUrl: string;
  private readonly serviceKey: string;

  constructor() {
    if (!env.SUPABASE_URL || !env.SUPABASE_SERVICE_KEY) {
      throw new Error("SupabaseStorageProvider requires SUPABASE_URL and SUPABASE_SERVICE_KEY");
    }
    this.baseUrl = env.SUPABASE_URL;
    this.serviceKey = env.SUPABASE_SERVICE_KEY;
  }

  async upload(file: UploadFileInput, folder: string): Promise<UploadFileResult> {
    const key = `${folder}/${randomUUID()}-${file.originalName}`;
    const res = await fetch(`${this.baseUrl}/storage/v1/object/${BUCKET}/${key}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${this.serviceKey}`,
        "Content-Type": file.mimeType,
      },
      body: file.buffer,
    });

    if (!res.ok) {
      throw new Error(`Supabase upload failed: ${res.status} ${await res.text()}`);
    }

    return { url: `${this.baseUrl}/storage/v1/object/public/${BUCKET}/${key}`, key };
  }

  async delete(key: string): Promise<void> {
    await fetch(`${this.baseUrl}/storage/v1/object/${BUCKET}/${key}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${this.serviceKey}` },
    });
  }
}
