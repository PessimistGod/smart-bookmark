alter table if exists bookmarks disable row level security;

drop policy if exists bookmark_select on bookmarks;
drop policy if exists bookmark_insert on bookmarks;
drop policy if exists bookmark_update on bookmarks;
drop policy if exists bookmark_delete on bookmarks;

do $$
begin
  if exists (
    select 1
    from pg_publication_tables
    where pubname='supabase_realtime'
      and tablename='bookmarks'
  ) then
    alter publication supabase_realtime drop table bookmarks;
  end if;
end$$;

drop table if exists bookmarks cascade;

drop function if exists bookmarks_last_7_days();