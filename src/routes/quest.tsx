import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { QuestCountdown } from "@/components/QuestCountdown";
import { RARITY_STYLES, Stars } from "@/lib/loot-data";
import { LootClaimButton } from "@/components/LootClaimButton";
import { useLootDrop } from "@/hooks/use-loot-drop";
import { useLanguage } from "@/lib/i18n";

export const Route = createFileRoute("/quest")({
  head: () => ({
    meta: [
      { title: "Today's Quest — Loot Drop" },
      {
        name: "description",
        content: "Check today's loot objectives and hunt them before the reset.",
      },
      { property: "og:title", content: "Today's Quest — Loot Drop" },
      {
        property: "og:description",
        content: "Check today's loot objectives and hunt them before the reset.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: QuestPage,
});

function QuestPage() {
  const { loot, claims, loading, error, submitProof } = useLootDrop();
  const { t } = useLanguage();

  if (loading) return <p className="font-pixel text-[9px] text-muted-foreground">{t("loadingQuest")}</p>;
  if (error) return <p className="text-sm text-destructive">{error}</p>;
  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Link
          to="/"
          className="grid h-9 w-9 place-items-center border-2 border-outline bg-secondary text-secondary-foreground pixel-shadow-sm pixel-press"
          aria-label={t("backHome")}
        >
          <ArrowLeft className="h-4 w-4" />
        </Link>
        <h1 className="font-pixel text-sm text-foreground">{t("todaysQuest")}</h1>
      </div>

      {/* Countdown banner */}
      <div className="border-2 border-outline bg-card p-4 text-center pixel-shadow">
        <p className="font-pixel text-[10px] text-muted-foreground">{t("newLootIn")}</p>
        <QuestCountdown
          className="mt-2 block font-pixel text-2xl text-primary"
          prefix=""
        />
      </div>

      {/* Loot list */}
      <section className="space-y-3">
        {loot.map((lootItem) => {
          const rarity = RARITY_STYLES[lootItem.rarity];
          const claim = claims.find((item) => item.loot_id === lootItem.id);
          return (
            <article
              key={lootItem.id}
              className={`border-2 border-l-8 border-outline bg-card p-3 pixel-shadow ${rarity.border}`}
            >
              <div className="flex items-start gap-3">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="truncate text-sm font-bold text-card-foreground">
                      {lootItem.title}
                      {lootItem.shared ? (
                        <span className="ml-2 border-2 border-outline bg-secondary px-1 py-0.5 align-middle font-pixel text-[7px] text-secondary-foreground">
                           {t("everyone")}
                        </span>
                      ) : null}
                    </h3>
                    <span className="shrink-0 font-pixel text-[9px] text-primary">
                      +{lootItem.xp}XP
                    </span>
                  </div>
                  <p className="mt-0.5 line-clamp-2 text-xs text-muted-foreground">
                    {lootItem.description}
                  </p>
                  <div className="mt-2 flex items-center justify-between gap-2">
                    <Stars count={lootItem.difficulty} />
                    <span
                      className={`border-2 border-outline px-1.5 py-0.5 font-pixel text-[7px] ${rarity.badge}`}
                    >
                      {t(lootItem.rarity)}
                    </span>
                  </div>
                </div>
              </div>
              <LootClaimButton loot={lootItem} claim={claim} onSubmit={submitProof} />
            </article>
          );
        })}
      </section>
    </div>
  );
}
