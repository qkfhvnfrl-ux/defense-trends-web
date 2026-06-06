import type { BattlefieldTechnology } from "../types";

type Props = {
  technologies: BattlefieldTechnology[];
  relatedTechnologies: BattlefieldTechnology[];
  onEquipmentSelect: (id: string) => void;
};

export function TechnologyPanel({ technologies, relatedTechnologies, onEquipmentSelect }: Props) {
  const relatedIds = new Set(relatedTechnologies.map((technology) => technology.id));
  const featured = [
    ...relatedTechnologies,
    ...technologies.filter((technology) => !relatedIds.has(technology.id))
  ];

  return (
    <section className="technology-band">
      <div className="section-heading">
        <div>
          <p className="eyebrow">Modern battlefield integration</p>
          <h2>현대 전장 기술 연계</h2>
        </div>
        <span>{featured.length}개 기술</span>
      </div>
      <div className="technology-grid">
        {featured.map((technology) => (
          <article key={technology.id} className="technology-card">
            {technology.images[0] ? (
              <figure className="technology-image">
                <img src={technology.images[0].url} alt={technology.images[0].captionKo} loading="lazy" />
                <figcaption>{technology.images[0].captionKo} · {technology.images[0].credit}</figcaption>
              </figure>
            ) : (
              <div className="technology-visual" aria-hidden="true">
                <span>{technology.category}</span>
              </div>
            )}
            <div className="technology-body">
              <div className="tech-meta">
                <span>{technology.category}</span>
                <span>{technology.maturity}</span>
              </div>
              <h3>{technology.titleKo}</h3>
              <p>{technology.summaryKo}</p>
              <dl>
                <div>
                  <dt>전장 적용</dt>
                  <dd>{technology.battlefieldUseKo}</dd>
                </div>
                <div>
                  <dt>차량 설계 영향</dt>
                  <dd>{technology.vehicleImpactKo}</dd>
                </div>
              </dl>
              <div className="technology-actions">
                {technology.relatedEquipmentIds.map((id) => (
                  <button key={id} type="button" onClick={() => onEquipmentSelect(id)}>
                    {id}
                  </button>
                ))}
              </div>
              <div className="source-list compact">
                {technology.sources.slice(0, 3).map((source) => (
                  <a key={source.url} href={source.url} target="_blank" rel="noreferrer">
                    {source.title}
                  </a>
                ))}
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
