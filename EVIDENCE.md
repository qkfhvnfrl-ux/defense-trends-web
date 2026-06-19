# EVIDENCE

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
