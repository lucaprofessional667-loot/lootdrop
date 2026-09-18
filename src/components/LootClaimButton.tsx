import { Camera, CheckCircle2, Clock3, XCircle } from "lucide-react";
import { useRef, useState } from "react";
import type { Claim, Loot } from "@/hooks/use-loot-drop";
import { useLanguage } from "@/lib/i18n";

export function LootClaimButton({ loot, claim, onSubmit }: { loot: Loot; claim: Claim | undefined; onSubmit: (loot: Loot, file: File) => Promise<void> }) {
  const { t } = useLanguage();
  const inputRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  if (claim?.status === "approved") return <span className="inline-flex items-center gap-1 font-pixel text-[8px] text-rarity-uncommon"><CheckCircle2 className="h-4 w-4" /> {t("verified")} +{claim.awarded_xp} XP</span>;
  if (claim?.status === "pending") return <span className="inline-flex items-center gap-1 font-pixel text-[8px] text-rarity-rare"><Clock3 className="h-4 w-4" /> {t("verifying")}</span>;
  return <div className="mt-3"><input ref={inputRef} className="hidden" type="file" accept="image/*" capture="environment" onChange={async (event) => { const file = event.target.files?.[0]; if (!file) return; setBusy(true); setMessage(null); try { await onSubmit(loot, file); setMessage(t("submitted")); } catch (cause) { setMessage(cause instanceof Error ? cause.message : t("submitFailed")); } finally { setBusy(false); event.target.value = ""; } }} />
    <button disabled={busy} onClick={() => inputRef.current?.click()} className="inline-flex w-full items-center justify-center gap-2 border-2 border-outline bg-primary px-3 py-2 font-pixel text-[8px] text-primary-foreground pixel-shadow-sm pixel-press disabled:opacity-60"><Camera className="h-4 w-4" /> {busy ? t("uploading") : t("takePhoto")}</button>
    {claim?.status === "rejected" && <p className="mt-2 flex gap-1 text-xs text-destructive"><XCircle className="mt-0.5 h-3.5 w-3.5 shrink-0" />{claim.verification_reason || t("noMatch")}</p>}{message && <p className="mt-2 text-xs text-muted-foreground">{message}</p>}</div>;
}
