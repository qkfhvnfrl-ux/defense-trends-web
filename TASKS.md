# v5 공개 검증 완료

- 공개 URL: https://qkfhvnfrl-ux.github.io/defense-trends-web/versions/v5/
- Pages 실행 36731676575 성공, 산출물 850ccbc4fac7d1dc4f1d6b41dcf560184f86d256.
- 실제 Chrome: OSM 타일 배경 정상, 사례 마커 12개, Stryker 사례 팝업 및 확대 타일 확인. API KEY REQUIRED 대체 이미지 없음.
- 기존 v4/v3 공개 산출물은 변경하지 않음. 3D WebGL 환경 제약은 지도 수정과 별도.

# 2026-09-30 API 키 없는 지도 복구

- 상태: completed. 사용자 1번 선택으로 키 없는 지도 교체 승인.
- 계획: EquipmentMap 타일 URL과 attribution 변경, v5 경로 생성, v4/v3 보관. 데이터·마커·Leaflet 유지.
- 위험: 외부 타일 서비스 제공 상태. OSM 표준 URL 및 attribution 정책 준수, 일괄 다운로드 없음.
- 검증: build/test/lint, 실제 배포 지도 배경 및 마커 확인.

# 2026-09-11 GitHub 버전 관리와 v4 공개 전환

- 상태: completed. GitHub 소스 저장 및 v4 공개 배포 성공.
- 변경: 공개 버전 빌드 스크립트, 릴리스 메타데이터, GitHub 버전 안내, 운영 기록.
- 범위: 최신 v4 공개, v2/v3 복구 링크, GitHub 소스 저장. 기존 개인 검토 공간 유지.
- 검증: 공개 빌드 및 버전 경로 검사, GitHub 소스 SHA 확인, Pages 완료 및 HTTP 해시 비교.

# 2026-09-10 v4 기능 확장

- 상태: completed. 5개 구현·검증 및 비공개 v4 게시 완료.
- 범위: 3D 패널, 비교/이력/연표/인쇄 컴포넌트, 검증된 기존 자료, 스타일 및 버전 기록.
- 기존 공개 v3와 비공개 보관본 유지. v4를 새 경로로 관리.
- 위험: 사진 파생형 혼동, 자료 확인일과 사건일 혼동, 한글 PDF 출력, 3D 화면 캡처.
- 검증: 단계별 타입 검사, 비교/이력/연표 검증, 최종 build/test/lint. 화면 직접 확인은 사용자.
- [x] 1. 실사진 ↔ 3D 대응 보기
- [x] 2. 파생형 나란히 비교
- [x] 3. 자료 변경 이력
- [x] 4. 개발·시험·계약·배치 연표
- [x] 5. 장비 요약 PDF 저장

# 2026-09-10 v3 공개 반영

- 상태: completed — 공개 배포 성공, HTTP 및 파일 해시 검증 완료.
- 사용자 요청으로 v3를 승인된 공개 버전으로 게시한다. 기존 비공개 비교 공간의 접근 권한은 유지한다.
- 공개 경로: /defense-trends-web/versions/v3/. 기존 루트 주소는 해당 버전으로 연결한다.
- 검증: 배포용 base 경로 빌드, Pages 완료 상태, 공개 HTML/JS/데이터 해시 확인.

# 2026-09-09 비공개 버전 검토 및 자료 최신화

- 상태: completed — 비공개 게시 완료, v3 사용자 확인 대기.
- 사용자 승인 범위: 버전별 URL, 본인 전용, 최근 3개 보관과 복구, 사용자가 확인 후 기준 버전 반영.
- 전장적응지표의 임의 점수/장식 제거, 3D 임무장비 정보창 및 가독성 개선.
- 장비/기술/사례의 공식 출처를 재조회하고 확인된 내용만 갱신. 확인일을 일괄 최신화하지 않는다.
- 변경 파일: 3D 패널, App, 스타일, 자료 JSON, 버전 빌드/보관 스크립트, 운영 기록.
- 위험: 과거 버전 경로/데이터 섞임, 공개 호스트 잔존, 자료의 발표·예정·운용 혼동.
- 검증: build, test, lint, 스키마 및 버전 경로/스냅샷 검사, 소유자 전용 배포 완료 상태 확인. 브라우저 확인은 사용자 수행.

# 2026-09-09 사이트 배포 및 차량 3D 외형

