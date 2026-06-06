import type { BattlefieldCase, Equipment, EquipmentVariant } from "../types";

type Props = {
  equipment: Equipment;
  incidents: BattlefieldCase[];
  variants: EquipmentVariant[];
};

const categoryText: Record<Equipment["category"], string> = {
  "wheeled-apc": "차륜형장갑차",
  "tracked-apc": "궤도형 APC",
  "tracked-ifv": "보병전투차",
  tank: "전차",
  "air-defense": "방공차량",
  artillery: "자주포"
};

export function EquipmentDetail({ equipment, incidents, variants }: Props) {
  return (
    <article className="detail-panel">
      <div className="image-strip">
        {(equipment.images.length ? equipment.images : ["visual-placeholder"]).map((image) => (
          <figure key={image} className="image-tile">
            {image !== "visual-placeholder" ? (
              <img
                src={image}
                alt={`${equipment.name} 공개 이미지`}
                loading="lazy"
                onError={(event) => {
                  event.currentTarget.style.display = "none";
                  event.currentTarget.nextElementSibling?.classList.add("visible");
                }}
              />
            ) : null}
            <figcaption className={image === "visual-placeholder" ? "visible" : ""}>
              {equipment.name} 검증 사진 없음 · 3D/제원 중심 표시
            </figcaption>
          </figure>
        ))}
      </div>
      <div className="detail-heading">
        <div>
          <p className="eyebrow">{categoryText[equipment.category]}</p>
          <h2>{equipment.name}</h2>
        </div>
        <span className="status-pill">{equipment.status}</span>
      </div>
      <div className="meta-row">
        <span>{equipment.country}</span>
        <span>{equipment.manufacturer}</span>
        <span>{categoryText[equipment.category]}</span>
      </div>
      <p className="summary">{equipment.summaryKo}</p>
      <dl className="spec-grid">
        <div>
          <dt>국가</dt>
          <dd>{equipment.country}</dd>
        </div>
        <div>
          <dt>제조사</dt>
          <dd>{equipment.manufacturer}</dd>
        </div>
        {Object.entries(equipment.specs).map(([key, value]) => (
          <div key={key}>
            <dt>{key}</dt>
            <dd>{value}</dd>
          </div>
        ))}
      </dl>
      <section className="case-list">
        <h3>전장 운용 사례</h3>
        {incidents.length ? (
          incidents.map((incident) => (
            <div key={incident.id} className="case-item">
              <strong>{incident.titleKo}</strong>
              <span>{incident.location} / {incident.period}</span>
              <p>{incident.summaryKo}</p>
            </div>
          ))
        ) : (
          <p className="muted">공개 출처로 확인한 실제 전장 운용 사례를 아직 넣지 않았습니다.</p>
        )}
      </section>
      <section className="variant-section">
        <div className="section-heading">
          <h3>계열차량·임무형</h3>
          <span>{variants.length}종</span>
        </div>
        {variants.length ? (
          <div className="variant-grid">
            {variants.map((variant) => (
              <article key={variant.id} className="variant-card">
                <div>
                  <strong>{variant.nameKo}</strong>
                  <span>{variant.maturity}</span>
                </div>
                <dl>
                  <dt>임무</dt>
                  <dd>{variant.role}</dd>
                  <dt>무장/장비</dt>
                  <dd>{variant.armament}</dd>
                </dl>
                <p>{variant.notesKo}</p>
              </article>
            ))}
          </div>
        ) : (
          <p className="muted">등록된 계열차량 데이터가 없습니다.</p>
        )}
      </section>
      <section className="source-list">
        {equipment.sources.map((source) => (
          <a key={source.url} href={source.url} target="_blank" rel="noreferrer">
            {source.title}
          </a>
        ))}
      </section>
    </article>
  );
}
