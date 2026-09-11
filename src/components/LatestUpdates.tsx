import { useState } from "react";
import review from "../content/september-review.json";

export function LatestUpdates() {
  const [filter, setFilter] = useState("전체");
  const kinds = ["전체", ...new Set(review.events.map(item => item.kind))];
  const events = review.events.filter(item => filter === "전체" || item.kind === filter);
  return <section className="latest-updates" aria-labelledby="updates-heading">
    <div className="updates-heading"><div><p className="eyebrow">자료 업데이트</p><h2 id="updates-heading">최근에 무엇이 바뀌었나요?</h2></div><span>확인 기준 {review.checkedAt}</span></div>
    <p className="updates-scope">{review.scope}. 발표일과 적용 단계를 함께 표시합니다. 검토 관점은 공개 자료에 대한 해석입니다.</p>
    <div className="update-filters" aria-label="발표 단계 필터">{kinds.map(kind => <button key={kind} type="button" aria-pressed={filter === kind} onClick={() => setFilter(kind)}>{kind}</button>)}</div>
    <div className="update-cards">{events.map(item => <article key={item.id} className="update-card">
      <div className="update-meta"><time dateTime={item.date}>{item.date}</time><span>{item.kind}</span></div>
      <h3>{item.title}</h3><p>{item.summary}</p><p className="update-meaning">{item.meaning}</p><p className="update-limit">{item.limit}</p>
      <a href={item.source.url} target="_blank" rel="noreferrer">{item.source.publisher} · 발표 원문 ↗</a>
    </article>)}</div>
    <details className="review-coverage"><summary>장비 15종 검토 현황 · 갱신 {review.audits.filter(a=>a.status === "갱신").length}종 / 나머지 확인 범위 보기</summary>
      <div className="review-table-wrap"><table><thead><tr><th>장비</th><th>검토 결과</th><th>확인 범위</th></tr></thead><tbody>{review.audits.map(a => <tr key={a.equipmentId}><th>{a.name}</th><td>{a.status}</td><td>{a.note}</td></tr>)}</tbody></table></div>
    </details>
  </section>;
}

export function EquipmentReview({ equipmentId }: { equipmentId: string }) {
  const audit = review.audits.find(a => a.equipmentId === equipmentId);
  if (!audit) return null;
  return <aside className="equipment-review"><strong>{audit.status} · {audit.checkedAt} 검토</strong><p>{audit.note}</p></aside>;
}
