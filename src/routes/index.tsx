import { createFileRoute, Link } from "@tanstack/react-router";
import { Camera, Zap, Target, Flame } from "lucide-react";
import { QuestCountdown } from "@/components/QuestCountdown";
import { RECENT_FINDS, RARITY_STYLES } from "@/lib/loot-data";
import avatarImg from "../assets/avatar.png";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Home — Loot Drop" },
      {
        name: "description",
        content: "Your daily loot: objectives, XP progress and your latest finds.",
      },
      { property: "og:title", content: "Home — Loot Drop" },
      {
        property: "og:description",
        content: "Your daily loot: objectives, XP progress and your latest finds.",
      },
    ],
  }),
  component: HomePage,
});


function HomePage() {
  return (
    <div className="space-y-5">
      {/* Profile card */}
      <section className="border-2 border-outline bg-card p-4 pixel-shadow">
        <div className="flex items-center gap-3">
          <img
            src={avatarImg}
            alt="Pixel avatar of xX_LootHunter_Xx"
            width={512}
            height={512}
            className="h-16 w-16 shrink-0 border-2 border-outline bg-secondary pixel-shadow-sm [image-rendering:pixelated]"
          />
          <div className="min-w-0 flex-1">
            <h1 className="truncate text-lg font-bold text-card-foreground">
              xX_LootHunter_Xx
            </h1>
            <div className="mt-0.5 inline-block border-2 border-outline bg-accent px-1.5 py-0.5 font-pixel text-[8px] text-accent-foreground">
              LEVEL 12
            </div>
          </div>
        </div>
        <div className="mt-3">
          <div className="flex items-center justify-between font-pixel text-[8px] text-muted-foreground">
            <span>XP</span>
            <span className="text-foreground">1,240 / 1,500</span>
          </div>
          <div className="mt-1 h-4 border-2 border-outline bg-muted">
            <div
              className="h-full bg-primary"
              style={{ width: `${(1240 / 1500) * 100}%` }}
            />
          </div>
        </div>
      </section>

      {/* Daily progress */}
      <section className="grid grid-cols-2 gap-3">
        <div className="border-2 border-outline bg-card p-3 pixel-shadow">
          <div className="flex items-center gap-1.5 text-muted-foreground">
            <Target className="h-4 w-4" />
            <span className="font-pixel text-[7px]">FOUND TODAY</span>
          </div>
          <p className="mt-2 font-pixel text-xl text-card-foreground">
            3<span className="text-muted-foreground">/5</span>
          </p>
        </div>
        <div className="border-2 border-outline bg-card p-3 pixel-shadow">
          <div className="flex items-center gap-1.5 text-muted-foreground">
            <Zap className="h-4 w-4" />
            <span className="font-pixel text-[7px]">XP TODAY</span>
          </div>
          <p className="mt-2 font-pixel text-xl text-card-foreground">
            +430<span className="text-[10px] text-muted-foreground"> XP</span>
          </p>
        </div>
      </section>

      {/* Today's Quest CTA */}
      <section>
        <Link
          to="/quest"
          className="group flex flex-col items-center justify-center gap-2 border-2 border-outline bg-primary p-5 text-center pixel-shadow pixel-press"
        >
          <span className="font-pixel text-sm text-primary-foreground">TODAY'S QUEST</span>
          <QuestCountdown className="font-pixel text-[10px] text-primary-foreground/80" />
          <span className="mt-1 font-pixel text-[7px] text-primary-foreground/70">
            TAP TO VIEW LOOT
          </span>
        </Link>
      </section>

      {/* Collection preview */}
      <section>
        <div className="flex items-baseline justify-between">
          <h2 className="font-pixel text-xs text-foreground">RECENT FINDS</h2>
          <Link
            to="/collection"
            className="font-pixel text-[7px] text-primary hover:underline"
          >
            VIEW ALL
          </Link>
        </div>
        <div className="mt-3 grid grid-cols-4 gap-2">
          {RECENT_FINDS.map((find) => {
            const rarity = RARITY_STYLES[find.rarity];
            const Icon = find.icon;
            return (
              <div
                key={find.title}
                className={`flex flex-col items-center gap-1.5 border-2 border-b-4 border-outline bg-card p-2 pixel-shadow-sm ${rarity.border.replace("border-l-", "border-b-")}`}
              >
                <span
                  className={`grid h-9 w-9 place-items-center border-2 border-outline ${rarity.badge}`}
                >
                  <Icon className="h-4 w-4" />
                </span>
                <span className="w-full truncate text-center text-[10px] font-semibold text-card-foreground">
                  {find.title}
                </span>
                <span className="font-pixel text-[6px] text-muted-foreground">
                  +{find.xp}XP
                </span>
              </div>
            );
          })}
        </div>
      </section>

      {/* Proof hint footer */}
      <div className="mt-6 space-y-3">
        <div className="h-px w-full bg-outline" />
        <section className="flex items-center gap-3 border-2 border-dashed border-outline bg-secondary p-3">
          <Camera className="h-5 w-5 shrink-0 text-secondary-foreground" />
          <p className="text-xs text-secondary-foreground">
            Found one? Snap a photo as proof to claim the XP.
          </p>
        </section>
      </div>
    </div>
  );
}
