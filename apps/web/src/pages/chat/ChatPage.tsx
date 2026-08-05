import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { Star, Trash2, Square } from "lucide-react";
import type { ChatLanguage, ChatSessionDTO } from "@haritha/shared-types";
import { ChatMessageBubble } from "../../features/chat/components/ChatMessageBubble.js";
import { useChat, useChatSessions, useChatSessionMutations } from "../../features/chat/useChat.js";
import { uploadChatImage } from "../../features/chat/api.js";
import { fetchFarmerProfile } from "../../features/profile/api.js";
import { useAuthStore } from "../../store/auth.store.js";
import { useSpeechRecognition } from "../../hooks/useSpeechRecognition.js";
import { getApiErrorMessage } from "../../lib/apiClient.js";
import { cn } from "../../lib/utils.js";
import { Dialog, DialogContent } from "../../components/ui/dialog.js";

const SUGGESTIONS = [
  { tag: "DIAGNOSE", tagColor: "#1B7A4B", prompt: "Why are my rice leaves turning yellow?" },
  { tag: "SELL", tagColor: "#C27D00", prompt: "Is this a good week to sell paddy?" },
  { tag: "PLAN", tagColor: "#3B6FA8", prompt: "Will it rain before Thursday?" },
  { tag: "CLAIM", tagColor: "#1B7A4B", prompt: "Which schemes am I eligible for?" },
];

const MIC_HINT: Record<ChatLanguage, string> = {
  te: "Tap the mic to speak in Telugu · tap Listen on any answer to hear it",
  hi: "Tap the mic to speak in Hindi · tap Listen on any answer to hear it",
  en: "Tap the mic to speak in English · tap Listen on any answer to hear it",
};

