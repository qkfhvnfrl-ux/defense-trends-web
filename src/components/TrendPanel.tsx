import type { Trend } from "../types";

type Props = {
  trends: Trend[];
  selectedEquipmentId: string;
  onEquipmentSelect: (id: string) => void;
};

export function TrendPanel({ trends, selectedEquipmentId, onEquipmentSelect }: Props) {
  const related = trends.filter((trend) => trend.equipmentIds.includes(selectedEquipmentId));
  const visible = related.length ? related : trends.slice(0, 6);

  return (
    <aside className="trend-panel">
      <div className="panel-title">
        <div>
          <p className="eyebrow">Trend watch</p>
          <h2>최신 동향</h2>
        </div>
        <span>{visible.length}건</span>
      </div>
      <div className="trend-list">
        {visible.map((trend) => (
          <article key={trend.id} className="trend-item">
            <span>{trend.type} · {trend.region} · {trend.date}</span>
            <strong>{trend.titleKo}</strong>
            <p>{trend.summaryKo}</p>
            <div className="trend-actions">
              {trend.equipmentIds.map((id) => (
                <button key={id} type="button" onClick={() => onEquipmentSelect(id)}>
                  {id}
                </button>
              ))}
            </div>
          </article>
        ))}
      </div>
    </aside>
  );
}
