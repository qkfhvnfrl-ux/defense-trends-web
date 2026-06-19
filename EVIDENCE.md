# 2026-06-20 적용 필터 배지 표시

## 작업 상태

completed

## 실행 명령어
```powershell
& "C:\Program Files\nodejs\npm.cmd" run typecheck
& "C:\Program Files\nodejs\npm.cmd" run lint
```

## 수정 내역

- `src/App.tsx`: 활성 필터 라벨 배열 생성 추가
- `src/App.tsx`: 활성 필터 영역에 적용 조건 배지 표시 추가
- `src/styles.css`: 필터 배지 줄바꿈/시각 스타일 추가
- `scripts/verify-render.cjs`: 프리셋 적용 후 필터 배지 표시 검증 추가
- `scripts/verify-design.cjs`: 필터 배지 표시 및 컨트롤 크기 검증 추가

## 검증 결과

- `npm run typecheck`: 통과
- `npm run lint`: 통과
- 권한 상승 후 `npm run quality`: 통과
  - validate:data 통과: 15 equipment / 30 variants / 23 components / 7 battlefield technologies / 7 case studies / 6 development lens items / 8 engineering references
  - test 통과: 2 files / 5 tests
  - build 통과: JS 428.86 kB / CSS 44.21 kB
  - test:e2e 통과: presetFilterTags 1 / presetNeedsReviewRows 3 / browser errors 없음
  - design:check 통과: presetFilterTags 1 / undersized controls 없음
  - dev:check 통과: browser errors 없음

## 남은 리스크

- 필터 배지는 읽기 전용이다. 개별 배지 클릭 해제는 필요성이 확인되면 별도 작업으로 추가한다.

# 2026-06-20 선택 장비 요약 복사 추가

## 작업 상태

completed

## 실행 명령어
```powershell
& "C:\Program Files\nodejs\npm.cmd" run typecheck
& "C:\Program Files\nodejs\npm.cmd" run lint
```

## 수정 내역

- `src/App.tsx`: 선택 장비 요약 텍스트 생성 함수 추가
- `src/App.tsx`: 선택 장비 요약 복사 상태와 Clipboard API 처리 추가
- `src/App.tsx`: 선택 장비 패널에 `요약 복사`, `상세 페이지 열기` 작업 버튼 추가
- `src/styles.css`: 선택 장비 빠른 작업 버튼 레이아웃 추가
- `scripts/verify-render.cjs`: 선택 장비 빠른 작업 버튼 2개 검증 추가
- `scripts/verify-design.cjs`: 선택 장비 빠른 작업 버튼 2개와 컨트롤 크기 검증 추가

## 검증 결과

- `npm run typecheck`: 통과
- `npm run lint`: 통과
- 권한 상승 후 `npm run quality`: 통과
  - validate:data 통과: 15 equipment / 30 variants / 23 components / 7 battlefield technologies / 7 case studies / 6 development lens items / 8 engineering references
  - test 통과: 2 files / 5 tests
  - build 통과: JS 428.26 kB / CSS 43.91 kB
  - test:e2e 통과: quickActionButtons 2 / equipmentRows 15 / browser errors 없음
  - design:check 통과: quickActionButtons 2 / undersized controls 없음
  - dev:check 통과: browser errors 없음

## 남은 리스크

- Clipboard API는 브라우저 권한에 따라 실패할 수 있으며, 실패 시 상태 메시지로 안내한다.

# 2026-06-20 중복 상단 메뉴 축소

## 작업 상태

completed

## 실행 명령어
```powershell
& "C:\Program Files\nodejs\npm.cmd" run typecheck
& "C:\Program Files\nodejs\npm.cmd" run lint
```

## 수정 내역

- `src/App.tsx`: 상단 `전체 장비` 메뉴 제거
- `src/App.tsx`: `/equipment`와 장비 상세 경로에서 `장비 검색` 메뉴가 활성화되도록 정리
- `scripts/verify-render.cjs`: 상단 메뉴 3개와 `전체 장비` 미노출 검증 추가
- `scripts/verify-design.cjs`: 상단 메뉴 3개와 `전체 장비` 미노출 디자인 검증 추가

