# TASKS

## 진행 중 작업

- 없음

## 완료 작업

### 2026-06-20 중복 상단 메뉴 축소

- 상태 전이: new_task -> planned -> executing -> verifying -> completed
- 목표:
  - 팀원이 보는 상단 메뉴에서 같은 검색 화면으로 이어지는 중복 진입점을 제거한다.
  - 기존 공유 링크와 상세 라우트는 유지해 호환성을 보존한다.
- 결과:
  - `전체 장비` 상단 메뉴 제거
  - 상단 메뉴를 `장비 검색`, `전장 인사이트`, `출처` 3개로 단순화
  - `/equipment`와 `/equipment/:id`에서는 `장비 검색` 메뉴가 활성화되도록 정리
  - E2E/디자인 검증에 메뉴 3개와 `전체 장비` 미노출 조건 추가
- 검증:
  - `npm run typecheck` 통과
  - `npm run lint` 통과
  - 권한 상승 후 `npm run quality` 통과

### 2026-06-20 팀 작업 큐 추가

- 상태 전이: new_task -> planned -> executing -> verifying -> completed
- 목표:
  - 팀원이 첫 화면에서 오늘 먼저 점검할 장비/출처 범위를 바로 볼 수 있게 한다.
  - 검색 프리셋과 출처 인덱스를 작업 큐에서 직접 연결해 반복 클릭을 줄인다.
- 결과:
  - `보강 필요 장비`, `출처 재확인`, `실전 사례 장비`, `계열 비교 후보` 큐 4개 추가
  - 장비 큐 클릭 시 기존 프리셋을 재사용해 검색 조건 즉시 적용
  - 출처 재확인 큐 클릭 시 `/sources?freshness=stale`로 이동
  - 출처 페이지가 `freshness` query를 초기 필터로 읽도록 개선
  - E2E/디자인 검증에 작업 큐 버튼 수, 출처 재확인 경로, 빈 상태 검증 추가
- 검증:
  - `npm run typecheck` 통과
  - `npm run lint` 통과
  - 권한 상승 후 `npm run quality` 통과

### 2026-06-19 팀용 장비 검색 프리셋 추가

- 상태 전이: new_task -> planned -> executing -> verifying -> completed
- 목표:
  - 팀원이 장비 검색 화면에서 자주 쓰는 검색 조건을 한 번에 적용할 수 있게 한다.
  - 3D 기능을 다시 늘리지 않고, 현재 우선순위인 장비 검색/공유 흐름을 강화한다.
- 결과:
  - `보강 필요`, `실전 사례`, `고신뢰 출처`, `계열 많은 장비` 프리셋 4개 추가
  - 프리셋 클릭 시 기존 필터/정렬/URL 동기화 로직 재사용
  - 모바일에서 프리셋 버튼이 한 열로 정렬되도록 반응형 스타일 추가
  - E2E/디자인 검증에 프리셋 버튼 수, 결과 축소, URL 동기화 검증 추가
- 검증:
  - `npm run typecheck` 통과
  - `npm run lint` 통과
  - 권한 상승 후 `npm run quality` 통과

### 2026-06-19 출처 필터 결과 내보내기 추가

- 상태 전이: new_task -> planned -> executing -> verifying -> completed
- 목표:
  - 팀원이 `/sources`에서 필터링한 출처 목록을 회의/점검 요청에 바로 붙일 수 있게 한다.
  - 필터 결과를 CSV로 저장해 별도 표 작업에 사용할 수 있게 한다.
- 결과:
  - `출처 요약 복사` 버튼 추가
  - `출처 CSV 다운로드` 버튼 추가
  - CSV 파일명 `source-index-results.csv` 고정
  - 현재 필터 결과 기준으로 요약/CSV 생성
  - E2E/디자인 검증에 출처 내보내기 버튼과 CSV 파일명 검증 추가
- 검증:
  - `npm run typecheck` 통과
  - `npm run lint` 통과
  - 권한 상승 후 `npm run quality` 통과

### 2026-06-19 출처 인덱스 필터/확인 상태 추가

