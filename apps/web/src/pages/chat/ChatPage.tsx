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

  const activeSession = sessions?.find(s => s.id === sessionId);
  const currentSessionTitle = activeSession?.title;

  // Sidebar JSX content (reused for mobile & desktop)
  const renderSidebarContent = () => (
    <div className="flex h-full flex-col gap-6 text-left">
      {/* Logo & Title */}
      <div className="flex items-center gap-3 shrink-0">
        <div 
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[10px] text-[#0F2419] font-serif font-extrabold text-lg shadow-sm"
          style={{ backgroundColor: '#9BD96B' }}
        >
          ह
        </div>
        <div className="flex flex-col leading-tight">
          <span style={{ fontFamily: "'Sora', sans-serif" }} className="text-[15px] font-bold text-white tracking-tight">AI Assistant</span>
        </div>
      </div>

      {/* New Chat Button */}
      <button
        onClick={handleNewChat}
        className="w-full bg-[#9BD96B] hover:bg-[#8ac75c] text-[#0F2419] rounded-xl py-3 px-4 flex items-center justify-center gap-2 text-[14px] font-bold transition shrink-0"
        style={{ fontFamily: "'Sora', sans-serif" }}
      >
        + New chat
      </button>

      {/* History list */}
      <div className="flex-1 overflow-y-auto no-scrollbar space-y-6 pr-1">
        {/* THIS WEEK */}
        <div className="flex flex-col gap-2">
          <div className="text-[10px] font-bold text-[#7F9A88] tracking-[0.1em] px-1 uppercase">
            This Week
          </div>
          <div className="flex flex-col gap-0.5">
            {thisWeekSessions.map((session) => (
              <button
                key={session.id}
                onClick={() => handleNavigateSession(session.id)}
                className={cn(
                  "text-[13px] font-semibold py-2 px-2.5 rounded-lg truncate text-left transition",
                  session.id === sessionId 
                    ? "bg-[#1C3D2A] text-[#F4F3EC]" 
                    : "text-[#7F9A88] hover:text-[#F4F3EC] hover:bg-white/5"
                )}
              >
                {session.title}
              </button>
            ))}
          </div>
        </div>

        {/* SAVED ANSWERS */}
        <div className="flex flex-col gap-2">
          <div className="text-[10px] font-bold text-[#7F9A88] tracking-[0.1em] px-1 uppercase">
            Saved Answers
          </div>
          <div className="flex flex-col gap-0.5">
            {savedSessions.map((session) => (
              <button
                key={session.id}
                onClick={() => handleNavigateSession(session.id)}
                className={cn(
                  "text-[13px] font-semibold py-2 px-2.5 rounded-lg truncate text-left transition",
                  session.id === sessionId 
                    ? "bg-[#1C3D2A] text-[#F4F3EC]" 
                    : "text-[#7F9A88] hover:text-[#F4F3EC] hover:bg-white/5"
                )}
              >
                {session.title}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Profile Details */}
      <div className="bg-[#1C3D2A] rounded-2xl p-4 flex flex-col gap-2.5 border border-[#2D5A3F]/50 shrink-0">
        <div className="text-[11px] font-bold text-[#E7C56B] uppercase tracking-wider">
          Answers use your farm profile:
        </div>
        <div className="space-y-1 text-[12.5px] text-[#A2B8AA] font-semibold leading-normal">
          <div>{profile?.name || "Ramesh Farm"} · {profile?.farmSizeAcres || "4.2"} ac</div>
          <div>{profile?.mainCrops?.join(" · ") || "Paddy · Tomato · Cotton"}</div>
          <div>{profile?.district || "Kadapa"}, {profile?.state || "Andhra Pradesh"}</div>
        </div>
        <button 
          onClick={() => navigate("/onboarding")} 
          className="text-[#9BD96B] hover:underline text-[12px] font-bold text-left mt-1"
        >
          Edit farm context
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex h-[calc(100vh-8rem)] w-full gap-4 overflow-hidden select-none text-left">
      {/* 1. LEFT SIDEBAR PANEL (Desktop only) */}
      <aside className="hidden md:flex w-[260px] h-full bg-[#0F2419] p-4 flex-col rounded-2xl shrink-0 border border-[#1C3D2A]/30 overflow-hidden">
        {renderSidebarContent()}
      </aside>

      {/* 2. RIGHT MAIN CONTENT PANEL */}
      <div className="flex-1 flex flex-col h-full bg-white border border-[#E4E3DA] rounded-2xl overflow-hidden">
        
        {/* Right Header */}
        <div className="px-6 py-3.5 border-b border-[#E4E3DA]/60 flex items-center justify-between bg-[#FAFAF7]">
          <div className="flex items-center gap-2">
            {/* Mobile History Toggle Button */}
            <button 
              onClick={() => setMobileHistoryOpen(true)}
              className="md:hidden px-2.5 py-1 text-xs rounded-lg border border-[#DCDBD1] text-[#5C6B62] hover:text-[#12261D] font-bold"
            >
              📂 History
            </button>
            <div style={{ fontFamily: "'Sora', sans-serif" }} className="text-[15px] font-bold text-[#12261D] truncate max-w-[180px] md:max-w-xs">
              {currentSessionTitle || "New conversation"}
            </div>
          </div>

          {/* Center Tabs for language selector */}
          <div className="flex items-center gap-1 bg-[#EBEAE1]/60 p-0.5 rounded-lg">
            {[
              { key: "te", label: "తెలుగు" },
              { key: "hi", label: "हिंदी" },
              { key: "en", label: "English" }
            ].map((lang) => (
              <button
                key={lang.key}
                onClick={() => setActiveLang(lang.key as any)}
                className={cn(
                  "px-3 py-1 rounded-md text-[12px] font-bold transition duration-150",
                  activeLang === lang.key 
                    ? "bg-[#1C3D2A] text-[#F4F3EC] shadow-sm"
                    : "text-[#5C6B62] hover:text-[#12261D]"
                )}
              >
                {lang.label}
              </button>
            ))}
          </div>
        </div>

        {/* Dynamic content scroll area */}
        <div className="flex-1 overflow-y-auto flex flex-col no-scrollbar">
          
          {/* Welcome view when no messages */}
          {!isLoadingMessages && messages.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center py-6 px-4 max-w-3xl mx-auto w-full text-center">
              {/* ह Logo icon */}
              <div 
                className="flex h-14 w-14 items-center justify-center rounded-2xl text-[#0F2419] font-serif font-extrabold text-2xl shadow-md mb-6"
                style={{ background: 'linear-gradient(135deg, #9BD96B 0%, #7DBF57 100%)' }}
              >
                ह
              </div>

              <h2 style={{ fontFamily: "'Sora', sans-serif" }} className="text-2xl md:text-3xl font-extrabold text-[#12261D] tracking-tight">
                Namaskaram, {user?.name?.split(" ")[0] || "Ramesh"}
              </h2>
              <p className="text-[13.5px] text-[#5C6B62] font-medium mt-2 mb-6 md:mb-8">
                Ask about your crops, or show me a photo of the problem.
              </p>

              {/* Suggestions Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full max-w-2xl mb-6">
                {[
                  { tag: "DIAGNOSE", tagColor: "#1B7A4B", prompt: "Why are my rice leaves turning yellow?" },
                  { tag: "SELL", tagColor: "#C27D00", prompt: "Is this a good week to sell paddy?" },
                  { tag: "PLAN", tagColor: "#3B6FA8", prompt: "Will it rain before Thursday?" },
                  { tag: "CLAIM", tagColor: "#1B7A4B", prompt: "Which schemes am I eligible for?" }
                ].map((item) => (
                  <button
                    key={item.prompt}
                    onClick={() => sendMessage(item.prompt)}
                    className="bg-white border border-[#E4E3DA] rounded-2xl p-4 text-left hover:bg-[#FAF9F5] transition duration-200 shadow-sm flex flex-col gap-1.5"
                  >
                    <span style={{ color: item.tagColor }} className="text-[10px] font-extrabold tracking-wider">
                      {item.tag}
                    </span>
                    <span className="text-[13.5px] font-bold text-[#12261D] leading-tight">
                      {item.prompt}
                    </span>
                  </button>
                ))}
              </div>

              {/* Send photo horizontal banner */}
              <div className="bg-[#E6F3E4] border border-[#CDE5C8] rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between w-full max-w-2xl gap-3">
                <div className="flex items-center gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-[#0F2419] flex items-center justify-center text-white text-lg shrink-0">
                    📷
                  </div>
                  <div className="text-left">
                    <div className="text-[13.5px] font-extrabold text-[#12261D]">Or just send a photo</div>
                    <div className="text-[12px] text-[#5C6B62] font-medium mt-0.5">A clear shot of the leaf is usually faster than typing.</div>
                  </div>
                </div>
                <button 
                  onClick={() => fileInputRef.current?.click()}
                  className="text-[#1B7A4B] font-extrabold text-[13.5px] hover:underline whitespace-nowrap self-end sm:self-auto"
                >
                  Open camera
                </button>
              </div>
            </div>
          ) : (
            // Messages bubble list
            <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4 no-scrollbar">
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
        <div className="p-4 border-t border-[#E4E3DA]/40 max-w-3xl mx-auto w-full flex flex-col items-center gap-2 bg-[#FAFAF7]">
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

          <div className="flex items-center gap-2 bg-white border border-[#DCDBD1] rounded-full px-4 py-1.5 w-full shadow-sm">
            {/* Image attachment / paperclip icon */}
            <button 
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="text-[#5C6B62] hover:text-[#12261D] p-1.5 shrink-0 text-lg"
            >
              📎
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
              className="w-full bg-transparent outline-none text-[#12261D] text-[14px] placeholder:text-[#8B978F] py-1"
            />

            {/* Mic icon with speech recognition */}
            <button
              type="button"
              onClick={() => (isListening ? stopSpeech() : startSpeech())}
              className={cn(
                "p-1.5 shrink-0 transition rounded-full text-lg",
                isListening ? "bg-red-100 text-red-600" : "text-[#5C6B62] hover:text-[#12261D]"
              )}
            >
              🎙️
            </button>

            {/* Send button (dark green circle with up arrow) */}
            <button 
              onClick={handleSend}
              disabled={isUploading || (!inputText.trim() && !imagePreview)}
              className="w-8 h-8 rounded-full bg-[#0F2419] hover:bg-[#1C3D2A] text-white flex items-center justify-center font-bold text-[14px] shrink-0 disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              ↑
            </button>
          </div>

          <div className="text-[11.5px] text-[#5C6B62] font-medium mt-1 text-center">
            {activeLang === "te" && "Hold the mic to speak in Telugu · answers read back aloud"}
            {activeLang === "hi" && "Hold the mic to speak in Hindi · answers read back aloud"}
            {activeLang === "en" && "Hold the mic to speak in English · answers read back aloud"}
          </div>
        </div>
      </div>

      {/* 3. MOBILE HISTORY DRAWER */}
      <Dialog open={mobileHistoryOpen} onOpenChange={setMobileHistoryOpen}>
        <DialogContent className="max-w-xs p-4 border-none overflow-hidden h-[80vh] flex flex-col rounded-2xl" style={{ backgroundColor: '#0F2419' }}>
          {renderSidebarContent()}
        </DialogContent>
      </Dialog>
    </div>
  );
}
