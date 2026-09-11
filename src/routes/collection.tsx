import { createFileRoute } from "@tanstack/react-router";
import { Backpack } from "lucide-react";

export const Route = createFileRoute("/collection")({
  head: () => ({
    meta: [
      { title: "Collection — Loot Drop" },
      { name: "description", content: "Your collected loot." },
      { property: "og:title", content: "Collection — Loot Drop" },
      { property: "og:description", content: "Your collected loot." },
    ],
  }),
  component: CollectionPage,
});

function CollectionPage() {
  return (
    <div className="flex flex-col items-center gap-4 border-2 border-dashed border-outline bg-card p-10 text-center pixel-shadow">
      <Backpack className="h-10 w-10 text-muted-foreground" />
      <h1 className="font-pixel text-xs text-foreground">COLLECTION</h1>
      <p className="text-sm text-muted-foreground">
        Your full loot stash will live here.
      </p>
    </div>
  );
}
