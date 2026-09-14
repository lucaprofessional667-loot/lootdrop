import { useState, type ReactNode } from "react";
import { useLootDrop } from "@/hooks/use-loot-drop";

export function AuthGate({ children }: { children: ReactNode }) {
  const { configured, profile, loading, error, signUp, signIn } = useLootDrop();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [mode, setMode] = useState<"signin" | "signup">("signup");
  const [busy, setBusy] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  if (!configured)
    return (
      <div className="border-2 border-outline bg-card p-4 pixel-shadow">
        <h1 className="font-pixel text-sm">CONNECT SUPABASE</h1>
        <p className="mt-3 text-sm text-muted-foreground">
          Add VITE_SUPABASE_URL and VITE_SUPABASE_PUBLISHABLE_KEY, then reload.
        </p>
      </div>
    );

  if (loading)
    return <p className="font-pixel text-[9px] text-muted-foreground">LOADING…</p>;

  if (profile) return <>{children}</>;

  return (
    <div className="space-y-4 border-2 border-outline bg-card p-4 pixel-shadow">
      <h1 className="font-pixel text-sm">{mode === "signup" ? "CREATE YOUR HUNTER" : "WELCOME BACK"}</h1>
      <p className="text-sm text-muted-foreground">
        Pick a username once — you stay signed in on this device.
      </p>
      <input
        value={username}
        onChange={(event) => setUsername(event.target.value)}
        maxLength={24}
        placeholder="Username"
        autoComplete="username"
        className="w-full border-2 border-outline bg-background px-3 py-2 text-sm"
      />
      <input
        value={password}
        type="password"
        onChange={(event) => setPassword(event.target.value)}
        placeholder="Password"
        autoComplete={mode === "signup" ? "new-password" : "current-password"}
        className="w-full border-2 border-outline bg-background px-3 py-2 text-sm"
      />
      <button
        disabled={busy}
        onClick={async () => {
          setBusy(true);
          setAuthError(null);
          try {
            await (mode === "signup" ? signUp(username, password) : signIn(username, password));
          } catch (cause) {
            setAuthError(cause instanceof Error ? cause.message : "Could not sign in.");
          } finally {
            setBusy(false);
          }
        }}
        className="w-full border-2 border-outline bg-primary py-2 font-pixel text-[9px] text-primary-foreground pixel-shadow-sm disabled:opacity-60"
      >
        {busy ? "…" : mode === "signup" ? "START HUNTING" : "SIGN IN"}
      </button>
      <button
        onClick={() => {
          setMode(mode === "signup" ? "signin" : "signup");
          setAuthError(null);
        }}
        className="w-full font-pixel text-[8px] text-muted-foreground underline"
      >
        {mode === "signup" ? "I ALREADY HAVE AN ACCOUNT" : "CREATE A NEW ACCOUNT"}
      </button>
      {authError && <p className="text-sm text-destructive">{authError}</p>}
      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  );
}
