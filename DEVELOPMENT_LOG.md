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
