-- Carnet de cartes : schéma Supabase
-- À coller dans Supabase > SQL Editor > New query, puis "Run".
-- Peut être relancé sans risque (idempotent).

create extension if not exists pgcrypto;

-- Cartes (une par jeu)
create table if not exists public.carnet_games (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null default auth.uid() references auth.users on delete cascade,
  name        text not null check (char_length(name) between 1 and 60),
  image_path  text not null,
  created_at  timestamptz not null default now()
);

-- Types de marqueurs (propres à chaque carte)
create table if not exists public.carnet_types (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null default auth.uid() references auth.users on delete cascade,
  game_id     uuid not null references public.carnet_games on delete cascade,
  label       text not null check (char_length(label) between 1 and 40),
  color       text not null check (color ~ '^#[0-9a-fA-F]{6}$'),
  icon        text not null,
  sort        double precision not null default 0
);

-- Marqueurs posés sur une carte (x, y entre 0 et 1, relatifs à l'image)
create table if not exists public.carnet_markers (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null default auth.uid() references auth.users on delete cascade,
  game_id     uuid not null references public.carnet_games on delete cascade,
  type_id     uuid not null references public.carnet_types on delete cascade,
  x           double precision not null check (x between 0 and 1),
  y           double precision not null check (y between 0 and 1),
  note        text not null default '' check (char_length(note) <= 500),
  created_at  timestamptz not null default now()
);

create index if not exists carnet_types_game_idx   on public.carnet_types (game_id);
create index if not exists carnet_markers_game_idx on public.carnet_markers (game_id);

-- Sécurité : chacun ne voit et ne modifie que ses propres données
alter table public.carnet_games   enable row level security;
alter table public.carnet_types   enable row level security;
alter table public.carnet_markers enable row level security;

drop policy if exists "own games"   on public.carnet_games;
drop policy if exists "own types"   on public.carnet_types;
drop policy if exists "own markers" on public.carnet_markers;

create policy "own games" on public.carnet_games
  for all to authenticated using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy "own types" on public.carnet_types
  for all to authenticated using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy "own markers" on public.carnet_markers
  for all to authenticated using (user_id = auth.uid()) with check (user_id = auth.uid());

-- Synchro en direct entre téléphone et PC
do $$
begin
  begin alter publication supabase_realtime add table public.carnet_games;   exception when duplicate_object then null; end;
  begin alter publication supabase_realtime add table public.carnet_types;   exception when duplicate_object then null; end;
  begin alter publication supabase_realtime add table public.carnet_markers; exception when duplicate_object then null; end;
end $$;

-- Stockage des images de cartes (privé, 50 Mo max par fichier)
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('carnet-maps', 'carnet-maps', false, 52428800, array['image/jpeg','image/png','image/webp'])
on conflict (id) do nothing;

-- Chaque utilisateur range ses images dans un dossier à son id
drop policy if exists "carnet maps read"   on storage.objects;
drop policy if exists "carnet maps insert" on storage.objects;
drop policy if exists "carnet maps delete" on storage.objects;

create policy "carnet maps read" on storage.objects for select to authenticated
  using (bucket_id = 'carnet-maps' and (storage.foldername(name))[1] = auth.uid()::text);
create policy "carnet maps insert" on storage.objects for insert to authenticated
  with check (bucket_id = 'carnet-maps' and (storage.foldername(name))[1] = auth.uid()::text);
create policy "carnet maps delete" on storage.objects for delete to authenticated
  using (bucket_id = 'carnet-maps' and (storage.foldername(name))[1] = auth.uid()::text);
