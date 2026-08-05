import { motion } from "framer-motion";
import { Leaf, User, Volume2, Square } from "lucide-react";
import { MarkdownRenderer } from "../../../components/shared/MarkdownRenderer";
import { Button } from "../../../components/ui/button";
import { cn } from "../../../lib/utils";
import { useSpeechSynthesis } from "../../../hooks/useSpeechSynthesis";
import type { PendingMessage } from "../useChat";

export function ChatMessageBubble({ message, language }: { message: PendingMessage; language: string }) {
  const isUser = message.role === "user";
  const { isSupported, isSpeaking, speak, cancel } = useSpeechSynthesis();

  const langLabel = language === "te" ? "Telugu" : language === "hi" ? "Hindi" : "English";

  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn("flex gap-3", isUser && "flex-row-reverse")}
    >
      <div
        className={cn(
          "flex h-8 w-8 shrink-0 items-center justify-center rounded-2xl",
          isUser ? "bg-[#236A43] text-white" : "bg-[#0F2B1D] text-[#D4E7D7]",
        )}
      >
        {isUser ? <User className="h-4 w-4" /> : <Leaf className="h-4 w-4" />}
      </div>

      <div className={cn("glass-card max-w-[85%] px-4 py-3 rounded-2xl text-left shadow-sm", isUser ? "bg-[#E4F2E9] border-[#D6E4DB]" : "bg-white border-[#E8E2D9]")}>
        {message.imageUrl && (
          <img src={message.imageUrl} alt="Attachment" className="mb-2 max-h-56 rounded-xl object-contain border border-[#E8E2D9]" />
        )}
        {message.content ? (
          <>
            <MarkdownRenderer content={message.content} />
            {!isUser && isSupported && !message.isStreaming && (
              <div className="mt-2.5 pt-2 border-t border-[#E8E2D9] flex items-center justify-between">
                <Button
                  variant="outline"
                  size="sm"
                  className={cn(
                    "h-7 px-2.5 text-[11px] font-bold rounded-lg flex items-center gap-1.5 transition",
                    isSpeaking
                      ? "border-red-500 text-red-600 bg-red-50 hover:bg-red-100"
                      : "border-[#236A43] text-[#236A43] bg-[#E4F2E9]/60 hover:bg-[#E4F2E9]"
                  )}
                  onClick={() => (isSpeaking ? cancel() : speak(message.content, language))}
                >
                  {isSpeaking ? (
                    <>
                      <Square className="h-3 w-3 fill-current" />
                      <span>Stop voice</span>
                    </>
                  ) : (
                    <>
                      <Volume2 className="h-3.5 w-3.5" />
                      <span>Listen in {langLabel}</span>
                    </>
                  )}
                </Button>
                {isSpeaking && (
                  <div className="flex items-center gap-0.5 h-3">
                    <span className="w-1 h-3 bg-[#236A43] rounded-full animate-bounce [animation-delay:-0.3s]" />
                    <span className="w-1 h-3 bg-[#236A43] rounded-full animate-bounce [animation-delay:-0.15s]" />
                    <span className="w-1 h-3 bg-[#236A43] rounded-full animate-bounce" />
                  </div>
                )}
              </div>
            )}
          </>
        ) : message.isStreaming ? (
          <span className="flex gap-1 py-1">
            <span className="h-2 w-2 animate-bounce rounded-full bg-[#236A43] [animation-delay:-0.3s]" />
            <span className="h-2 w-2 animate-bounce rounded-full bg-[#236A43] [animation-delay:-0.15s]" />
            <span className="h-2 w-2 animate-bounce rounded-full bg-[#236A43]" />
          </span>
        ) : null}
      </div>
    </motion.div>
  );
}
