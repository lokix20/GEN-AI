import { useCallback, useState } from "react";

export const INDIAN_LANGUAGES = [
  { code: "te", speechCode: "te-IN", name: "Telugu", nativeName: "తెలుగు" },
  { code: "hi", speechCode: "hi-IN", name: "Hindi", nativeName: "हिंदी" },
  { code: "ta", speechCode: "ta-IN", name: "Tamil", nativeName: "தமிழ்" },
  { code: "kn", speechCode: "kn-IN", name: "Kannada", nativeName: "ಕನ್ನಡ" },
  { code: "ml", speechCode: "ml-IN", name: "Malayalam", nativeName: "മലയാളം" },
  { code: "mr", speechCode: "mr-IN", name: "Marathi", nativeName: "मराठी" },
  { code: "bn", speechCode: "bn-IN", name: "Bengali", nativeName: "বাংলা" },
  { code: "gu", speechCode: "gu-IN", name: "Gujarati", nativeName: "ગુજરાતી" },
  { code: "pa", speechCode: "pa-IN", name: "Punjabi", nativeName: "ਪੰਜਾਬੀ" },
  { code: "or", speechCode: "or-IN", name: "Odia", nativeName: "ଓଡ଼ିଆ" },
  { code: "as", speechCode: "as-IN", name: "Assamese", nativeName: "অসমীয়া" },
  { code: "ur", speechCode: "ur-IN", name: "Urdu", nativeName: "اردو" },
  { code: "en", speechCode: "en-IN", name: "English", nativeName: "English" },
] as const;

export function useSpeechSynthesis() {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const isSupported = typeof window !== "undefined" && "speechSynthesis" in window;

  const speak = useCallback(
    (text: string, lang: string) => {
      if (!isSupported) return;
      window.speechSynthesis.cancel();

      const utterance = new SpeechSynthesisUtterance(text);
      const match = INDIAN_LANGUAGES.find((l) => l.code === lang || l.speechCode === lang);
      utterance.lang = match?.speechCode || "en-IN";
      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);

      window.speechSynthesis.speak(utterance);
    },
    [isSupported],
  );

  const cancel = useCallback(() => {
    if (!isSupported) return;
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
  }, [isSupported]);

  return { isSupported, isSpeaking, speak, cancel };
}
