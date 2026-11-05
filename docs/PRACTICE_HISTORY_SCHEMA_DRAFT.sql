-- DRAFT ONLY. Do not apply to production without explicit approval.
-- Run in an isolated test Supabase project first, then verify RLS with two users.
create table if not exists public.practice_sessions (
 id uuid primary key default gen_random_uuid(),
 user_id uuid not null references auth.users(id) on delete cascade,
 mode text not null check (mode in ('free','diagnostic','weak','daily','recommended')),
 completed_at timestamptz not null default now(),
 created_at timestamptz not null default now(),
 constraint practice_sessions_id_user_unique unique (id,user_id)
);
create table if not exists public.practice_attempts (
 id uuid primary key default gen_random_uuid(),
 session_id uuid not null,
 user_id uuid not null references auth.users(id) on delete cascade,
 position smallint not null check (position between 1 and 5),
 type_id text not null check (length(type_id) between 3 and 80),
 correct boolean not null,
 duration_ms integer not null check (duration_ms between 0 and 3600000),
 created_at timestamptz not null default now(),
 unique(session_id,position),
 foreign key (session_id,user_id) references public.practice_sessions(id,user_id) on delete cascade
);
create index if not exists practice_sessions_user_date_idx on public.practice_sessions(user_id,completed_at desc);
create index if not exists practice_attempts_user_session_idx on public.practice_attempts(user_id,session_id);
alter table public.practice_sessions enable row level security;
alter table public.practice_attempts enable row level security;
revoke all on public.practice_sessions,public.practice_attempts from anon;
grant select,insert on public.practice_sessions,public.practice_attempts to authenticated;
create policy practice_sessions_owner_select on public.practice_sessions for select to authenticated using (user_id=(select auth.uid()));
create policy practice_sessions_owner_insert on public.practice_sessions for insert to authenticated with check (user_id=(select auth.uid()));
create policy practice_attempts_owner_select on public.practice_attempts for select to authenticated using (user_id=(select auth.uid()));
create policy practice_attempts_owner_insert on public.practice_attempts for insert to authenticated with check (user_id=(select auth.uid()));
-- No UPDATE/DELETE grants or policies. Account deletion cascade remains a separate approved operation.
-- Test: user A can insert/read A; user B cannot read or insert as A.
-- Test: attempt referencing another user's session must fail due to composite FK.
-- Parent read policies intentionally absent until explicit family consent/privacy design.
-- Verify policies and security advisors in test project before any production consideration.
