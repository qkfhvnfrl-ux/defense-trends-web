# TASKS

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
