# ARCHITECTURE
- HTML/CSS/JavaScript ESM, GitHub Pages staging. 운영 main 변경 없음.
- src/catalog.js: 8개 영역/35개 예정 유형.
- src/engine.js: 순수 문제 생성 createQuestion(operation,random,options), createAdditionQuestion 호환, gradeAnswer. options={digits:1|2|3,condition:'any'|'with'|'without'}.
- 덧셈/뺄셈: 선택 자릿수 두 피연산자, 받아올림/받아내림 조건 보장. 한 자리 뺄셈의 받아내림 선택 불가.
- 곱셈: 선택 자릿수 × 한 자리. 나눗셈: 선택 자릿수 몫 × 한 자리 제수로 나머지 없는 문제.
- src/navigation.js: 해시 라우팅. src/main.js: 유형·자릿수·조건 선택, 선택 변경 시 세션 리셋, 채점/점수.
- src/styles.css: 반응형 공통 UI. 학습 데이터는 메모리만 사용; DB/Auth/RLS 미도입.
- tests/: 엔진 경계/조건/회귀 및 화면 마크업 검증. staging Actions npm test 후 배포.

- 문제 생성 제한: 덧셈 0 제외(기존 1~9 범위), 곱셈의 인수 1 제외, 뺄셈 결과 0 제외, 나눗셈 몫 1 제외. 고정 난수 및 경계값에서도 적용.

- 005 대체: src/session.js에서 5문제 세션 상태/시도/결과 계산. 제출 즉시 다음 문제 전환, 5문제 완료 시 결과·오답 표시, 진행 바. 메모리만 사용.

- 005 검증 완료: 5문제 세션 상태와 결과 요약은 src/session.js에서 관리. 사용자 브라우저 검수 8개 항목 통과. 006의 Supabase Auth는 별도 승인 전까지 미도입.

- 006: src/auth.js는 Supabase Auth의 가입·로그인·로그아웃·세션·변경 이벤트를 담당. src/supabase-config.js에는 공개 URL과 publishable key만 허용. 인증 화면은 #auth 해시 경로. 공개 설정이 없으면 인증을 비활성화하고 안내. 외부 CDN ESM 의존성은 브라우저 실제 검증 필요. 학습 기록 저장 및 회원 프로필 DB는 미도입.

- 006 실제 연결: Supabase 프로젝트 phydtapmwwonunqgaupx (서울), src/supabase-config.js 공개 URL/publishable key 사용. 회원가입·이메일 확인·로그인·세션 지속·로그아웃 브라우저 검수 완료. 인증 후 이동 주소는 staging GitHub Pages로 사용자 설정. 회원 프로필/학습 기록 DB 및 RLS는 후속 작업에서 설계·검증.

- 007 초안: src/profile.js는 E1~E6/M1~M3 학년 코드 및 표시명을 제공. 로그인 후 #auth에서 학년 선택 미리보기(저장하지 않음). db/007_student_profiles.sql은 user_id=auth.users.id PK, grade_code CHECK, 본인 소유 RLS 정책을 제안. 실제 DB 변경은 별도 승인 대기. 학부모-자녀 관계는 후속 설계.

- 007 DB 승인 적용: public.student_profiles 생성, RLS 활성화, 본인 소유 select/insert/update 3개 정책. src/profile.js의 loadStudentProfile/saveStudentProfile이 사용자 ID로 조회·upsert. 인증 변경 시 로그인 계정별 조회, 로그아웃 시 선택 초기화. 실제 교차 사용자 권한 실증 테스트는 별도 진행 필요.

- 007 보안 최종 조정: public/anon/authenticated 기본 테이블 권한 전부 회수 후 authenticated SELECT/INSERT/UPDATE만 재부여. RLS 3개 정책으로 auth.uid()=user_id 강제. 별도 학부모 접근은 아직 허용하지 않음.

## 008 학부모·자녀 연결 설계 (미적용)
- src/family.js: 연결 상태 및 자녀 표시명 검증. 로그인 계정에만 보이는 미리보기 UI.
- db/008_family_links.sql: parent_user_id/student_user_id 양측 auth.users 참조, 복수 자녀/복수 보호자 확장 가능한 관계 테이블, 자기 자신 연결 방지, 읽기 RLS.
- 연결 권한: 이메일만으로 연결 금지. 학생 인증 계정에서 단기 일회성 코드를 발급하고 학부모가 제출하면 서버 측 검증 후 연결. 코드 해시·만료·재사용 차단, 취소·동의 정책은 DB 승인 전 상세 확정. 브라우저의 직접 INSERT/UPDATE/DELETE 불허.
- 008 DB/서버 함수 아직 미적용. 학부모의 학습 데이터 조회 권한은 후속 033~034에서 별도 정책 설계.