export function ChatPage() {
  const { sessionId } = useParams<{ sessionId: string }>();
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);
  const role = user?.role;
  const bottomRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [activeLang, setActiveLang] = useState<ChatLanguage>("te");
  const [inputText, setInputText] = useState("");
  const [imagePreview, setImagePreview] = useState<{ url: string; localPreview: string } | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [mobileHistoryOpen, setMobileHistoryOpen] = useState(false);

  const { data: sessions, isLoading: isLoadingSessions } = useChatSessions();
  const { togglePin, remove } = useChatSessionMutations();

  const speechLang = activeLang === "te" ? "te-IN" : activeLang === "hi" ? "hi-IN" : "en-IN";
  const { isListening, transcript, start: startSpeech, stop: stopSpeech } = useSpeechRecognition(speechLang);

  const { data: profile } = useQuery({
    queryKey: ["farmer-profile"],
    queryFn: fetchFarmerProfile,
    enabled: role === "FARMER",
  });

  const handleSessionCreated = useCallback(
    (session: ChatSessionDTO) => {
      navigate(`/chat/${session.id}`, { replace: true });
    },
    [navigate],
  );

  const { messages, isLoadingMessages, isStreaming, sendMessage, stopStreaming } = useChat(
    sessionId,
    handleSessionCreated,
  );

  // Single funnel for every way a message can be sent, so failures always surface to the farmer.
  const submit = useCallback(
    async (content: string, imageUrl?: string | null) => {
      try {
        await sendMessage({ content, imageUrl, language: activeLang });
      } catch (error) {
        toast.error(getApiErrorMessage(error, "The assistant could not reply. Please try again."));
      }
    },
    [sendMessage, activeLang],
  );

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (isListening && transcript) setInputText(transcript);
  }, [transcript, isListening]);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

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
      e.target.value = "";
    }
  };

  const handleSend = () => {
    if (isStreaming || isUploading) return;
    const cleanText = inputText.trim();
    if (!cleanText && !imagePreview) return;

    if (isListening) stopSpeech();
    void submit(cleanText || "Please analyze this crop image.", imagePreview?.url ?? null);
    setInputText("");
    setImagePreview(null);
  };

  const handleNewChat = () => {
    if (isStreaming) stopStreaming();
    navigate("/chat");
    setInputText("");
    setImagePreview(null);
    setMobileHistoryOpen(false);
  };

  const handleDeleteSession = async (id: string) => {
    try {
      await remove.mutateAsync(id);
      if (id === sessionId) navigate("/chat", { replace: true });
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Could not delete this chat"));
    }
  };

  const allSessions = sessions ?? [];
  const savedSessions = allSessions.filter((s) => s.isPinned);
  const recentSessions = allSessions.filter((s) => !s.isPinned);

  const renderSessionRow = (session: ChatSessionDTO) => (
    <div
      key={session.id}
      className={cn(
        "group flex items-center gap-1 rounded-xl pr-1 transition",
        session.id === sessionId ? "bg-white shadow-sm" : "hover:bg-black/5",
      )}
    >
      <button
        onClick={() => {
          setMobileHistoryOpen(false);
          navigate(`/chat/${session.id}`);
        }}
        className={cn(
          "flex-1 text-[13.5px] font-semibold py-2.5 px-3 rounded-xl truncate text-left transition",
          session.id === sessionId ? "text-[#12261D]" : "text-[#5C6B62] group-hover:text-[#12261D]",
        )}
        title={session.title}
      >
        {session.title}
      </button>

      <button
        onClick={() => togglePin.mutate({ id: session.id, isPinned: !session.isPinned })}
        title={session.isPinned ? "Remove from saved" : "Save this answer"}
        className={cn(
          "p-1.5 rounded-lg shrink-0 transition",
          session.isPinned
            ? "text-[#C27D00] opacity-100"
            : "text-[#8B978F] opacity-0 group-hover:opacity-100 hover:text-[#12261D]",
        )}
      >
        <Star className={cn("h-3.5 w-3.5", session.isPinned && "fill-current")} />
      </button>

      <button
        onClick={() => void handleDeleteSession(session.id)}
        title="Delete this chat"
        className="p-1.5 rounded-lg shrink-0 text-[#8B978F] opacity-0 group-hover:opacity-100 hover:text-[#D94F4F] transition"
      >
        <Trash2 className="h-3.5 w-3.5" />
      </button>
    </div>
  );

  const renderSidebarContent = () => (
    <div className="flex h-full flex-col text-left py-6 px-4">
      <div className="flex-1 overflow-y-auto no-scrollbar space-y-8 pr-1">
        {isLoadingSessions ? (
          <div className="space-y-2">
            {[0, 1, 2].map((i) => (
              <div key={i} className="h-9 rounded-xl bg-black/5 animate-pulse" />
            ))}
          </div>
        ) : allSessions.length === 0 ? (
          <div className="text-[12.5px] font-medium text-[#8B978F] leading-relaxed px-2 pt-2">
            No conversations yet. Ask a question below and it will show up here.
          </div>
        ) : (
          <>
            {recentSessions.length > 0 && (
              <div className="flex flex-col gap-3">
                <div className="text-[10px] font-bold text-[#A2ADA5] tracking-widest uppercase ml-2">Recent</div>
                <div className="flex flex-col gap-1">{recentSessions.map(renderSessionRow)}</div>
              </div>
            )}

            {savedSessions.length > 0 && (
              <div className="flex flex-col gap-3">
                <div className="text-[10px] font-bold text-[#A2ADA5] tracking-widest uppercase ml-2">Saved Answers</div>
                <div className="flex flex-col gap-1">{savedSessions.map(renderSessionRow)}</div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Bottom Profile Details */}
      <div className="flex flex-col gap-1.5 text-left pt-6 mt-4 border-t border-[#DCDBD1]">
        <div className="text-[10px] font-bold text-[#A2ADA5] tracking-widest uppercase mb-1">Farm Context</div>
        <div className="text-[12.5px] text-[#5C6B62] font-semibold leading-relaxed">
          <div>
            {profile?.name || user?.name || "Ramesh Farm"} · {profile?.farmSizeAcres || "4.2"} ac
          </div>
          <div>{profile?.mainCrops?.join(" · ") || "Paddy · Tomato · Cotton"}</div>
          <div>
            {profile?.district || "Kadapa"}, {profile?.state || "Andhra Pradesh"}
          </div>
        </div>
        <button
          onClick={() => navigate("/onboarding")}
          className="text-[#1B7A4B] hover:underline text-[12px] font-bold text-left mt-1"
        >
          Edit context
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex flex-col h-screen w-full bg-[#F4F3EC] select-none text-left font-sans">

      {/* Full-width Top Header */}
      <header className="flex items-center justify-between px-6 py-4 border-b border-[#E4E3DA] shrink-0 bg-[#F4F3EC]">
        <div className="flex items-center gap-6">
          <h1 className="text-xl font-extrabold text-[#12261D] hidden md:block" style={{ fontFamily: "'Sora', sans-serif" }}>
            AI Assistant
          </h1>

          <button
            onClick={() => setMobileHistoryOpen(true)}
            className="md:hidden px-3 py-1.5 text-sm rounded-lg border border-[#DCDBD1] text-[#5C6B62] font-bold"
          >
            History
          </button>

          {/* Language selector pills */}
          <div className="flex items-center gap-1 bg-[#EBEAE2] p-1 rounded-xl border border-[#E4E3DA]">
            {([
              { key: "te", label: "తెలుగు" },
              { key: "hi", label: "हिंदी" },
              { key: "en", label: "English" },
            ] as const).map((lang) => (
              <button
                key={lang.key}
                onClick={() => setActiveLang(lang.key)}
                className={cn(
                  "px-4 py-1.5 rounded-lg text-[13px] font-bold transition duration-150",
                  activeLang === lang.key
                    ? "bg-white text-[#12261D] shadow-sm border border-[#DCDBD1]"
                    : "text-[#5C6B62] hover:text-[#12261D]",
                )}
              >
                {lang.label}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleNewChat}
            className="hidden sm:flex bg-white hover:bg-[#FAFAF7] text-[#12261D] border border-[#DCDBD1] rounded-xl py-2 px-4 items-center justify-center gap-2 text-[13px] font-bold shadow-sm transition"
          >
            + New chat
          </button>

          <div
            onClick={() => navigate("/")}
            className="w-9 h-9 rounded-xl bg-[#0F2419] text-[#9BD96B] flex items-center justify-center font-bold text-[13px] cursor-pointer hover:opacity-90 shadow-sm"
          >
            RF
          </div>
        </div>
      </header>

      {/* Main Split Content Area */}
      <div className="flex flex-1 overflow-hidden">
        <aside className="hidden md:flex w-[260px] h-full bg-[#EBEAE2] flex-col shrink-0 overflow-hidden">
          {renderSidebarContent()}
        </aside>

        {/* Right Chat Panel */}
        <div className="flex-1 flex flex-col h-full overflow-hidden bg-[#F4F3EC]">
          <div className="flex-1 overflow-y-auto flex flex-col no-scrollbar">
            {!isLoadingMessages && messages.length === 0 ? (
              // Welcome screen
              <div className="flex-1 flex flex-col items-center justify-center py-6 px-4 max-w-3xl mx-auto w-full text-center">
                <h2 style={{ fontFamily: "'Sora', sans-serif" }} className="text-3xl md:text-[34px] font-extrabold text-[#12261D] tracking-tight">
                  Namaskaram, {user?.name?.split(" ")[0] || "Ramesh"}
                </h2>
                <p className="text-[14.5px] text-[#5C6B62] font-medium mt-3 mb-10">
                  Ask about your crops — or just show me a photo of the problem.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full max-w-2xl mb-6">
                  {SUGGESTIONS.map((item) => (
                    <button
                      key={item.prompt}
                      onClick={() => void submit(item.prompt)}
                      disabled={isStreaming}
                      className="bg-white border border-[#E4E3DA] rounded-[20px] p-5 text-left hover:bg-[#FAF9F5] transition duration-200 shadow-sm flex flex-col gap-1.5 disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                      <span style={{ color: item.tagColor }} className="text-[10px] font-extrabold tracking-wider uppercase">
                        {item.tag}
                      </span>
                      <span className="text-[14.5px] font-bold text-[#12261D] leading-tight">{item.prompt}</span>
                    </button>
                  ))}
                </div>

                <div className="bg-[#E6F3E4] border border-[#CDE5C8] rounded-[20px] p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between w-full max-w-2xl gap-3">
                  <div className="flex items-center gap-4">
                    <div className="w-11 h-11 rounded-[14px] bg-[#12261D] flex items-center justify-center text-white text-xl shrink-0">
                      📷
                    </div>
                    <div className="text-left">
                      <div className="text-[14.5px] font-extrabold text-[#12261D]">Or just send a photo</div>
                      <div className="text-[12.5px] text-[#5C6B62] font-medium mt-0.5">
                        A clear shot of the leaf is faster than typing.
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="text-[#1B7A4B] font-extrabold text-[14.5px] hover:underline whitespace-nowrap self-end sm:self-auto px-2"
                  >
                    Open camera
                  </button>
                </div>
              </div>
            ) : (
              // Active chat feed
              <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-5 no-scrollbar max-w-4xl mx-auto w-full">
                {messages.map((message) => (
                  <ChatMessageBubble key={message.id} message={message} language={activeLang} />
                ))}
                <div ref={bottomRef} />
              </div>
            )}
          </div>

          <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleFileSelect} />

          {/* Bottom Input Composer */}
          <div className="p-4 max-w-3xl mx-auto w-full flex flex-col items-center gap-2 bg-[#F4F3EC] pb-6">
            {isStreaming && (
              <button
                onClick={stopStreaming}
                className="self-center flex items-center gap-1.5 bg-white border border-[#DCDBD1] hover:bg-[#FAFAF7] text-[#12261D] rounded-xl py-1.5 px-3 text-[12.5px] font-bold shadow-sm transition mb-1"
              >
                <Square className="h-3 w-3 fill-current" />
                Stop generating
              </button>
            )}

            {imagePreview && (
              <div className="relative inline-block self-start mb-2 ml-4">
                <img src={imagePreview.localPreview} alt="Preview" className="h-16 rounded-xl object-cover" />
                <button
                  className="absolute -right-2 -top-2 rounded-full bg-red-600 p-1 text-white hover:bg-red-700 w-5 h-5 flex items-center justify-center text-[10px]"
                  onClick={() => setImagePreview(null)}
                >
                  ✕
                </button>
              </div>
            )}

            <div className="flex items-center gap-2 bg-white border border-[#DCDBD1] rounded-2xl px-3 py-2 w-full shadow-sm min-h-[56px]">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploading}
                className="text-[#5C6B62] hover:text-[#12261D] p-2 shrink-0 bg-[#F4F3EC] rounded-xl transition disabled:opacity-50"
              >
                🖼️
              </button>

              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSend();
                  }
                }}
                placeholder={isUploading ? "Uploading photo..." : "Ask about your crops, weather, or schemes..."}
                className="w-full bg-transparent outline-none text-[#12261D] text-[15px] placeholder:text-[#8B978F] py-2 px-1"
              />

              <button
                type="button"
                onClick={() => (isListening ? stopSpeech() : startSpeech())}
                className={cn(
                  "p-2 shrink-0 transition rounded-xl text-lg",
                  isListening ? "bg-red-100 text-red-600 animate-pulse" : "text-[#5C6B62] hover:text-[#12261D]",
                )}
              >
                🎙️
              </button>

              <button
                onClick={handleSend}
                disabled={isStreaming || isUploading || (!inputText.trim() && !imagePreview)}
                className="w-10 h-10 rounded-xl bg-[#0F2419] hover:bg-[#1C3D2A] text-[#9BD96B] flex items-center justify-center font-bold text-[16px] shrink-0 disabled:opacity-50 disabled:cursor-not-allowed transition shadow-sm"
              >
                ↑
              </button>
            </div>

            <div className="text-[11.5px] text-[#A2ADA5] font-semibold mt-1 text-center tracking-wide">
              {isListening ? "Listening… tap the mic again to stop" : MIC_HINT[activeLang]}
            </div>
          </div>
        </div>
      </div>

      {/* MOBILE HISTORY DRAWER */}
      <Dialog open={mobileHistoryOpen} onOpenChange={setMobileHistoryOpen}>
        <DialogContent className="max-w-xs p-0 border-none overflow-hidden h-[90vh] flex flex-col rounded-2xl bg-[#EBEAE2]">
          {renderSidebarContent()}
        </DialogContent>
      </Dialog>
    </div>
  );
}
