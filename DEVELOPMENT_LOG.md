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

## 공통 자동 테스트 시스템 점검·보강 (2026-11-04)
- 기존: develop push/PR CI 및 staging 배포 전 npm test 존재.
- 추가: tests/build-integrity.test.mjs, .github/workflows/ci.yml 구문 검사 단계.
- GitHub Actions develop run 41849056652 completed/success.
- 운영 main/실제 DB 변경 없음. 008 상태 유지.

## 008 DB 승인 후 구현
- 사용자 명시 승인 후 Supabase migrations family_links_and_secure_invites_008, family_invite_persist_rate_limit_008, qualify_crypto_functions_008 적용.
- src/family.js 실제 RPC 및 목록 조회 구현, src/main.js 및 index.html 연결 UI 변경, tests/family.test.mjs 보강.
- 운영 main 변경 없음. 사용자 실제 부모/학생 계정 연결 검수 대기.

## 008 최종 승인·검증
- 사용자 실제 화면 4개 모두 통과: 학생 코드 발급, 학부모 연결, 목록 표시, 코드 재사용 거부.
- Supabase 연결 1건, 미사용 코드 0건. 역할별 SELECT: 부모 1/학생 1/무관 계정 0. 테이블 RLS 및 직접 쓰기 권한 차단 확인.
- staging Actions 41851544920 completed/success. 운영 main 미변경. 상태 검증 완료.

## 009 인증 상태·접근 권한 관리
- src/access.js, tests/access.test.mjs 추가. src/main.js 및 index.html 접근 상태 UI/로그아웃 초기화 변경. src/auth.js 및 내비게이션 테스트 캐시 버전 갱신.
- develop CI run 41853811611 completed/success. 운영 main/DB 변경 없음. 실제 화면 검수 대기.

## 009 최종 검증 완료
- 사용자 실제 화면 테스트 4/4 통과 확인: 비로그인 화면, 학생 학년/코드 발급, 학부모 자녀 목록, 로그아웃 초기화.
- develop CI 41854056488 성공, staging CI/배포 41854728410 성공 확인.
- 운영 main 변경 없음, DB 변경 없음. 009 검증 완료.

## 010 회원 정보 수정·탈퇴
- src/account.js, tests/account.test.mjs 신규. src/main.js, src/auth.js, index.html, tests/navigation-markup.test.mjs 변경.
- 이메일·비밀번호 수정 폼과 입력 검증 구현. 탈퇴는 안내만 제공하며 실제 삭제 기능 없음.
- develop CI 41910193966 성공. staging README 트리거 커밋 7b829114b6625d65511b2c8876927341a8493fdc. DB 변경/실제 계정 삭제/운영 main 변경 없음.
- 상태: 구현 완료·미검증 (스테이징 및 실제 화면 확인 필요).

- staging run 41910287188 completed/success; 010-1 배포 확인.

## 010 사용자 화면 확인 (2026-11-05)
- 사용자 '확인 완료' 보고를 010 화면 검수 승인으로 기록. 이메일·비밀번호 변경 UI의 실제 화면 확인 완료.
- 계정 삭제 서버 구현/실제 삭제는 별도 승인 전 보류. 전체 010 작업 상태는 보류, 구현된 부분은 검수 완료.

## 011 연산 콘텐츠 분류 체계 (2026-11-05)
- 사용자 1차 전체 기능 신속 구현 방식 승인. 011부터 단계별 구현 착수.
- src/catalog.js 35개 유형의 학년·ID·구현상태 정의, tests/catalog.test.mjs 추가.
- 실제 DB/운영 main 변경 없음. CI 및 사용자 화면 검수 결과 확인 전까지 구현 완료·미검증.

## 012~014 빠른 연속 개발 (2026-11-05)
- src/curriculum-engine.js 및 tests/curriculum-engine.test.mjs 신규 생성, src/catalog.js 가용 상태 갱신, tests/catalog.test.mjs 회귀 수정.
- 첫 CI에서 새 모듈의 캐시 버전 누락으로 실패하여 수정. 최종 CI 결과 확인 대기. UI 연결·스테이징 배포 미완료.

