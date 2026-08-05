import { useCallback, useEffect, useRef, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { ChatLanguage, ChatMessageDTO, ChatSessionDTO } from "@haritha/shared-types";
import { streamSSE } from "../../lib/sseClient";
import * as chatApi from "./api";

export interface PendingMessage extends ChatMessageDTO {
  isStreaming?: boolean;
}

export interface SendMessageOptions {
  content: string;
  imageUrl?: string | null;
  language?: ChatLanguage;
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

function isAbort(error: unknown): boolean {
  return error instanceof Error && (error.name === "AbortError" || error.message === "aborted");
}

export function useChat(sessionId: string | undefined, onSessionCreated: (session: ChatSessionDTO) => void) {
  const queryClient = useQueryClient();
  const [streamingMessage, setStreamingMessage] = useState<PendingMessage | null>(null);
  const [pendingUserMessage, setPendingUserMessage] = useState<ChatMessageDTO | null>(null);
  const [isStreaming, setIsStreaming] = useState(false);
  const abortRef = useRef<AbortController | null>(null);

  // The session the current stream actually belongs to. A brand-new chat has no id until the
  // server sends `init`, so the id captured in sendMessage's closure can't be used for cache writes.
  const activeSessionIdRef = useRef<string | undefined>(sessionId);
  useEffect(() => {
    activeSessionIdRef.current = sessionId;
  }, [sessionId]);

  const messagesQuery = useQuery({
    queryKey: ["chat-messages", sessionId],
    queryFn: () => chatApi.listChatMessages(sessionId!),
    enabled: Boolean(sessionId),
  });

  const sendMessage = useCallback(
    async ({ content, imageUrl, language }: SendMessageOptions) => {
      // Abort any stream still running so two replies can't interleave.
      abortRef.current?.abort();
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

      let userMessage: ChatMessageDTO | null = null;
      let fullText = "";

      try {
        for await (const { event, data } of streamSSE(
          "/api/chat/stream",
          { sessionId: sessionId ?? null, content, imageUrl: imageUrl ?? null, language },
          controller.signal,
        )) {
          if (event === "init") {
            const payload = data as { session: ChatSessionDTO; userMessage: ChatMessageDTO };
            userMessage = payload.userMessage;
            activeSessionIdRef.current = payload.session.id;
            setPendingUserMessage(payload.userMessage);
            if (!sessionId) onSessionCreated(payload.session);
          } else if (event === "chunk") {
            fullText += (data as { delta: string }).delta;
            setStreamingMessage((prev) => (prev ? { ...prev, content: fullText } : prev));
          } else if (event === "done") {
            const assistantMessage = (data as { message: ChatMessageDTO }).message;
            const finalSessionId = activeSessionIdRef.current;

            if (finalSessionId) {
              // Seed the cache synchronously so the finished reply never blinks out between
              // clearing the streaming bubble and the refetch landing.
              queryClient.setQueryData<ChatMessageDTO[]>(["chat-messages", finalSessionId], (old) => {
                const merged = [...(old ?? [])];
                for (const message of [userMessage, assistantMessage]) {
                  if (message && !merged.some((m) => m.id === message.id)) merged.push(message);
                }
                return merged;
              });
              queryClient.invalidateQueries({ queryKey: ["chat-messages", finalSessionId] });
            }
            queryClient.invalidateQueries({ queryKey: ["chat-sessions"] });
          } else if (event === "error") {
            throw new Error((data as { message: string }).message);
          }
        }
      } catch (error) {
        if (isAbort(error)) {
          // The server persists whatever it streamed before the disconnect, so pull that in.
          const finalSessionId = activeSessionIdRef.current;
          if (finalSessionId) queryClient.invalidateQueries({ queryKey: ["chat-messages", finalSessionId] });
          queryClient.invalidateQueries({ queryKey: ["chat-sessions"] });
          return;
        }
        throw error;
      } finally {
        abortRef.current = null;
        setIsStreaming(false);
        setStreamingMessage(null);
        setPendingUserMessage(null);
      }
    },
    [sessionId, onSessionCreated, queryClient],
  );

  const stopStreaming = useCallback(() => {
    abortRef.current?.abort();
  }, []);

  // Server data plus the optimistic user/assistant bubbles, de-duplicated by id: once a new
  // session's fetch lands, the pending user message is already in the server list.
  const messages: PendingMessage[] = [];
  const seenIds = new Set<string>();
  for (const message of [...(messagesQuery.data ?? []), pendingUserMessage, streamingMessage]) {
    if (!message || seenIds.has(message.id)) continue;
    seenIds.add(message.id);
    messages.push(message);
  }

  return {
    messages,
    isLoadingMessages: messagesQuery.isLoading,
    isStreaming,
    sendMessage,
    stopStreaming,
  };
}
