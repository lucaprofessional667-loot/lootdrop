import { createFileRoute, Link } from "@tanstack/react-router";
import { LogOut, Settings2, Key } from "lucide-react";
import avatarImg from "../assets/avatar.png";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Auth — Loot Drop" },
      { name: "description", content: "Autentificare și setări cont." },
      { property: "og:title", content: "Auth — Loot Drop" },
      { property: "og:description", content: "Autentificare și setări cont." },
    ],
  }),
  component: AuthPage,
});

function AuthPage() {
  const { configured, profile, loading, error, chooseUsername, setUsernameError } = useLootDrop();

  if (!configured) {
    return (
      <div className="flex flex-col items-center gap-4 border-2 border-dashed border-outline bg-card p-10 text-center pixel-shadow">
        <Settings2 className="h-10 w-10 text-muted-foreground" />
        <h1 className="font-pixel text-xs text-foreground">CONFIGURAȚIE NECESSARĂ</h1>
        <p className="text-sm text-muted-foreground">
          Supabase-ul nu este configurat. Contactează administratorul pentru a activa autentificarea.
        </p>
      </div>
    );
  }

  const user = profile ? { username: profile.username, id: profile.id } : null;

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh]">
        <Key className="h-8 w-8 animate-spin text-primary" />
        <p className="mt-4 font-pixel text-sm text-muted-foreground">ÎNCARCĂ SESIUNE...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="border-2 border-dashed border-outline bg-card p-10 text-center pixel-shadow">
        <h1 className="font-pixel text-sm text-destructive">{error}</h1>
        <Link to="/" className="mt-4 inline-block font-pixel text-[9px] text-primary hover:underline">
          Înapiri pe Home
        </Link>
      </div>
    );
  }

  // User is logged in and has a username - show welcome/ logout
  if (user) {
    return (
      <div className="flex flex-col items-center gap-4 border-2 border-outline bg-card p-6 pixel-shadow">
        <img
          src={avatarImg}
          alt={`Avatar de ${user.username}`}
          width={128}
          height={128}
          className="h-20 w-20 rounded-full border-2 border-primary [image-rendering:pixelated]"
        />
        <div className="text-center">
          <h1 className="font-pixel text-xl text-foreground">{user.username}</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Bun venit în Loot Drop! Ai {profile?.level || 0} nivel.
          </p>
        </div>
        <div className="flex flex-wrap justify-center gap-2 mt-4">
          <Link
            to="/quest"
            className="border-2 border-outline bg-primary px-4 py-2 font-pixel text-[10px] text-primary-foreground pixel-shadow-sm"
          >
            Pleacă în Căutare
          </Link>
          <Link
            to="/"
            className="border-2 border-outline bg-background px-4 py-2 font-pixel text-[10px] text-foreground pixel-shadow-sm"
          >
            Home
          </Link>
          <button
            onClick={async () => {
              await fetch("/api/auth/signout", { method: "POST" });
              // Optionally navigate to /auth or / for logout
            }}
            className="border-2 border-dashed border-destructive px-4 py-2 font-pixel text-[10px] text-destructive hover:bg-destructive/5 pixel-shadow-sm"
          >
            <LogOut className="inline h-3.5 w-3.5 mr-1.5" />
            Deconectare
          </button>
        </div>
      </div>
    );
  }

  // No user logged in - show login/signup form
  return (
    <div className="flex flex-col items-center gap-4 border-2 border-dashed border-outline bg-card p-10 text-center pixel-shadow">
      <Key className="h-12 w-12 text-primary" />
      <h1 className="font-pixel text-lg text-foreground">AUTENTIFICARE</h1>
      <p className="text-sm text-muted-foreground max-w-md">
        Fă-ți cont gratuit și începe aventura de hunting! Primești XP și niveluri pentru fiecare loot găsit.
      </p>

      {!user && (
        <div className="w-full max-w-md mt-2 space-y-3">
          <input
            autoFocus
            id="username"
            value={""} // Will be managed by state
            onChange={(e) => {}} // Will be managed
            maxLength={24}
            placeholder="Alege un username (3-24 caractere)"
            className="w-full border-2 border-outline bg-background px-3 py-2 text-sm font-pixel"
          />
          <button
            onClick={async () => {}} // Will be wired
            className="w-full border-2 border-primary bg-primary pixel-shadow pixel-press text-[10px] text-primary-foreground hover:bg-primary/90"
          >
            Începe Căutarea
          </button>
        </div>
      )}

      <p className="text-xs text-muted-foreground mt-4">
        Autentificare anonimă cu Supabase. Username-ul este doar pentru afișaj în joc.
      </p>
    </div>
  );
}