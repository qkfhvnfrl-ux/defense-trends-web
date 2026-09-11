import { useState } from "react";
import type { Equipment, EquipmentVariant } from "../types";
import { unavailableVariants } from "../vehicle3d/profiles";

type Props = { equipment: Equipment; variants: EquipmentVariant[]; onPreview: (id: string) => void };
export function VariantComparison({ equipment, variants, onPreview }: Props) {
  const [left, setLeft] = useState("base");
  const [right, setRight] = useState(variants[0]?.id ?? "base");
  const base = { id: "base", nameKo: `${equipment.name} 기본형`, role: equipment.roleTags.join(" · "), armament: equipment.specs["주무장"] ?? equipment.specs["무장"] ?? equipment.specs["주요 무장"] ?? equipment.specs["주포"] ?? "별도 확인 필요", notesKo: equipment.summaryKo, maturity: equipment.status, sources: equipment.sources };
  const options = [base, ...variants];
  const a = options.find(v => v.id === left) ?? base, b = options.find(v => v.id === right) ?? base;
  const rows = [{ label: "임무", a: a.role, b: b.role }, { label: "탑재 장비", a: a.armament, b: b.armament }, { label: "확인된 단계", a: a.maturity, b: b.maturity }, { label: "구성·차이 설명", a: a.notesKo, b: b.notesKo }];
  return <section className="research-tool" aria-label="파생형 나란히 비교"><h3>파생형 나란히 비교</h3>
    <div className="research-controls">{[{ value: left, setter: setLeft, label: "왼쪽 구성" }, { value: right, setter: setRight, label: "오른쪽 구성" }].map(item => <label key={item.label}>{item.label}<select value={item.value} onChange={e => item.setter(e.target.value)}>{options.map(v => <option key={v.id} value={v.id}>{v.nameKo}</option>)}</select></label>)}</div>
    <p>{left === right ? "같은 구성을 선택했습니다. 다른 구성을 선택하면 차이를 비교할 수 있습니다." : "배경색이 있는 행은 기록된 내용이 서로 다릅니다. 기본형 제원을 파생형 제원으로 간주하지 않습니다."}</p>
    <div className="research-table-wrap"><table><thead><tr><th scope="col">항목</th><th scope="col">{a.nameKo}</th><th scope="col">{b.nameKo}</th></tr></thead><tbody>{rows.map(row => <tr key={row.label} className={row.a !== row.b ? "different" : ""}><th scope="row">{row.label}{row.a !== row.b ? " · 다름" : ""}</th><td>{row.a}</td><td>{row.b}</td></tr>)}<tr><th scope="row">확인 출처</th>{[a,b].map((v,i) => <td key={i}>{v.sources.map(s => <p key={s.url}><a href={s.url} target="_blank" rel="noreferrer">{s.title} ↗</a><br/><small>확인일 {s.checkedAt}</small></p>)}</td>)}</tr><tr><th scope="row">3D 구성</th>{[a,b].map((v,i) => <td key={i}><button type="button" disabled={unavailableVariants.has(v.id)} onClick={() => onPreview(v.id)}>{unavailableVariants.has(v.id) ? "형상 미확인" : "이 구성을 3D에서 보기"}</button></td>)}</tr></tbody></table></div>
  </section>;
}
