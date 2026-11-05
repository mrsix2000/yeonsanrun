-- Test DB only. Consent/connection is provisioned by trusted backend, never browser.
create table if not exists public.parent_report_grants(
 parent_user_id uuid not null references auth.users(id) on delete cascade,
 student_user_id uuid not null references auth.users(id) on delete cascade,
 created_at timestamptz not null default now(),
 primary key(parent_user_id,student_user_id),
 check(parent_user_id<>student_user_id)
);
create index if not exists parent_report_grants_student_idx on public.parent_report_grants(student_user_id,parent_user_id);
alter table public.parent_report_grants enable row level security;
revoke all on public.parent_report_grants from anon,authenticated;
grant select on public.parent_report_grants to authenticated;
create policy parent_report_grants_read on public.parent_report_grants for select to authenticated
 using (parent_user_id=(select auth.uid()) or student_user_id=(select auth.uid()));
create policy practice_sessions_linked_parent_read on public.practice_sessions for select to authenticated
 using (exists(select 1 from public.parent_report_grants g
 where g.student_user_id=practice_sessions.user_id and g.parent_user_id=(select auth.uid())));
create policy practice_attempts_linked_parent_read on public.practice_attempts for select to authenticated
 using (exists(select 1 from public.parent_report_grants g
 where g.student_user_id=practice_attempts.user_id and g.parent_user_id=(select auth.uid())));
-- Revocation: trusted backend deletes grant, immediately removing parent read access.
-- Do not deploy to production: existing production family_links should be the source of truth.
