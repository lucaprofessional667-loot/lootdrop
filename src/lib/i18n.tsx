import React, { createContext, useContext, useEffect, useState, ReactNode } from "react";

export type Language = "en" | "ro";

const translations = {
  en: {
    pageNotFound: "Page Not Found",
    missingPage: "The page you are looking for doesn't exist or has been moved.",
    goHome: "GO HOME",
    pageFailed: "Something went wrong",
    retryHint: "We couldn't load this part of the game.",
    tryAgain: "TRY AGAIN",
  },
  ro: {
    pageNotFound: "Pagina nu a fost găsită",
    missingPage: "Pagina pe care o cauți nu există sau a fost mutată.",
    goHome: "ACASĂ",
    pageFailed: "Ceva nu a mers bine",
    retryHint: "Nu am putut încărca această parte a jocului.",
    tryAgain: "ÎNCEARCĂ DIN NOU",
  }
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string | { en: string; ro?: string | null }) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>("en");

  useEffect(() => {
    const stored = localStorage.getItem("lootdrop-lang") as Language;
    if (stored === "en" || stored === "ro") setLanguageState(stored);
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem("lootdrop-lang", lang);
    document.documentElement.lang = lang;
  };

  const t = (key: string | { en: string; ro?: string | null }) => {
    if (typeof key === 'object') {
      if (language === "ro" && key.ro) return key.ro;
      return key.en;
    }
    return (translations[language] as any)[key] || (translations["en"] as any)[key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) throw new Error("useLanguage must be used within LanguageProvider");
  return context;
}
