import { useCallback, useRef, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { ChatMessageDTO, ChatSessionDTO } from "@haritha/shared-types";
import { streamSSE } from "../../lib/sseClient";
import * as chatApi from "./api";

export interface PendingMessage extends ChatMessageDTO {
  isStreaming?: boolean;
}

export function useChatSessions() {
  return useQuery({ queryKey: ["chat-sessions"], queryFn: chatApi.listChatSessions });
}

export function useChatSessionMutations() {
  const queryClient = useQueryClient();

  const togglePin = useMutation({
    mutationFn: ({ id, isPinned }: { id: string; isPinned: boolean }) => chatApi.updateChatSession(id, { isPinned }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["chat-sessions"] }),
  });

  const remove = useMutation({
    mutationFn: (id: string) => chatApi.deleteChatSession(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["chat-sessions"] }),
  });

  return { togglePin, remove };
}

export function useChat(sessionId: string | undefined, onSessionCreated: (session: ChatSessionDTO) => void) {
  const queryClient = useQueryClient();
  const [streamingMessage, setStreamingMessage] = useState<PendingMessage | null>(null);
  const [pendingUserMessage, setPendingUserMessage] = useState<ChatMessageDTO | null>(null);
  const [isStreaming, setIsStreaming] = useState(false);
  const abortRef = useRef<AbortController | null>(null);

  const messagesQuery = useQuery({
    queryKey: ["chat-messages", sessionId],
    queryFn: () => chatApi.listChatMessages(sessionId!),
    enabled: Boolean(sessionId),
  });

  const sendMessage = useCallback(
    async (content: string, imageUrl?: string | null) => {
      const controller = new AbortController();
      abortRef.current = controller;
      setIsStreaming(true);
      setStreamingMessage({
        id: "streaming",
        sessionId: sessionId ?? "",
        role: "assistant",
        content: "",
        imageUrl: null,
        createdAt: new Date().toISOString(),
        isStreaming: true,
      });

      let fullText = "";

      try {
        for await (const { event, data } of streamSSE(
          "/api/chat/stream",
          { sessionId: sessionId ?? null, content, imageUrl: imageUrl ?? null },
          controller.signal,
        )) {
          if (event === "init") {
            const payload = data as { session: ChatSessionDTO; userMessage: ChatMessageDTO };
            setPendingUserMessage(payload.userMessage);
            if (!sessionId) onSessionCreated(payload.session);
          } else if (event === "chunk") {
            fullText += (data as { delta: string }).delta;
            setStreamingMessage((prev) => (prev ? { ...prev, content: fullText } : prev));
          } else if (event === "done") {
            queryClient.invalidateQueries({ queryKey: ["chat-messages", sessionId] });
            queryClient.invalidateQueries({ queryKey: ["chat-sessions"] });
          } else if (event === "error") {
            throw new Error((data as { message: string }).message);
          }
        }
      } finally {
        setIsStreaming(false);
        setStreamingMessage(null);
        setPendingUserMessage(null);
      }
    },
    [sessionId, onSessionCreated, queryClient],
  );

  const stopStreaming = useCallback(() => {
    abortRef.current?.abort();
    setIsStreaming(false);
  }, []);

  const messages: PendingMessage[] = [
    ...(messagesQuery.data ?? []),
    ...(pendingUserMessage ? [pendingUserMessage] : []),
    ...(streamingMessage ? [streamingMessage] : []),
  ];

  return {
    messages,
    isLoadingMessages: messagesQuery.isLoading,
    isStreaming,
    sendMessage,
    stopStreaming,
  };
}
