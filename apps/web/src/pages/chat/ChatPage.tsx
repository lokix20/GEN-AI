import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { ChatMessageBubble } from "../../features/chat/components/ChatMessageBubble.js";
import { useChat, useChatSessions } from "../../features/chat/useChat.js";
import { uploadChatImage } from "../../features/chat/api.js";
import { fetchFarmerProfile } from "../../features/profile/api.js";
import { useAuthStore } from "../../store/auth.store.js";
import { useSpeechRecognition } from "../../hooks/useSpeechRecognition.js";
import { cn } from "../../lib/utils.js";
import { Dialog, DialogContent } from "../../components/ui/dialog.js";
import { Skeleton } from "../../components/ui/skeleton.js";

const MOCK_THIS_WEEK = [
  { id: "mock-yellow-patches", title: "Yellow patches on paddy leaves", prompt: "Why are my rice leaves turning yellow?" },
  { id: "mock-sell-paddy", title: "Should I sell paddy this week?", prompt: "Is this a good week to sell paddy?" },
  { id: "mock-drip-flood", title: "Drip vs flood for tomato", prompt: "Is drip irrigation better than flood irrigation for tomato crops?" }
];

const MOCK_SAVED = [
  { id: "mock-urea-dose", title: "Urea dose chart — paddy", prompt: "What is the recommended urea dosage chart for paddy?" },
  { id: "mock-pm-kisan", title: "PM-KISAN document list", prompt: "What documents are required to claim PM-KISAN benefits?" }
];

