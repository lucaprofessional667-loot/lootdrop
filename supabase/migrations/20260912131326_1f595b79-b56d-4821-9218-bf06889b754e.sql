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
grant select, insert, update on public.profiles to authenticated;
grant all on public.profiles to service_role;
alter table public.profiles enable row level security;
create policy "profiles are readable by their owner" on public.profiles for select to authenticated using (id = auth.uid());
create policy "profiles can be created by their owner" on public.profiles for insert to authenticated with check (id = auth.uid());
create policy "profiles can be updated by their owner" on public.profiles for update to authenticated using (id = auth.uid()) with check (id = auth.uid());

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
grant select on public.loot_definitions to authenticated;
grant all on public.loot_definitions to service_role;
alter table public.loot_definitions enable row level security;
create policy "active loot is readable" on public.loot_definitions for select to authenticated using (active = true);

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
grant select, insert on public.loot_claims to authenticated;
grant all on public.loot_claims to service_role;
alter table public.loot_claims enable row level security;
create policy "users can read their claims" on public.loot_claims for select to authenticated using (user_id = auth.uid());
create policy "users can submit pending claims" on public.loot_claims for insert to authenticated with check (user_id = auth.uid() and status = 'pending' and awarded_xp = 0);

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
  if claim_row.id is null then raise exception 'Claim not found'; end if;
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
revoke all on function public.finalize_loot_claim(uuid, public.claim_status, text) from public, anon, authenticated;
grant execute on function public.finalize_loot_claim(uuid, public.claim_status, text) to service_role;

insert into public.loot_definitions (title, description, verification_prompt, xp, difficulty, rarity) values
  ('Rusty Bottle Cap', 'Find a discarded metal bottle cap on the ground.', 'The photo must clearly show a metal bottle cap.', 50, 1, 'common'),
  ('Street Cat Sighting', 'Spot a cat outside and snap it from a respectful distance.', 'The photo must clearly show a real cat outdoors.', 120, 2, 'uncommon'),
  ('Wall of Color', 'Find street art or a painted mural on a wall.', 'The photo must show painted street art or a mural on a wall or surface.', 250, 3, 'rare'),
  ('Old Sentinel', 'Photograph a building or monument that looks at least a century old.', 'The photo must show an old building, statue or monument with visible historic architecture.', 500, 4, 'epic'),
  ('Golden Hour', 'Capture the sun low on the horizon at sunrise or sunset.', 'The photo must show an outdoor scene at sunrise or sunset with warm low sunlight or visible sun near the horizon.', 1000, 5, 'legendary');