import { createFileRoute } from "@tanstack/react-router";
import { LogOut } from "lucide-react";
import { useLootDrop } from "@/hooks/use-loot-drop";
import avatarImg from "../assets/avatar.png";
import { useLanguage } from "@/lib/i18n";

export const Route = createFileRoute("/profile")({
  head: () => ({
    meta: [
      { title: "Profile — Loot Drop" },
      { name: "description", content: "Your hunter profile: level, XP and account." },
      { property: "og:title", content: "Profile — Loot Drop" },
      { property: "og:description", content: "Your hunter profile: level, XP and account." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: ProfilePage,
});

function ProfilePage() {
  const { profile, claims, signOut } = useLootDrop();
  const { t } = useLanguage();
  const approved = claims.filter((claim) => claim.status === "approved");
  const xp = profile?.total_xp ?? 0;
  const levelFloor = Math.max(0, (profile?.level ?? 1) - 1) * 500;

  return (
    <div className="space-y-4">
      <section className="border-2 border-outline bg-card p-4 pixel-shadow">
        <div className="flex items-center gap-3">
          <img
            src={avatarImg}
            alt={t("pixelAvatar")}
            width={512}
            height={512}
            className="h-16 w-16 border-2 border-outline bg-secondary pixel-shadow-sm [image-rendering:pixelated]"
          />
          <div className="min-w-0">
             <h1 className="truncate text-lg font-bold text-card-foreground">{profile?.username ?? t("hunter")}</h1>
            <div className="mt-0.5 inline-block border-2 border-outline bg-accent px-1.5 py-0.5 font-pixel text-[8px] text-accent-foreground">
               {t("level")} {profile?.level ?? 1}
            </div>
          </div>
        </div>
      </section>

      <section className="grid grid-cols-2 gap-3">
        <div className="border-2 border-outline bg-card p-3 pixel-shadow">
           <p className="font-pixel text-[7px] text-muted-foreground">{t("totalXp")}</p>
          <p className="mt-2 font-pixel text-xl text-card-foreground">{xp}</p>
        </div>
        <div className="border-2 border-outline bg-card p-3 pixel-shadow">
           <p className="font-pixel text-[7px] text-muted-foreground">{t("lootFound")}</p>
          <p className="mt-2 font-pixel text-xl text-card-foreground">{approved.length}</p>
        </div>
      </section>

      <p className="font-pixel text-[8px] text-muted-foreground">
         {xp - levelFloor} / 500 {t("xpToNext")}
      </p>

      <button
        onClick={() => void signOut()}
        className="inline-flex w-full items-center justify-center gap-2 border-2 border-outline bg-secondary py-2 font-pixel text-[9px] text-secondary-foreground pixel-shadow-sm pixel-press"
      >
         <LogOut className="h-4 w-4" /> {t("signOut")}
      </button>
    </div>
  );
}
