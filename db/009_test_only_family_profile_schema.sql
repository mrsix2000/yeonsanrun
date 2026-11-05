-- TEST-ONLY schema for yeonsanrun-test (project ref: cjrvoamwejcpmhyejamn).
-- Never apply this file to the production project.
-- Client writes profiles only as the owner; family links are created only through the
-- authenticated, rate-limited, single-use RPCs below. Invite tokens are stored as hashes.

begin;

create table if not exists public.student_profiles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  grade_code text not null check (grade_code in ('E1','E2','E3','E4','E5','E6','M1','M2','M3')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.student_profiles enable row level security;
revoke all on public.student_profiles from public, anon, authenticated;
grant select, insert, update on public.student_profiles to authenticated;
drop policy if exists student_profiles_select_own on public.student_profiles;
create policy student_profiles_select_own on public.student_profiles
  for select to authenticated using ((select auth.uid()) is not null and (select auth.uid()) = user_id);
drop policy if exists student_profiles_insert_own on public.student_profiles;
create policy student_profiles_insert_own on public.student_profiles
  for insert to authenticated with check ((select auth.uid()) is not null and (select auth.uid()) = user_id);
drop policy if exists student_profiles_update_own on public.student_profiles;
create policy student_profiles_update_own on public.student_profiles
  for update to authenticated
  using ((select auth.uid()) is not null and (select auth.uid()) = user_id)
  with check ((select auth.uid()) is not null and (select auth.uid()) = user_id);

create table if not exists public.family_links (
  id uuid primary key default extensions.gen_random_uuid(),
  parent_user_id uuid not null references auth.users(id) on delete cascade,
  student_user_id uuid not null references public.student_profiles(user_id) on delete cascade,
  child_alias text not null check (char_length(btrim(child_alias)) between 1 and 20),
  created_at timestamptz not null default now(),
  constraint family_links_not_self check (parent_user_id <> student_user_id),
  constraint family_links_parent_student_unique unique (parent_user_id, student_user_id)
);
create index if not exists family_links_student_idx on public.family_links(student_user_id, parent_user_id);
alter table public.family_links enable row level security;
revoke all on public.family_links from public, anon, authenticated;
grant select on public.family_links to authenticated;
drop policy if exists family_links_select_related on public.family_links;
create policy family_links_select_related on public.family_links
  for select to authenticated
  using ((select auth.uid()) = parent_user_id or (select auth.uid()) = student_user_id);

create table if not exists public.family_invites (
  student_user_id uuid primary key references public.student_profiles(user_id) on delete cascade,
  code_hash text not null unique check (code_hash ~ '^[0-9a-f]{64}$'),
  expires_at timestamptz not null,
  created_at timestamptz not null default now()
);
alter table public.family_invites enable row level security;
revoke all on public.family_invites from public, anon, authenticated;
drop policy if exists family_invites_deny_api on public.family_invites;
create policy family_invites_deny_api on public.family_invites
  for all to anon, authenticated using (false) with check (false);

create table if not exists public.family_link_attempts (
  parent_user_id uuid primary key references auth.users(id) on delete cascade,
  window_started_at timestamptz not null default now(),
  attempts integer not null default 0 check (attempts between 0 and 5)
);
alter table public.family_link_attempts enable row level security;
revoke all on public.family_link_attempts from public, anon, authenticated;
drop policy if exists family_link_attempts_deny_api on public.family_link_attempts;
create policy family_link_attempts_deny_api on public.family_link_attempts
  for all to anon, authenticated using (false) with check (false);

create or replace function public.create_family_invite()
returns text
language plpgsql
security definer
set search_path = ''
as $function$
declare
  v_student_id uuid := (select auth.uid());
  v_code text;
begin
  if v_student_id is null then
    raise exception 'Authentication required' using errcode = '28000';
  end if;

  perform 1
  from public.student_profiles p
  where p.user_id = v_student_id
  for update;

  if not found then
    raise exception 'Save a student profile before creating a family invite' using errcode = '42501';
  end if;

  v_code := pg_catalog.encode(extensions.gen_random_bytes(16), 'hex');
  insert into public.family_invites(student_user_id, code_hash, expires_at, created_at)
  values (
    v_student_id,
    pg_catalog.encode(extensions.digest(pg_catalog.convert_to(v_code, 'UTF8'), 'sha256'), 'hex'),
    pg_catalog.now() + interval '10 minutes',
    pg_catalog.now()
  )
  on conflict (student_user_id) do update
    set code_hash = excluded.code_hash,
        expires_at = excluded.expires_at,
        created_at = excluded.created_at;

  return v_code;
end;
$function$;

create or replace function public.redeem_family_invite(invite_code text, alias_name text)
returns boolean
language plpgsql
security definer
set search_path = ''
as $function$
declare
  v_parent_id uuid := (select auth.uid());
  v_code text := pg_catalog.lower(pg_catalog.btrim(coalesce($1, '')));
  v_alias text := pg_catalog.btrim(coalesce($2, ''));
  v_hash text;
  v_window timestamptz;
  v_attempts integer;
  v_student_id uuid;
begin
  if v_parent_id is null then
    raise exception 'Authentication required' using errcode = '28000';
  end if;
  if pg_catalog.char_length(v_alias) < 1 or pg_catalog.char_length(v_alias) > 20 then
    raise exception 'Child alias must be 1 to 20 characters' using errcode = '22023';
  end if;

  insert into public.family_link_attempts(parent_user_id, window_started_at, attempts)
  values (v_parent_id, pg_catalog.now(), 0)
  on conflict (parent_user_id) do nothing;

  select a.window_started_at, a.attempts
    into v_window, v_attempts
  from public.family_link_attempts a
  where a.parent_user_id = v_parent_id
  for update;

  if v_window <= pg_catalog.now() - interval '15 minutes' then
    update public.family_link_attempts a
       set window_started_at = pg_catalog.now(), attempts = 0
     where a.parent_user_id = v_parent_id
     returning a.window_started_at, a.attempts into v_window, v_attempts;
  end if;

  if v_attempts >= 5 then
    return false;
  end if;

  update public.family_link_attempts a
     set attempts = a.attempts + 1
   where a.parent_user_id = v_parent_id;

  if v_code !~ '^[0-9a-f]{32}$' then
    return false;
  end if;

  v_hash := pg_catalog.encode(
    extensions.digest(pg_catalog.convert_to(v_code, 'UTF8'), 'sha256'),
    'hex'
  );

  select i.student_user_id
    into v_student_id
  from public.family_invites i
  where i.code_hash = v_hash
    and i.expires_at > pg_catalog.now()
  for update;

  if not found or v_student_id = v_parent_id then
    return false;
  end if;

  insert into public.family_links(parent_user_id, student_user_id, child_alias)
  values (v_parent_id, v_student_id, v_alias)
  on conflict (parent_user_id, student_user_id) do nothing;

  delete from public.family_invites i
  where i.student_user_id = v_student_id
    and i.code_hash = v_hash;

  return true;
end;
$function$;

revoke all on function public.create_family_invite() from public, anon, authenticated;
grant execute on function public.create_family_invite() to authenticated;
revoke all on function public.redeem_family_invite(text, text) from public, anon, authenticated;
grant execute on function public.redeem_family_invite(text, text) to authenticated;

notify pgrst, 'reload schema';
commit;
