import { Star, Coins, Zap, Target, Flame, Palette, Building2, Droplet, Crown, TreePine } from "lucide-react";

export type Rarity = "common" | "uncommon" | "rare" | "epic" | "legendary";

export const RARITY_STYLES: Record<
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

export const TODAYS_LOOT: Array<{
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

export const RECENT_FINDS: Array<{ title: string; rarity: Rarity; xp: number; icon: typeof Coins }> = [
  { title: "Neon Sign", rarity: "epic", xp: 280, icon: Zap },
  { title: "Blue Mailbox", rarity: "common", xp: 35, icon: Target },
  { title: "Gargoyle", rarity: "rare", xp: 160, icon: Crown },
  { title: "Food Truck", rarity: "uncommon", xp: 90, icon: Flame },
];

export function Stars({ count }: { count: number }) {
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