## 검증 결과

- `npm run typecheck`: 통과
- `npm run lint`: 통과
- 권한 상승 후 `npm run quality`: 통과
  - validate:data 통과: 15 equipment / 30 variants / 23 components / 7 battlefield technologies / 7 case studies / 6 development lens items / 8 engineering references
  - test 통과: 2 files / 5 tests
  - build 통과: JS 427.03 kB / CSS 43.65 kB
  - test:e2e 통과: navButtons 3 / hiddenWholeEquipmentNav 0 / routeChecks 전체 렌더링
  - design:check 통과: navButtons 3 / hiddenWholeEquipmentNav 0 / undersized controls 없음
  - dev:check 통과: browser errors 없음

## 남은 리스크

- `/equipment` 경로는 호환용으로 유지한다. 완전 제거가 필요하면 외부 공유 링크 영향 검토가 먼저 필요하다.
- Pages 배포 후 공개 번들에 3개 메뉴 기준이 반영됐는지 확인해야 한다.

# 2026-06-20 팀 작업 큐 추가

## 작업 상태

completed

## 실행 명령어
```powershell
& "C:\Program Files\nodejs\npm.cmd" run typecheck
& "C:\Program Files\nodejs\npm.cmd" run lint
& "C:\Program Files\nodejs\npm.cmd" run quality
```

## 수정 내역

- `src/App.tsx`: 첫 화면 작업 큐 계산 및 버튼 UI 추가
- `src/App.tsx`: 출처 재확인 큐를 `/sources?freshness=stale`로 연결
- `src/App.tsx`: `/sources`가 `freshness` query를 초기 필터로 읽도록 개선
- `src/styles.css`: 작업 큐 버튼 그리드와 반응형 스타일 추가
- `scripts/verify-render.cjs`: 작업 큐 버튼, 출처 재확인 URL, 빈 상태 검증 추가
- `scripts/verify-design.cjs`: 작업 큐 버튼 수, 컨트롤 크기, 출처 재확인 이동 검증 추가

## 검증 결과

- `npm run typecheck`: 통과
- `npm run lint`: 통과
- 권한 상승 후 `npm run quality`: 통과
  - validate:data 통과: 15 equipment / 30 variants / 23 components / 7 battlefield technologies / 7 case studies / 6 development lens items / 8 engineering references
  - test 통과: 2 files / 5 tests
  - build 통과: JS 427.08 kB / CSS 43.65 kB
  - test:e2e 통과: teamQueueButtons 4 / sourceQueueUrlHasFreshness true / sourceQueueCards 0 / sourceQueueEmptyStates 1
  - design:check 통과: teamQueueButtons 4 / sourceQueueEmptyStates 1 / undersized controls 없음
  - dev:check 통과: browser errors 없음

## 남은 리스크

- 작업 큐는 현재 정적 데이터 기준으로 계산된다. 추후 데이터가 대량 확장되면 큐 기준을 별도 정책 파일로 분리할 수 있다.

# 2026-06-19 팀용 장비 검색 프리셋 추가

## 작업 상태

completed

## 실행 명령어
```powershell
& "C:\Program Files\nodejs\npm.cmd" run typecheck
& "C:\Program Files\nodejs\npm.cmd" run lint
& "C:\Program Files\nodejs\npm.cmd" run quality
```

## 수정 내역

- `src/App.tsx`: 장비 검색 프리셋 타입, 설정 배열, 적용 함수, 프리셋 버튼 UI 추가
- `src/styles.css`: 프리셋 버튼 그리드와 모바일 반응형 스타일 추가
- `scripts/verify-render.cjs`: 프리셋 버튼 수, 보강 필요 결과 축소, URL 동기화 검증 추가
- `scripts/verify-design.cjs`: 프리셋 버튼 수, 터치 크기, URL 동기화 검증 추가

## 검증 결과

