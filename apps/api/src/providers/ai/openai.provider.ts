import { env } from "../../config/env.js";
import { buildSystemPrompt } from "./ai-provider.interface.js";
import type { AIProvider, StreamChatInput } from "./ai-provider.interface.js";
import { MockAIProvider } from "./mock.provider.js";
import { logger } from "../../lib/logger.js";

const MODEL = "gpt-4o-mini";

export class OpenAIProvider implements AIProvider {
  private mockProvider = new MockAIProvider();

  constructor(private readonly apiKey: string) {}

  async *streamChat(input: StreamChatInput): AsyncIterable<string> {
    const { messages, farmerContext, imageUrl, language } = input;
    const chatMessages: Array<Record<string, unknown>> = [
      { role: "system", content: buildSystemPrompt(farmerContext, language) },
      ...messages.slice(0, -1).map((m) => ({ role: m.role, content: m.content })),
    ];

    const last = messages.at(-1);
    if (last) {
      chatMessages.push(
        imageUrl?.startsWith("http")
          ? {
              role: "user",
              content: [
                { type: "text", text: last.content },
                { type: "image_url", image_url: { url: imageUrl } },
              ],
            }
          : { role: "user", content: last.content },
      );
    }

    let res: Response;
    try {
      res = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${this.apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ model: MODEL, messages: chatMessages, stream: true }),
      });

      if (!res.ok || !res.body) {
        const errText = await res.text();
        logger.warn(`OpenAI Chat request failed (${res.status}): ${errText}. Falling back to MockAIProvider.`);
        yield* this.mockProvider.streamChat(input);
        return;
      }
    } catch (err: any) {
      logger.warn(`OpenAI Chat error (${err?.message || err}). Falling back to MockAIProvider.`);
      yield* this.mockProvider.streamChat(input);
      return;
    }

    const reader = res.body.getReader();
    const decoder = new TextDecoder();
    let buffer = "";

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      buffer += decoder.decode(value, { stream: true });

      const lines = buffer.split("\n");
      buffer = lines.pop() ?? "";

      for (const line of lines) {
        const trimmed = line.trim();
        if (!trimmed.startsWith("data:")) continue;
        const data = trimmed.slice("data:".length).trim();
        if (data === "[DONE]") return;

        try {
          const parsed = JSON.parse(data);
          const delta = parsed.choices?.[0]?.delta?.content;
          if (delta) yield delta;
        } catch {
          /* ignore malformed keep-alive chunks */
        }
      }
    }
  }
}
