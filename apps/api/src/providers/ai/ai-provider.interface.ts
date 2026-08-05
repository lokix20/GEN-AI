import type { FarmerContextDTO } from "@haritha/shared-types";

export interface ChatTurn {
  role: "user" | "assistant";
  content: string;
}

export interface StreamChatInput {
  messages: ChatTurn[];
  farmerContext: FarmerContextDTO;
  imageUrl?: string | null;
}

export interface AIProvider {
  streamChat(input: StreamChatInput): AsyncIterable<string>;
}

export function buildSystemPrompt(context: FarmerContextDTO): string {
  const location = [context.village, context.district, context.state].filter(Boolean).join(", ");
  const crops = context.mainCrops?.length ? context.mainCrops.join(", ") : "not specified";

  return [
    "You are Haritha Sahayak, an AI farming assistant for Indian farmers.",
    `You are speaking with ${context.name}${location ? `, based in ${location}` : ""}.`,
    `Their main crops are: ${crops}. Soil type: ${context.soilType ?? "unknown"}.`,
    context.experienceYears != null ? `They have ${context.experienceYears} years of farming experience.` : "",
    `Respond in ${context.preferredLanguage === "hi" ? "Hindi" : "English"}, in a conversational, localized, and actionable way.`,
    "Give specific, practical advice grounded in the farmer's actual crops and location rather than generic answers. Keep responses concise and well-formatted with markdown when helpful.",
  ]
    .filter(Boolean)
    .join(" ");
}
