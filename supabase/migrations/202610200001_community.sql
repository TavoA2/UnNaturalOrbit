begin;

create table public.admin_users (
  user_id uuid primary key references auth.users(id) on delete cascade
);
alter table public.admin_users enable row level security;
revoke all on public.admin_users from anon, authenticated;
grant select on public.admin_users to authenticated;
create policy "Admin can see own membership" on public.admin_users
  for select to authenticated using (user_id = (select auth.uid()));

create function public.is_admin() returns boolean
language sql stable security definer set search_path = ''
as $$ select exists(select 1 from public.admin_users where user_id = (select auth.uid())); $$;
revoke all on function public.is_admin() from public;
grant execute on function public.is_admin() to anon, authenticated;

create table public.reviews (
  id uuid primary key,
  author_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
  author_name text not null check (char_length(btrim(author_name)) between 1 and 50),
  title text not null check (char_length(btrim(title)) between 3 and 120),
  subject text not null check (char_length(btrim(subject)) between 2 and 160),
  body text not null check (char_length(btrim(body)) between 20 and 5000),
  created_at timestamptz not null default now()
);
create table public.comments (
  id uuid primary key,
  review_id uuid not null references public.reviews(id) on delete cascade,
  author_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
  author_name text not null check (char_length(btrim(author_name)) between 1 and 50),
  body text not null check (char_length(btrim(body)) between 2 and 1000),
  created_at timestamptz not null default now()
);
create index reviews_created_idx on public.reviews(created_at desc, id);
create index reviews_author_idx on public.reviews(author_id);
create index comments_review_created_idx on public.comments(review_id, created_at, id);
create index comments_author_idx on public.comments(author_id);
alter table public.reviews enable row level security;
alter table public.comments enable row level security;
revoke all on public.reviews, public.comments from anon, authenticated;
grant select on public.reviews, public.comments to anon, authenticated;
-- Column grants prevent clients from forging timestamps.
grant insert(id, author_id, author_name, title, subject, body) on public.reviews to authenticated;
grant insert(id, review_id, author_id, author_name, body) on public.comments to authenticated;
grant delete on public.reviews, public.comments to authenticated;

create policy "Public reviews" on public.reviews for select using (true);
create policy "Members create own reviews" on public.reviews for insert to authenticated
  with check (author_id = (select auth.uid()));
create policy "Owner or admin deletes review" on public.reviews for delete to authenticated
  using (author_id = (select auth.uid()) or (select public.is_admin()));
create policy "Public comments" on public.comments for select using (true);
create policy "Members create own comments" on public.comments for insert to authenticated
  with check (author_id = (select auth.uid()));
create policy "Owner or admin deletes comment" on public.comments for delete to authenticated
  using (author_id = (select auth.uid()) or (select public.is_admin()));

-- Serializes concurrent writes per author, including direct Data API requests.
create function public.limit_community_posts() returns trigger
language plpgsql security definer set search_path = ''
as $$
declare recent_count integer;
begin
  perform pg_advisory_xact_lock(hashtextextended(new.author_id::text, 0));
  if tg_table_name = 'reviews' then
    select count(*) into recent_count from public.reviews
      where author_id = new.author_id and created_at > now() - interval '1 hour';
    if recent_count >= 5 then raise exception 'Review limit reached' using errcode = 'P0001'; end if;
  else
    select count(*) into recent_count from public.comments
      where author_id = new.author_id and created_at > now() - interval '1 hour';
    if recent_count >= 30 then raise exception 'Comment limit reached' using errcode = 'P0001'; end if;
  end if;
  return new;
end; $$;
revoke all on function public.limit_community_posts() from public;
create trigger limit_reviews before insert on public.reviews for each row execute function public.limit_community_posts();
create trigger limit_comments before insert on public.comments for each row execute function public.limit_community_posts();
commit;

