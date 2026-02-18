-- Extensions
create extension if not exists "pgcrypto";

-- Table
create table if not exists bookmarks (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,

  title text not null,
  url text not null,
  domain text,

  is_archived boolean default false,

  created_at timestamp default now(),
  updated_at timestamp default now()
);

-- Enable RLS
alter table bookmarks enable row level security;

-- Add columns safely
alter table bookmarks
  add column if not exists domain text,
  add column if not exists is_archived boolean default false,
  add column if not exists updated_at timestamp default now();

-- Backfill timestamps
update bookmarks
set updated_at = created_at
where updated_at is null;

-- Indexes
create index if not exists idx_bookmarks_user on bookmarks(user_id);
create index if not exists idx_bookmarks_created on bookmarks(created_at);
create index if not exists idx_bookmarks_archived on bookmarks(is_archived);

-- Policies (idempotent)

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
    on bookmarks for update
    using (auth.uid() = user_id);
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

-- Realtime
do $$
begin
  if not exists (
    select 1
    from pg_publication_tables
    where pubname='supabase_realtime'
    and tablename='bookmarks'
  ) then
    alter publication supabase_realtime add table bookmarks;
  end if;
end$$;

-- Analytics

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
