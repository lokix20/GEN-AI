import type { ChatMessageDTO, ChatSessionDTO, FarmerContextDTO, SendMessageInput } from "@haritha/shared-types";
import { HttpError } from "../../middleware/error.middleware.js";
import { queryOne } from "../../lib/db.js";
import { getAIProvider } from "../../providers/ai/factory.js";
import type { ChatTurn } from "../../providers/ai/ai-provider.interface.js";
import * as repo from "./repository.js";

function toSessionDTO(session: {
  id: string;
  title: string;
  isPinned: boolean;
  createdAt: Date;
  updatedAt: Date;
  messages?: { content: string }[];
}): ChatSessionDTO {
  return {
    id: session.id,
    title: session.title,
    isPinned: session.isPinned,
    createdAt: session.createdAt.toISOString(),
    updatedAt: session.updatedAt.toISOString(),
    lastMessage: session.messages?.[0]?.content ?? null,
  };
}

function toMessageDTO(message: { id: string; sessionId: string; role: string; content: string; imageUrl: string | null; createdAt: Date }): ChatMessageDTO {
  return {
    id: message.id,
    sessionId: message.sessionId,
    role: message.role === "assistant" ? "assistant" : "user",
    content: message.content,
    imageUrl: message.imageUrl,
    createdAt: message.createdAt.toISOString(),
  };
}

export async function listSessions(userId: string): Promise<ChatSessionDTO[]> {
  const sessions = await repo.listSessions(userId);
  return sessions.map(toSessionDTO);
}

export async function listMessages(userId: string, sessionId: string): Promise<ChatMessageDTO[]> {
  const session = await repo.findSession(userId, sessionId);
  if (!session) throw new HttpError(404, "Chat session not found");
  const messages = await repo.listMessages(sessionId);
  return messages.map(toMessageDTO);
}

export async function updateSession(userId: string, sessionId: string, data: { title?: string; isPinned?: boolean }): Promise<ChatSessionDTO> {
  const session = await repo.findSession(userId, sessionId);
  if (!session) throw new HttpError(404, "Chat session not found");
  const updated = await repo.updateSession(sessionId, data);
  return toSessionDTO(updated);
}

export async function deleteSession(userId: string, sessionId: string): Promise<void> {
  const session = await repo.findSession(userId, sessionId);
  if (!session) throw new HttpError(404, "Chat session not found");
  await repo.deleteSession(sessionId);
}

async function loadFarmerContext(userId: string): Promise<FarmerContextDTO> {
  const user = await queryOne(`SELECT * FROM "User" WHERE id = $1`, [userId]);
  if (!user) throw new HttpError(404, "User not found");

  const profile = await queryOne(`SELECT * FROM "FarmerProfile" WHERE "userId" = $1`, [userId]);
  return {
    name: user.name,
    state: profile?.state ?? undefined,
    district: profile?.district ?? undefined,
    village: profile?.village ?? undefined,
    mainCrops: profile?.mainCrops,
    soilType: profile?.soilType ?? undefined,
    preferredLanguage: profile?.preferredLanguage ?? "en",
    experienceYears: profile?.experienceYears ?? undefined,
  };
}

function deriveTitle(content: string): string {
  const trimmed = content.trim().replace(/\s+/g, " ");
  return trimmed.length > 48 ? `${trimmed.slice(0, 48)}...` : trimmed || "New chat";
}

export interface StreamedReply {
  session: ChatSessionDTO;
  userMessage: ChatMessageDTO;
  chunks: AsyncIterable<string>;
  onComplete: (fullText: string) => Promise<ChatMessageDTO>;
}

export async function startReply(userId: string, input: SendMessageInput): Promise<StreamedReply> {
  let session = input.sessionId ? await repo.findSession(userId, input.sessionId) : null;
  const isNewSession = !session;
  if (!session) {
    session = await repo.createSession(userId, deriveTitle(input.content));
  }

  const userMessage = await repo.createMessage({
    sessionId: session.id,
    role: "user",
    content: input.content,
    imageUrl: input.imageUrl ?? null,
  });

  const history = await repo.listMessages(session.id);
  const turns: ChatTurn[] = history.map((m) => ({ role: m.role === "assistant" ? "assistant" : "user", content: m.content }));
  const farmerContext = await loadFarmerContext(userId);

  const chunks = getAIProvider().streamChat({ messages: turns, farmerContext, imageUrl: input.imageUrl });

  const sessionId = session.id;
  const onComplete = async (fullText: string): Promise<ChatMessageDTO> => {
    const assistantMessage = await repo.createMessage({ sessionId, role: "assistant", content: fullText });
    await repo.touchSession(sessionId);
    return toMessageDTO(assistantMessage);
  };

  return {
    session: toSessionDTO(isNewSession ? session : { ...session, messages: undefined }),
    userMessage: toMessageDTO(userMessage),
    chunks,
    onComplete,
  };
}
