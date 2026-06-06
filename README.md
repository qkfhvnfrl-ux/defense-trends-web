# 해외 장갑차·전차 동향 웹앱

해외 차륜형장갑차와 전차의 공개 출처 기반 동향, 전장 운용 사례, 장비 스펙, 3D 형상 확인을 위한 정적 웹앱입니다.

## 실행

PowerShell 실행 정책 때문에 `npm` 대신 `npm.cmd`를 직접 쓰는 방식이 가장 안정적입니다.

```powershell
cd "C:\Users\qkfhv\Documents\방산 웹페이지 제작"
& "C:\Program Files\nodejs\npm.cmd" run dev -- --host 127.0.0.1 --port 5173
```

브라우저에서 `http://127.0.0.1:5173`을 엽니다. `file:///.../index.html`로 직접 열면 데이터와 모듈 로딩이 깨질 수 있습니다.

## 페이지

- `/`: 인텔리전스 대시보드
- `/equipment`: 장비 탐색과 상세 패널
- `/equipment/{equipmentId}`: 장비 상세 분석
- `/compare`: 2~4개 장비 비교 분석
- `/technologies`: 현대 전장 기술 분석
- `/cases`: 공개 출처 기반 전장 사례

## 데이터 수정

첫 버전 데이터는 `public/data`의 JSON 파일로 관리합니다.

- `equipment.json`: 장비 기본 정보, 일반 제원, 이미지, 모델 경로
- `incidents.json`: 실제 전장 운용 사례와 지도 좌표
- `trends.json`: 도입, 개량, 수출, 전장운용 동향
- `components.json`: 3D 핫스팟 장치와 공개 스펙
- `variants.json`: RCWS형, 30mm 포탑형, 방공형, 박격포형, 의무형 등 계열차량/임무형
- `technologies.json`: 드론 대응 구조물, C-UAS, 전자전, UGV, APS, 디지털 전장 기술

데이터를 수정한 뒤에는 반드시 검증을 실행합니다.

```powershell
& "C:\Program Files\nodejs\npm.cmd" run validate:data
```

## 3D 모델 교체

현재는 GLB 파일이 없으면 절차적 플레이스홀더 형상을 보여줍니다. Meshy.ai에서 만든 모델은 아래 경로로 넣으면 됩니다.

- `public/models/{equipmentId}/vehicle.glb`
- `public/models/{equipmentId}/components/{componentId}.glb`

JSON의 `modelPath`와 `components.json`의 `modelPath`는 이 경로 규칙을 따릅니다.

## 품질 하네스

지속 개발용으로 아래 도구를 붙였습니다.

- ESLint: 코드 규칙 검사
- Zod: JSON 데이터 런타임 스키마 검증
- Vitest: 데이터 무결성 단위 테스트
- Playwright: 실제 브라우저 렌더링, 3D 캔버스, 모바일 레이아웃 검증
- Design check: KPI, 검색, 지도 오버레이, 터치 크기, 반응형 오버플로 검증
- Dev render check: Vite 개발 서버에서도 GLB 누락 fallback과 흰 화면 회귀를 검증
- GitHub Actions: PR/push 시 전체 품질 하네스 자동 실행

전체 검증:

```powershell
& "C:\Program Files\nodejs\npm.cmd" run quality
```

## 배포 빌드

```powershell
& "C:\Program Files\nodejs\npm.cmd" run build
& "C:\Program Files\nodejs\npm.cmd" run serve:dist
```

브라우저에서 `http://127.0.0.1:4173`을 엽니다.

## GitHub 공유

이 저장소는 `main` 브랜치에 소스 코드를 올리고, `gh-pages` 브랜치에 빌드 결과물만 올려 GitHub Pages로 공유합니다.

- 저장소: `https://github.com/qkfhvnfrl-ux/defense-trends-web`
- 공개 페이지: `https://qkfhvnfrl-ux.github.io/defense-trends-web/`

다시 배포할 때는 `GITHUB_ACTIONS=true`, `GITHUB_REPOSITORY=qkfhvnfrl-ux/defense-trends-web` 환경으로 빌드한 뒤 `dist` 폴더를 `gh-pages` 브랜치에 push하면 됩니다.
