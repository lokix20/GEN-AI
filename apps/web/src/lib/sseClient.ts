import { useAuthStore } from "../store/auth.store";

export interface SSEEvent {
  event: string;
  data: unknown;
}

/**
 * Streams a POST endpoint that responds with text/event-stream. Uses fetch + a manually parsed
 * ReadableStream rather than the EventSource constructor, since EventSource can't send an
 * Authorization header or a JSON body.
 */
export async function* streamSSE(url: string, body: unknown, signal?: AbortSignal): AsyncGenerator<SSEEvent> {
  const token = useAuthStore.getState().accessToken;

  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify(body),
    signal,
  });

  if (!res.ok || !res.body) {
    const text = await res.text().catch(() => "");
    throw new Error(text || `Request failed with status ${res.status}`);
  }

  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });

    const rawEvents = buffer.split("\n\n");
    buffer = rawEvents.pop() ?? "";

    for (const raw of rawEvents) {
      let eventName = "message";
      let dataLine = "";

      for (const line of raw.split("\n")) {
        if (line.startsWith("event:")) eventName = line.slice("event:".length).trim();
        else if (line.startsWith("data:")) dataLine = line.slice("data:".length).trim();
      }

      if (!dataLine) continue;
      try {
        yield { event: eventName, data: JSON.parse(dataLine) };
      } catch {
        /* ignore malformed chunk */
      }
    }
  }
}
