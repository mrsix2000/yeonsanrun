# ARCHITECTURE
- HTML/CSS/JavaScript ESM, GitHub Pages staging. 운영 main 변경 없음.
- src/catalog.js: 8개 영역/35개 예정 유형.
- src/engine.js: 순수 문제 생성 createQuestion(operation,random,options), createAdditionQuestion 호환, gradeAnswer. options={digits:1|2|3,condition:'any'|'with'|'without'}.
- 덧셈/뺄셈: 선택 자릿수 두 피연산자, 받아올림/받아내림 조건 보장. 한 자리 뺄셈의 받아내림 선택 불가.
- 곱셈: 선택 자릿수 × 한 자리. 나눗셈: 선택 자릿수 몫 × 한 자리 제수로 나머지 없는 문제.
- src/navigation.js: 해시 라우팅. src/main.js: 유형·자릿수·조건 선택, 선택 변경 시 세션 리셋, 채점/점수.
- src/styles.css: 반응형 공통 UI. 학습 데이터는 메모리만 사용; DB/Auth/RLS 미도입.
- tests/: 엔진 경계/조건/회귀 및 화면 마크업 검증. staging Actions npm test 후 배포.
