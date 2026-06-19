# TASKS

## 진행 중 작업

- 없음

## 완료 작업

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
