# SEO 작업 인계 (2026-11-04)

Claude Code가 이 파일을 읽고 이어서 작업합니다. 브라우저 작업은 aside-browser 스킬(`aside repl`)로 진행합니다.

## 완료된 작업
- 제목·요약의 HTML 엔티티(&lsquo; 등) 깨짐 수정 — `lib/decodeEntities.js`, `lib/data.js`, `lib/travel.js`, `app/api/link-preview/route.js`
- 상단 메뉴 '강의 문의' 버튼 글자색 흰색 — `app/globals.css`
- SEO 메타 정보 — `app/layout.js`
  - 홈 제목: "양성길 | 인싸이트컨설팅 대표 · AI 미래기술 강의 · 양성길의 세계여행"
  - 인싸이트/인사이트 두 표기 병기(설명·키워드·JSON-LD·푸터)
  - OG 이미지, JSON-LD(WebSite·Organization·Person) 보강
  - 네이버 소유확인 메타태그(content=f2dcfc79dbe6035b98ebe9595ad2fa9a46b18581) 배포됨
- 페이지별 제목·설명 보강(about, profile, lecture, travel, contact)
- 로고 교체: `public/logo.png` (상단 메뉴, 푸터 흰 바탕)
- 구글 서치콘솔: URL 접두어 https://insightconsulting.kr/ 소유확인 완료(`public/googleb559dcda2d76bfb1.html` — 삭제 금지), sitemap.xml 제출(46페이지 성공), 홈 색인 재요청 완료

## 남은 작업 (순서대로)
1. 네이버 서치어드바이저 (https://searchadvisor.naver.com/console/board)
   - insightconsulting.kr 소유확인 버튼 클릭(메타태그는 이미 배포됨)
   - 요청 → 사이트맵 제출: https://insightconsulting.kr/sitemap.xml
   - 요청 → 웹 페이지 수집: https://insightconsulting.kr/ , /profile , /lecture , /travel
2. Bing 웹마스터 도구: 구글 서치콘솔에서 가져오기로 등록
3. 구글 비즈니스 프로필에 '인싸이트컨설팅' 등록 검토(사용자 확인 필요)
4. 블로그·SNS 프로필 웹사이트 링크를 insightconsulting.kr로 변경(사용자 확인 후, 게시·설정 변경은 사용자 승인 필요)
5. 파비콘을 로고로 교체(선택)

## 주의
- 배포: main 브랜치 push 시 Vercel 자동 배포
- git 원격 주소에 GitHub 토큰이 평문으로 들어 있음 → 토큰 폐기·재발급 후 원격 주소 갱신 권장
- 전체 전략 문서: claude.ai 문서 "인싸이트컨설팅 홈페이지 SEO 전략"
