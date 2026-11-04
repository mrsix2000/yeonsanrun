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
