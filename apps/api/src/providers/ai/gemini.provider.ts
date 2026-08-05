import { buildSystemPrompt } from "./ai-provider.interface.js";
import type { AIProvider, StreamChatInput } from "./ai-provider.interface.js";

const MODEL = "gemini-1.5-flash";

export class GeminiProvider implements AIProvider {
  constructor(private readonly apiKey: string) {}

  async *streamChat({ messages, farmerContext, imageUrl }: StreamChatInput): AsyncIterable<string> {
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
        systemInstruction: { parts: [{ text: buildSystemPrompt(farmerContext) }] },
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
          const text = parsed.candidates?.[0]?.content?.parts?.[0]?.text;
          if (text) yield text;
        } catch {
          /* ignore malformed keep-alive chunks */
        }
      }
    }
  }
}
