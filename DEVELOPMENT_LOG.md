# DEVELOPMENT LOG
- 001~003: 검증 완료 (각 작업 사용자 검수 및 staging CI 통과).
## 004 자연수 연산 난이도 및 자릿수 확장 (2026-11-04)
- 사용자 승인 후 구현. 1~3자리 선택, 덧셈/뺄셈 조건 선택, 곱셈 n자리×1자리, 나눗셈 몫 n자리·제수 1자리.
- 변경: src/engine.js, src/main.js, index.html, src/styles.css, tests/navigation-markup.test.mjs; 추가 tests/difficulty.test.mjs 및 관리 문서.
- DB 변경 없음. 운영 배포 없음. 상태: 구현 완료·미검증.

## 004 화면 전환 오류 수정 (2026-11-04)
- 사용자: 링크만 바뀌고 화면 동작하지 않음. 자동 CI는 성공했지만 실제 브라우저 실패.
- src/main.js ESM 하위 모듈 import에 캐시 버전 부여; index.html 자산 버전 갱신; 캐시 정합성 테스트 추가.
- 상태: 테스트 실패·재검증 대기. 운영 main/DB 변경 없음.

## 004 추가 요구사항 반영 (2026-11-04)
- 사용자 상세 검수 통과 보고 후 문제 생성 제한 추가: +0, ×1, 뺄셈 결과 0, 나눗셈 몫 1 제외.
- src/engine.js, tests/operations.test.mjs 수정 및 tests/nontrivial.test.mjs 추가.
- 상태: 구현 완료·추가 조건 검증 대기. 운영 배포/DB 변경 없음.

## 004 최종 검증
- 사용자 추가 조건 최종 확인. staging Actions 41833358655 completed/success. 상태: 검증 완료.
## 005 공통 UI·상태 관리 및 오류 처리 (2026-11-04)
- 사용자 다음 단계 진행 승인. 훈련 상태 메시지, 정수 입력 오류, 문제 생성 실패 메시지 및 재시도, 세션 처음부터 다시 시작, 모바일 답안 입력 UI.
- 변경: index.html, src/main.js, src/styles.css, tests/navigation-markup.test.mjs, tests/session-ui.test.mjs 및 관리 문서.
- DB/운영 main 변경 없음. 상태: 구현 완료·미검증.

## 005 사용자 피드백 반영 (2026-11-04)
- 기존 상태/오류 안내 UI를 제거하고 5문제 연속 풀이, 진행 바, 제출 즉시 다음 문제, 결과·오답, 다시 5문제 기능으로 대체.
- 변경: index.html, src/main.js, src/styles.css, tests/navigation-markup.test.mjs, tests/session-ui.test.mjs. 추가: src/session.js, tests/session-flow.test.mjs.
- 상태: 구현 완료·미검증. DB/운영 main 변경 없음.

## 005 변경 (2026-11-04)
- 사용자 요청으로 상태 표시·오류 UI를 5문제 연속 풀이, 진행 바, 제출 즉시 다음 문제, 결과 및 오답 목록으로 교체.
- src/session.js, tests/session-flow.test.mjs 추가. src/main.js, index.html, src/styles.css, tests/session-ui.test.mjs, tests/navigation-markup.test.mjs 수정.
- 상태: 구현 완료·미검증. DB/운영 main 변경 없음.

## 005 최종 검증 (2026-11-04)
- 답안 제출 정규식 오류 수정 후 자동 테스트·staging 배포 성공 (Actions 41835783943).
- 사용자 5문제 연속 풀이 기능 검수 8개 항목 모두 정상 확인.
- 최종 상태: 검증 완료. DB/운영 main 변경 없음.

## 006 회원가입·로그인 기반 구축 (2026-11-04)
- 사용자 승인으로 개발 착수. #auth 화면, 회원가입·로그인·로그아웃, 세션 조회/유지 및 상태 표시, 인증 오류 안내 구현.
- 추가: src/auth.js, src/supabase-config.js, tests/auth.test.mjs. 수정: index.html, src/main.js, src/navigation.js, src/styles.css, tests/navigation.test.mjs, tests/navigation-markup.test.mjs 및 관리 문서.
- Supabase 프로젝트 공개 URL/key 미제공으로 실제 계정 연결·이메일 인증은 미검증. DB/운영 main 변경 없음. 상태: 구현 완료·미검증.

## 006 Supabase 연동 및 최종 검수 (2026-11-04)
- Supabase 공개 설정 연결: src/supabase-config.js, src/auth.js, src/main.js, index.html, 인증·캐시 버전 관련 테스트 변경. secret/service_role 키 미사용.
- 캐시 버전 불일치 자동 테스트 실패를 수정하여 staging Actions 41841572755 completed/success.
- 사용자 Supabase 인증 리디렉션 URL 설정 후 이메일 확인, 로그인, 새로고침 후 세션 유지, 로그아웃 검수 통과. 초기 로그인 실패는 비밀번호 오입력으로 확인.
- DB 스키마/운영 main 변경 없음. 상태: 검증 완료. 007 별도 승인 대기.

## 007 학생 프로필·학년 설정 (2026-11-04)
- 사용자 승인: 설계 및 staging 구현만 진행, 실제 DB 변경 전 별도 승인 필수.
- 추가: src/profile.js, db/007_student_profiles.sql(미적용), tests/profile.test.mjs.
- 변경: index.html, src/main.js, src/auth.js, src/styles.css, tests/navigation-markup.test.mjs.
- 로그인 후 학년 9개 선택·미리보기 구현. 저장 기능은 DB 미적용으로 비활성; 사용자에게 미저장 상태 명시.
- 운영 main/실제 DB 변경 없음. 상태: 구현 완료·미검증.

## 007 DB 적용 및 저장 구현
- 사용자 별도 DB 적용 승인 후 Supabase migration create_student_profiles_007 성공.
- RLS 활성화/정책 3개 확인, 기존 행 0개. src/profile.js 저장·불러오기 구현, src/main.js·index.html·src/auth.js·tests 수정, 버전 007-2.
- 운영 main 변경 없음. staging CI 및 사용자 실기기 검수 대기. 상태: 구현 완료·미검증.

## 007 최종 검증
- 사용자 실제 브라우저 검수 5개(로그인 표시/저장/새로고침/재로그인/학년 변경) 모두 통과 보고.
- DB 권한 점검에서 authenticated DELETE/TRUNCATE 권한 발견. 승인된 007 보안 범위 내 restrict_student_profiles_privileges_007 migration 적용, 권한 회수 후 SELECT/INSERT/UPDATE만 허용 확인.
- RLS 조회 실증: 실제 사용자 본인 1건 조회, 다른 사용자 UUID 역할 조회 0건. 운영 main 변경 없음.
- 상태: 검증 완료. 008은 별도 승인 대기.

## 008 학부모 계정·자녀 연결
- 사용자 승인 범위: 설계·staging 구현만. 실제 DB 변경 전 별도 승인.
- 추가: src/family.js, db/008_family_links.sql(미적용), tests/family.test.mjs.
- 변경: index.html, src/main.js, src/auth.js, src/styles.css, tests/navigation-markup.test.mjs.
- 학부모 자녀 연결 상태 미리보기 구현. 연결 코드/서버 검증/DB 쓰기는 아직 없음. 운영 main 변경 없음.
- 상태: 구현 완료·미검증.
