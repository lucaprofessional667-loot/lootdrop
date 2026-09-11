import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { QuestCountdown } from "@/components/QuestCountdown";
import { RARITY_STYLES, TODAYS_LOOT, Stars } from "@/lib/loot-data";

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
    ],
  }),
  component: QuestPage,
});

function QuestPage() {
  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Link
          to="/"
          className="grid h-9 w-9 place-items-center border-2 border-outline bg-secondary text-secondary-foreground pixel-shadow-sm pixel-press"
          aria-label="Back to Home"
        >
          <ArrowLeft className="h-4 w-4" />
        </Link>
        <h1 className="font-pixel text-sm text-foreground">TODAY'S QUEST</h1>
      </div>

      {/* Countdown banner */}
      <div className="border-2 border-outline bg-card p-4 text-center pixel-shadow">
        <p className="font-pixel text-[10px] text-muted-foreground">NEW LOOT IN</p>
        <QuestCountdown
          className="mt-2 block font-pixel text-2xl text-primary"
          prefix=""
        />
      </div>

      {/* Loot list */}
      <section className="space-y-3">
        {TODAYS_LOOT.map((loot) => {
          const rarity = RARITY_STYLES[loot.rarity];
          const Icon = loot.icon;
          return (
            <article
              key={loot.title}
              className={`border-2 border-l-8 border-outline bg-card p-3 pixel-shadow ${rarity.border}`}
            >
              <div className="flex items-start gap-3">
                <span
                  className={`grid h-11 w-11 shrink-0 place-items-center border-2 border-outline ${rarity.badge}`}
                >
                  <Icon className="h-5 w-5" />
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="truncate text-sm font-bold text-card-foreground">
                      {loot.title}
                    </h3>
                    <span className="shrink-0 font-pixel text-[9px] text-primary">
                      +{loot.xp}XP
                    </span>
                  </div>
                  <p className="mt-0.5 line-clamp-2 text-xs text-muted-foreground">
                    {loot.description}
                  </p>
                  <div className="mt-2 flex items-center justify-between gap-2">
                    <Stars count={loot.difficulty} />
                    <span
                      className={`border-2 border-outline px-1.5 py-0.5 font-pixel text-[7px] ${rarity.badge}`}
                    >
                      {rarity.label}
                    </span>
                  </div>
                </div>
              </div>
            </article>
          );
        })}
      </section>
    </div>
  );
}