- 상태 전이: new_task -> planned -> executing -> verifying -> completed
- 목표:
  - 팀원이 출처 목록에서 특정 기관/유형/확인 상태를 빠르게 찾을 수 있게 한다.
  - 소실 가능성이 있는 오래된 출처를 정적 UI에서 먼저 식별할 수 있게 한다.
- 기준:
  - `checkedAt` 기준 180일 초과: 재확인 필요
  - 180일 이내: 최근 확인
- 결과:
  - `/sources`에 출처 검색 입력 추가
  - 출처 유형 필터 추가
  - 확인 상태 필터 추가
  - 최근 확인/재확인 필요/현재 표시 건수 요약 추가
  - 출처 카드에 확인 상태 표시 추가
  - E2E/디자인 검증에 출처 필터 동작 추가
- 검증:
  - `npm run typecheck` 통과
  - `npm run lint` 통과
  - 권한 상승 후 `npm run quality` 통과

### 2026-06-19 데이터 보강 필요 필터 추가

- 상태 전이: new_task -> planned -> executing -> verifying -> completed
- 목표:
  - 팀원이 장비 목록에서 데이터 보강이 필요한 항목만 빠르게 추출할 수 있게 한다.
  - 보강 대상 링크를 URL로 공유할 수 있게 한다.
- 기준:
  - 출처 신뢰도 68 미만
  - 공개 출처 2건 미만
  - 계열 데이터 없음
- 결과:
  - `데이터 상태` 필터 추가
  - `검증 양호`, `보강 필요` 검색 지원
  - 장비 행별 데이터 상태 배지 추가
  - 결과 요약 복사와 CSV에 데이터 상태/보강 사유 포함
  - E2E/디자인 검증에 배지 수, 필터 수, 보강 필요 결과 3건, URL 파라미터 검증 추가
- 검증:
  - `npm run typecheck` 통과
  - `npm run lint` 통과
  - 권한 상승 후 `npm run quality` 통과

### 2026-06-19 불필요한 3D/구형 코드 제거

- 상태 전이: new_task → planned → executing → verifying → completed
- 목표:
  - 현재 검색 중심 버전에 필요 없는 3D 런타임과 구형 화면 코드를 제거
  - 팀원에게 필요한 기능만 남기고 유지보수 표면 축소
- 결과:
  - `@react-three/drei`, `@react-three/fiber`, `three`, `pngjs` 의존성 제거
  - 미사용 `DevelopmentLensPage` 삭제
  - 미사용 `TrendPanel` 삭제
  - 3D 캔버스/핫스팟 조작 CSS 제거
  - 삭제된 개발 렌즈 페이지 전용 CSS 제거
- 검증:
  - `npm run quality` 통과

### 2026-06-19 검색 결과 내보내기 추가

- 상태 전이: new_task → planned → executing → verifying → completed
- 목표:
  - 필터된 장비 목록을 회의록, 메신저, 보고서 초안에 바로 활용 가능하게 개선
  - 팀원이 검색 조건뿐 아니라 결과 목록 자체도 쉽게 공유하도록 지원
- 결과:
  - `결과 요약 복사` 버튼 추가
  - `CSV 다운로드` 버튼 추가
  - CSV에 장비명, 분류, 국가, 원산국, 제조사, 운용 상태, 임무 태그, 계열 수, 출처 신뢰도, 상세 ID 포함
  - E2E 검증에서 CSV 다운로드 파일명 확인
- 검증:
  - `npm run quality` 통과

### 2026-06-19 검색 조건 공유 링크 추가

- 상태 전이: new_task → planned → executing → verifying → completed
- 목표:
  - 팀원이 같은 검색 조건을 URL로 공유하고 다시 열 수 있게 개선
  - 검색 조건이 새로고침 또는 링크 전달 후에도 유지되게 개선
- 결과:
  - 검색 필터 상태를 URL query string과 동기화
  - 장비 검색 화면 진입 시 URL query에서 필터/검색어/선택 장비 복원
  - 검색 패널에 `검색 링크 복사` 버튼 추가
  - E2E 검증에서 URL 파라미터 생성과 reload 복원 확인
- 검증:
  - `npm run quality` 통과

