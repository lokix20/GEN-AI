import { useState, useEffect } from "react";
import { DASHBOARD_TRANSLATIONS, DashboardTranslation } from "../lib/dashboard-translations.js";
import i18n from "../lib/i18n.js";

export function useCurrentLanguage() {
  const [langCode, setLangCode] = useState(() => localStorage.getItem("haritha-language") || "te");

  useEffect(() => {
    const handleLangChange = () => {
      const newLang = localStorage.getItem("haritha-language") || "te";
      setLangCode(newLang);
    };
    window.addEventListener("haritha-language-change", handleLangChange);
    return () => window.removeEventListener("haritha-language-change", handleLangChange);
  }, []);

  const t: DashboardTranslation = DASHBOARD_TRANSLATIONS[langCode] || DASHBOARD_TRANSLATIONS["te"] || DASHBOARD_TRANSLATIONS["en"];

  const changeLanguage = (code: string) => {
    localStorage.setItem("haritha-language", code);
    i18n.changeLanguage(code);
    setLangCode(code);
    window.dispatchEvent(new Event("haritha-language-change"));
  };

  return { langCode, t, changeLanguage };
}
