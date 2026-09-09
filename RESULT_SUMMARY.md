# 검색 개선 결과

상태: completed (구현 및 로컬 검증 완료).

| 입력 예시 | 개선 후 검색 결과 |
| --- | --- |
| 독일 8x8 | Boxer |
| 스트라이커 | Stryker |
| T90M | T-90M Proryv |
| Leopard2A7 | Leopard 2A7 |

모든 검색어를 함께 찾고, 한글 검색 별칭과 이름 표기 차이를 처리한다. 장비 11종의 기존 별칭 데이터를 보강했다.

- build: 통과.
- 단위 테스트: 3개 파일 / 23개 테스트 통과.
- lint: 통과.
- 데이터 스키마 및 참조 검증: 동일 검증 스크립트를 node --import tsx로 실행해 통과.
- 브라우저 E2E 및 공개 사이트 배포: 수행하지 않음.

수정 파일: src/App.tsx, src/search.ts, src/search.test.ts, public/data/equipment.json 및 작업 기록 문서.

기존 검색 필터, 정렬, 공유 URL, 후보 목록, CSV 기능의 연결은 유지했다. 장비 제원과 출처 확인일은 이번 검색 작업에서 새로 검증하거나 갱신하지 않았다.

재현 과정과 최초 오류의 해결 내용은 EVIDENCE.md에 기록했다.
