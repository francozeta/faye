create table if not exists public.habit_events (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  device_id text not null check (char_length(device_id) between 8 and 96),
  residue_id text not null,
  residue_name text not null,
  material text not null,
  category text not null,
  bin text not null,
  points integer not null check (points between 0 and 30),
  confidence integer not null check (confidence between 0 and 100),
  source text not null default 'unknown',
  preparation text,
  impact text,
  metadata jsonb not null default '{}'::jsonb
);

alter table public.habit_events enable row level security;

drop policy if exists "anon can insert habit events" on public.habit_events;

create policy "anon can insert habit events"
on public.habit_events
for insert
to anon
with check (true);

grant usage on schema public to anon;
grant insert on table public.habit_events to anon;

create index if not exists habit_events_device_created_at_idx
on public.habit_events (device_id, created_at desc);
