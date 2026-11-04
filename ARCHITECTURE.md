# ARCHITECTURE
- 프론트엔드: 정적 HTML/CSS/ES Modules, GitHub Pages 예정
- src/catalog.js: 8개 영역 메타데이터
- src/engine.js: 순수 문제 생성 및 채점
- src/main.js: 화면 이벤트 및 상태
- 데이터베이스: Supabase 테스트/운영 프로젝트 분리 예정 (아직 미연결)
- 보안: 서버 비밀키를 브라우저에 넣지 않음. 추후 Auth/RLS 별도 검증
- 브랜치: main 운영 보존, develop 신규 개발
- 운영/테스트 배포: 아직 구성되지 않음. 운영 배포는 승인 필요
