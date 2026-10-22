import { useLootDrop } from "@/hooks/use-loot-drop";
import { CollectionCard } from "./CollectionCard";
import { QuestCountdown } from "./QuestCountdown";
import { Stars, Coins } from "lucide-react";
import { RARITY_STYLES } from "@/lib/loot-data";

export function RetroCollection() {
  const { profile, loot, claims, foundToday, xpToday, loading, error } = useLootDrop();
  
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <span className="font-pixel text-xs animate-pulse">Loading loot...</span>
      </div>
    );
  }
  
  if (error || !profile) {
    return null;
  }
  
  // Group claims by loot definition for display
  const collectedLoot = loot.map(definition => {
    const matchingClaim = claims.find(c => c.loot_id === definition.id);
    return {
      ...definition,
      foundDate: matchingClaim?.created_at || undefined,
      approvedDate: matchingClaim?.status === 'approved' ? matchingClaim?.created_at : undefined,
    };
  });
  
  const displayedLoot = collectedLoot.filter(l => l.id); // Show all active loot types in collection
  
  return (
    <div className="w-full max-w-2xl mx-auto font-pixel">
      {/* Header */}
      <header className="mb-6 bg-gradient-to-r from-yellow-700 to-yellow-900/80 text-white p-4 rounded-lg border-4 border-yellow-600 shadow-xl pixel-shadow">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold mb-1">💰 Loot Collection 💰</h2>
            <p className="text-xs text-yellow-200">{profile.username}'s Treasure Hoard</p>
          </div>
          
          {/* XP Summary */}
          <div className="flex items-center gap-3 bg-black/40 px-3 py-2 rounded">
            <Coins className="h-5 w-5 text-yellow-400" />
            <div className="text-right">
              <span className="text-sm font-bold block">{xpToday} XP</span>
              <span className="text-xs">today</span>
            </div>
          </div>
        </div>
      </header>
      
      {/* Quest Countdown */}
      <QuestCountdown />
      
      {/* Collection Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        {displayedLoot.map(definition => (
          <CollectionCard
            key={definition.id}
            loot={{
              id: definition.id,
              title: definition.title,
              description: definition.description,
              rarity: definition.rarity,
              xp: definition.xp,
              difficulty: definition.difficulty,
            }}
            foundDate={claims.find(c => c.loot_id === definition.id)?.created_at}
            approvedDate={claims.find(c => c.loot_id === definition.id && c.status === 'approved')?.created_at}
          />
        ))}
        
        {/* Empty slot placeholder for visual balance */}
        <div className="aspect-square border-2 border-dashed border-muted-foreground/50 rounded-lg flex items-center justify-center text-muted-foreground text-xs">
          More loot to find!
        </div>
      </div>
      
      {/* Legend */}
      <div className="flex flex-wrap gap-3 justify-center text-[8px] mb-4">
        {Object.entries(RARITY_STYLES).map(([rarity, { badge }]) => (
          <span key={rarity} className={`${badge} px-2 py-1 rounded font-pixel`}>
            {rarity.toUpperCase()}
          </span>
        ))}
      </div>
      
      {/* Footer Info */}
      <footer className="text-center text-[9px] text-muted-foreground flex items-center justify-center gap-2">
        <span>Find more loot and level up!</span>
        <Star className={`h-3 w-3 ${xpToday >= 100 ? 'fill-rarity-legendary' : ''}`} />
      </footer>
    </div>
  );
}