## 015~020 연속 개발 (2026-11-05)
- 015 선행 유형·난이도 규칙 정의, 016~017 통합 문제 생성·채점·입력 검증, 018 기존 자연수 자릿수/조건 유지, 019 문항별 시간 측정, 020 통합 회귀 테스트.
- src/catalog.js, src/main.js, src/session.js, index.html, tests/answer-submission.test.mjs, tests/session-ui.test.mjs 수정; src/typed-engine.js, tests/typed-engine.test.mjs 생성.
- 기존 테스트의 구형 코드 패턴 기대 및 분수 입력 정규식 문제 수정. CI 41934745630 성공(시간 기록 커밋 직전); 최종 CI/스테이징 확인 별도.
- 운영 main, 운영 DB 변경 없음. 실제 화면 사용자 검수 전.

## 015~020 사용자 검수 확정 및 021~025 구현 (2026-11-05)
- 사용자가 015~020 스테이징 화면 5개 항목 모두 통과 보고. 015~020 검증 완료로 갱신.
- 021~025: src/study-modes.js, tests/study-modes.test.mjs 신규 생성, src/main.js 및 index.html 변경. 운영 main/DB 변경 없음.
- 021~025 실제 화면 검수 전까지 구현 완료·미검증.

## 021~025 검수 및 026~030 구현 (2026-11-05)
- 사용자 021~025 실제 화면 테스트 통과 보고, staging run 41935457375 성공 확인. 검증 완료 갱신.
- 026~030: src/learning-history.js, tests/learning-history.test.mjs 신규; src/main.js, index.html 변경. 완료된 훈련 세션만 기기에 저장하고 학습 기록 화면에서 통계 표시.
- 운영 main/운영 DB 변경 없음. 기기 로컬 1차 구현이며 서버 저장·계정 간 동기화 미구현.

## 031~035 대시보드 (2026-11-05)
- 026~030 이후 사용자가 'ㅇㅋ 다음' 요청. 상세 검수 통과 항목을 명시하지 않아 별도 검증 완료 처리는 보류.
- src/dashboards.js, tests/dashboards.test.mjs 생성; src/main.js, index.html, src/styles.css 수정.
- 홈 학생 요약·최근 세션 추이·연결 자녀 수·학부모 기록 미제공 안내·모바일 스타일 추가. 운영 main/DB 변경 없음.

## 031~035 검수 및 036~040 미리보기 (2026-11-05)
- 사용자 '통과 다음'으로 031~035 스테이징 검수 승인. 036~040 src/billing-preview.js, tests/billing-preview.test.mjs 생성, index.html, src/main.js, src/navigation.js 및 관련 테스트 수정.
- 가격·결제사 미선정으로 실제 결제, 체험 권한 부여, 구독 상태 저장은 구현하지 않음. 운영 DB/사이트 변경 없음.

## 036~040 검수 및 041~045 착수
- 사용자가 036~040 안내 화면 통과 보고. 041~045 준비 상태 모듈과 테스트 추가. 화면 수정 요청은 안전 검사에서 차단되어 반영하지 못함.

## 041~050 개발 및 상용화 격차 점검
- 사용자 승인에 따라 041~050 준비 작업과 상용화 격차 점검 병행.
- 운영 준비 안내 라우트/화면 연결, src/release-gates.js, tests/release-gates.test.mjs 추가. 실제 관리자 API나 운영 결제 구현 없음.
- 스테이징 배포 및 사용자 화면 검수 대기. 운영 환경 변경 없음.

## 계정별 학습 기록 설계 착수 (2026-11-05)
- 사용자 041~045 운영 준비 화면 확인 보고. 실제 관리자 기능은 미구현.
- SQL 초안, 서버 기록 어댑터, 테스트 작성. 운영 DB 적용·운영 사이트 배포하지 않음.

