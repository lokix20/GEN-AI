import { env } from "../../config/env.js";
import { buildSystemPrompt } from "./ai-provider.interface.js";
import type { AIProvider, StreamChatInput } from "./ai-provider.interface.js";

const MODEL = "gpt-4o-mini";

export class OpenAIProvider implements AIProvider {
  constructor(private readonly apiKey: string) {}

  async *streamChat({ messages, farmerContext, imageUrl }: StreamChatInput): AsyncIterable<string> {
    const chatMessages: Array<Record<string, unknown>> = [
      { role: "system", content: buildSystemPrompt(farmerContext) },
      ...messages.slice(0, -1).map((m) => ({ role: m.role, content: m.content })),
    ];

    // Vision input requires a publicly reachable URL (e.g. Supabase storage); local-disk dev URLs are relative and skipped.
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

    const res = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${this.apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ model: MODEL, messages: chatMessages, stream: true }),
    });

    if (!res.ok || !res.body) {
      throw new Error(`OpenAI request failed: ${res.status} ${await res.text()}`);
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
