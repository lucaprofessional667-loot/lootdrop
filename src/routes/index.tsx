import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Star,
  Camera,
  Compass,
  Zap,
  Target,
  Flame,
  Coins,
  Palette,
  Building2,
  Droplet,
  Crown,
  TreePine,
} from "lucide-react";
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

type Rarity = "common" | "uncommon" | "rare" | "epic" | "legendary";

const RARITY_STYLES: Record<
  Rarity,
  { badge: string; label: string; border: string }
> = {
  common: {
    badge: "bg-rarity-common text-primary-foreground",
    border: "border-l-rarity-common",
    label: "COMMON",
  },
  uncommon: {
    badge: "bg-rarity-uncommon text-primary-foreground",
    border: "border-l-rarity-uncommon",
    label: "UNCOMMON",
  },
  rare: {
    badge: "bg-rarity-rare text-primary-foreground",
    border: "border-l-rarity-rare",
    label: "RARE",
  },
  epic: {
    badge: "bg-rarity-epic text-primary-foreground",
    border: "border-l-rarity-epic",
    label: "EPIC",
  },
  legendary: {
    badge: "bg-rarity-legendary text-primary-foreground",
    border: "border-l-rarity-legendary",
    label: "LEGENDARY",
  },
};

const TODAYS_LOOT: Array<{
  title: string;
  description: string;
  xp: number;
  difficulty: number;
  rarity: Rarity;
  icon: typeof Coins;
}> = [
  {
    title: "Golden Fire Hydrant",
    description: "Find a fire hydrant painted an unusual color.",
    xp: 500,
    difficulty: 5,
    rarity: "legendary",
    icon: Droplet,
  },
  {
    title: "Rooftop Overlook",
    description: "Snap a photo from any accessible rooftop view.",
    xp: 300,
    difficulty: 4,
    rarity: "epic",
    icon: Building2,
  },
  {
    title: "Arcade Token",
    description: "Spot a vintage coin, token or old arcade machine.",
    xp: 150,
    difficulty: 3,
    rarity: "rare",
    icon: Coins,
  },
  {
    title: "Street Art Mural",
    description: "Photograph a mural bigger than a door.",
    xp: 80,
    difficulty: 2,
    rarity: "uncommon",
    icon: Palette,
  },
  {
    title: "Oldest Tree in Sight",
    description: "Find the oldest-looking tree on your street.",
    xp: 40,
    difficulty: 1,
    rarity: "common",
    icon: TreePine,
  },
];

const RECENT_FINDS: Array<{ title: string; rarity: Rarity; xp: number; icon: typeof Coins }> = [
  { title: "Neon Sign", rarity: "epic", xp: 280, icon: Zap },
  { title: "Blue Mailbox", rarity: "common", xp: 35, icon: Target },
  { title: "Gargoyle", rarity: "rare", xp: 160, icon: Crown },
  { title: "Food Truck", rarity: "uncommon", xp: 90, icon: Flame },
];

function Stars({ count }: { count: number }) {
  return (
    <div className="flex items-center gap-0.5" aria-label={`Difficulty ${count} out of 5`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={`h-3 w-3 ${
            i < count ? "fill-rarity-legendary text-outline" : "text-border"
          }`}
        />
      ))}
    </div>
  );
}

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

      {/* Today's Quest */}
      <section>
        <div className="flex items-baseline justify-between">
          <h2 className="font-pixel text-xs text-foreground">TODAY'S QUEST</h2>
          <span className="font-pixel text-[7px] text-muted-foreground">RESETS IN 09:41</span>
        </div>
        <div className="mt-3 space-y-3">
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
        </div>
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
