-- Extensions
create extension if not exists "pgcrypto";

-- =====================
-- TABLE
-- =====================

create table if not exists bookmarks (
  id uuid primary key default gen_random_uuid(),

  user_id uuid not null default auth.uid(),

  title text not null,
  url text not null,
  domain text,

  is_archived boolean default false,

  created_at timestamp default now(),
  updated_at timestamp default now()
);

-- =====================
-- RLS
-- =====================

alter table bookmarks enable row level security;

-- =====================
-- SAFE COLUMN MIGRATION
-- =====================

alter table bookmarks
  add column if not exists domain text,
  add column if not exists is_archived boolean default false,
  add column if not exists updated_at timestamp default now();

-- =====================
-- BACKFILL
-- =====================

update bookmarks
set updated_at = created_at
where updated_at is null;

-- =====================
-- INDEXES
-- =====================

create index if not exists idx_bookmarks_user on bookmarks(user_id);
create index if not exists idx_bookmarks_created on bookmarks(created_at);
create index if not exists idx_bookmarks_archived on bookmarks(is_archived);

-- =====================
-- POLICIES (IDEMPOTENT)
-- =====================

do $$
begin
  if not exists (
    select 1 from pg_policies
    where tablename='bookmarks' and policyname='bookmark_select'
  ) then
    create policy bookmark_select
    on bookmarks for select
    using (auth.uid() = user_id);
  end if;

  if not exists (
    select 1 from pg_policies
    where tablename='bookmarks' and policyname='bookmark_insert'
  ) then
    create policy bookmark_insert
    on bookmarks for insert
    with check (auth.uid() = user_id);
  end if;

  if not exists (
    select 1 from pg_policies
    where tablename='bookmarks' and policyname='bookmark_update'
  ) then
    create policy bookmark_update
    on bookmarks
    for update
    using (auth.uid() = user_id)
    with check (auth.uid() = user_id);
  end if;

  if not exists (
    select 1 from pg_policies
    where tablename='bookmarks' and policyname='bookmark_delete'
  ) then
    create policy bookmark_delete
    on bookmarks for delete
    using (auth.uid() = user_id);
  end if;
end$$;

-- =====================
-- REALTIME
-- =====================

do $$
begin
  if not exists (
    select 1
    from pg_publication_tables
    where pubname = 'supabase_realtime'
      and schemaname = 'public'
      and tablename = 'bookmarks'
  ) then
    alter publication supabase_realtime add table public.bookmarks;
  end if;
end$$;

-- =====================
-- ANALYTICS FUNCTION
-- =====================

create or replace function bookmarks_last_7_days()
returns table(day text, count bigint)
language sql as $$
  select 
    to_char(created_at::date, 'Mon DD'),
    count(*)
  from bookmarks
  where created_at >= now() - interval '6 days'
    and is_archived = false
  group by created_at::date
  order by created_at::date;
$$;
