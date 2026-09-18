import { Languages } from "lucide-react";
import { useLanguage } from "@/lib/i18n";

export function LanguageToggle() {
  const { language, setLanguage } = useLanguage();

  return (
    <button
      onClick={() => setLanguage(language === "en" ? "ro" : "en")}
      aria-label="Switch Language"
      className="grid h-9 w-9 place-items-center border-2 border-outline bg-secondary text-secondary-foreground pixel-shadow-sm pixel-press"
    >
      <span className="font-pixel text-[9px]">{language.toUpperCase()}</span>
    </button>
  );
}
