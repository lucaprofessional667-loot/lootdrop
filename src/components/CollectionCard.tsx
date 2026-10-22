import { Star, Flame, Zap } from "lucide-react";
import type { Rarity } from "@/lib/loot-data";
import { RARITY_STYLES } from "@/lib/loot-data";

interface CollectionCardProps {
  loot: {
    id: string;
    title: string;
    description: string;
    rarity: Rarity;
    xp: number;
    difficulty: number;
  };
  foundDate?: string;
  approvedDate?: string;
}

export function CollectionCard({ loot, foundDate, approvedDate }: CollectionCardProps) {
  const style = RARITY_STYLES[loot.rarity];
  
  return (
    <div className={`border-2 ${style.border} bg-card p-3 shadow-lg pixel-shadow-sm relative overflow-hidden`}>
      {/* Rarity Badge */}
      <span className={`absolute top-1 right-1 font-pixel text-[6px] ${style.badge}`}>
        {style.label}
      </span>
      
      {/* Icon Header */}
      <div className="flex items-center gap-1 mb-2">
        {loot.rarity === "common" && <Flame className="h-5 w-5 text-rarity-common" />}
        {loot.rarity === "uncommon" && <Star className="h-5 w-5 text-rarity-uncommon" />}
        {loot.rarity === "rare" && <Zap className="h-5 w-5 text-rarity-rare" />}
      </div>
      
      {/* Title */}
      <h3 className="font-pixel text-[10px] font-bold text-foreground mb-1">{loot.title}</h3>
      
      {/* Description */}
      <p className="text-xs text-muted-foreground mb-2 line-clamp-2">
        {loot.description}
      </p>
      
      {/* Stats Row */}
      <div className="flex items-center justify-between text-[8px] font-pixel">
        <div className="flex items-center gap-1 text-xs text-primary">
          <span>+{loot.xp} XP</span>
          {foundDate && (
            <span className="text-muted-foreground">
              | Found: {new Date(foundDate).toLocaleDateString()}
            </span>
          )}
        </div>
        
        <div className="flex items-center gap-1 text-xs text-primary">
          <Star className="h-3 w-3 fill-rarity-legendary" />
          <span>{loot.difficulty}/5</span>
        </div>
      </div>
      
      {/* Approval Status */}
      {approvedDate && (
        <div className={`mt-2 px-2 py-1 font-pixel text-[7px] ${
          loot.rarity === "legendary" ? "bg-rarity-legendary/20 text-rarity-legendary" :
          loot.rarity === "epic" ? "bg-rarity-epic/20 text-rarity-epic" :
          "bg-primary/10 text-primary"
        }`}>
          ✓ APPROVED {new Date(approvedDate).toLocaleDateString()}
        </div>
      )}
    </div>
  );
}