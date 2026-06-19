# EVIDENCE

## 2026-06-19 검색 결과 내보내기 추가

### 작업 상태

completed

### 실행 명령어

```powershell
& "C:\Program Files\nodejs\npm.cmd" run typecheck
& "C:\Program Files\nodejs\npm.cmd" run lint
& "C:\Program Files\nodejs\npm.cmd" run test
& "C:\Program Files\nodejs\npm.cmd" run validate:data
& "C:\Program Files\nodejs\npm.cmd" run build
& "C:\Program Files\nodejs\npm.cmd" run test:e2e
& "C:\Program Files\nodejs\npm.cmd" run design:check
& "C:\Program Files\nodejs\npm.cmd" run dev:check
& "C:\Program Files\nodejs\npm.cmd" run quality
```

### 수정 내역

- `src/App.tsx`: 필터 결과 요약 텍스트 생성 기능 추가
- `src/App.tsx`: 필터 결과 CSV 생성 및 다운로드 기능 추가
- `src/App.tsx`: `결과 요약 복사`, `CSV 다운로드` 버튼 추가
- `src/styles.css`: 결과 내보내기 버튼 그리드 및 모바일 레이아웃 스타일 추가
- `scripts/verify-render.cjs`: 결과 내보내기 버튼 2개와 CSV 다운로드 파일명 검증 추가
- `scripts/verify-design.cjs`: 결과 내보내기 버튼 렌더링 및 크기 검증 추가

### 검증 결과

- `npm run typecheck`: 통과
- `npm run lint`: 통과
- `npm run test`: 통과, 2 files / 5 tests
- `npm run validate:data`: 통과, 15 equipment / 30 variants / 23 components / 7 technologies / 7 case studies / 6 development lens items / 8 engineering references
- `npm run build`: 통과, JS 415.91 kB / CSS 44.47 kB
- `npm run test:e2e`: 통과, result action buttons 2개 / CSV 파일명 `equipment-search-results.csv` 확인
- `npm run design:check`: 통과, result action buttons 2개 / undersized controls 없음
- `npm run dev:check`: 통과
- `npm run quality`: 통과

### 남은 리스크

- 요약 복사는 Clipboard API 권한에 따라 제한될 수 있다.
- CSV 컬럼은 현재 검색 실무에 필요한 최소 필드이며, 향후 팀 요구에 따라 컬럼 확장이 필요할 수 있다.

---

## 2026-06-19 검색 조건 공유 링크 추가

### 작업 상태

completed

### 실행 명령어

```powershell
& "C:\Program Files\nodejs\npm.cmd" run typecheck
& "C:\Program Files\nodejs\npm.cmd" run lint
& "C:\Program Files\nodejs\npm.cmd" run test
& "C:\Program Files\nodejs\npm.cmd" run validate:data
& "C:\Program Files\nodejs\npm.cmd" run build
& "C:\Program Files\nodejs\npm.cmd" run test:e2e
& "C:\Program Files\nodejs\npm.cmd" run design:check
& "C:\Program Files\nodejs\npm.cmd" run dev:check
& "C:\Program Files\nodejs\npm.cmd" run quality
```

### 수정 내역

- `src/App.tsx`: 검색 조건을 URL query string에서 초기화하도록 추가
- `src/App.tsx`: 검색 필터/검색어/선택 장비 변경 시 URL query string 동기화
- `src/App.tsx`: 검색 링크 복사 버튼과 상태 메시지 추가
- `src/styles.css`: 공유 버튼과 상태 메시지 스타일 추가
- `scripts/verify-render.cjs`: 필터 URL 파라미터 생성 및 reload 복원 검증 추가
- `scripts/verify-design.cjs`: 공유 버튼 렌더링 및 국가 필터 URL 동기화 검증 추가

### 검증 결과

- `npm run typecheck`: 통과
- `npm run lint`: 통과
- `npm run test`: 통과, 2 files / 5 tests
- `npm run validate:data`: 통과, 15 equipment / 30 variants / 23 components / 7 technologies / 7 case studies / 6 development lens items / 8 engineering references
- `npm run build`: 통과, JS 414.06 kB / CSS 44.16 kB
- `npm run test:e2e`: 통과, share button 1개 / role URL param 생성 / reload 후 필터 결과 1건 유지
- `npm run design:check`: 통과, country URL param 생성 / undersized controls 없음
- `npm run dev:check`: 통과
- `npm run quality`: 통과

