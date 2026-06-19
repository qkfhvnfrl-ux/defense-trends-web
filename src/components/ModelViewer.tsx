import type { ComponentSpec, Equipment } from "../types";

type Props = {
  equipment: Equipment;
  components: ComponentSpec[];
  onComponentSelect: (component: ComponentSpec) => void;
};

export function ModelViewer({ equipment, components, onComponentSelect }: Props) {
  return (
    <article className="viewer-panel model-slot">
      <div className="viewer-heading">
        <div>
          <p className="eyebrow">3D model slot</p>
          <h2>{equipment.name} 3D 모델 준비 영역</h2>
        </div>
        <span className="model-badge">GLB 추후 연동</span>
      </div>
      <p className="viewer-caption">
        현재 버전은 장비 검색과 공개 제원 확인에 집중합니다. Meshy.ai 또는 수동 제작 GLB가 준비되면
        <code>{equipment.modelPath}</code> 경로에 넣어 3D 뷰어를 다시 활성화할 수 있습니다.
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
