import type { BattlefieldTechnology, Equipment, EquipmentVariant } from "../types";

type Props = {
  equipment: Equipment;
  variants: EquipmentVariant[];
  technologies: BattlefieldTechnology[];
};

const categoryImpact: Record<BattlefieldTechnology["category"], number> = {
  "드론 대응": 96,
  전자전: 86,
  방공: 82,
  무인화: 74,
  능동방호: 78,
  네트워크: 68
};

export function BattlefieldLens({ equipment, variants, technologies }: Props) {
  const improvised = variants.filter((variant) => variant.maturity === "급조");
  const relatedCategories = technologies.map((technology) => technology.category);
  const dronePressure = technologies.some((technology) => technology.category === "드론 대응") ? 92 : 58;
  const integrationScore = Math.min(96, 44 + technologies.length * 9 + variants.length * 2);
  const fieldAdaptation = Math.min(98, 52 + improvised.length * 18 + relatedCategories.length * 5);

  const insight =
    improvised.length > 0
      ? "이 장비는 공개 자료상 급조 방호 또는 전장 개조 흐름과 직접 연결됩니다. 기본 제원보다 '어떻게 바뀌었는가'가 더 중요한 관찰 포인트입니다."
      : technologies.length > 0
        ? "이 장비는 센서, 전자전, 방공, 네트워크 같은 현대화 요소와 연결됩니다. 전장 생존성은 단일 장갑 두께가 아니라 체계 통합으로 판단해야 합니다."
        : "현재 선택 장비는 직접 연결된 전장 기술 데이터가 적습니다. 출처가 확인되는 운용 사례를 추가하면 분석 밀도가 올라갑니다.";

  return (
    <section className="battlefield-lens">
      <div className="section-heading">
        <div>
          <p className="eyebrow">Battlefield adaptation lens</p>
          <h2>{equipment.name} 전장 적응 지표</h2>
        </div>
        <span>{technologies.length}개 기술 연결</span>
      </div>
      <div className="lens-grid">
        <article className="adaptation-visual">
          <div className={`silhouette ${equipment.category}`}>
            <i className="cage" />
            <i className="sensor" />
            <i className="barrel" />
          </div>
          <div>
            <strong>기본 형상 → 드론전 적응형</strong>
            <p>GLB 모델이 없더라도 전장 개조 개념을 시각적으로 비교하도록 설계했습니다.</p>
          </div>
        </article>
        <article className="lens-card">
          <strong>드론 위협 압력</strong>
          <Meter value={dronePressure} />
        </article>
        <article className="lens-card">
          <strong>체계 통합도</strong>
          <Meter value={integrationScore} />
        </article>
        <article className="lens-card">
          <strong>야전 개조 민감도</strong>
          <Meter value={fieldAdaptation} />
        </article>
      </div>
      <p className="lens-insight">{insight}</p>
      <div className="impact-chips">
        {technologies.map((technology) => (
          <span key={technology.id} style={{ ["--impact" as string]: `${categoryImpact[technology.category]}%` }}>
            {technology.category}
          </span>
        ))}
        {!technologies.length ? <span>추가 분석 대기</span> : null}
      </div>
    </section>
  );
}

function Meter({ value }: { value: number }) {
  return (
    <div className="meter" aria-label={`${value}점`}>
      <span style={{ width: `${value}%` }} />
      <em>{value}</em>
    </div>
  );
}
