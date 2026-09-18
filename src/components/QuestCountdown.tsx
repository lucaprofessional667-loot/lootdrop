import { useEffect, useState } from "react";
import { useLanguage } from "@/lib/i18n";

function getTimeUntilReset() {
  const now = new Date();
  const next = new Date(now);
  next.setHours(24, 0, 0, 0);
  const diff = next.getTime() - now.getTime();
  return Math.max(0, diff);
}

function formatCountdown(ms: number) {
  const totalSeconds = Math.floor(ms / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  const pad = (n: number) => n.toString().padStart(2, "0");
  return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
}

interface QuestCountdownProps {
  className?: string;
  prefix?: string;
}

export function QuestCountdown({ className = "", prefix }: QuestCountdownProps) {
  const [ms, setMs] = useState<number | null>(null);
  const { t } = useLanguage();

  useEffect(() => {
    setMs(getTimeUntilReset());
    const id = setInterval(() => setMs(getTimeUntilReset()), 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <span className={className} aria-live="polite" suppressHydrationWarning>
      {prefix ?? t("resetsIn")} {ms === null ? "--:--:--" : formatCountdown(ms)}
    </span>
  );
}
