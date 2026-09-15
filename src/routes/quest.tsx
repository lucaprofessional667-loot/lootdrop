import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { QuestCountdown } from "@/components/QuestCountdown";
import { RARITY_STYLES, Stars } from "@/lib/loot-data";
import { LootClaimButton } from "@/components/LootClaimButton";
import { useLootDrop } from "@/hooks/use-loot-drop";
import { useState } from "react";

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
  const { loot, claims, loading, error, submitProof } = useLootDrop();

  if (loading) return <p className="font-pixel text-[9px] text-muted-foreground">LOADING QUEST…</p>;
  if (error) return <p className="text-sm text-destructive">{error}</p>;
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
                      {rarity.label}
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

function SetupNotice() {
  return <div className="border-2 border-outline bg-card p-4 pixel-shadow"><h1 className="font-pixel text-sm">CONNECT SUPABASE</h1><p className="mt-3 text-sm text-muted-foreground">Add VITE_SUPABASE_URL and VITE_SUPABASE_PUBLISHABLE_KEY to your local environment or connect the project in Lovable Cloud, then reload.</p></div>;
}
