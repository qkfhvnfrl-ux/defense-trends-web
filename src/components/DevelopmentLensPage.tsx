import { useMemo, useState } from "react";
import type { DevelopmentLensItem, EngineeringReference, Equipment } from "../types";

type Props = {
  equipment: Equipment[];
  lensItems: DevelopmentLensItem[];
  references: EngineeringReference[];
  onEquipmentOpen: (id: string) => void;
};

const lifecycle = ["선행연구", "소요/요구분석", "기본설계", "시제/시험평가", "제품군 설계", "전 수명주기"];

function confidenceLabel(score: number) {
  if (score >= 86) return "High";
  if (score >= 72) return "Medium";
  return "Low";
}

function levelKo(level: "High" | "Medium" | "Low") {
  return level === "High" ? "상" : level === "Medium" ? "중" : "하";
}

function equipmentName(equipment: Equipment[], id: string) {
  return equipment.find((item) => item.id === id)?.name ?? id;
}

export function DevelopmentLensPage({ equipment, lensItems, references, onEquipmentOpen }: Props) {
  const [selectedId, setSelectedId] = useState(lensItems[0]?.id ?? "");
  const selected = lensItems.find((item) => item.id === selectedId) ?? lensItems[0];

  const phaseCounts = useMemo(
    () => lifecycle.map((phase) => ({
      phase,
      count: lensItems.filter((item) => item.lifecyclePhaseKo === phase).length
    })),
    [lensItems]
  );

  const coverage = useMemo(() => {
    const equipmentIds = new Set(lensItems.flatMap((item) => item.relatedEquipmentIds));
    return {
      equipment: equipmentIds.size,
      requirements: lensItems.reduce((sum, item) => sum + item.requirementSignals.length, 0),
      verification: lensItems.reduce((sum, item) => sum + item.verificationItems.length, 0),
      risks: lensItems.reduce((sum, item) => sum + item.riskRegister.length, 0)
    };
  }, [lensItems]);

  return (
    <section className="development-page">
      <header className="development-hero">
        <div>
          <p className="eyebrow">Systems development lens</p>
          <h2>방산 체계개발 참고 보드</h2>
          <p>
            전장 사례를 단순 뉴스로 보지 않고 위협, 요구사항, 아키텍처, 시험평가, 리스크로 연결합니다.
            장갑차와 전차 개발자가 공개 출처 기반으로 의사결정 근거를 빠르게 훑는 화면입니다.
          </p>
        </div>
        <div className="development-kpis">
          <div><strong>{lensItems.length}</strong><span>개발 Lens</span></div>
          <div><strong>{coverage.equipment}</strong><span>연결 장비</span></div>
          <div><strong>{coverage.requirements}</strong><span>요구 신호</span></div>
          <div><strong>{coverage.verification}</strong><span>검증 항목</span></div>
        </div>
      </header>

      <div className="lifecycle-rail">
        {phaseCounts.map((item, index) => (
          <article key={item.phase}>
            <em>{String(index + 1).padStart(2, "0")}</em>
            <strong>{item.phase}</strong>
            <span>{item.count}개 항목</span>
          </article>
        ))}
      </div>

      <div className="development-layout">
        <aside className="development-selector" aria-label="체계개발 Lens 선택">
          {lensItems.map((item) => (
            <button key={item.id} className={item.id === selected.id ? "active" : ""} type="button" onClick={() => setSelectedId(item.id)}>
              <span>{item.lifecyclePhaseKo}</span>
              <strong>{item.titleKo}</strong>
              <small>{item.themeKo} · 신뢰도 {confidenceLabel(item.sourceConfidenceScore)}</small>
            </button>
          ))}
        </aside>

        <article className="development-detail">
          <div className="section-heading">
            <div>
              <p className="eyebrow">{selected.themeKo}</p>
              <h3>{selected.titleKo}</h3>
            </div>
            <span>Source {selected.sourceConfidenceScore}</span>
          </div>
          <p className="development-summary">{selected.summaryKo}</p>

          <div className="development-tags">
            {selected.tags.map((tag) => <span key={tag}>{tag}</span>)}
          </div>

          <div className="trace-grid">
            <section>
              <h4>위협/동인</h4>
              <ul>{selected.threatDrivers.map((item) => <li key={item}>{item}</li>)}</ul>
            </section>
            <section>
              <h4>요구사항 신호</h4>
              <ul>{selected.requirementSignals.map((item) => <li key={item}>{item}</li>)}</ul>
            </section>
          </div>

          <section className="architecture-board">
            <div className="section-heading">
              <h4>아키텍처 영향</h4>
              <span>{selected.architectureImpacts.length}개 영역</span>
            </div>
            <div className="architecture-grid">
              {selected.architectureImpacts.map((impact) => (
                <article key={impact.areaKo}>
                  <strong>{impact.areaKo}</strong>
                  <p>{impact.implicationKo}</p>
                  <small>{impact.designTradeoffKo}</small>
                </article>
              ))}
            </div>
          </section>

          <section className="verification-board">
            <div className="section-heading">
              <h4>시험평가 체크리스트</h4>
              <span>{selected.verificationItems.length}개 검증</span>
            </div>
            <div className="verification-list">
              {selected.verificationItems.map((item) => (
                <article key={`${item.phaseKo}-${item.itemKo}`}>
                  <span>{item.phaseKo}</span>
                  <strong>{item.itemKo}</strong>
                  <p>{item.evidenceKo}</p>
                </article>
              ))}
            </div>
          </section>

          <section className="risk-board">
            <div className="section-heading">
              <h4>리스크 레지스터</h4>
              <span>{selected.riskRegister.length}개 리스크</span>
            </div>
            <div className="risk-list">
              {selected.riskRegister.map((risk) => (
                <article key={risk.riskKo} className={`risk-${risk.level.toLowerCase()}`}>
                  <span>{levelKo(risk.level)} · {risk.ownerKo}</span>
                  <strong>{risk.riskKo}</strong>
                  <p>{risk.mitigationKo}</p>
                </article>
              ))}
            </div>
          </section>

          <section className="related-equipment-strip">
            <div className="section-heading">
              <h4>연결 장비</h4>
              <span>{selected.relatedEquipmentIds.length}종</span>
            </div>
            <div>
              {selected.relatedEquipmentIds.map((id) => (
                <button key={id} type="button" onClick={() => onEquipmentOpen(id)}>
                  {equipmentName(equipment, id)}
                </button>
              ))}
            </div>
          </section>

          <div className="source-list compact">
            {selected.sources.map((source) => (
              <a key={source.url} href={source.url} target="_blank" rel="noreferrer">{source.title}</a>
            ))}
          </div>
        </article>
      </div>

      <section className="requirements-matrix-block">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Traceability matrix</p>
            <h3>위협-요구사항-검증 추적 매트릭스</h3>
          </div>
          <span>{coverage.risks}개 리스크 포함</span>
        </div>
        <div className="matrix-table-wrap">
          <table className="requirements-matrix">
            <thead>
              <tr>
                <th>개발 Lens</th>
                <th>대표 위협/동인</th>
                <th>요구사항 신호</th>
                <th>아키텍처 영역</th>
                <th>검증 초점</th>
                <th>관련 장비</th>
              </tr>
            </thead>
            <tbody>
              {lensItems.map((item) => (
                <tr key={item.id}>
                  <th>{item.titleKo}</th>
                  <td>{item.threatDrivers[0]}</td>
                  <td>{item.requirementSignals[0]}</td>
                  <td>{item.architectureImpacts.map((impact) => impact.areaKo).join(", ")}</td>
                  <td>{item.verificationItems.map((verification) => verification.phaseKo).join(", ")}</td>
                  <td>{item.relatedEquipmentIds.slice(0, 4).map((id) => equipmentName(equipment, id)).join(", ")}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="reference-library">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Reference library</p>
            <h3>체계개발자가 계속 봐야 할 사이트</h3>
          </div>
          <span>{references.length}개 참고자료</span>
        </div>
        <div className="reference-grid">
          {references.map((reference) => (
            <a key={reference.id} href={reference.url} target="_blank" rel="noreferrer">
              <span>{reference.priority} · {reference.categoryKo}</span>
              <strong>{reference.titleKo}</strong>
              <p>{reference.usageKo}</p>
              <small>{reference.organization} · 확인 {reference.checkedAt}</small>
            </a>
          ))}
        </div>
      </section>
    </section>
  );
}
