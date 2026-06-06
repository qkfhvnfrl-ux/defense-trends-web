import { useEffect, useMemo } from "react";
import { MapContainer, Marker, Popup, TileLayer, useMap } from "react-leaflet";
import L from "leaflet";
import type { BattlefieldCase } from "../types";

type Props = {
  incidents: BattlefieldCase[];
  selectedEquipmentId: string;
  selectedIncident: BattlefieldCase | null;
  onIncidentSelect: (id: string) => void;
  onEquipmentSelect: (id: string) => void;
};

const defaultIcon = L.divIcon({
  className: "case-marker",
  html: "<span></span>",
  iconSize: [22, 22],
  iconAnchor: [11, 11]
});

const referenceLabels = [
  { id: "north-america", label: "북아메리카", lat: 45, lng: -105 },
  { id: "europe", label: "유럽", lat: 52, lng: 14 },
  { id: "eastern-europe", label: "동유럽", lat: 49, lng: 31 },
  { id: "middle-east", label: "중동", lat: 27, lng: 43 },
  { id: "central-asia", label: "중앙아시아", lat: 44, lng: 66 },
  { id: "sahel", label: "사헬", lat: 15, lng: 1 },
  { id: "east-asia", label: "동아시아", lat: 35, lng: 118 }
];

function escapeHtml(value: string) {
  return value.replace(/[&<>"']/g, (char) => {
    const entities: Record<string, string> = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      "\"": "&quot;",
      "'": "&#39;"
    };
    return entities[char];
  });
}

function koreanLabelIcon(label: string, tone: "reference" | "case") {
  const width = Math.min(160, Math.max(58, label.length * 15 + 30));
  return L.divIcon({
    className: `korean-region-label korean-region-label--${tone}`,
    html: `<span>${escapeHtml(label)}</span>`,
    iconSize: [width, 28],
    iconAnchor: [width / 2, 14]
  });
}

function FlyToIncident({ incident }: { incident: BattlefieldCase | null }) {
  const map = useMap();
  useEffect(() => {
    if (incident) {
      map.flyTo([incident.lat, incident.lng], 5, { duration: 0.8 });
    }
  }, [incident, map]);
  return null;
}

export function EquipmentMap({ incidents, selectedEquipmentId, selectedIncident, onIncidentSelect, onEquipmentSelect }: Props) {
  const sortedIncidents = useMemo(
    () =>
      [...incidents].sort((a, b) => {
        const aSelected = a.equipmentIds.includes(selectedEquipmentId) ? 0 : 1;
        const bSelected = b.equipmentIds.includes(selectedEquipmentId) ? 0 : 1;
        return aSelected - bSelected;
      }),
    [incidents, selectedEquipmentId]
  );

  const caseRegionLabels = useMemo(() => {
    const groups = new Map<string, { lat: number; lng: number; count: number }>();
    incidents.forEach((incident) => {
      const current = groups.get(incident.country) || { lat: 0, lng: 0, count: 0 };
      current.lat += incident.lat;
      current.lng += incident.lng;
      current.count += 1;
      groups.set(incident.country, current);
    });

    return [...groups.entries()].map(([label, value]) => ({
      id: label,
      label,
      lat: value.lat / value.count,
      lng: value.lng / value.count
    }));
  }, [incidents]);

  return (
    <div className="map-wrap">
      <div className="map-overlay">
        <div>
          <p className="eyebrow">Battlefield map</p>
          <strong>공개 전장 사례</strong>
        </div>
        <span><i /> 선택 장비 관련 사례 우선 표시</span>
      </div>
      <MapContainer center={[38, 32]} zoom={2.2} minZoom={2} scrollWheelZoom className="world-map">
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}{r}.png"
        />
        <FlyToIncident incident={selectedIncident} />
        {referenceLabels.map((label) => (
          <Marker
            key={label.id}
            icon={koreanLabelIcon(label.label, "reference")}
            interactive={false}
            position={[label.lat, label.lng]}
            zIndexOffset={-500}
          />
        ))}
        {caseRegionLabels.map((label) => (
          <Marker
            key={label.id}
            icon={koreanLabelIcon(label.label, "case")}
            interactive={false}
            position={[label.lat, label.lng]}
            zIndexOffset={-250}
          />
        ))}
        {sortedIncidents.map((incident) => {
          const isRelated = incident.equipmentIds.includes(selectedEquipmentId);
          return (
            <Marker
              key={incident.id}
              icon={defaultIcon}
              position={[incident.lat, incident.lng]}
              opacity={isRelated ? 1 : 0.45}
              eventHandlers={{ click: () => onIncidentSelect(incident.id) }}
            >
              <Popup>
                <div className="map-popup">
                  <strong>{incident.titleKo}</strong>
                  <span>{incident.location} / {incident.period}</span>
                  <p>{incident.summaryKo}</p>
                  <div>
                    {incident.equipmentIds.map((id) => (
                      <button key={id} type="button" onClick={() => onEquipmentSelect(id)}>
                        {id}
                      </button>
                    ))}
                  </div>
                  {incident.sources.map((source) => (
                    <a key={source.url} href={source.url} target="_blank" rel="noreferrer">
                      {source.title}
                    </a>
                  ))}
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
}
