-- ========================================
-- 1. habits 테이블
-- ========================================
create table public.habits (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references auth.users(id) on delete cascade,
  name        text not null check (char_length(name) between 1 and 50),
  target_days int[] not null default '{}',   -- 0=일, 1=월, 2=화, 3=수, 4=목, 5=금, 6=토
  created_at  timestamptz not null default now()
);

alter table public.habits enable row level security;

create policy "users can manage own habits"
  on public.habits
  for all
  using  (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create index habits_user_id_idx on public.habits(user_id);


-- ========================================
-- 2. habit_logs 테이블
-- ========================================
create table public.habit_logs (
  id         uuid primary key default gen_random_uuid(),
  habit_id   uuid not null references public.habits(id) on delete cascade,
  user_id    uuid not null references auth.users(id) on delete cascade,
  date       date not null,
  completed  boolean not null default false,
  unique (habit_id, date)
);

alter table public.habit_logs enable row level security;

create policy "users can manage own habit_logs"
  on public.habit_logs
  for all
  using  (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create index habit_logs_user_date_idx on public.habit_logs(user_id, date);
create index habit_logs_habit_id_idx  on public.habit_logs(habit_id);


-- ========================================
-- 3. acorns 테이블
-- ========================================
create type public.acorn_type as enum ('normal', 'golden');

create table public.acorns (
  id        uuid primary key default gen_random_uuid(),
  user_id   uuid not null references auth.users(id) on delete cascade,
  type      public.acorn_type not null default 'normal',
  reason    text not null,
  earned_at timestamptz not null default now()
);

alter table public.acorns enable row level security;

create policy "users can manage own acorns"
  on public.acorns
  for all
  using  (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create index acorns_user_id_earned_at_idx on public.acorns(user_id, earned_at desc);


-- ========================================
-- 4. upsert_habit_log RPC
-- ========================================
create or replace function public.upsert_habit_log(
  p_habit_id  uuid,
  p_date      date,
  p_completed boolean
)
returns public.habit_logs
language plpgsql security definer
as $$
declare
  v_row public.habit_logs;
begin
  insert into public.habit_logs (habit_id, user_id, date, completed)
  values (p_habit_id, auth.uid(), p_date, p_completed)
  on conflict (habit_id, date)
  do update set completed = excluded.completed
  returning * into v_row;

  return v_row;
end;
$$;
