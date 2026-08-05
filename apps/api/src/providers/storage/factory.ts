import { env } from "../../config/env.js";
import { logger } from "../../lib/logger.js";
import { LocalStorageProvider } from "./local.provider.js";
import { SupabaseStorageProvider } from "./supabase.provider.js";
import type { StorageProvider } from "./storage-provider.interface.js";

let instance: StorageProvider | undefined;

export function getStorageProvider(): StorageProvider {
  if (instance) return instance;

  if (env.SUPABASE_URL && env.SUPABASE_SERVICE_KEY) {
    logger.info("Storage provider: Supabase");
    instance = new SupabaseStorageProvider();
  } else {
    logger.info("Storage provider: local disk (dev fallback)");
    instance = new LocalStorageProvider();
  }

  return instance;
}
