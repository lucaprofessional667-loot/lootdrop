import { useState, useEffect, ReactNode } from "react";
import { Language, LanguageContext } from "@/hooks/use-language";

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>("en");

  useEffect(() => {
    const stored = localStorage.getItem("lootdrop-lang") as Language;
    if (stored === "en" || stored === "ro") setLanguageState(stored);
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem("lootdrop-lang", lang);
  };

  const t = (en: string, ro?: string | null) => {
    if (language === "ro" && ro) return ro;
    return en;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}
