import { randomUUID } from "node:crypto";
import { mkdir, unlink, writeFile } from "node:fs/promises";
import path from "node:path";
import type { StorageProvider, UploadFileInput, UploadFileResult } from "./storage-provider.interface.js";

const UPLOADS_ROOT = path.resolve(process.cwd(), "uploads");

const EXTENSION_BY_MIME: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
};

export class LocalStorageProvider implements StorageProvider {
  async upload(file: UploadFileInput, folder: string): Promise<UploadFileResult> {
    const dir = path.join(UPLOADS_ROOT, folder);
    await mkdir(dir, { recursive: true });

    const ext = EXTENSION_BY_MIME[file.mimeType] ?? "bin";
    const filename = `${randomUUID()}.${ext}`;
    await writeFile(path.join(dir, filename), file.buffer);

    const key = `${folder}/${filename}`;
    return { url: `/uploads/${key}`, key };
  }

  async delete(key: string): Promise<void> {
    try {
      await unlink(path.join(UPLOADS_ROOT, key));
    } catch {
      /* already gone */
    }
  }
}
