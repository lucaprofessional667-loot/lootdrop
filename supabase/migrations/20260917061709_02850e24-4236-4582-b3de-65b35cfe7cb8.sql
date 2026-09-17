ALTER TABLE public.loot_definitions
  ADD COLUMN IF NOT EXISTS quest_date date,
  ADD COLUMN IF NOT EXISTS user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE;

UPDATE public.loot_definitions SET active = false WHERE quest_date IS NULL;

CREATE UNIQUE INDEX IF NOT EXISTS loot_definitions_daily_shared_idx
  ON public.loot_definitions (quest_date) WHERE user_id IS NULL AND quest_date IS NOT NULL;

CREATE UNIQUE INDEX IF NOT EXISTS loot_definitions_daily_personal_idx
  ON public.loot_definitions (user_id, quest_date, rarity) WHERE user_id IS NOT NULL;

CREATE INDEX IF NOT EXISTS loot_definitions_quest_date_idx ON public.loot_definitions (quest_date);

DROP POLICY IF EXISTS "active loot is readable" ON public.loot_definitions;

CREATE POLICY "own and shared loot is readable"
  ON public.loot_definitions FOR SELECT TO authenticated
  USING (active = true AND (user_id IS NULL OR user_id = auth.uid()));