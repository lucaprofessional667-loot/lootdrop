import { createFileRoute } from "@tanstack/react-router";
import { User } from "lucide-react";

export const Route = createFileRoute("/profile")({
  head: () => ({
    meta: [
      { title: "Profile — Loot Drop" },
      { name: "description", content: "Your hunter profile." },
      { property: "og:title", content: "Profile — Loot Drop" },
      { property: "og:description", content: "Your hunter profile." },
    ],
  }),
  component: ProfilePage,
});

function ProfilePage() {
  return (
    <div className="flex flex-col items-center gap-4 border-2 border-dashed border-outline bg-card p-10 text-center pixel-shadow">
      <User className="h-10 w-10 text-muted-foreground" />
      <h1 className="font-pixel text-xs text-foreground">PROFILE</h1>
      <p className="text-sm text-muted-foreground">
        Stats, badges and settings coming soon.
      </p>
    </div>
  );
}
