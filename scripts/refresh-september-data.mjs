import { readFileSync, writeFileSync } from "node:fs";
const day = "2026-09-09";
const load = name => JSON.parse(readFileSync(`public/data/${name}.json`, "utf8"));
const save = (name, value) => {
  for (const row of value) if (row.sources) row.sources = row.sources.filter((s, i, all) => all.findIndex(other => other.url === s.url) === i);
  writeFileSync(`public/data/${name}.json`, JSON.stringify(value, null, 2) + "\n");
};
const urls = {
  boxer: "https://knds.com/en/press-releases/additional-69-boxer-rct-30-wheeled-infantry-fighting-vehicles-for-germany-and-the-netherlands",
  xm30: "https://www.rheinmetall.com/en/media/news-watch/news/2026/09/2026-09-01-american-rheinmetall-delivers-first-lynx-xm30-combat-vehicle-prototype-to-us-army",
  passive: "https://www.rheinmetall.com/en/media/news-watch/news/2026/08/2026-08-19-rheinmetall-and-hensoldt-demonstrate-the-successful-integration-of-passive-sensor-technology",
  api: "https://www.rheinmetall.com/en/media/news-watch/news/2026/09/2026-09-09-rheinmetall-releases-battlesuite-interfaces-as-open-source",
  tremos: "https://www.patriagroup.com/newsroom/news/2026/finland-to-acquire-over-100-patria-tremos-mortar-systems",
  dvd: "https://www.patriagroup.com/newsroom/news/2026/discover-patrias-protected-mobility-solutions-for-modern-land-forces-at-dvd-2026",
  stryker: "https://www.gdls.com/stryker/",
  abrams: "https://www.gdls.com/abrams/",
  cv90: "https://www.baesystems.com/en-us/product/cv90-mkiv",
  puma: "https://knds.com/en/products/systems/puma",
  caesar: "https://knds.com/en/products/systems/caesar-8x8",
  amv: "https://www.patriagroup.com/products-and-services/protected-mobility/wheeled-mobility/patria-amv-xp-number-1-in-the-battlefield",
  leopard: "https://knds.com/en/products/leopard",
  leclerc: "https://knds.com/media/KRV_041_LECLERC_XLR_EN_BAT_BDEF_6a502524d1.pdf",
  challenger: "https://www.gov.uk/government/news/uks-most-lethal-tank-rolls-off-the-production-lines",
  vbci: "https://knds.com/en/press-releases/dimdex-2024-nexter-company-of-knds-offers-the-vbci-to-modernise-the-qatar-infantry-units",
  crows: "https://www.kongsberg.com/what-we-do/defence-and-security/remote-weapon-systems/crows/",
  aps: "https://www.gdots.com/protection-systems/active-protection-systems/",
  rusi: "https://www.rusi.org/explore-our-research/publications/occasional-papers/protecting-force-uncrewed-aerial-systems",
  ugv: "https://mod.gov.ua/en/news/the-defence-forces-expand-their-fleet-of-ground-robots-with-a-unique-amphibious-system"
};
const source = (key, title, publisher) => ({ title, url: urls[key], publisher, sourceType: publisher === "UK MoD" || publisher === "Ukraine MoD" ? "Official" : publisher === "RUSI" ? "Think Tank" : "Manufacturer", checkedAt: day, accessedDate: day, confidence: "High", notes: "원문 확인. 발표·제품 설명에 대한 신뢰도이며 독립 성능 검증을 뜻하지 않음." });
const events = [
  { id: "battlesuite-apis", date: day, kind: "인터페이스 공개", title: "Battlesuite의 Onboard·Tactical API 공개", summary: "Rheinmetall이 두 인터페이스 사양의 공개를 발표했습니다. 플랫폼·센서·지휘 애플리케이션 간 연결을 위한 규격입니다.", meaning: "검토 관점: 차량 데이터와 임무장비 인터페이스를 분리해 변경 이력을 관리할 수 있는지 확인합니다.", limit: "제품 전체 소스 공개나 특정 차량의 적용 완료를 뜻하지 않습니다.", equipmentIds: [], source: source("api", "Battlesuite interface specifications released", "Rheinmetall") },
  { id: "tremos-order", date: "2026-09-08", kind: "조달 합의", title: "핀란드, TREMOS 100문 이상 조달 합의", summary: "Patria는 2026년부터 2028년까지 납품하는 양산 조달 합의를 발표했습니다.", meaning: "검토 관점: 임무 모듈 선택 시 포탑형과 다른 차량 탑재 개념을 구분해 비교합니다.", limit: "TREMOS는 NEMO와 다른 체계입니다. AMV 탑재 계약으로 해석하지 않습니다.", equipmentIds: [], source: source("tremos", "Finland to acquire over 100 Patria TREMOS mortar systems", "Patria") },
  { id: "patria-dvd", date: "2026-09-07", kind: "전시 예정", title: "Patria 6×6의 C-UAS·방공 구성 전시 예고", summary: "9월 16~17일 DVD에서 RWS/C-UAS 구성과 Thales 단거리 방공 개념을 선보일 예정입니다.", meaning: "검토 관점: 동일 플랫폼의 임무 구성 확장과 운용형 확정을 구분합니다.", limit: "확인일에는 아직 전시 전입니다. 6×6 소식이며 AMV 8×8 실전 적용 증거가 아닙니다.", equipmentIds: [], source: source("dvd", "Patria protected mobility solutions at DVD 2026", "Patria") },
  { id: "xm30-prototype", date: "2026-09-01", kind: "시제품 인도", title: "Lynx XM30 첫 시제품, 미 육군 시험 단계 진입", summary: "American Rheinmetall이 8대 중 첫 시제품 인도를 발표했습니다. Bradley 후속 경쟁 사업의 개발·성능 시험 단계입니다.", meaning: "검토 관점: 모듈형 전자 구조와 시제품 시험 결과를 양산 요구조건과 구분합니다.", limit: "Bradley 교체 완료나 XM30의 최종 사업자 선정을 의미하지 않습니다.", equipmentIds: ["m2a2-bradley"], source: source("xm30", "First Lynx XM30 prototype delivered to U.S. Army", "Rheinmetall") },
  { id: "passive-air-picture", date: "2026-08-19", kind: "연동 시연", title: "수동 레이더 항적과 방공 지휘체계 연동 시연", summary: "Timber Express에서 Twinvis 항적을 Skymaster에 통합해 Skynex 시나리오에 사용했다고 발표했습니다.", meaning: "검토 관점: 센서 자체 성능 외에 서로 다른 센서 데이터의 연결과 표시 방식도 확인합니다.", limit: "Skyranger로의 확장 가능성을 언급한 시연입니다. Boxer 전 차량에 탑재됐다는 뜻은 아닙니다.", equipmentIds: ["boxer"], source: source("passive", "Passive sensor integration demonstrated", "Rheinmetall / Hensoldt") },
  { id: "boxer-rct30-order", date: "2026-08-07", kind: "추가 발주", title: "독일·네덜란드, Boxer RCT30 69대 추가", summary: "2025년 222대 계약의 옵션이 행사됐습니다. 독일 35대, 네덜란드 34대가 추가되며 계약 합계는 291대입니다.", meaning: "검토 관점: 30mm 포탑과 MELLS를 탑재하는 임무 모듈의 계열 확장 사례입니다.", limit: "계약 수량이며 인도 또는 운용 완료 수량이 아닙니다.", equipmentIds: ["boxer"], source: source("boxer", "Additional 69 BOXER RCT30 vehicles", "KNDS") }
];
const equipment = load("equipment");
const edits = {
  stryker: ["stryker", "GDLS Stryker product family", "GDLS", "8×8 장갑차 계열이다. 제조사 현행 자료는 A1(DVH)의 강화된 동력·전력·디지털 기반과 Sgt Stout 방공형, NEXUS 지휘 개념 및 Leonidas 대드론 구성을 구분해 소개한다. 각 구성의 소개를 전체 차량의 탑재·전력화 완료로 해석하지 않는다."],
  boxer: ["boxer", "Additional 69 BOXER RCT30 vehicles", "KNDS", "교체형 임무 모듈을 사용하는 8×8 장갑차 계열이다. 2026년 8월 KNDS는 독일·네덜란드 RCT30 69대 추가 발주를 발표했다. 2025년 222대 계약과 합쳐 291대이며 인도 완료 수량은 아니다."],
  "patria-amv": ["amv", "Patria AMV XP current product information", "Patria", "핀란드의 8×8 장갑차 계열이다. AMV XP 현행 자료는 기본형·고상형, 일반·연장 축거, 지휘·의무·NEMO 등 임무 확장을 제시한다. 이 페이지의 기본 AMV 외형과 XP, 별도 플랫폼인 Patria 6×6의 제원·수주를 구분해야 한다."],
  "m1a2-abrams": ["abrams", "GDLS Abrams / M1A2 SEPv3", "GDLS", "120mm 활강포를 갖춘 미국 주력전차 계열이다. M1A2 SEPv3 제조사 자료는 보조동력장치, 전력 분배, 디지털 통신과 방호 개량을 설명한다. Abrams 계열의 우크라이나 운용 사례를 M1A2 특정 형식의 실전 기록으로 간주하지 않는다."],
  "leopard-2a7": ["leopard", "KNDS Leopard family and A8", "KNDS", "Leopard 2A7은 Leopard 2 계열의 개량형이다. KNDS 현행 자료는 후속 A8과 무인포탑 A-RC 3.0을 별도로 소개한다. A7을 계열 전체의 최신 형식으로 단정하거나 다른 형식의 운용 사례·제원을 혼용하지 않는다."],
  "m2a2-bradley": ["xm30", "Lynx XM30 first prototype delivery", "Rheinmetall", "25mm 기관포와 TOW를 탑재하는 궤도형 보병전투차다. 2026년 9월 후속 경쟁 사업인 Lynx XM30 첫 시제품 인도가 발표됐다. 이는 개발 시험 진전이며 현재 Bradley 운용이나 M2A2 ODS-SA 제원을 대체하지 않는다."],
  cv90: ["cv90", "CV90 MkIV product information", "BAE Systems", "다양한 무장과 임무형을 가진 궤도형 보병전투차 계열이다. MkIV 제조사 자료는 최대 1,000마력, 총중량 등급 38톤 및 확장형 전자 구조를 제시한다. 해당 수치는 MkIV 기준이며 모든 CV90 운용형의 공통 제원이 아니다."],
  "puma-ifv": ["puma", "KNDS PUMA", "KNDS", "독일 궤도형 보병전투차로 30mm 무인포탑과 MELLS, 디지털 보병체계 연동을 갖춘다. 제조사 자료는 승무원 3명과 보병 6명, 방호 구성 A/C에 따른 중량 차이, MUSS 소프트킬 체계를 구분해 설명한다."],
  "caesar-8x8": ["caesar", "KNDS CAESAR 8x8", "KNDS", "Tatra 8×8 차체 기반 155mm/52구경장 자주포다. 제조사 현행 자료는 승무원 4명, 36발 적재와 반자동 장전 체계를 제시한다. CAESAR 6×6·MK2와 구분하며, 전장 보호 구조물은 차량별 비표준 구성이므로 공통 제원으로 취급하지 않는다."]
};
for (const e of equipment) if (edits[e.id]) {
  const [key,title,publisher,summary] = edits[e.id]; e.summaryKo = summary; e.lastUpdated = day;
  e.sources = [source(key,title,publisher), ...e.sources.filter(s => s.url !== urls[key])];
}
const byId = Object.fromEntries(equipment.map(e => [e.id,e]));
byId.stryker.specs["중량"] = "형식별 상이. A1 제조사 총중량 기준 60,000 lb(약 27.2톤)";
byId["caesar-8x8"].specs["구동"] = "8×8 / Tatra T-815 차체";
byId["caesar-8x8"].specs["승무원"] = "4명 (제조사 현행 자료)";
byId["caesar-8x8"].specs["전투중량"] = "32톤 (요구 사양에 따라 변동)";
byId["caesar-8x8"].specs["적재 탄약"] = "36발";
byId["puma-ifv"].specs["방호 구성별 중량"] = "A: 31.4톤 / C: 43톤 (KNDS 자료)";
byId["puma-ifv"].specs["승무원/탑승"] = "승무원 3명 + 보병 6명";
save("equipment",equipment);
const variants = load("variants");
const rct = variants.find(v => v.id === "boxer-rct30");
rct.armament = "30mm RCT30 무인포탑 + MELLS 유도미사일";
rct.notesKo = "2026-08-07 발표: 독일 35대·네덜란드 34대 추가 발주. 2025년 계약 포함 291대이며 인도 완료를 의미하지 않는다.";
rct.maturity = "도입"; rct.sources.unshift(source("boxer","69 additional BOXER RCT30 vehicles","KNDS"));
const shorad = variants.find(v => v.id === "stryker-mshorad");shorad.nameKo = "M-SHORAD / Sgt Stout 방공형";shorad.sources.unshift(source("stryker","Sgt Stout product overview","GDLS"));
save("variants",variants);
const technologies = load("technologies");
const tech = Object.fromEntries(technologies.map(t=>[t.id,t]));
tech["digital-battlefield"].summaryKo = "차량·센서·임무장비 사이의 데이터 연결과 인터페이스 관리가 핵심이다. Rheinmetall은 2026-09-09 Battlesuite의 Onboard API와 Tactical API 사양 공개를 발표했다. 특정 차종에 적용 완료됐다는 발표는 아니다.";
tech["digital-battlefield"].sources.unshift(source("api","Battlesuite interface specifications released","Rheinmetall"));
tech["mobile-cuas-guns"].battlefieldUseKo = "Gepard의 운용 사례와 Skyranger의 조달·제품 설명을 구분한다. 2026-08-19 발표된 Twinvis–Skymaster 연동은 Skynex 시나리오의 시연이며 Boxer Skyranger 실전 검증이 아니다.";
tech["mobile-cuas-guns"].sources.unshift(source("passive","Passive sensor integration demonstrated","Rheinmetall / Hensoldt"));
tech["cuas-rcws"].summaryKo = "Kongsberg 현행 자료는 CROWS를 PROTECTOR RS4의 미국형으로 설명하며, Counter-UAS 소프트웨어를 통합할 때 대드론 임무를 지원한다고 명시한다. 모든 기존 RWS가 동일 기능을 갖췄다는 뜻은 아니다.";
tech["cuas-rcws"].sources.unshift(source("crows","CROWS and Counter-UAS integration","Kongsberg"));
tech["active-protection-aps"].titleKo = "능동방호체계 APS와 적용 범위";
tech["active-protection-aps"].summaryKo = "APS는 접근 위협의 탐지·대응을 위한 방호 체계다. 제조사의 장착 가능 플랫폼 설명과 실제 통합·운용 상태를 구분해야 하며, 모든 상부공격이나 드론에 대응한다고 일반화할 수 없다.";
tech["active-protection-aps"].sources.unshift(source("aps","Iron Fist active protection product information","GDOTS"));
tech["ugv-logistics-evacuation"].battlefieldUseKo = "우크라이나 국방부의 UNEX 채택 발표는 2025-04-17 자료다. 보급·후송 등 구성 가능성을 설명하지만 2026년 운용 규모나 모든 장갑차의 무인화를 입증하지 않는다.";
tech["ugv-logistics-evacuation"].sources.unshift(source("ugv","UNEX UGV codification announcement, 2025-04-17","Ukraine MoD"));
tech["electronic-warfare-jammers"].sources.unshift(source("rusi","Layered counter-UAS research, 2024-10-15","RUSI"));
save("technologies",technologies);
const cases = load("battlefieldCases");
for (const c of cases) {
 if (c.id === "case-skyranger-boxer") { c.dateObserved="2024-02-27 (발주 발표)"; c.operationalMeaning="조달 발표 사례이며 전장 관측이나 인도 완료와 구분한다."; }
 if (c.id === "case-rcws-cuas") { c.dateObserved="발표일 미상 · 제품 자료 확인 2026-09-09"; c.sourceUrls=[urls.crows]; c.observedChange="현행 제조사 자료는 CROWS에 Counter-UAS 소프트웨어를 통합할 경우 해당 임무를 지원한다고 설명한다."; }
 if (c.id === "case-ugv-evacuation") { c.dateObserved="2025-04-17";c.sourceUrls=[urls.ugv];c.observedChange="우크라이나 국방부가 UNEX UGV의 형식 등록·채택을 발표했다. 보급·후송 등 임무 구성을 제시한다."; }
 if (c.id === "case-gepard-cuas") c.dateObserved="2022년 이후 · 2026년 현황 재확인 필요";
}
save("battlefieldCases",cases);
const trends = load("trends");
const b=trends.find(t=>t.id==="trend-boxer-uk");b.id="trend-boxer-rct30-20260807";b.titleKo="독일·네덜란드 Boxer RCT30 추가 발주";b.date="2026-08-07";b.summaryKo=events.at(-1).summary;b.region="독일·네덜란드";b.sources=[source("boxer","69 additional BOXER RCT30 vehicles","KNDS")];
for (const t of trends) if(t.date==="2026") t.date="발표일 재확인 필요";
const abr=trends.find(t=>t.id==="trend-us-abrams-modernization");abr.summaryKo="GDLS 현행 제품 자료는 M1A2 SEPv3의 전력·디지털·방호 개량을 설명한다. SEP v4 개발 재개를 의미하지 않으며, 후속 M1E3 일정은 별도 확인이 필요하다.";abr.sources=[source("abrams","M1A2 SEPv3 product information","GDLS")];
save("trends",trends);
const audits = equipment.map(e => ({ equipmentId:e.id, name:e.name, status: edits[e.id] ? "갱신" : ["vbci","challenger-3","leclerc-xlr"].includes(e.id) ? "기존 근거 재확인" : "최신 근거 부족", checkedAt:day, note: edits[e.id] ? "해당 요약·추가 출처를 확인했습니다. 나머지 제원과 과거 출처의 일괄 재검증은 아닙니다." : e.id === "vbci" ? "2024년 MkII 제안 자료 재확인. 카타르 계약·인도 완료로 변경할 근거는 확보하지 못했습니다." : e.id === "challenger-3" ? "2024년 시제품 8대 자료 재확인. 2026년 전력화 완료를 확인하지 못했습니다." : e.id === "leclerc-xlr" ? "2024년 제조사 사양서 재확인. 최신 인도 수량은 추가 확인이 필요합니다." : "2026년 6월 이후의 신뢰할 수 있는 개별 장비 갱신 근거가 충분하지 않아 기존 확인일을 유지했습니다." }));
writeFileSync("src/content/september-review.json",JSON.stringify({ checkedAt:day, scope:"2026년 6월 이후 발표 우선 조사 · 확인된 자료만 반영", events, audits },null,2)+"\n");
console.log(`Updated ${Object.keys(edits).length} equipment summaries, ${events.length} dated announcements, ${audits.length} audit entries`);
