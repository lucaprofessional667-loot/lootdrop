import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

type Verdict = { approved: boolean; reason: string };

function toDataUrl(bytes: Uint8Array, type: string) {
  let binary = "";
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return `data:${type || "image/jpeg"};base64,${btoa(binary)}`;
}

function base64ToBytes(base64: string) {
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let index = 0; index < binary.length; index += 1) bytes[index] = binary.charCodeAt(index);
  return bytes;
}

async function verifyPhotoWithAI(prompt: string, dataUrl: string): Promise<Verdict> {
  const apiKey = process.env["LOVABLE_API_KEY"];
  if (!apiKey) throw new Error("AI verification is not configured.");

  const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
    method: "POST",
    headers: { "Content-Type": "application/json", "Lovable-API-Key": apiKey },
    body: JSON.stringify({
      model: "google/gemini-3.8-flash",
      messages: [
        {
          role: "system",
          content:
            "You verify real-world scavenger-hunt photos. Be fair but strict: approve only if the photo plausibly satisfies the requirement. Reject screenshots, drawings of the subject, or clearly unrelated photos. Reply with JSON only.",
        },
        {
          role: "user",
          content: [
            { type: "text", text: `Requirement: ${prompt}\nDoes this photo satisfy it?` },
            { type: "image_url", image_url: { url: dataUrl } },
          ],
        },
      ],
      response_format: {
        type: "json_schema",
        json_schema: {
          name: "verdict",
          strict: true,
          schema: {
            type: "object",
            additionalProperties: false,
            properties: {
              approved: { type: "boolean" },
              reason: { type: "string", description: "One short sentence explaining the decision." },
            },
            required: ["approved", "reason"],
          },
        },
      },
    }),
  });

  if (response.status === 429) throw new Error("Too many verifications right now. Try again in a moment.");
  if (response.status === 402) throw new Error("AI credits are exhausted. Add credits to keep verifying photos.");
  if (!response.ok) throw new Error(`Photo verification failed (${response.status}).`);

  const payload = (await response.json()) as { choices?: Array<{ message?: { content?: string } }> };
  const content = payload.choices?.[0]?.message?.content;
  if (!content) throw new Error("Photo verification returned no answer.");
  const parsed = JSON.parse(content) as Verdict;
  return { approved: Boolean(parsed.approved), reason: String(parsed.reason || "") };
}

/** Cuts the requested object out of the proof photo and returns a paper-sticker PNG. */
async function makeStickerFromPhoto(subject: string, dataUrl: string): Promise<Uint8Array | null> {
  const apiKey = process.env["LOVABLE_API_KEY"];
  if (!apiKey) return null;
  try {
    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: { "Content-Type": "application/json", "Lovable-API-Key": apiKey },
      body: JSON.stringify({
        model: "google/gemini-3.1-flash-image",
        modalities: ["image", "text"],
        messages: [
          {
            role: "user",
            content: [
              {
                type: "text",
                text: `Cut out the main subject of this photo (${subject}) and turn it into a die-cut paper sticker: keep the real photographic subject exactly as it is, remove the entire background, and add a thick clean white border following the subject silhouette, with a soft drop shadow. Output only the sticker on a plain solid white background, centered, square framing.`,
              },
              { type: "image_url", image_url: { url: dataUrl } },
            ],
          },
        ],
      }),
    });
    if (!response.ok) return null;
    const payload = (await response.json()) as {
      choices?: Array<{ message?: { images?: Array<{ image_url?: { url?: string } }> } }>;
    };
    const url = payload.choices?.[0]?.message?.images?.[0]?.image_url?.url;
    const base64 = url?.split(",")[1];
    if (!base64) return null;
    return base64ToBytes(base64);
  } catch {
    return null;
  }
}

async function buildSticker(claimId: string, userId: string, subject: string, dataUrl: string) {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const sticker = await makeStickerFromPhoto(subject, dataUrl);
  if (!sticker) {
    await supabaseAdmin.from("loot_claims").update({ sticker_status: "failed" }).eq("id", claimId);
    return null;
  }
  const path = `${userId}/${claimId}.png`;
  const { error: uploadError } = await supabaseAdmin.storage
    .from("loot-stickers")
    .upload(path, sticker, { contentType: "image/png", upsert: true });
  if (uploadError) {
    await supabaseAdmin.from("loot_claims").update({ sticker_status: "failed" }).eq("id", claimId);
    return null;
  }
  await supabaseAdmin
    .from("loot_claims")
    .update({ sticker_path: path, sticker_status: "ready" })
    .eq("id", claimId);
  return path;
}