## 자동 테스트 구조 보강
- develop GitHub Actions .github/workflows/ci.yml: Node 22, JavaScript 구문 검사 후 npm test.
- staging workflow: develop 소스 체크아웃 후 npm test 성공 시에만 GitHub Pages 배포.
- tests/build-integrity.test.mjs: 로컬 import 경로·캐시 버전, HTML id, 참조 요소, 클라이언트 비밀키 패턴 정적 검사.
- 실제 브라우저 E2E 및 Supabase 테스트 전용 환경은 아직 미구축. 정적 검사와 실제 브라우저 검증은 구분.

## 008 DB 적용 (최신)
- family_links: 학부모-학생 관계, SELECT만 authenticated 및 양측 소유 RLS. 클라이언트 직접 INSERT/UPDATE/DELETE 금지.
- family_invites: 128비트 무작위 코드 SHA-256 해시, 10분 TTL, 1회 교환 후 삭제. 직접 테이블 접근 금지.
- family_link_attempts: 계정별 15분 5회 제한. 잘못된 코드에는 NULL 반환해 시도 횟수 트랜잭션 보존.
- create_family_invite, redeem_family_invite RPC: SECURITY DEFINER, search_path='', extensions crypto 명시, auth.uid() 확인, authenticated만 EXECUTE.
- 아직 학부모의 학습 기록 조회 권한은 없음. 학생 코드 발급은 학년 프로필 보유 필요.

## 008 최종 검증
- 학부모 및 학생 각각 연결 1건 조회, 무관한 UUID 역할 0건 조회. family_links/family_invites/family_link_attempts RLS 활성.
- 관계 직접 쓰기 권한 없음, 초대 코드 직접 조회 불가, anon RPC 실행 불가. 운영 main 미변경.

## 009 인증 상태·접근 제어
- src/access.js: 세션 ID, 저장된 학생 프로필 존재, 연결된 자녀 존재로 UI 기능 표시를 계산한다. 사용자 편집 가능한 metadata는 권한 근거로 사용하지 않는다.
- 로그아웃 시 연결 코드, 목록, 학년 권한 상태를 초기화한다. 학년 설정 전에는 학생 연결 코드 발급 버튼 숨김.
- 클라이언트 권한 표시는 UX 보조일 뿐이며 실제 데이터 접근은 Supabase Auth/RLS/RPC가 강제한다. 학부모/학생은 배타적 역할이 아니며 계정이 두 기능을 모두 가질 수 있다.

## 009 최종 검증
- 인증 상태에 따른 계정 기능 표시, 학생 학년 기반 코드 발급 UI 제한, 로그아웃 시 계정 정보 초기화가 사용자 실제 화면 검수를 통과함.
- DB 권한 강제는 기존 RLS/RPC가 담당하며 009에서 DB 스키마나 정책 변경 없음.

## 010 회원 정보 변경·탈퇴 설계
- src/account.js는 Supabase Auth `updateUser`로 로그인 사용자의 이메일·비밀번호 변경을 처리한다. 브라우저에서 관리자 키·관리자 API 사용 금지.
- 이메일 변경은 Supabase의 확인 이메일 정책에 따라 인증이 필요할 수 있다. 비밀번호 변경은 서버의 재인증 정책을 따른다.
- 계정 탈퇴는 서버 인증, 본인 재인증, 자녀 연결·학습 기록 보존/삭제 정책, 별도 DB 변경 승인 전까지 미구현. 삭제 버튼/엔드포인트 없음.
- 기존 student_profiles, family_links 테이블 변경 없음. 운영 main 미변경.

## 010 검수 상태
- 사용자 화면 확인 완료(2026-11-05). 계정 삭제 구현은 별도 승인 전 보류. 서버 측 삭제·연관 데이터 정책 미확정.

## 011 콘텐츠 카탈로그
- src/catalog.js: GRADE_CODES E1~E6/M1~M3, CONTENT_TYPES 35개 고유 ID/areaId/name/grade/gradeIndex/order/level/prerequisites/generator/status.
- status=available은 기존 자연수 사칙연산 4개뿐, 나머지 31개는 planned. 미구현 유형을 출제 가능하다고 표시하지 않음.
- getContentType/getTypesForGrade/validateCatalog 공개 API. 기존 AREAS/TOTAL_TYPES 호환 유지. DB 변경 없음.

