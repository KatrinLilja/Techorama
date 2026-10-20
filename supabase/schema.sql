-- Techorama Team Planner — run this once in Supabase: SQL Editor → New query → Run.

create table if not exists public.people (
  id          uuid primary key default gen_random_uuid(),
  name        text not null check (char_length(name) between 1 and 40),
  picks       text[] not null default '{}',   -- one session id per time slot (incl. "skip-…" = not going)
  interested  text[] not null default '{}',   -- sessions marked with the shrugging knight
  notes       jsonb  not null default '{}'::jsonb, -- own excuses: { "skip-tue-3": "Food coma" }
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

-- Names are unique, ignoring case
create unique index if not exists people_name_lower_idx on public.people (lower(name));

-- "Anyone with the link" access: the public (anon) key may read and change rows.
-- Table privileges for the API roles (needed if "Automatically expose new tables" was unchecked)
grant usage on schema public to anon, authenticated;
grant select, insert, update, delete on public.people to anon, authenticated;

alter table public.people enable row level security;
drop policy if exists "people read"   on public.people;
drop policy if exists "people insert" on public.people;
drop policy if exists "people update" on public.people;
drop policy if exists "people delete" on public.people;
create policy "people read"   on public.people for select to anon, authenticated using (true);
create policy "people insert" on public.people for insert to anon, authenticated with check (true);
create policy "people update" on public.people for update to anon, authenticated using (true) with check (true);
create policy "people delete" on public.people for delete to anon, authenticated using (true);

-- Live updates between devices
do $$ begin
  alter publication supabase_realtime add table public.people;
exception when duplicate_object then null; end $$;