- `npm run typecheck`: 통과
- `npm run lint`: 통과
- `npm run quality`: 샌드박스에서는 Vitest 설정 접근 권한 문제로 1회 실패, 권한 상승 후 통과
  - validate:data 통과: 15 equipment / 30 variants / 23 components / 7 battlefield technologies / 7 case studies / 6 development lens items / 8 engineering references
  - test 통과: 2 files / 5 tests
  - build 통과: JS 425.48 kB / CSS 43.00 kB
  - test:e2e 통과: presetButtons 4 / presetNeedsReviewRows 3 / presetUrlHasDataParam true
  - design:check 통과: presetButtons 4 / presetRows 3 / undersized controls 없음
  - dev:check 통과: browser errors 없음

## 남은 리스크

- 프리셋 목록은 현재 코드 상수로 관리한다. 운영자가 프리셋을 직접 편집해야 하면 추후 JSON 외부화가 필요하다.

# 2026-06-19 출처 필터 결과 내보내기 추가

## 작업 상태

completed

## 실행 명령어

```powershell
& "C:\Program Files\nodejs\npm.cmd" run typecheck
& "C:\Program Files\nodejs\npm.cmd" run lint
& "C:\Program Files\nodejs\npm.cmd" run quality
```

## 수정 내역

- `src/App.tsx`: 필터링된 출처 결과 요약 생성 함수 추가
- `src/App.tsx`: 필터링된 출처 결과 CSV 생성 및 다운로드 추가
- `src/App.tsx`: `/sources` 화면에 `출처 요약 복사`, `출처 CSV 다운로드` 버튼 및 상태 메시지 추가
- `src/styles.css`: 출처 내보내기 버튼 레이아웃 추가
- `scripts/verify-render.cjs`: 출처 내보내기 버튼 2개와 `source-index-results.csv` 다운로드 파일명 검증 추가
- `scripts/verify-design.cjs`: 출처 내보내기 버튼 2개와 컨트롤 크기 검증 추가

## 검증 결과

- `npm run typecheck`: 통과
- `npm run lint`: 통과
- 권한 상승 후 `npm run quality`: 통과
  - validate:data 통과: 15 equipment / 30 variants / 23 components / 7 battlefield technologies / 7 case studies / 6 development lens items / 8 engineering references
  - test 통과: 2 files / 5 tests
  - build 통과: JS 424.51 kB / CSS 42.36 kB
  - test:e2e 통과: sourceActionButtons 2 / csvSuggestedFilename `source-index-results.csv`
  - design:check 통과: sourceActionButtons 2 / undersized controls 없음
  - dev:check 통과: browser errors 없음

## 남은 리스크

- Clipboard API는 브라우저 권한에 따라 실패할 수 있으며, 이 경우 CSV 다운로드를 대체 수단으로 안내한다.
- CSV에는 정적 데이터의 확인 상태만 포함되며 실제 접속 실패 여부는 `sources:check` 결과와 별도다.

# 2026-06-19 출처 인덱스 필터/확인 상태 추가

## 작업 상태

completed

## 실행 명령어

```powershell
& "C:\Program Files\nodejs\npm.cmd" run typecheck
& "C:\Program Files\nodejs\npm.cmd" run lint
& "C:\Program Files\nodejs\npm.cmd" run quality
```

## 수정 내역

- `src/App.tsx`: `/sources` 화면에 출처 검색, 유형 필터, 확인 상태 필터, 상태 요약 추가
- `src/App.tsx`: 출처 카드에 `최근 확인` 또는 `재확인 필요` 표시 추가
- `src/styles.css`: 출처 상태 요약과 필터바 스타일 및 반응형 레이아웃 추가
- `scripts/verify-render.cjs`: 출처 카드/필터/상태 요약/유형 필터/검색 필터 검증 추가
- `scripts/verify-design.cjs`: 출처 필터 UI와 undersized control 검증 추가

## 검증 결과

