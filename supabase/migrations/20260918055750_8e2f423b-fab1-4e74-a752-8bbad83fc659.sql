ALTER TABLE public.loot_definitions
  ADD COLUMN IF NOT EXISTS title_ro text,
  ADD COLUMN IF NOT EXISTS description_ro text,
  ADD COLUMN IF NOT EXISTS verification_prompt_ro text;

ALTER TABLE public.loot_claims
  ADD COLUMN IF NOT EXISTS verification_reason_ro text;