export const verifyClaim = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: { claimId: string }) => {
    if (!input?.claimId) throw new Error("Missing claim id.");
    return { claimId: input.claimId };
  })
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context;
    const { data: claim, error: claimError } = await supabase
      .from("loot_claims")
      .select("id, user_id, status, photo_path, loot_id")
      .eq("id", data.claimId)
      .maybeSingle();
    if (claimError) throw new Error(claimError.message);
    if (!claim || claim.user_id !== userId) throw new Error("Claim not found.");
    if (claim.status !== "pending") return { status: claim.status };

    const { data: loot, error: lootError } = await supabase
      .from("loot_definitions")
      .select("title, verification_prompt")
      .eq("id", claim.loot_id)
      .maybeSingle();
    if (lootError || !loot) throw new Error("Loot definition not found.");

    const { data: file, error: downloadError } = await supabase.storage
      .from("loot-proofs")
      .download(claim.photo_path);
    if (downloadError || !file) throw new Error("Could not read the uploaded photo.");
    const dataUrl = toDataUrl(new Uint8Array(await file.arrayBuffer()), file.type);

    const verdict = await verifyPhotoWithAI(loot.verification_prompt, dataUrl);

    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error: finalizeError } = await supabaseAdmin.rpc("finalize_loot_claim", {
      claim_id: claim.id,
      verdict: verdict.approved ? "approved" : "rejected",
      reason: verdict.reason,
    });
    if (finalizeError) throw new Error(finalizeError.message);

    if (verdict.approved) {
      await buildSticker(claim.id, userId, loot.title, dataUrl);
    } else {
      // Rejected proofs are not kept.
      await supabaseAdmin.storage.from("loot-proofs").remove([claim.photo_path]);
    }

    return { status: verdict.approved ? "approved" : "rejected", reason: verdict.reason };
  });

export const retrySticker = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: { claimId: string }) => {
    if (!input?.claimId) throw new Error("Missing claim id.");
    return { claimId: input.claimId };
  })
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context;
    const { data: claim, error } = await supabase
      .from("loot_claims")
      .select("id, user_id, status, photo_path, loot_id")
      .eq("id", data.claimId)
      .maybeSingle();
    if (error) throw new Error(error.message);
    if (!claim || claim.user_id !== userId) throw new Error("Claim not found.");
    if (claim.status !== "approved") throw new Error("This loot is not verified yet.");

    const { data: loot } = await supabase
      .from("loot_definitions")
      .select("title")
      .eq("id", claim.loot_id)
      .maybeSingle();
    const { data: file } = await supabase.storage.from("loot-proofs").download(claim.photo_path);
    if (!file) throw new Error("The original photo is no longer available.");
    const dataUrl = toDataUrl(new Uint8Array(await file.arrayBuffer()), file.type);
    const path = await buildSticker(claim.id, userId, loot?.title ?? "the found object", dataUrl);
    return { ok: Boolean(path) };
  });

export type CollectionEntry = {
  claimId: string;
  title: string;
  description: string;
  rarity: "common" | "uncommon" | "rare" | "epic" | "legendary";
  xp: number;
  foundAt: string;
  reason: string | null;
  stickerStatus: "pending" | "ready" | "failed";
  stickerUrl: string | null;
  photoUrl: string | null;
};

export const getCollection = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }): Promise<CollectionEntry[]> => {
    const { supabase, userId } = context;
    const { data, error } = await supabase
      .from("loot_claims")
      .select(
        "id, photo_path, sticker_path, sticker_status, awarded_xp, verification_reason, created_at, loot_definitions(title, description, rarity)",
      )
      .eq("user_id", userId)
      .eq("status", "approved")
      .order("created_at", { ascending: false });
    if (error) throw new Error(error.message);

    const rows = (data ?? []) as unknown as Array<{
      id: string;
      photo_path: string;
      sticker_path: string | null;
      sticker_status: CollectionEntry["stickerStatus"];
      awarded_xp: number;
      verification_reason: string | null;
      created_at: string;
      loot_definitions: { title: string; description: string; rarity: CollectionEntry["rarity"] } | null;
    }>;

    return Promise.all(
      rows.map(async (row) => {
        const [sticker, photo] = await Promise.all([
          row.sticker_path
            ? supabase.storage.from("loot-stickers").createSignedUrl(row.sticker_path, 3600)
            : Promise.resolve({ data: null }),
          supabase.storage.from("loot-proofs").createSignedUrl(row.photo_path, 3600),
        ]);
        return {
          claimId: row.id,
          title: row.loot_definitions?.title ?? "Unknown loot",
          description: row.loot_definitions?.description ?? "",
          rarity: row.loot_definitions?.rarity ?? "common",
          xp: row.awarded_xp,
          foundAt: row.created_at,
          reason: row.verification_reason,
          stickerStatus: row.sticker_status,
          stickerUrl: sticker.data?.signedUrl ?? null,
          photoUrl: photo.data?.signedUrl ?? null,
        };
      }),
    );
  });
