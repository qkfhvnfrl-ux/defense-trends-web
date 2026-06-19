# PROJECT_STATE

## 상태

completed

## 프로젝트 목적

해외 차륜형장갑차, 전차, 궤도형 장갑차, 자주포, 방공 플랫폼의 공개 출처 기반 동향을 한국어 중심 웹앱으로 제공한다. 장비별 제원, 계열차량, 전장 사례, 현대 전장 기술 연계, 3D 플레이스홀더 뷰어, 지도 기반 사례 탐색을 유지보수 가능한 정적 웹앱으로 관리한다.

## 기술 스택

- Vite
- React
- TypeScript
- Three.js / React Three Fiber
- Leaflet / React Leaflet
- Zod
- Vitest
- Playwright
- ESLint
- GitHub Pages

## 구현 완료 기능

- 공개 출처 기반 장비 데이터 JSON 관리
- 장비 상세, 비교, 기술, 사례 페이지
- 세계지도 기반 전장 사례 표시
- 한국어 지도 보조 라벨
- 3D 플레이스홀더 모델 및 부품 핫스팟
- 차량 계열/파생형 데이터
- 현대 전장 기술 패널
- 출처 URL 검증 스크립트
- 이미지 URL 검증 스크립트
- Playwright 렌더링 검증
- GitHub Pages 배포 구조
- Harness-based development 운영 문서 체계

## 진행 중 기능

- 없음

## 위험 요소

- 일부 외부 이미지/출처는 원 사이트 정책에 따라 403, 429, 리다이렉트가 발생할 수 있다.
- 실제 GLB 모델은 아직 플레이스홀더 구조이며 Meshy.ai 결과물 교체가 필요하다.
- `README.md`, `CHANGELOG.md`의 과거 한글 일부가 콘솔에서 깨져 보일 수 있다.
- GitHub Actions 자동 배포는 토큰 workflow 권한 문제로 현재 사용하지 않고 `gh-pages` 브랜치 배포 방식을 사용한다.
- 미추적 파일 `ax-development-journey.html`은 사용자 작업물 가능성이 있어 이번 작업 범위에서 제외했다.

## 다음 우선순위

1. 실제 GLB 모델 경로별 교체 절차 정리
2. 데이터 출처 정기 재검증 주기 수립
3. GitHub Pages 배포 자동화 재검토
4. `README.md`, `CHANGELOG.md` 인코딩/문서 품질 정리
5. 장비/기술 데이터 확장 시 TASKS/EVIDENCE 동시 갱신
