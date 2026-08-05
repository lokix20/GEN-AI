import { useCallback, useRef, useState } from "react";
import { ImagePlus, Send, Square, X } from "lucide-react";
import { toast } from "sonner";
import { Button } from "../../../components/ui/button";
import { Textarea } from "../../../components/ui/textarea";
import { VoiceInputButton } from "../../../components/shared/VoiceInputButton";
import { getApiErrorMessage } from "../../../lib/apiClient";
import { uploadChatImage } from "../api";

interface ChatComposerProps {
  onSend: (content: string, imageUrl?: string | null) => void;
  isStreaming: boolean;
  onStop: () => void;
  language: string;
}

export function ChatComposer({ onSend, isStreaming, onStop, language }: ChatComposerProps) {
  const [text, setText] = useState("");
  const [imagePreview, setImagePreview] = useState<{ url: string; localPreview: string } | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback(async (file: File) => {
    const localPreview = URL.createObjectURL(file);
    setIsUploading(true);
    try {
      const { url } = await uploadChatImage(file);
      setImagePreview({ url, localPreview });
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Could not upload image"));
      URL.revokeObjectURL(localPreview);
    } finally {
      setIsUploading(false);
    }
  }, []);

  const handleSend = () => {
    if (isStreaming || isUploading) return;
    if (!text.trim() && !imagePreview) return;
    onSend(text.trim(), imagePreview?.url ?? null);
    setText("");
    setImagePreview(null);
  };

  return (
    <div className="glass-card p-3">
      {imagePreview && (
        <div className="relative mb-2 inline-block">
          <img src={imagePreview.localPreview} alt="Attachment preview" className="h-20 rounded-xl object-cover" />
          <button
            className="absolute -right-2 -top-2 rounded-full bg-destructive p-1 text-destructive-foreground"
            onClick={() => setImagePreview(null)}
            aria-label="Remove image"
          >
            <X className="h-3 w-3" />
          </button>
        </div>
      )}

      <div className="flex items-end gap-2">
        <Button
          type="button"
          variant="ghost"
          size="icon"
          disabled={isUploading}
          onClick={() => fileInputRef.current?.click()}
          aria-label="Attach image"
        >
          <ImagePlus className="h-5 w-5" />
        </Button>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) handleFile(file);
            e.target.value = "";
          }}
        />

        <Textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleSend();
            }
          }}
          placeholder="Ask about your crops, weather, or schemes..."
          className="min-h-[44px] flex-1 resize-none"
          rows={1}
        />

        <VoiceInputButton lang={language} onTranscriptChange={setText} />

        {isStreaming ? (
          <Button type="button" variant="destructive" size="icon" onClick={onStop} aria-label="Stop">
            <Square className="h-4 w-4" />
          </Button>
        ) : (
          <Button type="button" size="icon" onClick={handleSend} disabled={isUploading} aria-label="Send">
            <Send className="h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  );
}
