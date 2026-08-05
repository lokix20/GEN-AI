import { motion } from "framer-motion";
import { Leaf, User, Volume2 } from "lucide-react";
import { MarkdownRenderer } from "../../../components/shared/MarkdownRenderer";
import { Button } from "../../../components/ui/button";
import { cn } from "../../../lib/utils";
import { useSpeechSynthesis } from "../../../hooks/useSpeechSynthesis";
import type { PendingMessage } from "../useChat";

export function ChatMessageBubble({ message, language }: { message: PendingMessage; language: string }) {
  const isUser = message.role === "user";
  const { isSupported, speak } = useSpeechSynthesis();

  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn("flex gap-3", isUser && "flex-row-reverse")}
    >
      <div
        className={cn(
          "flex h-8 w-8 shrink-0 items-center justify-center rounded-2xl",
          isUser ? "bg-leaf text-leaf-foreground" : "bg-forest text-forest-foreground",
        )}
      >
        {isUser ? <User className="h-4 w-4" /> : <Leaf className="h-4 w-4" />}
      </div>

      <div className={cn("glass-card max-w-[80%] px-4 py-3", isUser && "bg-forest/5")}>
        {message.imageUrl && (
          <img src={message.imageUrl} alt="Attachment" className="mb-2 max-h-56 rounded-xl object-contain" />
        )}
        {message.content ? (
          <>
            <MarkdownRenderer content={message.content} />
            {!isUser && isSupported && !message.isStreaming && (
              <Button
                variant="ghost"
                size="icon"
                className="mt-1 h-6 w-6"
                onClick={() => speak(message.content, language)}
                aria-label="Read aloud"
              >
                <Volume2 className="h-3.5 w-3.5" />
              </Button>
            )}
          </>
        ) : message.isStreaming ? (
          <span className="flex gap-1">
            <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-muted-foreground [animation-delay:-0.3s]" />
            <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-muted-foreground [animation-delay:-0.15s]" />
            <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-muted-foreground" />
          </span>
        ) : null}
      </div>
    </motion.div>
  );
}
