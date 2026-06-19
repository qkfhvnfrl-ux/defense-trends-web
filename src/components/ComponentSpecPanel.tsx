import type { ComponentSpec, Equipment } from "../types";

type Props = {
  equipment: Equipment;
  components: ComponentSpec[];
  onComponentSelect: (component: ComponentSpec) => void;
};

export function ComponentSpecPanel({ equipment, components, onComponentSelect }: Props) {
  return (
    <article className="viewer-panel component-spec-panel">
      <div className="viewer-heading">
        <div>
          <p className="eyebrow">Open component specs</p>
          <h2>{equipment.name} 장치/부품 공개 스펙</h2>
        </div>
        <span className="model-badge">공개 출처 기반</span>
      </div>
      <p className="viewer-caption">
        장비 검색에 필요한 공개 장치 정보를 우선 표시합니다. 각 항목을 열면 확인 가능한 스펙과 출처를 볼 수 있습니다.
      </p>
      <div className="component-slot-list">
        {components.length ? (
          components.map((component) => (
            <button key={component.id} type="button" className="component-slot" onClick={() => onComponentSelect(component)}>
              <span>{component.type}</span>
              <strong>{component.nameKo}</strong>
              <small>{Object.keys(component.specs).slice(0, 3).join(" / ")}</small>
            </button>
          ))
        ) : (
          <p className="empty-state">등록된 공개 부품 스펙이 없습니다.</p>
        )}
      </div>
    </article>
  );
}
