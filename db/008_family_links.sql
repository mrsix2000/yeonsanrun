-- 008 설계안. 실제 DB 승인 전 실행 금지.
-- 인증된 학부모 계정과 학생 계정의 연결을 별도 관계로 보관한다.
-- 이메일만으로 학생 계정 연결 금지. 학생이 인증 상태에서 발급한
-- 일회성·만료형 연결 코드를 서버 함수가 검증한 뒤 관계를 생성해야 한다.
-- 코드 원문은 저장하지 않고 해시/만료/사용 여부를 관리한다.
-- 이 SQL은 관계 테이블만 정의하며, 연결 코드 검증 서버 함수는 별도 승인·구현 대상.
create table public.family_links (
 id uuid primary key default gen_random_uuid(),
 parent_user_id uuid not null references auth.users(id) on delete cascade,
 student_user_id uuid not null references auth.users(id) on delete cascade,
 child_alias text not null check (char_length(btrim(child_alias)) between 1 and 20),
 created_at timestamptz not null default now(),
 unique(parent_user_id,student_user_id),
 check (parent_user_id <> student_user_id)
);
create index family_links_student_idx on public.family_links(student_user_id);
alter table public.family_links enable row level security;
revoke all on public.family_links from public,anon,authenticated;
grant select on public.family_links to authenticated;
create policy family_links_parent_read on public.family_links
 for select to authenticated using ((select auth.uid())=parent_user_id);
create policy family_links_student_read on public.family_links
 for select to authenticated using ((select auth.uid())=student_user_id);
-- INSERT/UPDATE/DELETE는 클라이언트 권한 없음.
-- 서버 측 코드 교환·연결 해제 함수 및 학부모 열람 범위는 후속 설계 후 적용.