## 테스트 Supabase 프로젝트 생성
- yeonsanrun-test (서울) 별도 생성, 월 $0 견적. 학습 기록 스키마/RLS 테스트 DB 적용. 운영 DB 변경 없음.

- 테스트 DB A/B 소유권 RLS SQL 롤백 검증 성공. 원자적 저장 RPC 추가, 클라이언트 어댑터 및 테스트 수정. 운영 DB 미변경.

- 테스트 전용 5문항 로그인·저장·재조회 화면 구현, 테스트 전용 DB만 연결. 운영 앱의 학습 기록 방식은 변경 없음.


## 2026-11-05 서버 기록 E2E 브라우저 검수
- 테스트 주소: `https://mrsix2000.github.io/yeonsanrun-staging/test-history.html`.
- yeonsanrun-test 연결을 확인한 뒤 브라우저에서 테스트 계정 가입 요청 수행. `example.com` 주소는 Auth가 거부했으며, 다른 형식 주소로 가입 계정 생성 확인.
- 테스트 DB Auth에 미인증 사용자 1개 생성됨. 브라우저 로그인 결과: `Email not confirmed`. 이메일 확인 링크에 접근할 수 없어 5문항 풀이/서버 저장/로그아웃/재로그인/기록 조회는 미실행.
- 확인된 결함 없음. 소스 수정, GitHub 변경, 자동 테스트 및 스테이징 재배포는 하지 않음. 제품 버그 확인 후에만 수정.
- 테스트 DB 외 변경 없음. 테스트 계정 비밀번호는 문서·로그에 기록하지 않음.

## 2026-11-05 테스트 이메일 가입 제한
- 사용자가 제공한 이메일로 스테이징 가입을 시도했으나 `email rate limit exceeded`. test project `auth.users`에서 해당 주소 계정 없음 확인.
- 55초 대기 후 한 번 재시도했지만 동일 응답. 운영 DB 변경 없음. 코드/배포 수정 없음. 계속 반복하지 않고 일시 제한 해제 또는 테스트 Auth 이메일 설정 확인이 필요함.


## 2026-11-05 테스트 전용 서버 기록 브라우저 검증 완료
- 사용자가 테스트 프로젝트에서 Confirm email을 꺼 준 뒤 기존 스테이징 페이지로 학생/학부모 계정별 흐름 실행.
- 학생 계정 가입 및 로그인 성공. 2+3, 4+5, 7+2, 6+6, 9+1에 답해 5/5 정답. 화면에 저장 1건 표시.
- 로그아웃 후 같은 학생 계정 재로그인: 서버 기록 1건 및 5/5 재조회 성공.
- 별도 학부모 테스트 계정 가입·로그인: 기록 0건. 로그아웃·재로그인 후에도 0건.
- yeonsanrun-test DB 집계: 학생 1세션/5시도/5정답, 학부모 0세션/0시도. 두 계정만 비교했고 실제 parent-child 관계 연결 권한은 시험 범위가 아님.
- 오류 없음. 소스 코드 수정/배포 없음. develop CI workflow run 41958467803 성공(문서-only 커밋 기준). 이후 결과 문서 갱신만 수행.
- 운영 DB/운영 사이트 미변경. 이메일 확인을 다시 켜는 설정은 사용자가 test 프로젝트 대시보드에 로그인해 복구해야 함. 기존 실패 과정에서 만들어진 미인증 throwaway 테스트 계정 1개는 test DB에 남아 있으며 학습 세션 없음;삭제하지 않음.

- 사용자 서버 기록 검증 완료 보고에 따라 학부모 리포트 집계 작업 착수. 집계 모듈, 권한 차단 SQL 초안, 단위 테스트 작성. 운영 DB/사이트 변경 없음.

- 학부모 리포트 2차: 테스트 DB 부모 권한 정책 적용, 읽기 전용 어댑터 및 단위 테스트 구현. 실서비스 UI와 운영 DB는 변경하지 않음.

