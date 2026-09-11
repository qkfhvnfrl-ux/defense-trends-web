import { useState } from "react";
import review from "../content/september-review.json";
import type { Equipment } from "../types";
const stages = ["전체", "개발·공개", "시험·시연", "계약", "배치·운용"];
const stageByKind: Record<string, string> = { "인터페이스 공개": "개발·공개", "전시 예정": "개발·공개", "시제품 인도": "시험·시연", "연동 시연": "시험·시연", "조달 합의": "계약", "추가 발주": "계약" };
const events = [
  ...review.events.map(e => ({ ...e, stage: stageByKind[e.kind], dateLabel: "발표일", planned: e.kind === "전시 예정" })),
  { id: "challenger3-contract-2021", equipmentIds: ["challenger-3"], date: "2021-05-07", dateLabel: "발표일", planned: false, stage: "계약", kind: "개량 계약", title: "Challenger 3 148대 개량 계약 발표", summary: "영국 국방부가 RBSL과 8억 파운드 규모의 Challenger 3 개량 계약을 발표했습니다.", limit: "계약 당시 납품 목표를 현재 배치 완료로 해석하지 않습니다.", source: { url: "https://www.gov.uk/government/news/british-army-to-possess-most-lethal-tank-in-europe", publisher: "UK Ministry of Defence", checkedAt: "2026-09-10" } }
];
export function EquipmentTimeline({ equipment }: { equipment?: Equipment }) {
  const [stage, setStage] = useState("전체");
  const [ascending, setAscending] = useState(false);
  const filtered = events.filter(e => (!equipment || e.equipmentIds.includes(equipment.id)) && (stage === "전체" || stage === e.stage)).sort((a,b) => ascending ? a.date.localeCompare(b.date) : b.date.localeCompare(a.date));
  return <section className="research-tool" aria-label="개발 시험 계약 배치 연표"><h3>{equipment ? `${equipment.name} 관련 연표` : "개발·시험·계약·배치 연표"}</h3><p>원문에서 확인된 발표일 순서입니다. 관련 기술·후속 사업도 포함하며, 각 사건의 범위를 함께 표시합니다. 출처 확인일로 사건 날짜를 대신하지 않습니다.</p>
    <div className="research-controls">{stages.map(s => <button key={s} type="button" aria-pressed={stage === s} onClick={() => setStage(s)}>{s}</button>)}<button type="button" onClick={() => setAscending(!ascending)}>{ascending ? "오래된 순" : "최신 순"} ↕</button></div>
    {!filtered.length && <p role="status">이 범위에 날짜까지 확인한 사건이 없습니다. 계약·시제품 인도를 배치 완료로 추정해 채우지 않습니다.</p>}
    <ol className="equipment-timeline">{filtered.map(e => <li key={e.id}><div><time dateTime={e.date}>{e.date}</time> · {e.dateLabel} <strong>{e.stage}</strong>{e.planned && <span> · 예정 사항 포함</span>}</div><h4>{e.title}</h4><p>{e.summary}</p><p className="model-uncertainty">{e.limit}</p><a href={e.source.url} target="_blank" rel="noreferrer">{e.source.publisher} · 원문 ↗</a><small>출처 확인 {e.source.checkedAt}</small></li>)}</ol>
    {equipment && <details><summary>날짜가 확정되지 않은 현재 장비 기록</summary><p>{equipment.status}</p><p>자료 갱신일: {equipment.lastUpdated}. 이 날짜는 개발·배치 사건일이 아닙니다.</p><ul>{equipment.sources.map(s => <li key={s.url}><a href={s.url} target="_blank" rel="noreferrer">{s.title} ↗</a></li>)}</ul></details>}
  </section>;
}