export function ChatPage() {
  const { sessionId } = useParams<{ sessionId: string }>();
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);
  const role = user?.role;
  const bottomRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [activeLang, setActiveLang] = useState<"te" | "hi" | "en">("te");
  const [inputText, setInputText] = useState("");
  const [imagePreview, setImagePreview] = useState<{ url: string; localPreview: string } | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [mobileHistoryOpen, setMobileHistoryOpen] = useState(false);

  // Load actual chat sessions
  const { data: sessions } = useChatSessions();

  // Speech Recognition hook
  const speechLang = activeLang === "te" ? "te-IN" : activeLang === "hi" ? "hi-IN" : "en-IN";
  const { isListening, transcript, start: startSpeech, stop: stopSpeech } = useSpeechRecognition(speechLang);

  // Load Profile context
  const { data: profile } = useQuery({
    queryKey: ["farmer-profile"],
    queryFn: fetchFarmerProfile,
    enabled: role === "FARMER",
  });

  const { messages, isLoadingMessages, isStreaming, sendMessage } = useChat(
    sessionId && !sessionId.startsWith("mock-") ? sessionId : undefined, 
    (session) => {
      navigate(`/chat/${session.id}`, { replace: true });
    }
  );

  // Auto-scroll on new messages
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Handle Speech Recognition transcript updates
  useEffect(() => {
    if (isListening && transcript) {
      setInputText(transcript);
    }
  }, [transcript, isListening]);

  // Handle file capture / attachment selection
  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const localPreview = URL.createObjectURL(file);
    setIsUploading(true);
    try {
      const { url } = await uploadChatImage(file);
      setImagePreview({ url, localPreview });
    } catch (error) {
      toast.error("Could not upload image");
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

    sendMessage(cleanText || "Please analyze this crop image.", imagePreview?.url ?? null);
    setInputText("");
    setImagePreview(null);
  };

  const handleNewChat = () => {
    navigate("/chat");
    setInputText("");
    setImagePreview(null);
  };

  const handleNavigateSession = (id: string) => {
    setMobileHistoryOpen(false);
    const mockWeek = MOCK_THIS_WEEK.find(s => s.id === id);
    const mockSave = MOCK_SAVED.find(s => s.id === id);
    const mock = mockWeek || mockSave;

    if (mock) {
      sendMessage(mock.prompt);
    } else {
      navigate(`/chat/${id}`);
    }
  };

  // Group actual sessions
  const realSessions = sessions || [];
  const pinnedSessions = realSessions.filter(s => s.isPinned);
  const unpinnedSessions = realSessions.filter(s => !s.isPinned);

  const thisWeekSessions = unpinnedSessions.length > 0 
    ? unpinnedSessions.map(s => ({ id: s.id, title: s.title }))
    : MOCK_THIS_WEEK;

  const savedSessions = pinnedSessions.length > 0
    ? pinnedSessions.map(s => ({ id: s.id, title: s.title }))
    : MOCK_SAVED;

  // Inner Left Sidebar Content
  const renderSidebarContent = () => (
    <div className="flex h-full flex-col text-left py-6 px-4">
      <div className="flex-1 overflow-y-auto no-scrollbar space-y-8 pr-1">
        {/* THIS WEEK */}
        <div className="flex flex-col gap-3">
          <div className="text-[10px] font-bold text-[#A2ADA5] tracking-widest uppercase ml-2">
            This Week
          </div>
          <div className="flex flex-col gap-1">
            {thisWeekSessions.map((session) => (
              <button
                key={session.id}
                onClick={() => handleNavigateSession(session.id)}
                className={cn(
                  "text-[13.5px] font-semibold py-2.5 px-3 rounded-xl truncate text-left transition",
                  session.id === sessionId 
                    ? "bg-white text-[#12261D] shadow-sm" 
                    : "text-[#5C6B62] hover:text-[#12261D] hover:bg-black/5"
                )}
              >
                {session.title}
              </button>
            ))}
          </div>
        </div>

        {/* SAVED ANSWERS */}
        <div className="flex flex-col gap-3">
          <div className="text-[10px] font-bold text-[#A2ADA5] tracking-widest uppercase ml-2">
            Saved Answers
          </div>
          <div className="flex flex-col gap-1">
            {savedSessions.map((session) => (
              <button
                key={session.id}
                onClick={() => handleNavigateSession(session.id)}
                className={cn(
                  "text-[13.5px] font-semibold py-2.5 px-3 rounded-xl truncate text-left transition",
                  session.id === sessionId 
                    ? "bg-white text-[#12261D] shadow-sm" 
                    : "text-[#5C6B62] hover:text-[#12261D] hover:bg-black/5"
                )}
              >
                {session.title}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Profile Details */}
      <div className="flex flex-col gap-1.5 text-left pt-6 mt-4 border-t border-[#DCDBD1]">
        <div className="text-[10px] font-bold text-[#A2ADA5] tracking-widest uppercase mb-1">
          Farm Context
        </div>
        <div className="text-[12.5px] text-[#5C6B62] font-semibold leading-relaxed">
          <div>{profile?.name || "Ramesh Farm"} · {profile?.farmSizeAcres || "4.2"} ac</div>
          <div>{profile?.mainCrops?.join(" · ") || "Paddy · Tomato · Cotton"}</div>
          <div>{profile?.district || "Kadapa"}, {profile?.state || "Andhra Pradesh"}</div>
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
          
          {/* Mobile History Toggle */}
          <button 
            onClick={() => setMobileHistoryOpen(true)}
            className="md:hidden px-3 py-1.5 text-sm rounded-lg border border-[#DCDBD1] text-[#5C6B62] font-bold"
          >
            History
          </button>

          {/* Language selector pills */}
          <div className="flex items-center gap-1 bg-[#EBEAE2] p-1 rounded-xl border border-[#E4E3DA]">
            {[
              { key: "te", label: "తెలుగు" },
              { key: "hi", label: "हिंदी" },
              { key: "en", label: "English" }
            ].map((lang) => (
              <button
                key={lang.key}
                onClick={() => setActiveLang(lang.key as any)}
                className={cn(
                  "px-4 py-1.5 rounded-lg text-[13px] font-bold transition duration-150",
                  activeLang === lang.key 
                    ? "bg-white text-[#12261D] shadow-sm border border-[#DCDBD1]"
                    : "text-[#5C6B62] hover:text-[#12261D]"
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
        {/* Inner Left Sidebar (Desktop) */}
        <aside className="hidden md:flex w-[260px] h-full bg-[#EBEAE2] flex-col shrink-0 overflow-hidden">
          {renderSidebarContent()}
        </aside>

        {/* Right Chat Panel */}
        <div className="flex-1 flex flex-col h-full overflow-hidden bg-[#F4F3EC]">
          {/* Messages scroll area */}
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

                {/* Suggestions Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full max-w-2xl mb-6">
                  {[
                    { tag: "DIAGNOSE", tagColor: "#1B7A4B", prompt: "Why are my rice leaves turning yellow?" },
                    { tag: "SELL", tagColor: "#C27D00", prompt: "Is this a good week to sell paddy?" },
                    { tag: "PLAN", tagColor: "#3B6FA8", prompt: "Will it rain before Thursday?" },
                    { tag: "CLAIM", tagColor: "#1B7A4B", prompt: "Which schemes am I eligible for?" }
                  ].map((item) => (
                    <button
                      key={item.prompt}
                      onClick={() => sendMessage(item.prompt)}
                      className="bg-white border border-[#E4E3DA] rounded-[20px] p-5 text-left hover:bg-[#FAF9F5] transition duration-200 shadow-sm flex flex-col gap-1.5"
                    >
                      <span style={{ color: item.tagColor }} className="text-[10px] font-extrabold tracking-wider uppercase">
                        {item.tag}
                      </span>
                      <span className="text-[14.5px] font-bold text-[#12261D] leading-tight">
                        {item.prompt}
                      </span>
                    </button>
                  ))}
                </div>

                {/* Send photo horizontal banner */}
                <div className="bg-[#E6F3E4] border border-[#CDE5C8] rounded-[20px] p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between w-full max-w-2xl gap-3">
                  <div className="flex items-center gap-4">
                    <div className="w-11 h-11 rounded-[14px] bg-[#12261D] flex items-center justify-center text-white text-xl shrink-0">
                      📷
                    </div>
                    <div className="text-left">
                      <div className="text-[14.5px] font-extrabold text-[#12261D]">Or just send a photo</div>
                      <div className="text-[12.5px] text-[#5C6B62] font-medium mt-0.5">A clear shot of the leaf is faster than typing.</div>
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
            ) : isLoadingMessages ? (
              // Chat feed Skeleton loader
              <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-5 no-scrollbar max-w-4xl mx-auto w-full">
                <div className="flex gap-3 justify-end">
                  <Skeleton className="h-12 w-2/3 rounded-2xl bg-[#E2E1D7]" />
                </div>
                <div className="flex gap-3">
                  <Skeleton className="w-9 h-9 rounded-full shrink-0" />
                  <Skeleton className="h-24 w-3/4 rounded-2xl" />
                </div>
                <div className="flex gap-3 justify-end">
                  <Skeleton className="h-10 w-1/2 rounded-2xl bg-[#E2E1D7]" />
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

          {/* Hidden Camera / File Selector Input */}
          <input 
            ref={fileInputRef}
            type="file" 
            accept="image/*"
            className="hidden"
            onChange={handleFileSelect}
          />

          {/* Bottom Input Composer */}
          <div className="p-4 max-w-3xl mx-auto w-full flex flex-col items-center gap-2 bg-[#F4F3EC] pb-6">
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
              {/* Image attachment / paperclip icon */}
              <button 
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="text-[#5C6B62] hover:text-[#12261D] p-2 shrink-0 bg-[#F4F3EC] rounded-xl transition"
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
                placeholder="Ask about your crops, weather, or schemes..." 
                className="w-full bg-transparent outline-none text-[#12261D] text-[15px] placeholder:text-[#8B978F] py-2 px-1"
              />

              {/* Mic icon with speech recognition */}
              <button
                type="button"
                onClick={() => (isListening ? stopSpeech() : startSpeech())}
                className={cn(
                  "p-2 shrink-0 transition rounded-xl text-lg",
                  isListening ? "bg-red-100 text-red-600" : "text-[#5C6B62] hover:text-[#12261D]"
                )}
              >
                🎙️
              </button>

              {/* Send button (dark green circle with up arrow) */}
              <button 
                onClick={handleSend}
                disabled={isUploading || (!inputText.trim() && !imagePreview)}
                className="w-10 h-10 rounded-xl bg-[#0F2419] hover:bg-[#1C3D2A] text-[#9BD96B] flex items-center justify-center font-bold text-[16px] shrink-0 disabled:opacity-50 disabled:cursor-not-allowed transition shadow-sm"
              >
                ↑
              </button>
            </div>

            <div className="text-[11.5px] text-[#A2ADA5] font-semibold mt-1 text-center tracking-wide uppercase">
              {activeLang === "te" && "Hold the mic to speak in Telugu · answers read back aloud"}
              {activeLang === "hi" && "Hold the mic to speak in Hindi · answers read back aloud"}
              {activeLang === "en" && "Hold the mic to speak in English · answers read back aloud"}
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