### 2026-06-19 팀원용 장비 검색 필터 고도화

- 상태 전이: new_task → planned → executing → verifying → completed
- 목표:
  - 팀원이 꼭 필요한 장비를 빠르게 좁힐 수 있도록 검색 패널을 강화
  - 불필요한 3D 중심 탐색 대신 장비 유형, 임무, 국가, 상태 중심 검색을 우선
- 결과:
  - 임무/파생형 필터 추가
  - 국가 필터 추가
  - 운용 상태 필터 추가
  - 계열 성숙도 필터 추가
  - 필터 초기화 버튼 및 적용 조건 수 표시
  - 검색 결과 행에 역할 태그와 계열 수 표시
  - 렌더/디자인 검증 스크립트가 새 필터 동작을 확인하도록 갱신
- 검증:
  - `npm run quality` 통과

### 2026-06-19 장비 검색 카탈로그 중심 UI 개편

- 상태 전이: new_task → interviewing → planned → executing → verifying → completed
- 사용자 답변:
  - 목적은 장비 검색용
  - 전 세계 장비를 모두 검색 가능하게 확장하는 것이 목표
  - 3D는 추후 추가 예정이며 현재는 단순화
- 결과:
  - 첫 화면을 장비 검색 중심으로 재구성
  - 메뉴를 `장비 검색 / 전체 장비 / 전장 인사이트 / 출처`로 단순화
  - `Compare` 메뉴를 검색 화면으로 흡수
  - `Technologies`, `Cases`, `Development` 화면을 `전장 인사이트`로 통합
  - 3D 캔버스를 제거하고 GLB 추후 연동 슬롯과 부품 스펙 버튼으로 축소
  - 렌더링/디자인/개발 서버 검증 기준을 새 목표에 맞게 갱신
- 검증:
  - `npm run quality` 통과

## 상태 머신

사용 가능한 상태:

- new_task
- interviewing
- planned
- executing
- verifying
- completed
- needs_human
- failed_with_evidence
- retry_with_revision

## 진행 중 작업

- 없음

## 완료 작업

### 2026-06-19 문서 기반 운영 체계 도입

- 상태 전이: new_task → planned → executing → verifying → completed
- 요청: 프로젝트 루트에 운영 문서 6개를 갖추고 AGENTS.md의 harness-based development loop를 기본 개발 방식으로 적용
- 결과:
  - `AGENTS.md` 생성
  - `PROJECT_STATE.md` 생성
  - `TASKS.md` 생성
  - `DECISIONS.md` 생성
  - `EVIDENCE.md` 생성
  - `CHANGELOG.md` 업데이트
- 범위 제외:
  - 앱 코드 수정 없음
  - `ax-development-journey.html` 변경 없음

## 보류 작업

- GitHub Actions 기반 자동 Pages 배포 복구
- 실제 GLB 모델 추가
- README/CHANGELOG 한글 인코딩 정리

## 실패 작업

- 없음

## 2026-06-19 검색 결과 핵심 지표 스트립 추가

- 상태 전이: new_task -> planned -> executing -> verifying -> completed
- 목표:
  - 팀원이 검색 결과 목록만 보고도 장비별 운용국, 계열/파생형, 전장 사례, 공개 출처 규모를 빠르게 비교할 수 있게 한다.
  - 데이터 구조 변경 없이 기존 `equipment`, `variants`, `battlefieldCaseIds`, `sources` 데이터를 재사용한다.
- 결과:
  - 장비 검색 결과 행마다 핵심 지표 스트립을 추가했다.
  - 지표 항목은 `운용국`, `계열`, `전장 사례`, `출처` 4개로 고정했다.
  - 렌더/디자인 검증에 지표 스트립과 셀 개수 검증을 추가했다.
- 검증:
  - `npm run typecheck` 통과
  - `npm run lint` 통과
  - sandbox 내부 `npm run quality`는 Vitest/Vite 설정 로드 권한 문제로 실패
  - 권한 상승 후 `npm run quality` 통과
## 2026-06-19 3D 준비 영역 제거 및 공개 장치 스펙 패널 전환