- 상태: completed — 구현·로컬 검증 및 GitHub Pages 배포 성공.
- 요청: 검색 개선안을 실제 사이트에 배포하고, 공개 사진을 참고한 차량별 3D 외형과 임무장비를 설명에 추가한다.
- 범위: 기존 15종, 확인 가능한 임무형의 시각적 구성, 사진 근거와 추정 범위 표시, 회전/시점/구성 표시 및 GLB 저장.
- 변경: 차량 형상 생성 모듈, 3D 패널, 사진 근거 데이터, 기존 화면 연결, Three.js 의존성 및 작업 기록.
- 영향: 장비 설명에 새 3D 섹션을 추가하며 검색/필터/출처/부품 정보는 유지한다.
- 검증: 빌드/기존 테스트/모델 구조 및 GLB 검증/린트, 배포 작업 성공과 공개 HTML·JS·데이터 조회.
- 형상은 사진을 참고한 시각화이며 실측 CAD나 사진측량 복원으로 표시하지 않는다.

# 2026-09-09 장비 검색 정확도 개선

## 완료 작업

- 상태 전이: new_task -> interviewing -> planned -> executing -> verifying -> completed
- 사용자 요청: GitHub의 세계 장비 검색 웹앱 개선.
- 범위: 현재 검색의 연속 문구 일치 제약을 개선하고 한글 장비명 검색을 보강한다.
- 목표:
  - `독일 8x8`처럼 서로 다른 필드의 검색어를 함께 찾는다.
  - 한글 별칭, 이름 띄어쓰기, 하이픈, 전각 문자, `8×8` 표기를 처리한다.
  - 기존 상세 필터, 정렬, 검색 URL, 후보 목록과 내보내기 흐름을 유지한다.
- 수정 파일:
  - `src/search.ts`, `src/search.test.ts`: 검색 함수와 실제 장비 데이터 기반 회귀 검증.
  - `src/App.tsx`: 검색 함수 연결 및 입력 예시 갱신.
  - `public/data/equipment.json`: 기존 `aliases` 배열의 한글 검색 별칭 보강.
  - 운영 문서: 범위, 결정, 검증 결과 기록.
- 영향 범위: 장비 자유 검색 및 검색 결과를 사용하는 기존 화면/내보내기.
- 리스크: 검색 정규화에 따른 과도한 일치; 전체 검색어 충족 및 불일치 사례로 확인한다.
- 검증 계획: build, 기존/추가 단위 테스트, lint, 데이터 스키마/참조 검증.
- 검증 결과:
  - 프로덕션 build 통과.
  - 단위 테스트 3개 파일 / 23개 테스트 통과.
  - lint 통과.
  - node --import tsx scripts/validate-data.mjs 통과.
  - 수정 전 0건이던 독일 8x8, 스트라이커, T90M, Leopard2A7 검색 결과 복구.
  - 브라우저 E2E 및 공개 사이트 배포는 이번 작업에 포함하지 않음.

# 2026-06-20 구형 라우트 canonical 정리

## 진행 중 작업

- 없음

## 완료 작업

### 2026-06-20 구형 라우트 canonical 정리

- 상태 전이: new_task -> planned -> executing -> verifying -> completed
- 목표:
  - 숨겨진 이전 메뉴 URL을 현재 메뉴 구조에 맞는 공식 URL로 정리한다.
  - 기존 공유 링크 호환성은 유지한다.
- 결과:
  - `/compare`를 `/`로 canonical 처리
  - `/development`, `/technologies`, `/cases`를 `/insights`로 canonical 처리
  - `/compare?data=needs-review` query string 보존 검증 추가
  - routeChecks에 최종 경로 검증 추가
- 검증:
  - `npm run typecheck` 통과
  - `npm run lint` 통과
  - 권한 상승 후 `npm run quality` 통과

# TASKS

## 진행 중 작업

- 없음

## 완료 작업

### 2026-06-20 필터 배지 개별 해제

- 상태 전이: new_task -> planned -> executing -> verifying -> completed
- 목표:
  - 적용 중인 필터 중 하나만 빠르게 해제할 수 있게 한다.
  - 프리셋/공유 링크 기반 검색에서 select를 다시 찾는 반복 작업을 줄인다.
- 결과:
  - 활성 필터 배지를 버튼으로 변경
  - 계열, 분류, 임무, 국가, 상태, 성숙도, 신뢰도, 사례, 데이터 상태, 정렬, 검색어 조건별 개별 해제 지원
  - 배지 클릭 시 필터 상태와 URL query가 함께 갱신
  - E2E/디자인 검증에 배지 클릭 후 조건 해제, 전체 목록 복원, URL 파라미터 제거 검증 추가
- 검증:
  - `npm run typecheck` 통과
  - `npm run lint` 통과
  - 권한 상승 후 `npm run quality` 통과

### 2026-06-20 적용 필터 배지 표시

