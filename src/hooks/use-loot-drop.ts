import { useCallback, useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { hasSupabaseConfig } from "@/lib/supabase-config";
import { verifyClaim } from "@/lib/loot.functions";
import { ensureDailyQuest, questDateFor } from "@/lib/quest.functions";
import { compressImage, getCurrentCoords } from "@/lib/image-compress";

export type Loot = { id: string; title: string; description: string; verification_prompt: string; xp: number; difficulty: number; rarity: "common" | "uncommon" | "rare" | "epic" | "legendary"; shared: boolean };
export type Profile = { id: string; username: string; total_xp: number; level: number };
export type Claim = { id: string; loot_id: string; status: "pending" | "approved" | "rejected"; verification_reason: string | null; awarded_xp: number; created_at: string };

const usernameToEmail = (username: string) =>
  `${username.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")}@lootdrop.player`;

export function useLootDrop() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [signedIn, setSignedIn] = useState(false);
  const [loot, setLoot] = useState<Loot[]>([]);
  const [claims, setClaims] = useState<Claim[]>([]);
  const [loading, setLoading] = useState(hasSupabaseConfig);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    if (!hasSupabaseConfig) return;
    setLoading(true); setError(null);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      setSignedIn(Boolean(user));
      if (!user) { setProfile(null); setLoot([]); setClaims([]); return; }
      const questDate = questDateFor();
      try {
        await ensureDailyQuest();
      } catch (cause) {
        setError(cause instanceof Error ? cause.message : "Could not generate today's quest.");
      }
      const [profileResult, lootResult, claimsResult] = await Promise.all([
        supabase.from("profiles").select("id, username, total_xp, level").eq("id", user.id).maybeSingle(),
        supabase.from("loot_definitions").select("id, title, description, verification_prompt, xp, difficulty, rarity, user_id").eq("active", true).eq("quest_date", questDate).order("xp"),
        supabase.from("loot_claims").select("id, loot_id, status, verification_reason, awarded_xp, created_at").eq("user_id", user.id).order("created_at", { ascending: false }),
      ]);
      if (profileResult.error || lootResult.error || claimsResult.error) throw profileResult.error || lootResult.error || claimsResult.error;
      setProfile(profileResult.data ? { ...profileResult.data, level: profileResult.data.level ?? 1 } : null);
      setLoot((lootResult.data ?? []).map(({ user_id, ...item }) => ({ ...item, shared: user_id === null })));
      setClaims(claimsResult.data ?? []);
    } catch (cause) { setError(cause instanceof Error ? cause.message : "Nu am putut încărca datele de joc."); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { void refresh(); }, [refresh]);

  const signUp = async (username: string, password: string) => {
    const cleaned = username.trim();
    if (!/^[a-zA-Z0-9_ -]{3,24}$/.test(cleaned)) throw new Error("Username: 3–24 characters, letters, numbers, _ or -.");
    if (password.length < 6) throw new Error("Password must be at least 6 characters.");
    const { data, error: signUpError } = await supabase.auth.signUp({ email: usernameToEmail(cleaned), password });
    if (signUpError) throw new Error(signUpError.message.includes("already") ? "That username is already taken." : signUpError.message);
    if (!data.user) throw new Error("Could not create the account.");
    const { error: insertError } = await supabase.from("profiles").insert({ id: data.user.id, username: cleaned });
    if (insertError && insertError.code !== "23505") throw new Error(insertError.message);
    await refresh();
  };

  const signIn = async (username: string, password: string) => {
    const { error: signInError } = await supabase.auth.signInWithPassword({ email: usernameToEmail(username), password });
    if (signInError) throw new Error("Wrong username or password.");
    await refresh();
  };

  const signOut = async () => { await supabase.auth.signOut(); await refresh(); };

  const submitProof = async (lootItem: Loot, file: File) => {
    if (!profile) throw new Error("Sign in first.");
    if (!file.type.startsWith("image/")) throw new Error("Choose a photo.");
    if (file.size > 20 * 1024 * 1024) throw new Error("The photo must be 20 MB or smaller.");
    const [compressed, coords] = await Promise.all([compressImage(file), getCurrentCoords()]);
    if (compressed.size > 8 * 1024 * 1024) throw new Error("The photo is too large, try another one.");
    const extension = compressed.name.split(".").pop()?.replace(/[^a-z0-9]/gi, "") || "jpg";
    const path = `${profile.id}/${crypto.randomUUID()}.${extension}`;
    const { error: uploadError } = await supabase.storage.from("loot-proofs").upload(path, compressed, { contentType: compressed.type, upsert: false });
    if (uploadError) throw new Error(uploadError.message);
    const { data: claim, error: claimError } = await supabase
      .from("loot_claims")
      .insert({
        user_id: profile.id,
        loot_id: lootItem.id,
        photo_path: path,
        latitude: coords?.latitude ?? null,
        longitude: coords?.longitude ?? null,
      })
      .select("id")
      .single();
    if (claimError) throw new Error(claimError.message);
    await refresh();
    try {
      await verifyClaim({ data: { claimId: claim.id } });
    } finally {
      await refresh();
    }
  };

  const today = new Date().toDateString();
  const approvedToday = claims.filter((claim) => new Date(claim.created_at).toDateString() === today && claim.status === "approved");
  return { configured: hasSupabaseConfig, signedIn, profile, loot, claims, loading, error, refresh, signUp, signIn, signOut, submitProof, foundToday: approvedToday.length, xpToday: approvedToday.reduce((sum, claim) => sum + claim.awarded_xp, 0) };
}
