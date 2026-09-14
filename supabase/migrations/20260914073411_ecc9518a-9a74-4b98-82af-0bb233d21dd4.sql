CREATE TYPE public.sticker_status AS ENUM ('pending','ready','failed');
ALTER TABLE public.loot_claims ADD COLUMN sticker_path text;
ALTER TABLE public.loot_claims ADD COLUMN sticker_status public.sticker_status NOT NULL DEFAULT 'pending';