- 학부모 리포트 테스트 화면 및 분리 테스트 추가, staging README 배포 트리거. 실제 부모 연결 생성 UI는 의도적으로 미구현(권한 오남용 방지).


## 2026-11-05 학부모 리포트 브라우저·권한 검증
- 테스트 URL: `https://mrsix2000.github.io/yeonsanrun-staging/test-parent-report.html` (테스트 전용 화면).
- 테스트 학부모 계정으로 로그인 성공. 자녀 목록 새로고침 후 `자녀 연결 0건`, `승인된 자녀 연결이 없습니다`, `자녀를 선택하면 기록이 표시됩니다` 노출 확인. 이어 로그아웃 후 `학부모 로그인 필요`, 로그아웃/새로고침 비활성화 확인.
- test DB `parent_report_grants` 승인 연결 0건. 브라우저에서 리포트 읽기가 일어나지 않았으며 정답률·풀이 속도·취약 유형 지표와 연결된 자녀 접근 성공은 미검증.
- `yeonsanrun-test`의 authenticated 역할 읽기 모의: 부모 UID로 승인 연결 0, 자녀 세션 0, 자녀 시도 0. 학생 UID로 본인 세션 1, 시도 5. 테스트 DB 외 데이터 접근/변경 없음.
- 미연결 접근 차단 결과는 정상. 오류 없음으로 소스 수정, CI 재실행, staging 배포 없음. 운영 사이트 및 운영 DB 변경 없음.
- 후속: 관리자 절차로 승인된 테스트 연결 데이터가 마련된 후 연결 자녀 조회 및 세 지표, 제3자 학생 차단을 양성 경로 포함해 검증.

## 2026-11-05 부모 리포트 E2E 재개 시도 — 인증 차단
- 사용자 승인: test DB에서 임시 부모-자녀 연결 후 실제 리포트/미연결 접근을 확인하고, 끝나면 연결 해제. 운영 제외.
- `yeonsanrun-test`에서 지정된 테스트 학생의 세션 1건·시도 5건 및 관계 grant 0건을 사전 확인.
- 브라우저 인증은 사용자 승인된 secure browser auth 흐름으로 시도했으나 화면 오류 `Invalid login credentials`. 재시도하지 않고 페이지를 새로고침해 입력값 제거.
- 연결 grant는 생성하지 않음. test DB 권한/데이터 변경 없음. 운영 사이트·DB 변경 없음.
- 다음: 사용자가 secure browser auth 입력에서 올바른 학부모 계정 비밀번호로 재시도 선택 시 이어서 실행.

## 2026-11-05 부모 리포트 임시 연결 DB 권한 확인
- 사용자 승인에 따라 yeonsanrun-test에서 지정된 학부모/학생 사이 parent_report_grants 1행을 임시 생성.
- `authenticated` 역할·학부모 UID로 RLS 조회: 연결 1건, 자녀 session 1건, attempt 5건. 집계값 100% 정답, 평균 풀이 1,000ms, 유형 natural.add.
- 검증 후 정확히 해당 grant 행 삭제. 삭제 후 부모 조회 grant/session/attempt 각 0건이며 학생 본인 attempts 5건 유지. 테스트 데이터 기록은 보존, grant는 0행.
- 브라우저 로그인은 `Invalid login credentials`; 실제 리포트 화면은 미검증. 입력값은 새로고침으로 제거. 운영 변경 없음.
- 2026-11-05: 학부모 테스트 로그인 OTP 복구 폼과 verifyOtp(type=recovery) 추가. 테스트 코드 확장. 운영 사이트/DB 변경 없음. 이메일 템플릿은 대시보드 별도 설정 필요.

- 2026-11-05: 인증 로그에서 첫 verify 성공(303, login), 이후 같은 토큰 재사용 403 확인. OTP UI 제거, 기본 복구 링크 복원, 복구 이벤트/오류 안내 개선.

- 2026-11-05: test parent recovery 요청 429 over_email_send_rate_limit 확인. 이메일 복구 E2E는 보류하고, UI에 발송 제한·재시도 안내 및 자동 테스트 추가. 독립 작업 계속 진행.

