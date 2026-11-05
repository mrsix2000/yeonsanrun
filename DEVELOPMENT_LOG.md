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
