import type { ChatMessageDTO, ChatSessionDTO } from "@haritha/shared-types";
import { apiClient } from "../../lib/apiClient";

export async function listChatSessions(): Promise<ChatSessionDTO[]> {
  try {
    const { data } = await apiClient.get("/chat/sessions");
    return data.sessions;
  } catch (err) {
    return [];
  }
}

export async function listChatMessages(sessionId: string): Promise<ChatMessageDTO[]> {
  try {
    const { data } = await apiClient.get(`/chat/sessions/${sessionId}/messages`);
    return data.messages;
  } catch (err) {
    return [];
  }
}

export async function updateChatSession(sessionId: string, patch: { title?: string; isPinned?: boolean }): Promise<ChatSessionDTO> {
  const { data } = await apiClient.patch(`/chat/sessions/${sessionId}`, patch);
  return data.session;
}

export async function deleteChatSession(sessionId: string): Promise<void> {
  try {
    await apiClient.delete(`/chat/sessions/${sessionId}`);
  } catch {
    /* ignore unauthenticated delete error */
  }
}

export async function uploadChatImage(file: File): Promise<{ url: string; key: string }> {
  const formData = new FormData();
  formData.append("file", file);
  const { data } = await apiClient.post("/uploads/image", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data;
}
