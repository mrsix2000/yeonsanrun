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
