import { useState, type ReactNode } from "react";
import { useLootDrop } from "@/hooks/use-loot-drop";
import { useLanguage } from "@/lib/i18n";

export function AuthGate({ children }: { children: ReactNode }) {
  const { configured, profile, loading, error, signUp, signIn } = useLootDrop();
  const { t } = useLanguage();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [mode, setMode] = useState<"signin" | "signup">("signup");
  const [busy, setBusy] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  if (!configured)
    return (
      <div className="border-2 border-outline bg-card p-4 pixel-shadow">
        <h1 className="font-pixel text-sm">LOOT DROP</h1>
        <p className="mt-3 text-sm text-muted-foreground">
          {t("pageFailed")}
        </p>
      </div>
    );

  if (loading)
    return <p className="font-pixel text-[9px] text-muted-foreground">{t("loading")}</p>;

  if (profile) return <>{children}</>;

  return (
    <div className="space-y-4 border-2 border-outline bg-card p-4 pixel-shadow">
      <h1 className="font-pixel text-sm">{mode === "signup" ? t("createHunter") : t("welcomeBack")}</h1>
      <p className="text-sm text-muted-foreground">
        {t("authHint")}
      </p>
      <input
        value={username}
        onChange={(event) => setUsername(event.target.value)}
        maxLength={24}
        placeholder={t("username")}
        autoComplete="username"
        className="w-full border-2 border-outline bg-background px-3 py-2 text-sm"
      />
      <input
        value={password}
        type="password"
        onChange={(event) => setPassword(event.target.value)}
        placeholder={t("password")}
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
            setAuthError(cause instanceof Error ? cause.message : t("signInFailed"));
          } finally {
            setBusy(false);
          }
        }}
        className="w-full border-2 border-outline bg-primary py-2 font-pixel text-[9px] text-primary-foreground pixel-shadow-sm disabled:opacity-60"
      >
        {busy ? "…" : mode === "signup" ? t("startHunting") : t("signIn")}
      </button>
      <button
        onClick={() => {
          setMode(mode === "signup" ? "signin" : "signup");
          setAuthError(null);
        }}
        className="w-full font-pixel text-[8px] text-muted-foreground underline"
      >
        {mode === "signup" ? t("haveAccount") : t("createAccount")}
      </button>
      {authError && <p className="text-sm text-destructive">{authError}</p>}
      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  );
}
