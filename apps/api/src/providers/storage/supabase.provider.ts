import { randomUUID } from "node:crypto";
import { env } from "../../config/env.js";
import type { StorageProvider, UploadFileInput, UploadFileResult } from "./storage-provider.interface.js";
import { LocalStorageProvider } from "./local.provider.js";

const BUCKET = "haritha-uploads";

/**
 * Real Supabase Storage integration with automatic bucket provisioning & local fallback.
 */
export class SupabaseStorageProvider implements StorageProvider {
  private readonly baseUrl: string;
  private readonly serviceKey: string;
  private readonly localFallback: LocalStorageProvider;
  private bucketCreated: boolean = false;

  constructor() {
    if (!env.SUPABASE_URL || !env.SUPABASE_SERVICE_KEY) {
      throw new Error("SupabaseStorageProvider requires SUPABASE_URL and SUPABASE_SERVICE_KEY");
    }
    this.baseUrl = env.SUPABASE_URL;
    this.serviceKey = env.SUPABASE_SERVICE_KEY;
    this.localFallback = new LocalStorageProvider();
  }

  private async ensureBucket(): Promise<void> {
    if (this.bucketCreated) return;
    try {
      await fetch(`${this.baseUrl}/storage/v1/bucket`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${this.serviceKey}`,
          apikey: this.serviceKey,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: BUCKET,
          name: BUCKET,
          public: true,
        }),
      });
      this.bucketCreated = true;
    } catch {
      // Ignore bucket exists error
    }
  }

  async upload(file: UploadFileInput, folder: string): Promise<UploadFileResult> {
    const key = `${folder}/${randomUUID()}-${file.originalName.replace(/[^a-zA-Z0-9.-]/g, "_")}`;
    
    try {
      await this.ensureBucket();

      const res = await fetch(`${this.baseUrl}/storage/v1/object/${BUCKET}/${key}`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${this.serviceKey}`,
          apikey: this.serviceKey,
          "Content-Type": file.mimeType,
          "x-upsert": "true",
        },
        body: file.buffer,
      });

      if (res.ok) {
        return { url: `${this.baseUrl}/storage/v1/object/public/${BUCKET}/${key}`, key };
      }

      // If bucket is missing (404/400), try creating it once and retry
      const errText = await res.text();
      if (errText.includes("NoSuchBucket") || errText.includes("Bucket not found")) {
        await this.ensureBucket();
        const retryRes = await fetch(`${this.baseUrl}/storage/v1/object/${BUCKET}/${key}`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${this.serviceKey}`,
            apikey: this.serviceKey,
            "Content-Type": file.mimeType,
            "x-upsert": "true",
          },
          body: file.buffer,
        });
        if (retryRes.ok) {
          return { url: `${this.baseUrl}/storage/v1/object/public/${BUCKET}/${key}`, key };
        }
      }
    } catch (err) {
      console.warn("Supabase Storage upload warning, using local fallback:", err);
    }

    // Graceful fallback to local storage if Supabase storage bucket is unprovisioned
    return this.localFallback.upload(file, folder);
  }

  async delete(key: string): Promise<void> {
    try {
      await fetch(`${this.baseUrl}/storage/v1/object/${BUCKET}/${key}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${this.serviceKey}`,
          apikey: this.serviceKey,
        },
      });
    } catch {
      await this.localFallback.delete(key);
    }
  }
}