- `npm run typecheck`: 통과
- `npm run lint`: 통과
- 권한 상승 후 `npm run quality`: 통과
  - validate:data 통과: 15 equipment / 30 variants / 23 components / 7 battlefield technologies / 7 case studies / 6 development lens items / 8 engineering references
  - test 통과: 2 files / 5 tests
  - build 통과: JS 423.19 kB / CSS 42.04 kB
  - test:e2e 통과: sourceCards 46 / sourceFilterInputs 1 / sourceFilterSelects 2 / sourceHealthStats 3 / officialCards 16 / searchFilteredCards 5
  - design:check 통과: sourceCards 46 / officialCards 16 / searchFilteredCards 5 / undersized controls 없음
  - dev:check 통과: browser errors 없음

## 남은 리스크

- `재확인 필요`는 `checkedAt` 날짜 기반이며 실제 링크 접속 성공/실패를 뜻하지 않는다.
- 실제 URL 소실 여부는 `npm run sources:check` 결과를 별도로 확인해야 한다.

# 2026-06-19 데이터 보강 필요 필터 추가

## 작업 상태

completed

## 실행 명령어

```powershell
& "C:\Program Files\nodejs\npm.cmd" run typecheck
& "C:\Program Files\nodejs\npm.cmd" run lint
& "C:\Program Files\nodejs\npm.cmd" run quality
```

## 수정 내역

- `src/App.tsx`: `dataStatus` 필터, `data` URL 파라미터, 데이터 상태 배지, 보강 사유 표시 추가
- `src/App.tsx`: 결과 요약 복사와 CSV에 데이터 상태/보강 사유 추가
- `src/styles.css`: 데이터 상태 배지와 행 배지 레이아웃 추가
- `scripts/verify-render.cjs`: readinessPills 15, filterSelects 8, needsReviewRows 3, `data=needs-review` 검증 추가
- `scripts/verify-design.cjs`: readinessPills 15, filterSelects 8, 보강 필요 필터/URL 검증 추가

## 검증 결과

- `npm run typecheck`: 통과
- `npm run lint`: 통과
- 권한 상승 후 `npm run quality`: 통과
  - validate:data 통과: 15 equipment / 30 variants / 23 components / 7 battlefield technologies / 7 case studies / 6 development lens items / 8 engineering references
  - test 통과: 2 files / 5 tests
  - build 통과: JS 421.19 kB / CSS 40.88 kB
  - test:e2e 통과: readinessPills 15 / filterSelects 8 / needsReviewRows 3 / dataStatusUrlHasParam true / mobile overflow 없음
  - design:check 통과: readinessPills 15 / filterSelects 8 / needsReviewRows 3 / undersized controls 없음
  - dev:check 통과: browser errors 없음

## 남은 리스크

- 보강 필요 기준은 현재 수동 데이터셋 기준의 운영 규칙이며, 실제 링크 상태 자동 점검 결과와 아직 직접 연결되어 있지 않다.
- 전장 사례 없음은 결측으로 보지 않으므로, 사례 조사 대상은 별도 필터 `전장 사례 없음`과 함께 운영해야 한다.

# 2026-06-19 검색 결과 핵심 지표 스트립 추가

## 작업 상태

completed

## 실행 명령어

```powershell
& "C:\Program Files\nodejs\npm.cmd" run typecheck
& "C:\Program Files\nodejs\npm.cmd" run lint
& "C:\Program Files\nodejs\npm.cmd" run quality
```

## 수정 내역

- `src/App.tsx`: 장비 검색 결과 행마다 `운용국`, `계열`, `전장 사례`, `출처` 지표 스트립 추가
- `src/styles.css`: 지표 스트립의 4열 grid, 모바일 안전 텍스트 처리, 시각 구분 스타일 추가
- `scripts/verify-render.cjs`: 장비 행별 지표 스트립 1개와 지표 셀 4개 검증 추가
- `scripts/verify-design.cjs`: 디자인 검증에 지표 스트립/셀 카운트 검증 추가

## 검증 결과

- `npm run typecheck`: 통과
- `npm run lint`: 통과
- sandbox 내부 `npm run quality`: 실패
  - 원인: `Cannot read directory "../..": Access is denied.`
  - 성격: Vitest/Vite 설정 로드 시 샌드박스 파일 접근 제한
