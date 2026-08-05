import { z } from "zod";

export const ChatMessageDTOSchema = z.object({
  id: z.string(),
  sessionId: z.string(),
  role: z.enum(["user", "assistant"]),
  content: z.string(),
  imageUrl: z.string().nullable().optional(),
  createdAt: z.string(),
});
export type ChatMessageDTO = z.infer<typeof ChatMessageDTOSchema>;

export const ChatSessionDTOSchema = z.object({
  id: z.string(),
  title: z.string(),
  isPinned: z.boolean(),
  createdAt: z.string(),
  updatedAt: z.string(),
  lastMessage: z.string().nullable().optional(),
});
export type ChatSessionDTO = z.infer<typeof ChatSessionDTOSchema>;

export const SendMessageSchema = z.object({
  sessionId: z.string().nullable(),
  content: z.string().min(1, "Message cannot be empty"),
  imageUrl: z.string().nullable().optional(),
});
export type SendMessageInput = z.infer<typeof SendMessageSchema>;
