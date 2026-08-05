import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { History } from "lucide-react";
import { Card } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Dialog, DialogContent } from "../../components/ui/dialog";
import { ChatSessionList } from "../../features/chat/components/ChatSessionList";
import { ChatMessageBubble } from "../../features/chat/components/ChatMessageBubble";
import { ChatComposer } from "../../features/chat/components/ChatComposer";
import { useChat } from "../../features/chat/useChat";
import { fetchFarmerProfile } from "../../features/profile/api";
import { useAuthStore } from "../../store/auth.store";

const SUGGESTED_QUESTIONS = [
  "Why are my rice leaves turning yellow?",
  "Best fertilizer for tomato?",
  "Will it rain tomorrow?",
  "Government schemes for paddy farmers.",
];

export function ChatPage() {
  const { sessionId } = useParams<{ sessionId: string }>();
  const navigate = useNavigate();
  const role = useAuthStore((s) => s.user?.role);
  const [mobileHistoryOpen, setMobileHistoryOpen] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  const { data: profile } = useQuery({
    queryKey: ["farmer-profile"],
    queryFn: fetchFarmerProfile,
    enabled: role === "FARMER",
  });
  const language = profile?.preferredLanguage ?? "en";

  const { messages, isLoadingMessages, isStreaming, sendMessage, stopStreaming } = useChat(sessionId, (session) => {
    navigate(`/chat/${session.id}`, { replace: true });
  });

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="grid h-[calc(100vh-7rem)] gap-4 md:grid-cols-[260px_1fr]">
      <Card className="hidden p-3 md:block">
        <ChatSessionList activeSessionId={sessionId} />
      </Card>

      <div className="flex min-h-0 flex-col gap-3">
        <div className="flex items-center justify-between md:hidden">
          <Button variant="outline" size="sm" onClick={() => setMobileHistoryOpen(true)}>
            <History className="mr-2 h-4 w-4" />
            History
          </Button>
        </div>

        <div className="flex-1 overflow-y-auto rounded-2xl">
          {!isLoadingMessages && messages.length === 0 && (
            <div className="flex h-full flex-col items-center justify-center gap-4 p-6 text-center">
              <p className="text-sm text-muted-foreground">Ask me anything about your farm.</p>
              <div className="grid gap-2 sm:grid-cols-2">
                {SUGGESTED_QUESTIONS.map((q) => (
                  <button
                    key={q}
                    onClick={() => sendMessage(q)}
                    className="glass-card px-4 py-3 text-left text-sm transition-transform hover:-translate-y-0.5"
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="space-y-4 p-1">
            {messages.map((message) => (
              <ChatMessageBubble key={message.id} message={message} language={language} />
            ))}
          </div>
          <div ref={bottomRef} />
        </div>

        <ChatComposer onSend={sendMessage} isStreaming={isStreaming} onStop={stopStreaming} language={language} />
      </div>

      <Dialog open={mobileHistoryOpen} onOpenChange={setMobileHistoryOpen}>
        <DialogContent className="max-w-xs p-4">
          <ChatSessionList activeSessionId={sessionId} onSelect={() => setMobileHistoryOpen(false)} />
        </DialogContent>
      </Dialog>
    </div>
  );
}