- 2026-11-05: src/account-history.js 신설, src/main.js/index.html 수정, tests/account-history.test.mjs 신설. 완료 5문제 로컬 저장 유지 후 로그인 사용자에 한해 테스트 서버 RPC 업로드, 로그인 시 계정별 조회. staging workflow 테스트 DB 격리 변경. 실제 브라우저 사용자 검수 전까지 미검증.


## 2026-11-05 026~030 통합 브라우저 검증 및 수정
- 스테이징 메인 화면과 학습 기록 화면 정상 표시. staging workflow run 41978712676 성공; workflow가 배포본에 테스트 DB 설정만 넣도록 구성되고 운영 프로젝트 ref 제외 검사를 수행함. 브라우저 기록 화면의 로그인 전 서버 상태 문구 정상 확인.
- 비로그인 브라우저 훈련 5문항 제출: 5/5 정답, 100%, 총 20.8초. `학습 기록` 화면에 1회·5문제·100%·평균 4.2초/문항 표시. 화면 새로고침 뒤 같은 로컬 기록 유지.
- 결함: 최초 비로그인 인증 상태에서 `accountHistoryUser=null`와 초기 `null`이 같아 `refreshAccountHistory(null)`을 건너뛰고 서버 상태가 '연결 확인 중'에 머물렀음.
- 수정 파일: `src/account-history.js`(shouldRefreshAccountHistory), `src/main.js`(최초 auth 초기화), `tests/account-history.test.mjs`(guest 초기화/identity 변경 회귀 테스트). develop CI run 41978367901 성공.
- 사용자 안전 인증 요청은 취소됨. 학생 계정 로그인, 서버 세션 신규 저장, 서버 조회, 로그아웃/재로그인 흐름은 미실행. 테스트 DB 기존 기록 1 session/5 attempts 유지. guest session은 서버에 저장되지 않음.
- RLS test DB role simulation: 학생 본인 1 session/5 attempts, 다른 authenticated 계정 0/0, anon은 practice 테이블 SELECT 권한 거부. SQL 쓰기 없음.
- staging repo `.github/workflows/staging.yml`에 테스트 전용 배포 출처를 설명하는 주석 추가(동작 변경 없음), 이후 성공 배포. 운영 사이트/DB 변경 없음.
- 모바일 실제 뷰포트 검증 미실행. 사용자 인증 재개 및 최종 확인 대기.
- 2026-11-05: index.html 서버 기록 새로고침 버튼, src/main.js 사용자 ID 재검증·중복 클릭 방지·상태 안내, tests/account-history.test.mjs 회귀 검사 추가. develop 반영, 운영 DB/사이트 변경 없음.


## 2026-11-05 026~030 브라우저 검증 재개
- develop 관리 문서·코드 및 최신 CI/staging 성공 상태 확인. 이전 guest 로컬 저장/새로고침, test DB RLS 역할 모의 검증은 반복하지 않음.
- staging 기록 화면에서 guest 기록 1회·5문제·100%·평균 4.2초 확인. 인증 입력 UI에서 학생 이메일/비밀번호를 안전 브라우저 절차로 요청했으나 요청이 취소되어 즉시 중단.
- 이번 작업 코드 수정 없음. 신규 풀이·DB 쓰기 없음. test DB 학생 기존 1 session/5 attempts 보존. 인증 사용자 서버 기록, 수동 새로고침 버튼, 로그아웃/재로그인, 모바일은 미검증. 비밀번호 재설정은 제외.
- 운영 DB/사이트 미접속·미변경. 기존 RLS 검증 기록은 유지.


