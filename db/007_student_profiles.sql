-- 007 설계 초안: 승인 전 실행 금지. Supabase SQL Editor에서 승인 후 적용.
-- 인증 사용자당 학생 프로필 하나. 향후 학부모-자녀 다대다 관계는 별도 테이블로 확장.
create table if not exists public.student_profiles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  grade_code text not null check (grade_code in ('E1','E2','E3','E4','E5','E6','M1','M2','M3')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.student_profiles enable row level security;
revoke all on public.student_profiles from anon;
grant select, insert, update on public.student_profiles to authenticated;
create policy "student_profiles_select_own" on public.student_profiles
  for select to authenticated using ((select auth.uid()) = user_id);
create policy "student_profiles_insert_own" on public.student_profiles
  for insert to authenticated with check ((select auth.uid()) = user_id);
create policy "student_profiles_update_own" on public.student_profiles
  for update to authenticated using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);
-- 정책 생성은 최초 1회 적용 전제. 재실행 시 정책 중복 오류 가능.
-- updated_at은 앱에서 명시 갱신. 추후 서버 트리거로 전환 가능.
