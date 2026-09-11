-- LootDrop: profiles, daily loot and photo claims. Run through Supabase CLI or SQL editor.
create extension if not exists pgcrypto;

create type public.loot_rarity as enum ('common', 'uncommon', 'rare', 'epic', 'legendary');
create type public.claim_status as enum ('pending', 'approved', 'rejected');

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  username text not null check (char_length(username) between 3 and 24),
  total_xp integer not null default 0 check (total_xp >= 0),
  level integer generated always as (greatest(1, floor(total_xp / 500.0)::integer + 1)) stored,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create unique index profiles_username_lower_key on public.profiles (lower(username));

create table public.loot_definitions (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text not null,
  verification_prompt text not null,
  xp integer not null check (xp > 0),
  difficulty smallint not null check (difficulty between 1 and 5),
  rarity public.loot_rarity not null,
  active boolean not null default true,
  created_at timestamptz not null default now()
);

create table public.loot_claims (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  loot_id uuid not null references public.loot_definitions(id) on delete restrict,
  photo_path text not null,
  status public.claim_status not null default 'pending',
  verification_reason text,
  verified_at timestamptz,
  awarded_xp integer not null default 0 check (awarded_xp >= 0),
  created_at timestamptz not null default now()
);

create index loot_claims_user_created_idx on public.loot_claims (user_id, created_at desc);
create unique index loot_claims_one_per_day_idx on public.loot_claims (user_id, loot_id, (created_at::date));

alter table public.profiles enable row level security;
alter table public.loot_definitions enable row level security;
alter table public.loot_claims enable row level security;

create policy "profiles are readable by their owner" on public.profiles for select to authenticated using (id = auth.uid());
create policy "profiles can be created by their owner" on public.profiles for insert to authenticated with check (id = auth.uid());
create policy "profiles can be updated by their owner" on public.profiles for update to authenticated using (id = auth.uid()) with check (id = auth.uid());
create policy "active loot is readable" on public.loot_definitions for select to authenticated using (active = true);
create policy "users can read their claims" on public.loot_claims for select to authenticated using (user_id = auth.uid());
create policy "users can submit pending claims" on public.loot_claims for insert to authenticated with check (user_id = auth.uid() and status = 'pending' and awarded_xp = 0);

insert into storage.buckets (id, name, public) values ('loot-proofs', 'loot-proofs', false) on conflict (id) do nothing;
create policy "users upload their own loot proofs" on storage.objects for insert to authenticated with check (
  bucket_id = 'loot-proofs' and (storage.foldername(name))[1] = auth.uid()::text
);
create policy "users read their own loot proofs" on storage.objects for select to authenticated using (
  bucket_id = 'loot-proofs' and (storage.foldername(name))[1] = auth.uid()::text
);

-- This RPC is intentionally service-role only: client code must never award itself XP.
create or replace function public.finalize_loot_claim(
  claim_id uuid,
  verdict public.claim_status,
  reason text
) returns public.loot_claims
language plpgsql security definer set search_path = public
as $$
declare
  claim_row public.loot_claims;
  loot_xp integer;
begin
  select * into claim_row from public.loot_claims where id = claim_id for update;
  if claim_row is null then raise exception 'Claim not found'; end if;
  if claim_row.status <> 'pending' then return claim_row; end if;

  select xp into loot_xp from public.loot_definitions where id = claim_row.loot_id;
  update public.loot_claims
    set status = verdict, verification_reason = reason, verified_at = now(),
        awarded_xp = case when verdict = 'approved' then loot_xp else 0 end
    where id = claim_id
    returning * into claim_row;
  if verdict = 'approved' then
    update public.profiles set total_xp = total_xp + loot_xp, updated_at = now() where id = claim_row.user_id;
  end if;
  return claim_row;
end;
$$;

-- Add daily loot from the dashboard or a seed migration. `verification_prompt` is sent to the verifier.