- 권한 상승 후 `npm run quality`: 통과
  - lint 통과
  - validate:data 통과: 15 equipment / 30 variants / 23 components / 7 battlefield technologies / 7 case studies / 6 development lens items / 8 engineering references
  - test 통과: 2 files / 5 tests
  - build 통과: JS 419.85 kB / CSS 40.39 kB
  - test:e2e 통과: metricStrips 15 / metricCells 60 / mobile overflow 없음
  - design:check 통과: metricStrips 15 / metricCells 60 / undersized controls 없음
  - dev:check 통과: browser errors 없음

## 남은 리스크

- 지표는 현재 보유 데이터의 수량을 표시하므로, 데이터 자체의 최신성은 별도 출처 재검증 주기에 의존한다.
- 장비 수가 크게 늘어나면 결과 행의 정보 밀도와 스크롤 성능을 다시 점검해야 한다.

# EVIDENCE

## 2026-06-19 불필요한 3D/구형 코드 제거

### 작업 상태

completed

### 실행 명령어

```powershell
rg "@react-three|three|pngjs|canvas-frame|viewer-controls|hotspot|DevelopmentLensPage|TrendPanel|development-page|requirements-matrix|lifecycle-rail" -n package.json package-lock.json src scripts
& "C:\Program Files\nodejs\npm.cmd" uninstall @react-three/drei @react-three/fiber three pngjs
& "C:\Program Files\nodejs\npm.cmd" run typecheck
& "C:\Program Files\nodejs\npm.cmd" run lint
& "C:\Program Files\nodejs\npm.cmd" run validate:data
& "C:\Program Files\nodejs\npm.cmd" run test
& "C:\Program Files\nodejs\npm.cmd" run build
& "C:\Program Files\nodejs\npm.cmd" run quality
```

### 수정 내역

- `package.json`, `package-lock.json`: `@react-three/drei`, `@react-three/fiber`, `three`, `pngjs` 제거
- `src/components/DevelopmentLensPage.tsx`: 미사용 구형 개발 렌즈 페이지 삭제
- `src/components/TrendPanel.tsx`: 미사용 트렌드 패널 삭제
- `src/styles.css`: 3D 캔버스 조작 UI, 핫스팟 버튼, 삭제된 개발 렌즈 페이지 전용 스타일 제거
- `src/styles.css`: CSS 블록 정리 중 발생한 `reference-grid` 닫힘 누락을 복구

### 검증 결과

- `npm run typecheck`: 통과
- `npm run lint`: 통과
- `npm run validate:data`: 통과, 15 equipment / 30 variants / 23 components / 7 technologies / 7 case studies / 6 development lens items / 8 engineering references
- `npm run test`: 통과, 2 files / 5 tests
- `npm run build`: 통과, JS 415.91 kB / CSS 39.47 kB
- `npm run test:e2e`: 통과, 장비 15건 / 필터 4개 / 결과 내보내기 버튼 2개 / CSV 파일명 확인 / 모바일 overflow 없음
- `npm run design:check`: 통과
- `npm run dev:check`: 통과
- `npm run quality`: 통과

### 남은 리스크

- 실제 3D 뷰어를 다시 활성화할 때는 제거한 3D 런타임 의존성을 재도입해야 한다.
- `hotspotPosition` 필드는 현재 화면에서 직접 사용하지 않지만 향후 GLB 핫스팟 연동을 위해 유지했다.

---

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
## 2026-06-19 3D 준비 영역 제거 및 공개 장치 스펙 패널 전환

### 작업 상태

completed

### 실행 명령어

```powershell
& "C:\Program Files\nodejs\npm.cmd" run typecheck
& "C:\Program Files\nodejs\npm.cmd" run lint
& "C:\Program Files\nodejs\npm.cmd" run validate:data
& "C:\Program Files\nodejs\npm.cmd" run test
& "C:\Program Files\nodejs\npm.cmd" run build
& "C:\Program Files\nodejs\npm.cmd" run test:e2e
& "C:\Program Files\nodejs\npm.cmd" run design:check
& "C:\Program Files\nodejs\npm.cmd" run dev:check
& "C:\Program Files\nodejs\npm.cmd" run quality
```

