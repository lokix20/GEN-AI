import { env } from "../../config/env.js";
import { logger } from "../../lib/logger.js";
import { GeminiProvider } from "./gemini.provider.js";
import { MockAIProvider } from "./mock.provider.js";
import { OpenAIProvider } from "./openai.provider.js";
import type { AIProvider } from "./ai-provider.interface.js";

let instance: AIProvider | undefined;

export function getAIProvider(): AIProvider {
  if (instance) return instance;

  if (env.OPENAI_API_KEY) {
    logger.info("AI provider: OpenAI (gpt-4o-mini)");
    instance = new OpenAIProvider(env.OPENAI_API_KEY);
  } else if (env.GEMINI_API_KEY) {
    logger.info("AI provider: Gemini (gemini-1.5-flash)");
    instance = new GeminiProvider(env.GEMINI_API_KEY);
  } else {
    logger.info("AI provider: mock (set OPENAI_API_KEY or GEMINI_API_KEY for real responses)");
    instance = new MockAIProvider();
  }

  return instance;
}
