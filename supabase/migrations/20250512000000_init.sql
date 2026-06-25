-- CamiDante: posts, profiles, bookmarks + RLS
-- Run via Supabase CLI or paste in SQL Editor.

create extension if not exists "pgcrypto";

create table public.posts (
  id uuid primary key default gen_random_uuid(),
  slug text unique,
  title text not null,
  excerpt text not null,
  body text not null default '',
  category text not null,
  cover_image text not null,
  reading_minutes int not null default 5,
  published boolean not null default false,
  published_at timestamptz,
  tags text[] not null default '{}',
  featured boolean not null default false,
  size text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.profiles (
  id uuid primary key references auth.users on delete cascade,
  full_name text,
  avatar_url text,
  is_admin boolean not null default false,
  updated_at timestamptz default now()
);

create table public.bookmarks (
  user_id uuid not null references auth.users on delete cascade,
  post_id uuid not null references public.posts on delete cascade,
  created_at timestamptz not null default now(),
  primary key (user_id, post_id)
);

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, full_name, avatar_url)
  values (
    new.id,
    nullif(trim(coalesce(new.raw_user_meta_data->>'full_name', '')), ''),
    nullif(trim(coalesce(new.raw_user_meta_data->>'avatar_url', '')), '')
  );
  return new;
end;
$$;

create or replace function public.current_user_is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select coalesce(
    (select p.is_admin from public.profiles p where p.id = auth.uid()),
    false
  );
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

alter table public.posts enable row level security;
alter table public.profiles enable row level security;
alter table public.bookmarks enable row level security;

-- Published posts readable by anyone; full rows for admins
create policy posts_select_public_or_admin on public.posts
  for select using (
    published = true
    or (
      auth.uid() is not null
      and exists (
        select 1 from public.profiles p
        where p.id = auth.uid() and p.is_admin = true
      )
    )
  );

create policy posts_write_admin on public.posts
  for insert with check (
    exists (
      select 1 from public.profiles p
      where p.id = auth.uid() and p.is_admin = true
    )
  );

create policy posts_update_admin on public.posts
  for update using (
    exists (
      select 1 from public.profiles p
      where p.id = auth.uid() and p.is_admin = true
    )
  )
  with check (
    exists (
      select 1 from public.profiles p
      where p.id = auth.uid() and p.is_admin = true
    )
  );

create policy posts_delete_admin on public.posts
  for delete using (
    exists (
      select 1 from public.profiles p
      where p.id = auth.uid() and p.is_admin = true
    )
  );

create policy profiles_select_own on public.profiles
  for select using (id = auth.uid());

create policy profiles_update_own on public.profiles
  for update using (id = auth.uid())
  with check (
    id = auth.uid()
    and is_admin = public.current_user_is_admin()
  );

create policy bookmarks_all_own on public.bookmarks
  for all using (user_id = auth.uid())
  with check (user_id = auth.uid());

-- Tras crear tu usuario en Auth, otorga admin (ajusta el id):
-- update public.profiles set is_admin = true where id = 'UUID_DEL_USUARIO';
