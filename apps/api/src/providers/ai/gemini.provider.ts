import { buildSystemPrompt } from "./ai-provider.interface.js";
import type { AIProvider, StreamChatInput } from "./ai-provider.interface.js";

// Pinned to a current stable flash model. gemini-1.5-flash and gemini-2.5-flash both return
// 404 "no longer available to new users" on newly issued API keys. If this ever 404s again,
// list what the key can actually reach:
//   curl "https://generativelanguage.googleapis.com/v1beta/models?key=$GEMINI_API_KEY"
// ("gemini-flash-latest" is the auto-tracking alias if you'd rather not pin a version.)
const MODEL = "gemini-3.6-flash";

export class GeminiProvider implements AIProvider {
  constructor(private readonly apiKey: string) {}

  async *streamChat({ messages, farmerContext, imageUrl, language }: StreamChatInput): AsyncIterable<string> {
    const contents: Array<Record<string, unknown>> = messages.slice(0, -1).map((m) => ({
      role: m.role === "assistant" ? "model" : "user",
      parts: [{ text: m.content }],
    }));

    const last = messages.at(-1);
    if (last) {
      const parts: Array<Record<string, unknown>> = [{ text: last.content }];

      // Vision input requires a publicly reachable URL; local-disk dev URLs are relative and skipped.
      if (imageUrl?.startsWith("http")) {
        const imageRes = await fetch(imageUrl);
        if (imageRes.ok) {
          const mimeType = imageRes.headers.get("content-type") ?? "image/jpeg";
          const base64 = Buffer.from(await imageRes.arrayBuffer()).toString("base64");
          parts.push({ inlineData: { mimeType, data: base64 } });
        }
      }

      contents.push({ role: "user", parts });
    }

    const url = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:streamGenerateContent?alt=sse&key=${this.apiKey}`;
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents,
        systemInstruction: { parts: [{ text: buildSystemPrompt(farmerContext, language) }] },
        // Gemini 3.x reasons before answering; the default spends hundreds of thinking tokens even
        // on a greeting. "low" keeps the chat responsive and cheap for short advisory answers.
        generationConfig: { thinkingConfig: { thinkingLevel: "low" } },
      }),
    });

    if (!res.ok || !res.body) {
      throw new Error(`Gemini request failed: ${res.status} ${await res.text()}`);
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
          // Walk every part rather than just parts[0]: thinking models interleave reasoning parts
          // (flagged `thought`, or text-empty carriers for `thoughtSignature`) with the real answer.
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
  }
}
