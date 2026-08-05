import { useNavigate } from "react-router-dom";
import { Pin, PinOff, Plus, Trash2 } from "lucide-react";
import type { ChatSessionDTO } from "@haritha/shared-types";
import { Button } from "../../../components/ui/button";
import { ScrollArea } from "../../../components/ui/scroll-area";
import { cn } from "../../../lib/utils";
import { useChatSessionMutations, useChatSessions } from "../useChat";

export function ChatSessionList({ activeSessionId, onSelect }: { activeSessionId?: string; onSelect?: () => void }) {
  const navigate = useNavigate();
  const { data: sessions, isLoading } = useChatSessions();
  const { togglePin, remove } = useChatSessionMutations();

  return (
    <div className="flex h-full flex-col gap-3">
      <Button
        variant="outline"
        className="w-full justify-start gap-2"
        onClick={() => {
          navigate("/chat");
          onSelect?.();
        }}
      >
        <Plus className="h-4 w-4" />
        New chat
      </Button>

      <ScrollArea className="flex-1">
        <div className="space-y-1 pr-2">
          {isLoading && <p className="px-2 text-xs text-muted-foreground">Loading...</p>}
          {sessions?.map((session: ChatSessionDTO) => (
            <div
              key={session.id}
              className={cn(
                "group flex items-center gap-1 rounded-2xl px-2 py-1.5 transition-colors",
                session.id === activeSessionId ? "bg-forest/10" : "hover:bg-muted",
              )}
            >
              <button
                className="min-w-0 flex-1 truncate text-left text-sm"
                onClick={() => {
                  navigate(`/chat/${session.id}`);
                  onSelect?.();
                }}
              >
                {session.title}
              </button>
              <button
                className="opacity-0 transition-opacity group-hover:opacity-100"
                onClick={() => togglePin.mutate({ id: session.id, isPinned: !session.isPinned })}
                aria-label="Pin chat"
              >
                {session.isPinned ? <PinOff className="h-3.5 w-3.5" /> : <Pin className="h-3.5 w-3.5" />}
              </button>
              <button
                className="opacity-0 text-destructive transition-opacity group-hover:opacity-100"
                onClick={() => remove.mutate(session.id)}
                aria-label="Delete chat"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}
