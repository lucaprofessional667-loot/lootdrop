import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Backpack, RefreshCw, X } from "lucide-react";
import { useCollection } from "@/hooks/use-collection";
import { RARITY_STYLES } from "@/lib/loot-data";
import type { CollectionEntry } from "@/lib/loot.functions";

export const Route = createFileRoute("/collection")({
  head: () => ({
    meta: [
      { title: "Collection — Loot Drop" },
      { name: "description", content: "Every loot you verified, turned into a paper sticker." },
      { property: "og:title", content: "Collection — Loot Drop" },
      { property: "og:description", content: "Every loot you verified, turned into a paper sticker." },
    ],
  }),
  component: CollectionPage,
});

function CollectionPage() {
  const { entries, loading, error, retry } = useCollection();
  const [open, setOpen] = useState<CollectionEntry | null>(null);
  const [busy, setBusy] = useState<string | null>(null);

  return (
    <div className="space-y-4">
      <h1 className="font-pixel text-sm text-foreground">LOOT HISTORY</h1>

      {loading && <p className="font-pixel text-[9px] text-muted-foreground">LOADING STICKERS…</p>}
      {error && <p className="text-sm text-destructive">{error}</p>}

      {!loading && entries.length === 0 && (
        <div className="flex flex-col items-center gap-4 border-2 border-dashed border-outline bg-card p-10 text-center pixel-shadow">
          <Backpack className="h-10 w-10 text-muted-foreground" />
          <p className="font-pixel text-[9px] text-foreground">NO LOOT YET</p>
          <p className="text-sm text-muted-foreground">Verify a photo and your first sticker lands here.</p>
          <Link
            to="/quest"
            className="border-2 border-outline bg-primary px-3 py-2 font-pixel text-[8px] text-primary-foreground pixel-shadow-sm pixel-press"
          >
            TODAY'S QUEST
          </Link>
        </div>
      )}

      <div className="grid grid-cols-2 gap-3">
        {entries.map((entry) => {
          const rarity = RARITY_STYLES[entry.rarity];
          const image = entry.stickerUrl ?? entry.photoUrl;
          return (
            <button
              key={entry.claimId}
              onClick={() => setOpen(entry)}
              className={`border-2 border-b-4 border-outline bg-card p-2 text-left pixel-shadow pixel-press ${rarity.border.replace("border-l-", "border-b-")}`}
            >
              <div className="grid aspect-square w-full place-items-center overflow-hidden border-2 border-outline bg-muted">
                {image ? (
                  <img
                    src={image}
                    alt={entry.title}
                    className="h-full w-full object-contain p-1 drop-shadow-[0_2px_0_rgba(0,0,0,0.35)]"
                  />
                ) : (
                  <span className="font-pixel text-[7px] text-muted-foreground">NO IMAGE</span>
                )}
              </div>
              <p className="mt-2 truncate text-xs font-bold text-card-foreground">{entry.title}</p>
              <div className="mt-1 flex items-center justify-between gap-1">
                <span className={`border-2 border-outline px-1 py-0.5 font-pixel text-[6px] ${rarity.badge}`}>
                  {rarity.label}
                </span>
                <span className="font-pixel text-[7px] text-primary">+{entry.xp}XP</span>
              </div>
              <p className="mt-1 font-pixel text-[6px] text-muted-foreground">
                {new Date(entry.foundAt).toLocaleDateString()}
              </p>
            </button>
          );
        })}
      </div>

      {open && (
        <div
          className="fixed inset-0 z-50 grid place-items-center bg-black/70 p-4"
          onClick={() => setOpen(null)}
        >
          <div
            className="w-full max-w-sm space-y-3 border-2 border-outline bg-card p-4 pixel-shadow"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-2">
              <h2 className="font-pixel text-[10px] text-foreground">{open.title.toUpperCase()}</h2>
              <button onClick={() => setOpen(null)} aria-label="Close" className="pixel-press">
                <X className="h-4 w-4" />
              </button>
            </div>
            {open.photoUrl && (
              <img src={open.photoUrl} alt={`Proof photo for ${open.title}`} className="w-full border-2 border-outline" />
            )}
            <p className="text-sm text-muted-foreground">{open.description}</p>
            {open.reason && <p className="text-xs text-muted-foreground">AI: {open.reason}</p>}
            {open.stickerStatus !== "ready" && (
              <button
                disabled={busy === open.claimId}
                onClick={async () => {
                  setBusy(open.claimId);
                  try {
                    await retry(open.claimId);
                    setOpen(null);
                  } finally {
                    setBusy(null);
                  }
                }}
                className="inline-flex w-full items-center justify-center gap-2 border-2 border-outline bg-secondary py-2 font-pixel text-[8px] text-secondary-foreground pixel-shadow-sm pixel-press disabled:opacity-60"
              >
                <RefreshCw className="h-3.5 w-3.5" />
                {busy === open.claimId ? "MAKING STICKER…" : "MAKE STICKER"}
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