### 수정 내역

- `src/components/ComponentSpecPanel.tsx`: 공개 장치/부품 스펙 패널 추가
- `src/components/ModelViewer.tsx`: 3D 준비 컴포넌트 제거
- `src/App.tsx`: 상세 영역에서 `ComponentSpecPanel` 사용
- `src/components/BattlefieldLens.tsx`: GLB 전제 문구 제거
- `src/components/EquipmentDetail.tsx`: 이미지 대체 문구에서 3D 전제 제거
- `src/styles.css`: `.model-slot` 스타일을 `.component-spec-panel` 기준으로 전환
- `scripts/verify-render.cjs`, `scripts/verify-design.cjs`, `scripts/verify-dev-render.cjs`: 검증 기준 갱신

### 검증 결과

- `npm run typecheck`: 통과
- `npm run lint`: 통과
- `npm run validate:data`: 통과, 15 equipment / 30 variants / 23 components / 7 battlefield technologies / 7 case studies / 6 development lens items / 8 engineering references
- `npm run test`: 통과, 2 files / 5 tests
- `npm run build`: 통과, JS 415.87 kB / CSS 39.26 kB
- `npm run test:e2e`: 통과, 장비 15건 / 지도 마커 12건 / 장치 스펙 패널 1건 / 모바일 overflow 없음
- `npm run design:check`: 통과, KPI 4개 / 필터 4개 / 장치 스펙 패널 1건 / undersized controls 없음
- `npm run dev:check`: 통과, 장비 15건 / 장치 스펙 패널 1건 / 브라우저 오류 없음
- `npm run quality`: 통과

### 남은 리스크

- 실제 3D GLB 뷰어를 다시 도입하려면 3D 의존성, 파일 검증, 모바일 성능 검증을 별도 작업으로 재개해야 한다.
- `modelPath`, `hotspotPosition`은 미래 호환용으로 남아 있으나 현재 화면에서는 직접 사용하지 않는다.

---
## 2026-06-19 검색 결과 출처 신뢰도 즉시 표시

### 작업 상태

completed

### 실행 명령어

```powershell
& "C:\Program Files\nodejs\npm.cmd" run typecheck
& "C:\Program Files\nodejs\npm.cmd" run lint
& "C:\Program Files\nodejs\npm.cmd" run validate:data
& "C:\Program Files\nodejs\npm.cmd" run test
& "C:\Program Files\nodejs\npm.cmd" run build
& "C:\Program Files\nodejs\npm.cmd" run test:e2e
& "C:\Program Files\nodejs\npm.cmd" run design:check
& "C:\Program Files\nodejs\npm.cmd" run dev:check
& "C:\Program Files\nodejs\npm.cmd" run quality
```

### 수정 내역

- `src/App.tsx`: 검색 행에 출처 신뢰도 배지, 공개 출처 수, 최근 확인일 추가
- `src/App.tsx`: 선택 장비 요약 패널에 출처 신뢰도/확인일/출처 수 추가
- `src/App.tsx`: 결과 요약 복사와 CSV 다운로드에 출처 등급, 최근 확인일, 출처 수 추가
- `src/styles.css`: 신뢰도 배지와 확인일 보조 라인 스타일 추가
- `scripts/verify-render.cjs`: 모든 장비 행의 신뢰도 배지/확인일 라인 검증 추가
- `scripts/verify-design.cjs`: 디자인 검증에 신뢰도 배지/확인일 라인 카운트 추가

### 검증 결과

