import { useCallback, useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { hasSupabaseConfig } from "@/lib/supabase-config";

export type Loot = { id: string; title: string; description: string; verification_prompt: string; xp: number; difficulty: number; rarity: "common" | "uncommon" | "rare" | "epic" | "legendary" };
export type Profile = { id: string; username: string; total_xp: number; level: number };
export type Claim = { id: string; loot_id: string; status: "pending" | "approved" | "rejected"; verification_reason: string | null; awarded_xp: number; created_at: string };

// Generated types are populated after the migration is applied to the linked Supabase project.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const db: any = supabase;

export function useLootDrop() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loot, setLoot] = useState<Loot[]>([]);
  const [claims, setClaims] = useState<Claim[]>([]);
  const [loading, setLoading] = useState(hasSupabaseConfig);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    if (!hasSupabaseConfig) return;
    setLoading(true); setError(null);
    try {
      let { data: { user } } = await db.auth.getUser();
      if (!user) {
        const { data, error: authError } = await db.auth.signInAnonymously();
        if (authError) throw new Error("Activează Anonymous Sign-Ins în Supabase Authentication pentru autentificarea cu username.");
        user = data.user;
      }
      const [profileResult, lootResult, claimsResult] = await Promise.all([
        db.from("profiles").select("id, username, total_xp, level").eq("id", user.id).maybeSingle(),
        db.from("loot_definitions").select("id, title, description, verification_prompt, xp, difficulty, rarity").eq("active", true),
        db.from("loot_claims").select("id, loot_id, status, verification_reason, awarded_xp, created_at").eq("user_id", user.id).order("created_at", { ascending: false }),
      ]);
      if (profileResult.error || lootResult.error || claimsResult.error) throw profileResult.error || lootResult.error || claimsResult.error;
      setProfile(profileResult.data); setLoot(lootResult.data ?? []); setClaims(claimsResult.data ?? []);
    } catch (cause) { setError(cause instanceof Error ? cause.message : "Nu am putut încărca datele de joc."); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { void refresh(); }, [refresh]);

  const chooseUsername = async (username: string) => {
    const cleaned = username.trim().replace(/\s+/g, " ");
    if (!/^[\p{L}\p{N}_ -]{3,24}$/u.test(cleaned)) throw new Error("Username-ul trebuie să aibă 3–24 caractere.");
    const { data: { user } } = await db.auth.getUser();
    if (!user) throw new Error("Sesiunea nu a fost inițializată.");
    const { error: insertError } = await db.from("profiles").insert({ id: user.id, username: cleaned });
    if (insertError) throw new Error(insertError.code === "23505" ? "Acest username este deja folosit." : insertError.message);
    await refresh();
  };

  const submitProof = async (lootItem: Loot, file: File) => {
    if (!profile) throw new Error("Alege mai întâi un username.");
    if (!file.type.startsWith("image/")) throw new Error("Alege o fotografie.");
    if (file.size > 8 * 1024 * 1024) throw new Error("Fotografia trebuie să aibă cel mult 8 MB.");
    const extension = file.name.split(".").pop()?.replace(/[^a-z0-9]/gi, "") || "jpg";
    const path = `${profile.id}/${crypto.randomUUID()}.${extension}`;
    const { error: uploadError } = await db.storage.from("loot-proofs").upload(path, file, { contentType: file.type, upsert: false });
    if (uploadError) throw new Error(uploadError.message);
    const { error: claimError } = await db.from("loot_claims").insert({ user_id: profile.id, loot_id: lootItem.id, photo_path: path });
    if (claimError) throw new Error(claimError.message);
    await refresh();
  };

  const today = new Date().toDateString();
  const approvedToday = claims.filter((claim) => new Date(claim.created_at).toDateString() === today && claim.status === "approved");
  return { configured: hasSupabaseConfig, profile, loot, claims, loading, error, refresh, chooseUsername, submitProof, foundToday: approvedToday.length, xpToday: approvedToday.reduce((sum, claim) => sum + claim.awarded_xp, 0) };
}
