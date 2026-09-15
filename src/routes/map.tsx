import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { Map as MapIcon } from "lucide-react";
import { useCollection } from "@/hooks/use-collection";
import { RARITY_STYLES } from "@/lib/loot-data";
import type { CollectionEntry } from "@/lib/loot.functions";

export const Route = createFileRoute("/map")({
  head: () => ({
    meta: [
      { title: "Map — Loot Drop" },
      { name: "description", content: "See on the map where you found every verified loot." },
      { property: "og:title", content: "Map — Loot Drop" },
      { property: "og:description", content: "See on the map where you found every verified loot." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
    links: [{ rel: "stylesheet", href: "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" }],
  }),
  component: MapPage,
});

function MapPage() {
  const { entries, loading, error } = useCollection();
  const located = entries.filter(
    (entry) => typeof entry.latitude === "number" && typeof entry.longitude === "number",
  );
  const [selected, setSelected] = useState<CollectionEntry | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<{ remove: () => void } | null>(null);

  useEffect(() => {
    let cancelled = false;
    let map: any = null;

    (async () => {
      if (!containerRef.current || located.length === 0) return;
      const L = (await import("leaflet")).default;
      if (cancelled || !containerRef.current) return;

      map = L.map(containerRef.current, { attributionControl: true });
      mapRef.current = map;
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 19,
        attribution: "© OpenStreetMap",
      }).addTo(map);

      const points: Array<[number, number]> = [];
      for (const entry of located) {
        const position: [number, number] = [entry.latitude as number, entry.longitude as number];
        points.push(position);
        const image = entry.stickerUrl ?? entry.photoUrl;
        const icon = L.divIcon({
          className: "",
          iconSize: [44, 44],
          iconAnchor: [22, 22],
          html: `<div style="width:44px;height:44px;border:3px solid #111;background:#fff;box-shadow:2px 2px 0 rgba(0,0,0,.5);overflow:hidden;display:grid;place-items:center">${
            image ? `<img src="${image}" style="width:100%;height:100%;object-fit:cover" alt="" />` : "?"
          }</div>`,
        });
        L.marker(position, { icon })
          .addTo(map)
          .on("click", () => setSelected(entry));
      }

      map.fitBounds(L.latLngBounds(points).pad(0.3), { maxZoom: 16 });
    })();

    return () => {
      cancelled = true;
      mapRef.current?.remove();
      mapRef.current = null;
    };
  }, [located.length]);

  return (
    <div className="space-y-4">
      <h1 className="font-pixel text-sm text-foreground">LOOT MAP</h1>
      {loading && <p className="font-pixel text-[9px] text-muted-foreground">LOADING PINS…</p>}
      {error && <p className="text-sm text-destructive">{error}</p>}

      {!loading && located.length === 0 ? (
        <div className="flex flex-col items-center gap-4 border-2 border-dashed border-outline bg-card p-10 text-center pixel-shadow">
          <MapIcon className="h-10 w-10 text-muted-foreground" />
          <p className="font-pixel text-[9px] text-foreground">NO PINS YET</p>
          <p className="text-sm text-muted-foreground">
            Allow location when you snap a proof photo and the spot lands on this map.
          </p>
          <Link
            to="/quest"
            className="border-2 border-outline bg-primary px-3 py-2 font-pixel text-[8px] text-primary-foreground pixel-shadow-sm pixel-press"
          >
            TODAY'S QUEST
          </Link>
        </div>
      ) : (
        <div
          ref={containerRef}
          className="h-[60vh] w-full border-2 border-outline bg-muted pixel-shadow"
          style={{ zIndex: 0 }}
        />
      )}

      {selected && (
        <div className="fixed inset-0 z-[1000] grid place-items-center bg-black/70 p-4" onClick={() => setSelected(null)}>
          <div
            className="w-full max-w-sm space-y-3 border-2 border-outline bg-card p-4 pixel-shadow"
            onClick={(event) => event.stopPropagation()}
          >
            <h2 className="font-pixel text-[10px] text-foreground">{selected.title.toUpperCase()}</h2>
            {selected.photoUrl && (
              <img
                src={selected.photoUrl}
                alt={`Proof photo for ${selected.title}`}
                className="w-full border-2 border-outline"
              />
            )}
            <div className="flex items-center justify-between">
              <span
                className={`border-2 border-outline px-1 py-0.5 font-pixel text-[6px] ${RARITY_STYLES[selected.rarity].badge}`}
              >
                {RARITY_STYLES[selected.rarity].label}
              </span>
              <span className="font-pixel text-[7px] text-primary">+{selected.xp}XP</span>
            </div>
            <p className="font-pixel text-[6px] text-muted-foreground">
              {new Date(selected.foundAt).toLocaleString()}
            </p>
            <button
              onClick={() => setSelected(null)}
              className="w-full border-2 border-outline bg-secondary py-2 font-pixel text-[8px] text-secondary-foreground pixel-shadow-sm pixel-press"
            >
              CLOSE
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
