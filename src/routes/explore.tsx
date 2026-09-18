import { createFileRoute } from "@tanstack/react-router";
import { Compass } from "lucide-react";
import { useLanguage } from "@/lib/i18n";

export const Route = createFileRoute("/explore")({
  head: () => ({
    meta: [
      { title: "Explore — Loot Drop" },
      { name: "description", content: "Explore nearby loot drops." },
      { property: "og:title", content: "Explore — Loot Drop" },
      { property: "og:description", content: "Explore nearby loot drops." },
    ],
  }),
  component: ExplorePage,
});

function ExplorePage() {
  const { t } = useLanguage();
  return (
    <div className="flex flex-col items-center gap-4 border-2 border-dashed border-outline bg-card p-10 text-center pixel-shadow">
      <Compass className="h-10 w-10 text-muted-foreground" />
      <h1 className="font-pixel text-xs text-foreground">{t("explore").toUpperCase()}</h1>
      <p className="text-sm text-muted-foreground">
        {t("exploreSoon")}
      </p>
    </div>
  );
}