### 남은 리스크

- Clipboard API는 브라우저 보안 정책에 따라 http 로컬 환경에서 제한될 수 있으나, GitHub Pages HTTPS 환경에서는 정상 동작 대상이다.
- 공유 링크는 현재 데이터셋 ID와 필터값을 기준으로 하므로, 향후 데이터 명칭을 바꿀 때 구 링크 호환성을 고려해야 한다.

---

## 2026-06-19 팀원용 장비 검색 필터 고도화

### 작업 상태

completed

### 실행 명령어

```powershell
& "C:\Program Files\nodejs\npm.cmd" run typecheck
& "C:\Program Files\nodejs\npm.cmd" run lint
& "C:\Program Files\nodejs\npm.cmd" run test
& "C:\Program Files\nodejs\npm.cmd" run validate:data
& "C:\Program Files\nodejs\npm.cmd" run build
& "C:\Program Files\nodejs\npm.cmd" run test:e2e
& "C:\Program Files\nodejs\npm.cmd" run design:check
& "C:\Program Files\nodejs\npm.cmd" run dev:check
& "C:\Program Files\nodejs\npm.cmd" run quality
```

### 수정 내역

- `src/App.tsx`: 임무/파생형, 국가, 운용 상태, 계열 성숙도 필터 추가
- `src/App.tsx`: 검색 대상에 계열차량 명칭, 임무, 무장, 성숙도 포함
- `src/App.tsx`: 필터 적용 조건 수와 초기화 버튼 추가
- `src/App.tsx`: 검색 결과 행에 역할 태그와 계열 수 표시
- `src/styles.css`: 필터 그리드, 선택 상자, 적용 조건 바, 결과 행 보조 텍스트 스타일 추가
- `scripts/verify-render.cjs`: 필터 4개 렌더링 및 역할 필터 축소 동작 검증 추가
- `scripts/verify-design.cjs`: 필터 UI, 초기화 버튼 크기, 국가 필터 축소 동작 검증 추가

### 검증 결과

- `npm run typecheck`: 통과
- `npm run lint`: 통과
- `npm run test`: 통과, 2 files / 5 tests
- `npm run validate:data`: 통과, 15 equipment / 30 variants / 23 components / 7 technologies / 7 case studies / 6 development lens items / 8 engineering references
- `npm run build`: 통과, JS 411.96 kB / CSS 43.78 kB
- `npm run test:e2e`: 통과, 필터 select 4개 / 역할 필터 결과 1건 / 모바일 overflow 없음
- `npm run design:check`: 통과, 국가 필터 결과 4건 / 검색어 필터 결과 1건 / undersized controls 없음
- `npm run dev:check`: 통과
- `npm run quality`: 통과

### 남은 리스크

- 현재 장비 데이터는 15종이므로 필터 구조는 준비됐지만 실제 “전 세계 장비 검색” 수준의 DB 확장이 필요하다.
- 국가 데이터가 일부 대표 운용국 중심이라 향후 `operatorCountries` 정밀 확장이 필요하다.
- 일부 과거 문서 텍스트가 콘솔 인코딩 환경에서 깨져 보일 수 있다.

---

## 2026-06-19 운영 문서 체계 도입

### 작업 상태

completed

### 실행 명령어

```powershell
Get-ChildItem -Force AGENTS.md,PROJECT_STATE.md,TASKS.md,DECISIONS.md,EVIDENCE.md,CHANGELOG.md -ErrorAction SilentlyContinue | Select-Object Name,Length,LastWriteTime
& 'C:\Program Files\Git\cmd\git.exe' status --short --branch
rg --files
```

### 초기 확인 결과

