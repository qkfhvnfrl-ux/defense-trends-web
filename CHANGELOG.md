# 변경사항 요약

## 1.0 분석형 사이트 개편

- 홈을 `Global Land Platform Intelligence` 대시보드로 개편했습니다.
- 라우팅 페이지를 추가했습니다.
  - `/`
  - `/equipment`
  - `/equipment/:id`
  - `/compare`
  - `/technologies`
  - `/cases`
- 장비 데이터 스키마에 분석형 필드를 추가했습니다.
  - 운용국, 플랫폼 계열, 임무 태그, 파생형 연결, 기술 태그, 사례 연결
  - 현대화 확장성, 드론 위협 압력, 체계 통합도, 야전 개조 민감도, 출처 신뢰도
- 현대 전장 사례 데이터셋 `public/data/battlefieldCases.json`을 추가했습니다.
- 비교 분석 페이지를 추가했습니다.
  - 기본 제원뿐 아니라 플랫폼 계열성, 기술 연계, 전장 적응성, 출처 신뢰도를 비교합니다.
- 기술 페이지와 사례 페이지를 추가했습니다.
- 3D 뷰어를 개선했습니다.
  - 라벨 토글
  - 기본형/개량형 비교 모드
  - 전장 적응 패키지 프리셋
  - RCWS, 30mm, APS, EW, Drone Cage 개념 오버레이
- 이미지 검증을 정리했습니다.
  - 실제 404 이미지는 제거했습니다.
  - Wikimedia 요청 제한 429는 실패가 아닌 일시 제한으로 분류합니다.
- 정적 서버 `serve:dist`가 SPA 라우트 fallback을 지원하도록 수정했습니다.

## 검증

통과한 명령:

```powershell
& "C:\Program Files\nodejs\npm.cmd" run quality
& "C:\Program Files\nodejs\npm.cmd" run images:check
```

확인된 범위:

- 장비 15개
- 파생형 30개
- 장치 스펙 23개
- 현대 전장 기술 7개
- 현대 전장 사례 7개
- 지도 마커 12개
- `/`, `/equipment`, `/equipment/:id`, `/compare`, `/technologies`, `/cases` 렌더링 확인
- 모바일 가로 오버플로 없음
- 실제 이미지 404 실패 0개