- 상태 전이: new_task -> planned -> executing -> verifying -> completed
- 목표:
  - 화면에 남아 있던 3D/GLB 준비 UI를 제거한다.
  - 동일 영역을 팀 검색 업무에 필요한 공개 장치/부품 스펙 패널로 전환한다.
- 결과:
  - `ModelViewer` 제거
  - `ComponentSpecPanel` 추가
  - 검색 상세와 장비 상세에서 장치/부품 공개 스펙 패널 표시
  - Battlefield Lens와 이미지 대체 문구에서 3D/GLB 전제 문구 제거
  - 렌더/디자인/개발 서버 검증 기준을 `.component-spec-panel`로 갱신
- 검증:
  - `npm run quality` 통과
## 2026-06-19 검색 결과 출처 신뢰도 즉시 표시

- 상태 전이: new_task -> planned -> executing -> verifying -> completed
- 목표:
  - 팀원이 검색 결과에서 장비 데이터의 근거 수준을 바로 판단할 수 있게 한다.
  - 검색 결과 공유물에도 출처 신뢰도와 확인일이 남도록 한다.
- 결과:
  - 장비 검색 행에 출처 신뢰도 배지 추가
  - 장비 검색 행에 공개 출처 수와 최근 확인일 표시
  - 선택 장비 요약 패널에 출처 신뢰도, 최근 확인일, 공개 출처 수 추가
  - 결과 요약 복사와 CSV 다운로드에 출처 등급, 최근 확인일, 출처 수 포함
  - E2E/디자인 검증에 신뢰도 배지와 확인일 라인 검증 추가
- 검증:
  - `npm run quality` 통과
## 2026-06-19 출처 신뢰도 필터 추가

- 상태 전이: new_task -> planned -> executing -> verifying -> completed
- 목표:
  - 팀원이 검증 우선순위가 높은 장비를 빠르게 찾도록 출처 신뢰도 기준 필터를 제공한다.
  - 신뢰도 필터도 검색 링크 공유와 새로고침 복원 대상에 포함한다.
- 결과:
  - 장비 검색 필터에 `출처 신뢰도` 선택 상자 추가
  - `High`, `Medium`, `Low` 등급별 장비 검색 지원
  - URL query string에 `confidence` 파라미터 추가
  - E2E/디자인 검증에서 필터 5개, Low 신뢰도 결과 1건, URL 동기화 확인
- 검증:
  - `npm run quality` 통과
## 2026-06-19 전장 사례 유무 필터 추가

- 상태 전이: new_task -> planned -> executing -> verifying -> completed
- 목표:
  - 팀원이 실제 전장 사례가 있는 장비만 빠르게 좁혀 볼 수 있게 한다.
  - 반대로 사례가 없는 장비를 데이터 보강 대상으로 식별할 수 있게 한다.
- 결과:
  - 장비 검색 필터에 `전장 사례` 선택 상자 추가
  - `사례 있음`, `사례 없음` 기준 검색 지원
  - URL query string에 `cases` 파라미터 추가
  - 결과 요약 복사와 CSV 다운로드에 전장 사례 수 포함
  - E2E/디자인 검증에서 필터 6개, 사례 있음 결과 7건, URL 동기화 확인
- 검증:
  - `npm run quality` 통과
## 2026-06-19 검색 결과 정렬 기준 추가

- 상태 전이: new_task -> planned -> executing -> verifying -> completed
- 목표:
  - 팀원이 필터링된 장비 결과의 검토 우선순위를 빠르게 정할 수 있게 한다.
  - 정렬 기준도 검색 링크 공유와 새로고침 복원 대상에 포함한다.
- 결과:
  - 검색 패널에 `정렬 기준` 선택 상자 추가
  - 기본순, 출처 신뢰도 높은순, 전장 사례 많은순, 계열 많은순, 최근 확인일순 지원
  - URL query string에 `sort` 파라미터 추가
  - 결과 요약 복사와 CSV 다운로드가 정렬된 순서를 그대로 사용
  - E2E/디자인 검증에서 필터/정렬 select 7개, 전장 사례 많은순 첫 결과 Boxer, URL 동기화 확인
- 검증:
  - `npm run quality` 통과
