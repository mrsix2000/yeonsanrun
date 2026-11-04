# DEVELOPMENT LOG
## 001 기본 시스템 구축 (2026-11-04)
- 신규 정적 웹앱 구축. 자동 테스트와 staging 배포 통과. 사용자 화면 검수 5개 항목 통과.
- 상태: 검증 완료. DB 변경 없음.
## 002 공통 화면 구조 및 내비게이션 구축 (2026-11-04)
- 범위: 홈/연산 훈련/학습 기록 화면 분리, 공통 헤더/메뉴, 해시 라우팅, 모바일 메뉴, 기존 덧셈 체험 유지
- 변경: index.html, src/main.js, src/navigation.js, src/styles.css, tests/navigation.test.mjs 및 관리 문서
- DB 변경: 없음. 운영 배포: 없음.
- 상태: 구현 완료·미검증. CI 및 사용자 화면 확인 대기.
