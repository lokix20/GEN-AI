import { useState, useRef, useEffect } from "react";
import { INDIAN_LANGUAGES } from "../../hooks/useSpeechSynthesis.js";
import i18n from "../../lib/i18n.js";

export function LanguageSelector({
  className = "",
  buttonClassName = "",
}: {
  className?: string;
  buttonClassName?: string;
}) {
  const [selectedLang, setSelectedLang] = useState(() => localStorage.getItem("haritha-language") || "te");
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const currentLangObj = INDIAN_LANGUAGES.find((l) => l.code === selectedLang) || INDIAN_LANGUAGES[0];

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (code: string) => {
    setSelectedLang(code);
    localStorage.setItem("haritha-language", code);
    i18n.changeLanguage(code);
    setIsOpen(false);
    window.dispatchEvent(new Event("haritha-language-change"));
  };

  return (
    <div className={`relative inline-block ${className}`} ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={
          buttonClassName ||
          "bg-[#006837]/80 hover:bg-[#006837] border border-[#2E7D32] text-white px-3 py-1.5 rounded-xl text-xs font-extrabold flex items-center gap-2 transition shadow-sm"
        }
      >
        <span>🌐</span>
        <span>{currentLangObj.nativeName} ({currentLangObj.name})</span>
        <span className="text-[10px] opacity-75">▼</span>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 bg-white border-2 border-[#1B4332] rounded-2xl shadow-2xl z-50 py-2 overflow-hidden text-left max-h-80 overflow-y-auto">
          <div className="px-4 py-2 border-b border-[#E0E4D8] bg-[#F8F9F5]">
            <span className="text-[10px] font-extrabold text-[#006837] uppercase tracking-wider">
              Select Language (12 Indian Languages)
            </span>
          </div>
          {INDIAN_LANGUAGES.map((lang) => (
            <button
              key={lang.code}
              onClick={() => handleSelect(lang.code)}
              className={`w-full text-left px-4 py-2 text-xs font-bold flex items-center justify-between hover:bg-[#E8F5E9] transition ${
                selectedLang === lang.code ? "bg-[#E8F5E9] text-[#006837]" : "text-[#1B4332]"
              }`}
            >
              <div className="flex items-center gap-2">
                <span className="text-sm font-extrabold">{lang.nativeName}</span>
                <span className="text-[11px] text-[#4A6354] font-normal">({lang.name})</span>
              </div>
              {selectedLang === lang.code && <span className="text-[#006837] font-extrabold">✓</span>}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
