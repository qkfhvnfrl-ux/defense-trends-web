# TASKS

## 진행 중 작업

- 없음

## 완료 작업

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
