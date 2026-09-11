import { useState } from "react";
import history from "../content/equipment-history.json";
export function EquipmentHistory({ equipmentId }: { equipmentId?: string }) {
  const [selection, setSelection] = useState("all");
  const records = history.filter(item => equipmentId ? item.equipmentId === equipmentId : selection === "all" || item.equipmentId === selection);
  return <section className="research-tool" aria-label="자료 변경 이력"><h3>자료 변경 이력</h3><p>보관된 v2와 v3의 실제 기록을 비교했습니다. 날짜는 사이트 자료를 수정한 날이며, 차량의 개량·배치일을 의미하지 않습니다. v4에서는 이력 열람 기능을 추가했습니다.</p>
    {!equipmentId && <label>장비 선택 <select value={selection} onChange={e => setSelection(e.target.value)}><option value="all">전체 장비</option>{history.map(item => <option key={item.equipmentId} value={item.equipmentId}>{item.name}</option>)}</select></label>}
    {!records.length && <p>v2 → v3에서 비교 대상 설명·제원·출처의 변경 기록이 없습니다.</p>}
    {records.map(item => <details key={item.equipmentId} open={Boolean(equipmentId)}><summary>{item.name} · {item.from} → {item.to} · {item.recordedAt} · {item.changes.length}개 항목</summary><div className="research-table-wrap"><table><thead><tr><th>항목</th><th>이전 기록 ({item.from})</th><th>수정 기록 ({item.to})</th></tr></thead><tbody>{item.changes.map(change => <tr key={change.field}><th scope="row">{change.field}</th><td><del>{change.before}</del></td><td>{change.after}</td></tr>)}</tbody></table></div><details><summary>수정본의 근거 출처</summary><ul>{item.sources.map(source => <li key={source.url}><a href={source.url} target="_blank" rel="noreferrer">{source.title} ↗</a> · 확인일 {source.checkedAt}</li>)}</ul></details></details>)}
  </section>;
}
