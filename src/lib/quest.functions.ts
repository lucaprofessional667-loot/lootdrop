import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

type Rarity = "common" | "uncommon" | "rare" | "epic" | "legendary";

const RARITY_SPEC: Record<Rarity, { xp: number; difficulty: number }> = {
  common: { xp: 50, difficulty: 1 },
  uncommon: { xp: 120, difficulty: 2 },
  rare: { xp: 250, difficulty: 3 },
  epic: { xp: 500, difficulty: 4 },
  legendary: { xp: 1000, difficulty: 5 },
};

const PERSONAL_RARITIES: Rarity[] = ["uncommon", "rare", "epic", "legendary"];

type GeneratedLoot = { 
  title: string; 
  description: string; 
  verification_prompt: string;
  title_ro: string;
  description_ro: string;
  verification_prompt_ro: string;
};

export function questDateFor(now = new Date()) {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Europe/Bucharest",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(now);
}

async function generateLoot(rarities: Rarity[], seed: string): Promise<Record<string, GeneratedLoot>> {
  const apiKey = process.env["LOVABLE_API_KEY"];
  if (!apiKey) throw new Error("AI quest generation is not configured.");

  const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
    method: "POST",
    headers: { "Content-Type": "application/json", "Lovable-API-Key": apiKey },
    body: JSON.stringify({
      model: "google/gemini-3.8-flash",
      messages: [
        {
          role: "system",
          content:
            "You design daily real-world scavenger-hunt objectives for a retro arcade game. Each objective must be a concrete thing a player can photograph in almost any town or city. Provide every field in both English and Romanian. Keep titles under 28 chars and descriptions under 90 chars.",
        },
        {
          role: "user",
          content: `Seed: ${seed}. Invent one fresh objective for each of these rarities: ${rarities.join(", ")}.`,
        },
      ],
      response_format: {
        type: "json_schema",
        json_schema: {
          name: "daily_quest",
          strict: true,
          schema: {
            type: "object",
            additionalProperties: false,
            properties: Object.fromEntries(
              rarities.map((rarity) => [
                rarity,
                {
                  type: "object",
                  additionalProperties: false,
                  properties: {
                    title: { type: "string" },
                    description: { type: "string" },
                    verification_prompt: { type: "string" },
                    title_ro: { type: "string" },
                    description_ro: { type: "string" },
                    verification_prompt_ro: { type: "string" },
                  },
                  required: ["title", "description", "verification_prompt", "title_ro", "description_ro", "verification_prompt_ro"],
                },
              ]),
            ),
            required: rarities,
          },
        },
      },
    }),
  });

  if (!response.ok) throw new Error(`Quest generation failed (${response.status}).`);
  const payload = await response.json();
  const content = payload.choices?.[0]?.message?.content;
  if (!content) throw new Error("Quest generation returned no answer.");
  return JSON.parse(content);
}

function toRow(rarity: Rarity, loot: GeneratedLoot, questDate: string, userId: string | null) {
  return {
    title: loot.title.slice(0, 60),
    description: loot.description.slice(0, 160),
    verification_prompt: loot.verification_prompt.slice(0, 400),
    title_ro: loot.title_ro.slice(0, 60),
    description_ro: loot.description_ro.slice(0, 160),
    verification_prompt_ro: loot.verification_prompt_ro.slice(0, 400),
    rarity,
    xp: RARITY_SPEC[rarity].xp,
    difficulty: RARITY_SPEC[rarity].difficulty,
    quest_date: questDate,
    user_id: userId,
    active: true,
  };
}

export const ensureDailyQuest = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { supabase, userId } = context;
    const questDate = questDateFor();
    const { data: existing, error } = await supabase.from("loot_definitions").select("id, rarity, user_id").eq("quest_date", questDate);
    if (error) throw new Error(error.message);

    const hasShared = (existing ?? []).some((row) => row.user_id === null);
    const ownRarities = new Set((existing ?? []).filter((row) => row.user_id === userId).map((row) => row.rarity));
    const missingPersonal = PERSONAL_RARITIES.filter((rarity) => !ownRarities.has(rarity));
    if (hasShared && missingPersonal.length === 0) return { questDate, created: 0 };

    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const rows = [];

    if (!hasShared) {
      const generated = await generateLoot(["common"], `shared-${questDate}`);
      if (generated["common"]) rows.push(toRow("common", generated["common"], questDate, null));
    }
    if (missingPersonal.length > 0) {
      const generated = await generateLoot(missingPersonal, `${userId}-${questDate}`);
      for (const rarity of missingPersonal) {
        if (generated[rarity]) rows.push(toRow(rarity, generated[rarity], questDate, userId));
      }
    }
    for (const row of rows) {
      const { error: insertError } = await supabaseAdmin.from("loot_definitions").insert(row);
      if (insertError && insertError.code !== "23505") throw new Error(insertError.message);
    }
    return { questDate, created: rows.length };
  });