## 2026-11-05 학부모 비밀번호 복구 후 브라우저 검증
- 사용자가 테스트 스테이징에서 복구 링크 인증과 새 비밀번호 변경 성공을 보고함. 해당 선행 결과는 사용자 보고이며 이번 세션에서 독립 확인하지 않음.
- 지정된 학부모 리포트 페이지를 실제 브라우저로 열어 테스트 전용 안내와 로그아웃 상태(`학부모 로그인 필요`, 로그아웃/새로고침 비활성)를 확인.
- 변경 비밀번호로 재로그인, 새로고침 세션 유지, 자녀 목록 조회 및 연결 없음 안내는 인증정보 미제공으로 미검증. 비밀번호 추측·임의 재설정 금지 지침에 따라 로그인 시도하지 않음.
- 테스트 DB 읽기/쓰기 및 계정 변경 없음. 운영 사이트와 운영 DB 미접속·미변경. 코드 수정 및 자동 테스트 미실행.


## 2026-11-05 학부모 인증 최종 E2E
- 사용자가 이미 확인한 복구 링크 인증·새 비밀번호 변경 성공을 유지했으며 복구 절차는 재수행하지 않음.
- Work 안전 인증 입력으로 테스트 학부모 계정 로그인 성공. 페이지 새로고침 후에도 로그인 유지 확인.
- 로그아웃 성공 후 로그인 필요 UI와 비활성 로그아웃/새로고침 확인. 변경된 비밀번호로 재로그인 성공.
- 자녀 목록 요청 성공: 연결 0건, `승인된 자녀 연결이 없습니다` 표시. 연결된 자녀 리포트는 데이터가 없어 미검증.
- 테스트 스테이징 및 테스트 Auth만 사용. 비밀번호를 모델에 노출하거나 저장하지 않음. 부모-자녀 grant/학습 데이터 수정·삭제 없음. 운영 사이트/DB 변경 없음.
- 코드 수정 및 자동 테스트 실행 없음. 문서만 갱신.

## 2026-11-05 047 학부모 리포트 권한 회귀 테스트 추가
- develop tests/parent-report-server.test.mjs에 인증 계정 불일치, 서버 grant/기록 오류, 200회 조회 상한, 빈 기록 처리 테스트 추가(commit 76e0d77b16454f7be0da1167679d78cb557333e6).
- 테스트 DB SELECT 집계: 연결 grant 0건, 학생 학습 세션 1건, 시도 5건. DB 쓰기 없음.
- 기존 학부모 인증 브라우저 E2E 성공 유지. 실제 연결된 자녀의 지표 화면과 026~030 학생 서버 기록 통합 E2E는 별도 미검증. CI 결과 확인 대기. 운영 환경 변경 없음.


## 2026-11-05 026~030 / 학부모 리포트 E2E 재개 기록
- 최신 develop 코드·다섯 관리 문서·GitHub Actions 및 staging Actions 사전 확인. 최신 develop CI run 42009091989 success; staging run 42003764097 success. 자동 테스트 실패 없음, 코드 수정 불필요.
- 브라우저가 이미 학부모 테스트 계정으로 로그인된 상태여서 학생 흐름 시작 전 해당 세션을 종료함(기존 학부모 E2E 성공을 반복 검증한 것이 아니라 학생 계정 전환 목적).
- 학생 계정 인증 결과 화면이 지정한 학생이 아닌 학부모 계정으로 표시되어 즉시 로그아웃. 이후 안전한 이메일 입력도 지정 학생 주소와 불일치하여 비밀번호 입력/연산 훈련/서버 저장 전에 중단.
- test DB 읽기 전후: practice_sessions 1, practice_attempts 5, parent_report_grants 0. 세션/시도/grant 변경·삭제 없음.
- 기존 성공: 학부모 로그인·세션 유지·로그아웃·재로그인·자녀 0건 조회, guest 5문제·로컬 기록, RLS 교차 계정 검증은 재실행하지 않고 유지. 부모 연결 자녀 실화면 지표는 미실행.
- 부수 화면 경고: 로그인 후 staging 기본 계정 설정 화면에서 student_profiles/family_links schema-cache 테이블 누락 메시지 관찰. 이번 과제의 학습 기록/부모 리포트 테이블과 별도이며 이 경고를 수정하거나 DB 스키마를 변경하지 않음.
- 운영 DB/사이트 미접속·미변경, 이메일 비밀번호 재설정 없음, 모바일 미실행.


