-- Saved articles: a point-in-time copy of a conversion result, owner-only access.
create table public.saved_articles (
  id uuid not null default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users on delete cascade,
  title text not null default '',
  author text not null default '',
  site text not null default '',
  word_count integer not null default 0,
  markdown text not null,
  source_url text not null,
  created_at timestamptz not null default now(),
  primary key (id)
);

create index saved_articles_user_created_idx
  on public.saved_articles (user_id, created_at desc);

alter table public.saved_articles enable row level security;

-- Signed-in users only. No update/delete: saved copies are immutable for now.
grant select, insert on public.saved_articles to authenticated;
grant select, insert, update, delete on public.saved_articles to service_role;

create policy "saved_articles_select_own" on public.saved_articles
  for select to authenticated
  using ((select auth.uid()) = user_id);

create policy "saved_articles_insert_own" on public.saved_articles
  for insert to authenticated
  with check ((select auth.uid()) = user_id);