- `npm run typecheck`: 통과
- `npm run lint`: 통과
- `npm run validate:data`: 통과, 15 equipment / 30 variants / 23 components / 7 battlefield technologies / 7 case studies / 6 development lens items / 8 engineering references
- `npm run test`: 통과, 2 files / 5 tests
- `npm run build`: 통과, JS 416.89 kB / CSS 39.87 kB
- `npm run test:e2e`: 통과, trustPills 15 / sourceQuicklines 15 / 모바일 overflow 없음
- `npm run design:check`: 통과, trustPills 15 / sourceQuicklines 15 / undersized controls 없음
- `npm run dev:check`: 통과, 장비 15건 / 브라우저 오류 없음
- `npm run quality`: 통과

### 남은 리스크

- 출처 신뢰도 점수는 현재 수동 데이터셋의 참고 지표이며, 실제 URL 재검증 자동 점수는 아직 연결되지 않았다.
- 향후 데이터가 대량 확장되면 낮은 신뢰도 장비만 따로 보는 필터가 필요할 수 있다.

---
## 2026-06-19 출처 신뢰도 필터 추가

### 작업 상태

completed

### 실행 명령어

```powershell
& "C:\Program Files\nodejs\npm.cmd" run typecheck
& "C:\Program Files\nodejs\npm.cmd" run lint
& "C:\Program Files\nodejs\npm.cmd" run validate:data
& "C:\Program Files\nodejs\npm.cmd" run test
& "C:\Program Files\nodejs\npm.cmd" run build
& "C:\Program Files\nodejs\npm.cmd" run test:e2e
& "C:\Program Files\nodejs\npm.cmd" run design:check
& "C:\Program Files\nodejs\npm.cmd" run dev:check
& "C:\Program Files\nodejs\npm.cmd" run quality
```

### 수정 내역

- `src/App.tsx`: `CatalogFilters.confidence` 추가
- `src/App.tsx`: `confidence` URL query string 읽기/쓰기 추가
- `src/App.tsx`: 신뢰도 등급별 검색 결과 필터링 추가
- `src/App.tsx`: 검색 패널에 `출처 신뢰도` 선택 상자 추가
- `scripts/verify-render.cjs`: 필터 5개, Low 신뢰도 필터, URL 동기화 검증 추가
- `scripts/verify-design.cjs`: 필터 5개, Low 신뢰도 필터, URL 동기화 검증 추가

### 검증 결과

- `npm run typecheck`: 통과
- `npm run lint`: 통과
- `npm run validate:data`: 통과, 15 equipment / 30 variants / 23 components / 7 battlefield technologies / 7 case studies / 6 development lens items / 8 engineering references
- `npm run test`: 통과, 2 files / 5 tests
- `npm run build`: 통과, JS 417.41 kB / CSS 39.87 kB
- `npm run test:e2e`: 통과, filterSelects 5 / lowConfidenceRows 1 / confidenceUrlHasParam true / 모바일 overflow 없음
- `npm run design:check`: 통과, filterSelects 5 / lowConfidenceRows 1 / undersized controls 없음
- `npm run dev:check`: 통과, 장비 15건 / 브라우저 오류 없음
- `npm run quality`: 통과

### 남은 리스크

- 현재 Low 신뢰도 장비는 1건이므로 데이터가 늘어날수록 신뢰도 등급 분포를 재점검해야 한다.
- 출처 신뢰도 점수 산정 자체는 아직 수동 데이터 기반이다.

---
## 2026-06-19 전장 사례 유무 필터 추가

### 작업 상태

completed

### 실행 명령어

```powershell
& "C:\Program Files\nodejs\npm.cmd" run typecheck
& "C:\Program Files\nodejs\npm.cmd" run lint
& "C:\Program Files\nodejs\npm.cmd" run validate:data
& "C:\Program Files\nodejs\npm.cmd" run test
& "C:\Program Files\nodejs\npm.cmd" run build
& "C:\Program Files\nodejs\npm.cmd" run test:e2e
& "C:\Program Files\nodejs\npm.cmd" run design:check
& "C:\Program Files\nodejs\npm.cmd" run dev:check
& "C:\Program Files\nodejs\npm.cmd" run quality
```

### 수정 내역

