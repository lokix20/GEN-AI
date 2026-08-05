import { buildSystemPrompt } from "./ai-provider.interface.js";
import type { AIProvider, StreamChatInput } from "./ai-provider.interface.js";
import { MockAIProvider } from "./mock.provider.js";
import { logger } from "../../lib/logger.js";

const MODEL = "gemini-1.5-flash-latest";

export class GeminiProvider implements AIProvider {
  private mockProvider = new MockAIProvider();

  constructor(private readonly apiKey: string) {}

  async *streamChat(input: StreamChatInput): AsyncIterable<string> {
    const { messages, farmerContext, imageUrl, language } = input;
    const contents: Array<Record<string, unknown>> = messages.slice(0, -1).map((m) => ({
      role: m.role === "assistant" ? "model" : "user",
      parts: [{ text: m.content }],
    }));

    const last = messages.at(-1);
    if (last) {
      const parts: Array<Record<string, unknown>> = [{ text: last.content }];

      if (imageUrl?.startsWith("http")) {
        try {
          const imageRes = await fetch(imageUrl);
          if (imageRes.ok) {
            const mimeType = imageRes.headers.get("content-type") ?? "image/jpeg";
            const base64 = Buffer.from(await imageRes.arrayBuffer()).toString("base64");
            parts.push({ inlineData: { mimeType, data: base64 } });
          }
        } catch {
          /* ignore image fetch error */
        }
      }

      contents.push({ role: "user", parts });
    }

    try {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:streamGenerateContent?alt=sse&key=${this.apiKey}`;
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents,
          systemInstruction: { parts: [{ text: buildSystemPrompt(farmerContext, language) }] },
        }),
      });

      if (!res.ok || !res.body) {
        const errText = await res.text();
        logger.warn(`Gemini request failed (${res.status}): ${errText}. Falling back to MockAIProvider.`);
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
          if (!data) continue;

          try {
            const parsed = JSON.parse(data);
            const parts = parsed.candidates?.[0]?.content?.parts ?? [];
            for (const part of parts) {
              if (part?.thought) continue;
              if (part?.text) yield part.text as string;
            }
          } catch {
            /* ignore malformed keep-alive chunks */
          }
        }
      }
    } catch (err: any) {
      logger.warn(`Gemini AI error (${err?.message || err}). Falling back to MockAIProvider.`);
      yield* this.mockProvider.streamChat(input);
      return;
    }
  }
}
