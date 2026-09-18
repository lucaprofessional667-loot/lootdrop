import { Link, useRouterState } from "@tanstack/react-router";
import {
  Bell,
  Home,
  Compass,
  Backpack,
  Map as MapIcon,
  User,
  Sun,
  Moon,
  Package,
} from "lucide-react";
import { useEffect, useState, type ReactNode } from "react";
import { AuthGate } from "@/components/AuthGate";
import { useLanguage } from "@/lib/i18n";

function ThemeToggle() {
  const { t } = useLanguage();
  const [dark, setDark] = useState(false);

  useEffect(() => {
    const stored = window.localStorage.getItem("lootdrop-theme");
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const initial = stored ? stored === "dark" : prefersDark;
    setDark(initial);
    document.documentElement.classList.toggle("dark", initial);
  }, []);

  const toggle = () => {
    const next = !dark;
    setDark(next);
    document.documentElement.classList.toggle("dark", next);
    window.localStorage.setItem("lootdrop-theme", next ? "dark" : "light");
  };

  return (
    <button
      onClick={toggle}
      aria-label={dark ? t("switchLight") : t("switchDark")}
      className="grid h-9 w-9 place-items-center border-2 border-outline bg-secondary text-secondary-foreground pixel-shadow-sm pixel-press"
    >
      {dark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
    </button>
  );
}

const NAV_ITEMS = [
  { to: "/explore", label: "Explore", icon: Compass },
  { to: "/collection", label: "Loot", icon: Backpack },
  { to: "/", label: "Home", icon: Home },
  { to: "/map", label: "Map", icon: MapIcon },
  { to: "/profile", label: "Profile", icon: User },
] as const;

export function AppShell({ children }: { children: ReactNode }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const { language, toggleLanguage, t } = useLanguage();

  return (
    <div className="flex min-h-screen flex-col bg-background bg-dots">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b-2 border-outline bg-card">
        <div className="mx-auto flex h-14 w-full max-w-md items-center justify-between px-4">
          <Link to="/" className="flex items-center gap-2">
            <span className="grid h-8 w-8 place-items-center border-2 border-outline bg-primary text-primary-foreground pixel-shadow-sm">
              <Package className="h-4 w-4" />
            </span>
            <span className="font-pixel text-[11px] tracking-tight text-foreground">
              LOOT<span className="text-primary">DROP</span>
            </span>
          </Link>
          <div className="flex items-center gap-2">
            <button
              key={language}
              onClick={toggleLanguage}
              aria-label={t("switchLanguage")}
              title={t("switchLanguage")}
              className="grid h-9 w-9 animate-scale-in place-items-center border-2 border-outline bg-secondary text-lg pixel-shadow-sm pixel-press"
            >
              <span aria-hidden="true">{language === "en" ? "🇺🇸" : "🇷🇴"}</span>
            </button>
            <ThemeToggle />
            <button
              aria-label={t("notifications")}
              className="relative grid h-9 w-9 place-items-center border-2 border-outline bg-secondary text-secondary-foreground pixel-shadow-sm pixel-press"
            >
              <Bell className="h-4 w-4" />
              <span className="absolute -top-1.5 -right-1.5 grid h-4 w-4 place-items-center border border-outline bg-destructive font-pixel text-[7px] text-destructive-foreground">
                3
              </span>
            </button>
            <Link
              to="/profile"
              aria-label={t("profile")}
              className="grid h-9 w-9 place-items-center border-2 border-outline bg-secondary text-secondary-foreground pixel-shadow-sm pixel-press"
            >
              <User className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </header>

      {/* Page content */}
      <main className="mx-auto w-full max-w-md flex-1 px-4 pt-4 pb-24">
        <AuthGate>{children}</AuthGate>
      </main>

      {/* Bottom navigation (mobile-first) */}
      <nav className="fixed inset-x-0 bottom-0 z-40 border-t-2 border-outline bg-card">
        <div className="mx-auto grid h-16 w-full max-w-md grid-cols-5">
          {NAV_ITEMS.map(({ to, label, icon: Icon }) => {
            const active = pathname === to;
            return (
              <Link
                key={to}
                to={to}
                className={`flex flex-col items-center justify-center gap-1 ${
                  active
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-secondary hover:text-secondary-foreground"
                }`}
              >
                <Icon className="h-5 w-5" />
                <span className="font-pixel text-[7px]">{t(label.toLowerCase() as "explore" | "loot" | "home" | "map" | "profile").toUpperCase()}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
