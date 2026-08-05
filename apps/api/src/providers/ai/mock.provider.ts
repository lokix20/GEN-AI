import type { AIProvider, StreamChatInput } from "./ai-provider.interface.js";

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/** Dev fallback used when no OPENAI_API_KEY/GEMINI_API_KEY is configured. Builds a templated but profile-grounded reply so the chat UX still feels personalized end-to-end without any real LLM call. */
export class MockAIProvider implements AIProvider {
  async *streamChat({ messages, farmerContext, imageUrl }: StreamChatInput): AsyncIterable<string> {
    const lastUserMessage = [...messages].reverse().find((m) => m.role === "user")?.content ?? "";
    const crop = farmerContext.mainCrops?.[0] ?? "your crop";
    const place = farmerContext.village ?? farmerContext.district ?? "your area";

    const reply = imageUrl
      ? `Thanks for the photo, ${farmerContext.name}! Based on what I can see, keep an eye on leaf discoloration and spacing around your ${crop} in ${place}. ` +
        `For a precise diagnosis, try the **Crop Disease Detection** tool, or describe the symptoms here (leaf color, spots, wilting pattern) and I'll suggest next steps.\n\n` +
        `_(Note: this is a demo response — connect an OPENAI_API_KEY or GEMINI_API_KEY to get real AI-generated answers.)_`
      : `Hi ${farmerContext.name}! About "${lastUserMessage.slice(0, 120)}" — for ${crop} in ${place}, ` +
        `here's a general pointer: check soil moisture before irrigating, watch for pest activity in the early morning, and time fertilizer application to the current growth stage.\n\n` +
        `Here are a couple of things I'd normally personalize further with a live model:\n\n` +
        `1. Weather-adjusted irrigation timing for ${place}\n` +
        `2. Crop-stage-specific fertilizer dose for ${crop}\n\n` +
        `_(Note: this is a demo response — connect an OPENAI_API_KEY or GEMINI_API_KEY in apps/api/.env to get real AI-generated answers.)_`;

    const words = reply.split(" ");
    for (const word of words) {
      await sleep(18);
      yield word + " ";
    }
  }
}
