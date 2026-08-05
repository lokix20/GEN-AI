import { env } from "../../config/env.js";
import { logger } from "../../lib/logger.js";
import { GeminiVisionProvider } from "./gemini.provider.js";
import { MockVisionProvider } from "./mock.provider.js";
import { OpenAIVisionProvider } from "./openai.provider.js";
import type { VisionProvider } from "./vision-provider.interface.js";

let instance: VisionProvider | undefined;

export function getVisionProvider(): VisionProvider {
  if (instance) return instance;

  if (env.OPENAI_API_KEY) {
    logger.info("Vision provider: OpenAI (gpt-4o-mini)");
    instance = new OpenAIVisionProvider(env.OPENAI_API_KEY);
  } else if (env.GEMINI_API_KEY) {
    logger.info("Vision provider: Gemini (gemini-1.5-flash)");
    instance = new GeminiVisionProvider(env.GEMINI_API_KEY);
  } else {
    logger.info("Vision provider: mock (set OPENAI_API_KEY or GEMINI_API_KEY for real disease detection)");
    instance = new MockVisionProvider();
  }

  return instance;
}