- `CHANGELOG.md`만 존재했다.
- `AGENTS.md`, `PROJECT_STATE.md`, `TASKS.md`, `DECISIONS.md`, `EVIDENCE.md`는 없었다.
- Git 상태는 `main...origin/main`이었다.
- 미추적 파일 `ax-development-journey.html`이 있었다.

### 수정 내역

- `AGENTS.md` 신규 생성
- `PROJECT_STATE.md` 신규 생성
- `TASKS.md` 신규 생성
- `DECISIONS.md` 신규 생성
- `EVIDENCE.md` 신규 생성
- `CHANGELOG.md`에 운영 문서 체계 도입 이력 추가

### 검증 결과

- 문서 존재 확인: 통과
  - `AGENTS.md`
  - `PROJECT_STATE.md`
  - `TASKS.md`
  - `DECISIONS.md`
  - `EVIDENCE.md`
  - `CHANGELOG.md`
- `npm run validate:data`: 통과
  - 15 equipment
  - 30 variants
  - 23 components
  - 7 battlefield technologies
  - 7 case studies
  - 6 development lens items
  - 8 engineering references
- `git status --short --branch`: 확인
  - `main...origin/main`
  - 운영 문서 변경 파일 확인
  - 미추적 `ax-development-journey.html`은 이번 작업 범위 제외

### 남은 리스크

- `README.md`, `CHANGELOG.md`의 과거 한글 내용이 콘솔에서 깨져 보인다.
- `ax-development-journey.html`은 미추적 상태이며 이번 작업 범위에서 제외했다.
## 2026-06-19 장비 검색 카탈로그 중심 UI 개편

### 작업 상태

completed

### 실행 명령어

```powershell
& "C:\Program Files\nodejs\npm.cmd" run typecheck
& "C:\Program Files\nodejs\npm.cmd" run lint
& "C:\Program Files\nodejs\npm.cmd" run test
& "C:\Program Files\nodejs\npm.cmd" run validate:data
& "C:\Program Files\nodejs\npm.cmd" run build
& "C:\Program Files\nodejs\npm.cmd" run test:e2e
& "C:\Program Files\nodejs\npm.cmd" run design:check
& "C:\Program Files\nodejs\npm.cmd" run dev:check
& "C:\Program Files\nodejs\npm.cmd" run quality
```

### 수정 내역

- `src/App.tsx`: 장비 검색 중심 첫 화면, 메뉴 단순화, `/insights` 및 `/sources` 화면 추가, 기존 `/development`, `/technologies`, `/cases`, `/compare` 흡수
- `src/components/ModelViewer.tsx`: 기본 3D 캔버스 제거, GLB 추후 연동 슬롯과 부품 스펙 버튼으로 단순화
- `src/styles.css`: 검색 카탈로그, 모델 슬롯, 모바일 레이아웃 스타일 추가
- `scripts/verify-render.cjs`: 캔버스 검증을 모델 슬롯/부품 슬롯 검증으로 변경
- `scripts/verify-design.cjs`: KPI 4개, 검색 필드, 모델 슬롯 기준으로 갱신
- `scripts/verify-dev-render.cjs`: 개발 서버 검증 기준을 `.model-slot`으로 변경
- `src/routing.test.ts`: `/insights` 경로 기준으로 라우팅 테스트 갱신

### 검증 결과

- `npm run typecheck`: 통과
- `npm run lint`: 통과
- `npm run test`: 통과, 2 files / 5 tests
- `npm run validate:data`: 통과, 15 equipment / 30 variants / 23 components / 7 technologies / 7 case studies / 6 development lens items / 8 engineering references
- `npm run build`: 통과, JS 408.88 kB
- `npm run test:e2e`: 통과, 장비 15건 / 지도 마커 12건 / 모델 슬롯 1건 / 모바일 overflow 없음
- `npm run design:check`: 통과
- `npm run dev:check`: 통과
- `npm run quality`: 통과

### 남은 리스크

- 현재 장비 데이터는 15종이므로 "전 세계 모든 장비 검색" 목표에는 지속적인 데이터 확장이 필요하다.
- 실제 GLB 3D 모델은 아직 추가되지 않았다.
- 일부 기존 문서의 과거 한글 텍스트가 콘솔에서 깨져 보인다.

---
