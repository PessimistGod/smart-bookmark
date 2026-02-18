-- Disable RLS first
alter table if exists bookmarks disable row level security;

-- Drop policies safely
drop policy if exists bookmark_select on bookmarks;
drop policy if exists bookmark_insert on bookmarks;
drop policy if exists bookmark_update on bookmarks;
drop policy if exists bookmark_delete on bookmarks;

-- Remove from realtime publication safely
do $$
begin
  if exists (
    select 1
    from pg_publication_tables
    where pubname = 'supabase_realtime'
      and schemaname = 'public'
      and tablename = 'bookmarks'
  ) then
    alter publication supabase_realtime drop table public.bookmarks;
  end if;
end$$;

-- Drop table
drop table if exists bookmarks cascade;

-- Drop analytics function
drop function if exists bookmarks_last_7_days();