## 2026-11-05 학생 서버 기록 E2E 재시도
- 테스트 Supabase `auth.users`를 읽기 전용으로 확인: 지정 학생 계정 1개, 이메일 인증 완료.
- staging 브라우저는 로그아웃 상태 확인. 이메일 입력란을 비운 후 Work 안전 인증으로 이메일 입력을 요청했으나 화면 값이 대상 학생과 다름. 비밀번호 요청·로그인·연습은 사용자 지정 중단 조건에 따라 미실행.
- test DB 집계는 이전과 동일하게 sessions 1, attempts 5, parent grants 0. DB 쓰기/수정/삭제 없음.
- 기존 학부모 인증·빈 자녀 조회, guest 로컬 기록 및 RLS 성공 기록은 재실행하지 않고 보존. 학생 계정 서버 E2E와 연결 리포트 양성 경로는 미검증.
- 코드 수정 없음. 직전 최신 develop CI와 staging 배포는 success; 이번에는 코드/배포 변경 없음. 운영 환경 미접속·미변경.


## 2026-11-05 학생 서버 기록·학부모 연결 리포트 실제 브라우저 E2E
- 성공: 지정 학생 계정으로 로그인, 연산 5문항 풀이(5/5, 100%, 23.4초), Supabase 테스트 DB에 새 세션 1건/시도 5건 추가 저장. DB 합계 2세션/10시도.
- 성공: 계정별 기록 화면에 2세션/10문항/100% 표시, 서버 새로고침 버튼 실행, 로그아웃·재로그인 및 페이지 새로고침 후 기록 유지.
- 성공: 테스트 학부모 로그인, 승인 임시 연결 자녀 1명 조회. 자녀 2세션/10문항/정답률 100%/평균 2.8초/최근 7일 2회/취약 유형 없음 표시.
- 성공: 임시 grant 해제 후 테스트 DB 정확 연결 0건. 기존 학습 기록 2세션/10시도 유지. 기존 RLS 교차 계정 검증은 반복하지 않음.
- 실패 및 수정: 실제 grant 해제 후 목록은 0건인데 이전 자녀 지표가 남는 UI 오류 확인. src/parent-report.js, src/test-parent-report.js, tests/parent-report.test.mjs, test-parent-report.html 수정. 초기 CI는 모듈 캐시 버전 불일치 1건으로 실패; 캐시 버전 정정 후 CI 42019704191 성공, race 무효화 보강 후 42020021655도 성공. staging에 수정본 배포 및 브라우저 재검증 대기.
- 미실행: 모바일 뷰포트. 사용자 최종 승인 전 구현 완료·미검증 유지. 운영 환경 변경 없음.

## 2026-11-05 staging 브라우저 재검증 최종 결과
- 수정본 staging workflow 42020311527 성공 배포 후 실제 학부모 브라우저에서 다시 검증했다.
- 임시 승인 연결 상태에서 자녀 1명 리포트(2세션/10문항/정답률 100%/평균 2.8초/최근 7일 2회/취약 유형 없음)가 표시됐다.
- 연결을 해제하고 자녀 목록을 새로고침하자 자녀 연결 0건, 연결 없음 안내 및 기본 요약 안내만 남았고 과거 지표는 화면에서 제거됐다. 리포트 조회 버튼도 더 이상 노출되지 않았다.
- test DB 최종 확인: 지정 부모-학생 grant 0건, 학생 학습 기록 2세션/10시도 보존. 학부모 테스트 세션 로그아웃 완료.
- 자동 테스트 및 staging 배포 성공. 모바일 미실행. 기존 RLS 교차 계정 검증은 재실행하지 않고 이전 성공 이력을 유지. 운영 환경 미변경.
- 사용자 최종 승인 전 작업 상태는 구현 완료·미검증으로 유지한다.
