import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mic, MicOff } from "lucide-react";
import { Button } from "../ui/button";
import { useSpeechRecognition } from "../../hooks/useSpeechRecognition";
import { cn } from "../../lib/utils";

interface VoiceInputButtonProps {
  lang: string;
  onTranscriptChange: (text: string) => void;
  className?: string;
}

export function VoiceInputButton({ lang, onTranscriptChange, className }: VoiceInputButtonProps) {
  const { isSupported, isListening, transcript, start, stop } = useSpeechRecognition(lang === "hi" ? "hi-IN" : "en-IN");

  useEffect(() => {
    if (isListening) onTranscriptChange(transcript);
  }, [transcript, isListening, onTranscriptChange]);

  if (!isSupported) return null;

  return (
    <div className={cn("relative", className)}>
      <AnimatePresence>
        {isListening && (
          <motion.span
            className="absolute inset-0 rounded-full bg-destructive/30"
            initial={{ scale: 1, opacity: 0.6 }}
            animate={{ scale: 1.8, opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{ repeat: Infinity, duration: 1.2 }}
          />
        )}
      </AnimatePresence>
      <Button
        type="button"
        variant={isListening ? "destructive" : "outline"}
        size="icon"
        className="relative"
        onClick={() => (isListening ? stop() : start())}
        aria-label={isListening ? "Stop voice input" : "Start voice input"}
      >
        {isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
      </Button>
    </div>
  );
}
