import type { FarmerContextDTO } from "@haritha/shared-types";

export interface ChatTurn {
  role: "user" | "assistant";
  content: string;
}

export interface StreamChatInput {
  messages: ChatTurn[];
  farmerContext: FarmerContextDTO;
  imageUrl?: string | null;
  /** Language picked in the chat UI for this turn; overrides the saved profile preference. */
  language?: string | null;
}

export interface AIProvider {
  streamChat(input: StreamChatInput): AsyncIterable<string>;
}

const LANGUAGE_NAMES: Record<string, string> = {
  te: "Telugu",
  hi: "Hindi",
  en: "English",
};

export function buildSystemPrompt(context: FarmerContextDTO, language?: string | null): string {
  const location = [context.village, context.district, context.state].filter(Boolean).join(", ");
  const crops = context.mainCrops?.length ? context.mainCrops.join(", ") : "not specified";
  const langCode = language ?? context.preferredLanguage ?? "en";
  const langName = LANGUAGE_NAMES[langCode] ?? "English";

  return [
    "You are Haritha Sahayak, an AI farming assistant for Indian farmers.",
    `You are speaking with ${context.name}${location ? `, based in ${location}` : ""}.`,
    `Their main crops are: ${crops}. Soil type: ${context.soilType ?? "unknown"}.`,
    context.experienceYears != null ? `They have ${context.experienceYears} years of farming experience.` : "",
    `Respond in ${langName}, in a conversational, localized, and actionable way.`,
    langName !== "English"
      ? `Write your entire answer in ${langName} script. Keep well-known agricultural terms, chemical names, scheme names and numbers in their standard form so they stay recognisable.`
      : "",
    "Give specific, practical advice grounded in the farmer's actual crops and location rather than generic answers. Keep responses concise and well-formatted with markdown when helpful.",
  ]
    .filter(Boolean)
    .join(" ");
}
