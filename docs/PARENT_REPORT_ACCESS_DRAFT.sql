-- TEST-ONLY draft: parent reporting RPC. Do not apply to production without approval.
-- Requires public.family_links and public.practice_sessions / practice_attempts.
-- Read-only aggregate: never exposes individual question answers.
create or replace function public.parent_child_practice_summary(p_student_id uuid)
returns table(sessions bigint, questions bigint, correct bigint, average_duration_ms numeric, latest_completed_at timestamptz)
language plpgsql security invoker set search_path = ''
as $$
begin
 if (select auth.uid()) is null then raise exception 'Authentication required'; end if;
 if not exists (
   select 1 from public.family_links f
   where f.parent_user_id = (select auth.uid()) and f.student_user_id = p_student_id
 ) then raise exception 'Child is not linked to this parent' using errcode='42501'; end if;
 -- The existing owner-only RLS intentionally prevents a parent from reading
 -- practice tables directly. A separate least-privilege, reviewed access design
 -- is required before enabling this function. This draft deliberately fails closed.
 raise exception 'Parent reporting is not enabled until a secure access path is approved'
   using errcode='42501';
end $$;
revoke all on function public.parent_child_practice_summary(uuid) from public,anon,authenticated;