- `src/App.tsx`: `CatalogFilters.casePresence` 추가
- `src/App.tsx`: `cases` URL query string 읽기/쓰기 추가
- `src/App.tsx`: `battlefieldCaseIds` 기반 전장 사례 유무 필터링 추가
- `src/App.tsx`: 검색 패널에 `전장 사례` 선택 상자 추가
- `src/App.tsx`: 결과 요약 복사와 CSV 다운로드에 전장 사례 수 추가
- `scripts/verify-render.cjs`: 필터 6개, 사례 있음 필터, URL 동기화 검증 추가
- `scripts/verify-design.cjs`: 필터 6개, 사례 있음 필터, URL 동기화 검증 추가

### 검증 결과

- `npm run typecheck`: 통과
- `npm run lint`: 통과
- `npm run validate:data`: 통과, 15 equipment / 30 variants / 23 components / 7 battlefield technologies / 7 case studies / 6 development lens items / 8 engineering references
- `npm run test`: 통과, 2 files / 5 tests
- `npm run build`: 통과, JS 418.20 kB / CSS 39.87 kB
- `npm run test:e2e`: 통과, filterSelects 6 / withCaseRows 7 / casesUrlHasParam true / 모바일 overflow 없음
- `npm run design:check`: 통과, filterSelects 6 / withCaseRows 7 / undersized controls 없음
- `npm run dev:check`: 통과, 장비 15건 / 브라우저 오류 없음
- `npm run quality`: 통과

### 남은 리스크

- 전장 사례 유무는 현재 `battlefieldCaseIds` 데이터 입력 품질에 의존한다.
- 향후 사례 데이터가 늘어나면 분쟁 지역, 시기, 사례 신뢰도 기준의 추가 필터가 필요할 수 있다.

---
## 2026-06-19 검색 결과 정렬 기준 추가

### 작업 상태

completed

### 실행 명령어

```powershell
& "C:\Program Files\nodejs\npm.cmd" run typecheck
& "C:\Program Files\nodejs\npm.cmd" run lint
& "C:\Program Files\nodejs\npm.cmd" run validate:data
& "C:\Program Files\nodejs\npm.cmd" run test
& "C:\Program Files\nodejs\npm.cmd" run build
& "C:\Program Files\nodejs\npm.cmd" run test:e2e
& "C:\Program Files\nodejs\npm.cmd" run design:check
& "C:\Program Files\nodejs\npm.cmd" run dev:check
& "C:\Program Files\nodejs\npm.cmd" run quality
```

### 수정 내역

- `src/App.tsx`: `CatalogSortMode` 및 정렬 옵션 추가
- `src/App.tsx`: `sort` URL query string 읽기/쓰기 추가
- `src/App.tsx`: 신뢰도, 전장 사례 수, 계열 수, 최근 확인일 기준 정렬 로직 추가
- `src/App.tsx`: 검색 패널에 `정렬 기준` 선택 상자 추가
- `scripts/verify-render.cjs`: select 7개, 전장 사례 많은순, URL 동기화 검증 추가
- `scripts/verify-design.cjs`: select 7개, 전장 사례 많은순, URL 동기화 검증 추가

### 검증 결과

- `npm run typecheck`: 통과
- `npm run lint`: 통과
- `npm run validate:data`: 통과, 15 equipment / 30 variants / 23 components / 7 battlefield technologies / 7 case studies / 6 development lens items / 8 engineering references
- `npm run test`: 통과, 2 files / 5 tests
- `npm run build`: 통과, JS 419.30 kB / CSS 39.87 kB
- `npm run test:e2e`: 통과, filterSelects 7 / sortedFirstRow Boxer / sortUrlHasParam true / 모바일 overflow 없음
- `npm run design:check`: 통과, filterSelects 7 / sortedFirstRow Boxer / undersized controls 없음
- `npm run dev:check`: 통과, 장비 15건 / 브라우저 오류 없음
- `npm run quality`: 통과

### 남은 리스크

- 기본순은 현재 JSON 데이터 입력 순서를 따른다.
- 대량 데이터 확장 후에는 검색어 매칭 점수 기반 정렬도 검토할 수 있다.

---