## 012~014 콘텐츠 엔진 초안
- src/curriculum-engine.js: 20개 유형의 순수 문제 생성 createCurriculumQuestion(typeId, random), 채점 gradeCurriculumAnswer(question,raw). 분수 기약분수 동치 허용, 소수·정수 수치 비교. 기존 src/engine.js API 유지.
- 현재 신규 20개 유형은 UI에 연결되지 않음. catalog.status available은 생성기 존재 의미이며 실제 화면에서 사용 가능하다는 뜻은 아님. 향후 016 통합 시 UI 노출 예정.

## 015~020 문제풀이 통합
- src/catalog.js: 35개 유형의 학년·난이도(level 1~3)·선행 유형 관계; 현재 생성기 구현 24개, 11개 계획.
- src/typed-engine.js: availableTypes/createTypedQuestion/gradeTypedAnswer/isValidAnswerInput; 기존 자연수 엔진과 신규 분수·소수·정수 등 엔진 연결.
- src/main.js: 유형 선택 셀렉트, 자연수만 자릿수·받아올림 설정 노출, 5문제 세션 공통 처리, performance.now 기반 문항별 시간 측정.
- src/session.js: 시도마다 typeId/durationMs 저장(메모리), 합산 시간 계산. 학습 기록 DB 저장 없음.

## 021~025 학습 모드
- src/study-modes.js: 5개 모드, 진단 5개 대표 유형, 메모리 내 오답률 기반 취약/추천 유형, 날짜별 챌린지 유형. localStorage/DB 사용 없음.
- src/main.js: 모드 선택과 기존 5문제 세션 연결. 진단은 5개 유형을 한 문제씩 제시. 최근 기록은 현재 페이지 생존 동안만 메모리에 보유.

## 026~030 기기 로컬 학습 기록
- src/learning-history.js: localStorage key yeonsanrun.practice.v1, 완료 5문제 세션만 저장, 최대 200회, 문제별 typeId/correct/durationMs 및 모드/시각. 개인정보·인증정보 저장 안 함.
- 분석: 정답률, 문항별 평균 풀이 시간, 취약 유형, 오늘/최근7일/최근30일 완료 횟수, 간단 학습 가이드. 서버 동기화 없음. 동일 브라우저의 모든 이용자에게 기록이 보일 수 있으므로 계정별 기록으로 간주하지 않음.
- 운영 DB 및 인증 정책 변경 없음. 향후 Supabase 사용자별 기록은 RLS/별도 테스트 DB/운영 승인 후 개발.

## 031~035 화면 구조
- src/dashboards.js: studentDashboard(records), sessionTrend(records), parentDashboard(links). 학생 화면은 기기 로컬 기록 기반; 학부모 화면은 연결된 자녀의 별칭/수만 제공하며 자녀 성적은 서버 데이터 없이 노출하지 않음.
- src/main.js: 홈 요약, 학습 기록 추이, 계정 내 학부모 안내 연동. src/styles.css: 모바일 레이아웃/키보드 포커스/동작 줄이기.
- 서버 자녀 학습 기록/RLS 연결은 미구현이며, 운영 DB 변경 없음.

## 036~040 구독·결제 미리보기
- src/billing-preview.js: 7일 체험 계산(미리보기), 월/6개월/연간 요금제 가격 null, entitlement false, checkoutEnabled false, 결제·환불 요청은 명시적 예외.
- #plans 라우트: 가격/결제사/환불 정책 미확정 공지, 비활성화 결제 버튼. Supabase Auth/DB/결제 API 호출 없음.
- 운영 결제 연동은 서버 검증, 웹훅 서명 검증, RLS, 멱등성, 환불/해지 정책과 별도 승인 후 수행.

## 041~045 준비 상태
- src/admin-readiness.js: 5개 영역 준비 목록과 비활성화 상태만 반환. 서버 기능 없음.

## 출시 준비 게이트
- src/admin-readiness.js 및 #admin: 운영 준비 상태 안내만 제공. 관리자 권한 인증이나 데이터 접근 기능 아님.
- src/release-gates.js: 자동 테스트, 실제 브라우저, 계정별 기록, 학부모 리포트, 구독 권한, 결제, 관리자 보안, 운영 승인 모두 증빙될 때만 출시 가능으로 평가.
- 운영 main 및 Supabase 운영 DB 변경 금지 유지.

## 계정별 기록 서버 설계 초안
- docs/PRACTICE_HISTORY_SCHEMA_DRAFT.sql: practice_sessions/practice_attempts, 사용자 소유권 기반 SELECT/INSERT RLS, session_id+user_id 복합 FK. 운영 미적용.
- src/server-history.js: DB 연결용 어댑터 초안. 현재 UI 미연결. 세션과 문항 2단계 INSERT의 부분 실패 가능성 때문에 운영 사용 전 트랜잭션 RPC 및 멱등성 설계 필요.
- 부모 조회 정책은 의도적으로 미구현. 운영 DB 변경 없음.