- 상태 전이: new_task -> planned -> executing -> verifying -> completed
- 목표:
  - 팀원이 현재 장비 목록에 어떤 검색 조건이 적용됐는지 즉시 볼 수 있게 한다.
  - 프리셋/공유 링크로 진입했을 때 조건 의미를 다시 추적하지 않게 한다.
- 결과:
  - 적용 필터 라벨 생성 로직 추가
  - 검색 패널의 활성 필터 영역에 조건 배지 표시
  - 계열, 분류, 임무, 국가, 상태, 성숙도, 신뢰도, 사례, 데이터 상태, 정렬, 검색어 라벨 지원
  - E2E/디자인 검증에 프리셋 적용 후 필터 배지 표시 검증 추가
- 검증:
  - `npm run typecheck` 통과
  - `npm run lint` 통과
  - 권한 상승 후 `npm run quality` 통과

### 2026-06-20 선택 장비 요약 복사 추가

- 상태 전이: new_task -> planned -> executing -> verifying -> completed
- 목표:
  - 팀원이 선택한 장비 하나의 핵심 정보를 메신저/회의록에 바로 공유할 수 있게 한다.
  - 전체 검색 결과 내보내기와 단일 장비 공유 작업을 분리해 반복 작업을 줄인다.
- 결과:
  - 선택 장비 패널에 `요약 복사` 버튼 추가
  - 장비 요약 텍스트 생성 함수 추가
  - 복사 성공/실패 상태 메시지 추가
  - 선택 장비 작업 버튼을 `요약 복사`, `상세 페이지 열기` 2개로 정리
  - E2E/디자인 검증에 선택 장비 빠른 작업 버튼 2개와 컨트롤 크기 검증 추가
- 검증:
  - `npm run typecheck` 통과
  - `npm run lint` 통과
  - 권한 상승 후 `npm run quality` 통과

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
# 2026-06-20 팀 후보 목록 추가

## 진행 중 작업

- 없음

## 완료 작업

### 2026-06-20 팀 후보 목록 추가

- 상태 전이: new_task -> planned -> executing -> verifying -> completed
- 목표:
  - 팀원이 검색 중 후보 장비를 몇 개만 골라 회의용으로 비교/공유할 수 있게 한다.
  - 별도 비교 페이지를 되살리지 않고 검색 중심 화면 안에서 처리한다.
- 결과:
  - 선택 장비 패널에 `후보 추가/후보 제외` 버튼 추가
  - `팀 후보 목록` 패널 추가
  - 후보 열기, 후보 제거, 후보 전체 비우기 추가
  - 후보 요약 복사 기능 추가
  - 후보 목록은 최대 6개 유지
- 검증:
  - `npm run typecheck` 통과
  - `npm run lint` 통과
  - 권한 상승 후 `npm run quality` 통과
# 2026-06-20 후보 목록 공유 URL 지원

## 진행 중 작업

- 없음

## 완료 작업

### 2026-06-20 후보 목록 공유 URL 지원

- 상태 전이: new_task -> planned -> executing -> verifying -> completed
- 목표:
  - 팀 후보 목록을 새로고침과 링크 공유 후에도 복원되게 한다.
  - 기존 검색 공유 URL 구조를 유지하면서 후보 목록만 추가한다.
- 결과:
  - `shortlist` query string 추가
  - 후보 추가 시 URL 동기화
  - 후보 제거/비우기 시 URL query 제거
  - 공유 URL 직접 진입 시 후보 목록 복원
  - e2e/design 검증에 URL 동기화와 복원 조건 추가
- 검증:
  - `npm run typecheck` 통과
  - `npm run lint` 통과
  - 권한 상승 후 `npm run quality` 통과
# 2026-06-20 후보 링크 복사 액션 추가

## 진행 중 작업

- 없음

## 완료 작업

### 2026-06-20 후보 링크 복사 액션 추가

- 상태 전이: new_task -> planned -> executing -> verifying -> completed
- 목표:
  - 팀 후보 목록 패널 안에서 직접 공유 링크를 복사할 수 있게 한다.
  - 기존 검색 링크 복사 버튼을 찾는 반복 작업을 줄인다.
- 결과:
  - `후보 링크 복사` 버튼 추가
  - 후보 action 버튼을 2개에서 3개로 확장
  - 후보가 없으면 후보 action 전체 비활성화 유지
  - 후보 링크 복사 성공/실패 상태 메시지 추가
  - e2e/design 검증에 후보 링크 복사 버튼 수와 action 활성화 수 추가
- 검증:
  - `npm run typecheck` 통과
  - `npm run lint` 통과
  - 권한 상승 후 `npm run quality` 통과
