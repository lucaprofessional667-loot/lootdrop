import { createFileRoute } from "@tanstack/react-router";
import { Map as MapIcon } from "lucide-react";

export const Route = createFileRoute("/map")({
  head: () => ({
    meta: [
      { title: "Map — Loot Drop" },
      { name: "description", content: "Loot drop map." },
      { property: "og:title", content: "Map — Loot Drop" },
      { property: "og:description", content: "Loot drop map." },
    ],
  }),
  component: MapPage,
});

function MapPage() {
  return (
    <div className="flex flex-col items-center gap-4 border-2 border-dashed border-outline bg-card p-10 text-center pixel-shadow">
      <MapIcon className="h-10 w-10 text-muted-foreground" />
      <h1 className="font-pixel text-xs text-foreground">MAP</h1>
      <p className="text-sm text-muted-foreground">
        The world map is being drawn, tile by tile.
      </p>
    </div>
  );
}
