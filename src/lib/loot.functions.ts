import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

type Verdict = { approved: boolean; reason: string };

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
      .select("verification_prompt")
      .eq("id", claim.loot_id)
      .maybeSingle();
    if (lootError || !loot) throw new Error("Loot definition not found.");

    const { data: file, error: downloadError } = await supabase.storage
      .from("loot-proofs")
      .download(claim.photo_path);
    if (downloadError || !file) throw new Error("Could not read the uploaded photo.");
    const bytes = new Uint8Array(await file.arrayBuffer());
    let binary = "";
    for (const byte of bytes) binary += String.fromCharCode(byte);
    const dataUrl = `data:${file.type || "image/jpeg"};base64,${btoa(binary)}`;

    const verdict = await verifyPhotoWithAI(loot.verification_prompt, dataUrl);

    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error: finalizeError } = await supabaseAdmin.rpc("finalize_loot_claim", {
      claim_id: claim.id,
      verdict: verdict.approved ? "approved" : "rejected",
      reason: verdict.reason,
    });
    if (finalizeError) throw new Error(finalizeError.message);

    return { status: verdict.approved ? "approved" : "rejected", reason: verdict.reason };
  });
