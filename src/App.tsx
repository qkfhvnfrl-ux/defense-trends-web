import { useEffect, useMemo, useState } from "react";
import type {
  BattlefieldCase,
  BattlefieldTechnology,
  ComponentSpec,
  DevelopmentLensItem,
  EngineeringReference,
  Equipment,
  EquipmentCategory,
  EquipmentVariant,
  Trend
} from "./types";
import { loadAppData } from "./data";
import { EquipmentMap } from "./components/EquipmentMap";
import { EquipmentDetail } from "./components/EquipmentDetail";
import { ModelViewer } from "./components/ModelViewer";
import { TrendPanel } from "./components/TrendPanel";
import { TechnologyPanel } from "./components/TechnologyPanel";
import { BattlefieldLens } from "./components/BattlefieldLens";
import { DevelopmentLensPage } from "./components/DevelopmentLensPage";

type AppData = {
  equipment: Equipment[];
  incidents: BattlefieldCase[];
  trends: Trend[];
  components: ComponentSpec[];
  variants: EquipmentVariant[];
  technologies: BattlefieldTechnology[];
  caseStudies: import("./types").BattlefieldCaseStudy[];
  developmentLens: DevelopmentLensItem[];
  engineeringReferences: EngineeringReference[];
};

const categoryLabels: Record<EquipmentCategory | "all", string> = {
  all: "전체",
  "wheeled-apc": "차륜형장갑차",
  "tracked-apc": "궤도형 APC",
  "tracked-ifv": "보병전투차",
  tank: "전차",
  "air-defense": "방공차량",
  artillery: "자주포"
};

type EquipmentFamily = "all" | "wheeled" | "tracked";

const familyLabels: Record<EquipmentFamily, string> = {
  all: "전체",
  wheeled: "차륜형장갑차",
  tracked: "전차·궤도전투차"
};

const familyCategories: Record<Exclude<EquipmentFamily, "all">, EquipmentCategory[]> = {
  wheeled: ["wheeled-apc", "artillery"],
  tracked: ["tank", "tracked-ifv", "tracked-apc", "air-defense"]
};

const navItems = [
  { path: "/", label: "Dashboard" },
  { path: "/equipment", label: "Equipment" },
  { path: "/development", label: "Development" },
  { path: "/compare", label: "Compare" },
  { path: "/technologies", label: "Technologies" },
  { path: "/cases", label: "Cases" }
];

function inferSourceType(url: string): "Official" | "Manufacturer" | "Think Tank" | "News" | "OSINT" | "Other" {
  if (url.includes("gdls.com") || url.includes("rheinmetall.com") || url.includes("knds") || url.includes("baesystems.com") || url.includes("patriagroup.com") || url.includes("kongsberg.com")) return "Manufacturer";
  if (
    url.includes("army.mil") ||
    url.includes("defense.gov") ||
    url.includes("gov.uk") ||
    url.includes("mod.gov.ua") ||
    url.includes("defense.gouv.fr") ||
    url.includes("nato.int") ||
    url.includes("natogva.org") ||
    url.includes("dau.edu") ||
    url.includes("dla.mil") ||
    url.includes("dsca.mil") ||
    url.includes("eda.europa.eu") ||
    url.includes("sto.nato.int")
  ) return "Official";
  if (url.includes("rusi.org") || url.includes("csis.org") || url.includes("iiss.org") || url.includes("sipri.org")) return "Think Tank";
  if (url.includes("commons.wikimedia.org") || url.includes("wikimedia.org")) return "OSINT";
  if (url.includes("apnews.com") || url.includes("kyivpost.com") || url.includes("armyrecognition.com") || url.includes("defence-ua.com") || url.includes("rferl.org")) return "News";
  return "Other";
}

function confidenceLabel(score: number) {
  if (score >= 82) return "High";
  if (score >= 68) return "Medium";
  return "Low";
}

function ScoreBar({ label, value, reason }: { label: string; value: number; reason?: string }) {
  return (
    <div className="score-item">
      <div>
        <strong>{label}</strong>
        <span>{value}</span>
      </div>
      <i><b style={{ width: `${value}%` }} /></i>
      {reason ? <p>{reason}</p> : null}
    </div>
  );
}

export function App() {
  const [data, setData] = useState<AppData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [path, setPath] = useState(window.location.pathname);
  const [family, setFamily] = useState<EquipmentFamily>("all");
  const [category, setCategory] = useState<EquipmentCategory | "all">("all");
  const [query, setQuery] = useState("");
  const [selectedId, setSelectedId] = useState("m1a2-abrams");
  const [selectedIncidentId, setSelectedIncidentId] = useState<string | null>(null);
  const [selectedComponent, setSelectedComponent] = useState<ComponentSpec | null>(null);

  useEffect(() => {
    loadAppData().then(setData).catch((reason: unknown) => {
      setError(reason instanceof Error ? reason.message : "데이터를 불러오지 못했습니다.");
    });
  }, []);

  useEffect(() => {
    const onPopState = () => setPath(window.location.pathname);
    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, []);

  const filteredEquipment = useMemo(() => {
    if (!data) return [];
    const normalizedQuery = query.trim().toLowerCase();
    return data.equipment.filter((item) => {
      const matchesFamily =
        family === "all" ||
        (family === "wheeled" && familyCategories.wheeled.includes(item.category)) ||
        (family === "tracked" && familyCategories.tracked.includes(item.category));
      const matchesCategory = category === "all" || item.category === category;
      const matchesQuery = !normalizedQuery || `${item.name} ${item.country} ${item.manufacturer}`.toLowerCase().includes(normalizedQuery);
      return matchesFamily && matchesCategory && matchesQuery;
    });
  }, [category, data, family, query]);

  const availableCategoryKeys = useMemo(() => {
    if (family === "all") return Object.keys(categoryLabels) as Array<EquipmentCategory | "all">;
    return ["all", ...familyCategories[family]] as Array<EquipmentCategory | "all">;
  }, [family]);

  const selectedEquipment = data?.equipment.find((item) => item.id === selectedId) ?? data?.equipment[0];
  const relatedIncidents = data?.incidents.filter((incident) => selectedEquipment?.id && incident.equipmentIds.includes(selectedEquipment.id)) ?? [];
  const relatedComponents = data?.components.filter((component) => component.equipmentId === selectedEquipment?.id) ?? [];
  const relatedVariants = data?.variants.filter((variant) => variant.equipmentId === selectedEquipment?.id) ?? [];
  const relatedTechnologies = data?.technologies.filter((technology) => technology.relatedEquipmentIds.includes(selectedEquipment?.id ?? "")) ?? [];
  const selectedIncident = data?.incidents.find((incident) => incident.id === selectedIncidentId) ?? null;

  function selectEquipment(id: string) {
    setSelectedId(id);
    setSelectedComponent(null);
  }

  function navigate(nextPath: string) {
    window.history.pushState(null, "", nextPath);
    setPath(nextPath);
  }

  if (error) {
    return <main className="state-page">데이터 오류: {error}</main>;
  }

  if (!data || !selectedEquipment) {
    return <main className="state-page">자료를 불러오는 중입니다.</main>;
  }

  const equipmentPathMatch = path.match(/^\/equipment\/([^/]+)$/);
  const routeSelectedEquipment = equipmentPathMatch
    ? data.equipment.find((item) => item.id === equipmentPathMatch[1]) ?? selectedEquipment
    : selectedEquipment;
  const routeVariants = data.variants.filter((variant) => variant.equipmentId === routeSelectedEquipment.id);
  const routeIncidents = data.incidents.filter((incident) => incident.equipmentIds.includes(routeSelectedEquipment.id));
  const routeComponents = data.components.filter((component) => component.equipmentId === routeSelectedEquipment.id);
  const routeTechnologies = data.technologies.filter((technology) => technology.relatedEquipmentIds.includes(routeSelectedEquipment.id));

  const uniqueSources = new Map<string, { title: string; url: string; type: string; checkedAt: string }>();
  for (const item of data.equipment) {
    for (const source of item.sources) {
      uniqueSources.set(source.url, {
        title: source.title,
        url: source.url,
        type: inferSourceType(source.url),
        checkedAt: source.checkedAt
      });
    }
  }
  for (const item of data.developmentLens) {
    for (const source of item.sources) {
      uniqueSources.set(source.url, {
        title: source.title,
        url: source.url,
        type: inferSourceType(source.url),
        checkedAt: source.checkedAt
      });
    }
  }
  for (const reference of data.engineeringReferences) {
    uniqueSources.set(reference.url, {
      title: reference.titleKo,
      url: reference.url,
      type: inferSourceType(reference.url),
      checkedAt: reference.checkedAt
    });
  }

  return (
    <main className="app-shell">
      <nav className="site-nav" aria-label="주요 메뉴">
        {navItems.map((item) => (
          <button key={item.path} className={path === item.path || (item.path !== "/" && path.startsWith(item.path)) ? "active" : ""} type="button" onClick={() => navigate(item.path)}>
            {item.label}
          </button>
        ))}
      </nav>
      <header className="topbar">
        <div>
          <p className="eyebrow">Open-source armored vehicle intelligence</p>
          <h1>Global Land Platform Intelligence</h1>
          <p className="hero-subtitle">공개 출처 기반 차륜형장갑차·전차 현대화 동향 분석</p>
        </div>
        <div className="kpi-strip" aria-label="자료 현황">
          <div>
            <strong>{data.equipment.length}</strong>
            <span>장비</span>
          </div>
          <div>
            <strong>{data.incidents.length}</strong>
            <span>전장 사례</span>
          </div>
          <div>
            <strong>{data.variants.length}</strong>
            <span>파생형</span>
          </div>
          <div>
            <strong>{data.technologies.length}</strong>
            <span>전장 기술</span>
          </div>
          <div>
            <strong>{uniqueSources.size}</strong>
            <span>공개 출처</span>
          </div>
        </div>
      </header>

      {path === "/compare" ? (
        <ComparePage equipment={data.equipment} variants={data.variants} technologies={data.technologies} />
      ) : path === "/development" ? (
        <DevelopmentLensPage
          equipment={data.equipment}
          lensItems={data.developmentLens}
          references={data.engineeringReferences}
          onEquipmentOpen={(id) => {
            selectEquipment(id);
            navigate(`/equipment/${id}`);
          }}
        />
      ) : path === "/technologies" ? (
        <TechnologyPage technologies={data.technologies} onEquipmentSelect={(id) => {
          selectEquipment(id);
          navigate(`/equipment/${id}`);
        }} />
      ) : path === "/cases" ? (
        <CasesPage cases={data.caseStudies} equipment={data.equipment} />
      ) : equipmentPathMatch ? (
        <>
          <EquipmentHero equipment={routeSelectedEquipment} variants={routeVariants} />
          <section className="detail-grid">
            <EquipmentDetail equipment={routeSelectedEquipment} incidents={routeIncidents} variants={routeVariants} />
            <ModelViewer equipment={routeSelectedEquipment} components={routeComponents} onComponentSelect={setSelectedComponent} />
          </section>
          <BattlefieldLens equipment={routeSelectedEquipment} variants={routeVariants} technologies={routeTechnologies} />
          <ComparableVehicles equipment={routeSelectedEquipment} equipmentList={data.equipment} onSelect={(id) => navigate(`/equipment/${id}`)} />
          <SourcePanel equipment={routeSelectedEquipment} />
        </>
      ) : (
        <>
          {path === "/" ? <DashboardOverview equipment={data.equipment} variants={data.variants} technologies={data.technologies} caseStudies={data.caseStudies} sources={Array.from(uniqueSources.values())} /> : null}
          <section className="dashboard-grid">
        <aside className="equipment-rail" aria-label="장비 목록">
          <div className="rail-header">
            <div>
              <p className="eyebrow">Inventory</p>
              <h2>장비 탐색</h2>
            </div>
            <span>{filteredEquipment.length}건</span>
          </div>
          <label className="search-box">
            <span>검색</span>
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="모델, 국가, 제조사"
            />
          </label>
          <div className="family-tabs">
            {(Object.keys(familyLabels) as EquipmentFamily[]).map((key) => (
              <button
                key={key}
                className={family === key ? "active" : ""}
                type="button"
                onClick={() => {
                  setFamily(key);
                  setCategory("all");
                }}
              >
                {familyLabels[key]}
              </button>
            ))}
          </div>
          <div className="segmented-control">
            {availableCategoryKeys.map((key) => (
              <button
                key={key}
                className={category === key ? "active" : ""}
                type="button"
                onClick={() => setCategory(key)}
              >
                {categoryLabels[key]}
              </button>
            ))}
          </div>
          <div className="equipment-list">
            {filteredEquipment.map((item) => (
              <button
                key={item.id}
                type="button"
                className={`equipment-row ${item.id === selectedEquipment.id ? "active" : ""}`}
                onClick={() => selectEquipment(item.id)}
                onDoubleClick={() => navigate(`/equipment/${item.id}`)}
              >
                <span>{item.name}</span>
                <small>{item.country} · {categoryLabels[item.category]}</small>
              </button>
            ))}
            {!filteredEquipment.length ? <p className="empty-state">검색 조건에 맞는 장비가 없습니다.</p> : null}
          </div>
        </aside>

        <section className="map-panel">
          <EquipmentMap
            incidents={data.incidents}
            selectedEquipmentId={selectedEquipment.id}
            selectedIncident={selectedIncident}
            onIncidentSelect={setSelectedIncidentId}
            onEquipmentSelect={selectEquipment}
          />
        </section>

        <TrendPanel trends={data.trends} selectedEquipmentId={selectedEquipment.id} onEquipmentSelect={selectEquipment} />
      </section>

      <section className="detail-grid">
        <EquipmentDetail equipment={selectedEquipment} incidents={relatedIncidents} variants={relatedVariants} />
        <ModelViewer equipment={selectedEquipment} components={relatedComponents} onComponentSelect={setSelectedComponent} />
      </section>

      <BattlefieldLens equipment={selectedEquipment} variants={relatedVariants} technologies={relatedTechnologies} />
      <TechnologyPanel technologies={data.technologies} relatedTechnologies={relatedTechnologies} onEquipmentSelect={selectEquipment} />
        </>
      )}

      {selectedComponent ? (
        <div className="modal-backdrop" role="presentation" onClick={() => setSelectedComponent(null)}>
          <article className="component-modal" role="dialog" aria-modal="true" onClick={(event) => event.stopPropagation()}>
            <button className="icon-close" type="button" aria-label="닫기" onClick={() => setSelectedComponent(null)}>
              ×
            </button>
            <p className="eyebrow">{selectedComponent.type}</p>
            <h2>{selectedComponent.nameKo}</h2>
            <p>{selectedComponent.summaryKo}</p>
            <dl className="spec-grid">
              {Object.entries(selectedComponent.specs).map(([key, value]) => (
                <div key={key}>
                  <dt>{key}</dt>
                  <dd>{value}</dd>
                </div>
              ))}
            </dl>
            <div className="source-list">
              {selectedComponent.sources.map((source) => (
                <a key={source.url} href={source.url} target="_blank" rel="noreferrer">
                  {source.title}
                </a>
              ))}
            </div>
          </article>
        </div>
      ) : null}
    </main>
  );
}

function DashboardOverview({ equipment, variants, technologies, caseStudies, sources }: {
  equipment: Equipment[];
  variants: EquipmentVariant[];
  technologies: BattlefieldTechnology[];
  caseStudies: AppData["caseStudies"];
  sources: Array<{ title: string; url: string; type: string; checkedAt: string }>;
}) {
  const avg = (values: number[]) => Math.round(values.reduce((sum, value) => sum + value, 0) / values.length);
  const timeline = ["기본형", "RCWS형", "30mm 포탑형", "C-UAS형", "APS/EW 통합형"];
  const threats = ["FPV 드론", "ATGM", "지뢰/IED", "소형 UAV 정찰", "포병 위협"];
  const responses = ["드론 네트", "APS", "재머/EW", "RCWS", "C-UAS 기관포", "센서융합"];

  return (
    <section className="dashboard-overview">
      <div className="overview-grid">
        <ScoreBar label="드론 위협 압력" value={avg(equipment.map((item) => item.droneThreatPressure))} reason="공개 관측 사례와 드론 대응 기술 연결 수를 반영한 평균 지표입니다." />
        <ScoreBar label="체계 통합도" value={avg(equipment.map((item) => item.systemIntegrationLevel))} reason="센서, 네트워크, 전자전, 방공 통합 여지를 비교합니다." />
        <ScoreBar label="야전 개조 민감도" value={avg(equipment.map((item) => item.fieldModificationSensitivity))} reason="급조 방호와 임무형 전환 가능성을 반영합니다." />
      </div>
      <div className="timeline-panel">
        <div className="section-heading">
          <h2>Equipment Evolution Timeline</h2>
          <span>{variants.length}개 파생형 기반</span>
        </div>
        <div className="timeline-row">
          {timeline.map((item, index) => (
            <article key={item} className="timeline-event">
              <em>{String(index + 1).padStart(2, "0")}</em>
              <strong>{item}</strong>
            </article>
          ))}
        </div>
      </div>
      <div className="matrix-panel">
        <div className="section-heading">
          <h2>Threat-Response Matrix</h2>
          <span>{technologies.length}개 기술 축 반영</span>
        </div>
        <div className="threat-matrix">
          {threats.map((threat) => responses.map((response, index) => (
            <div key={`${threat}-${response}`} className={index % 2 === 0 ? "active" : ""}>
              <strong>{threat}</strong>
              <span>{response}</span>
            </div>
          )))}
        </div>
      </div>
      <div className="source-update-panel">
        <div className="section-heading">
          <h2>Recently Updated Sources</h2>
          <span>{sources.length}개 출처</span>
        </div>
        <div className="source-cards">
          {sources.slice(0, 8).map((source) => (
            <a key={source.url} href={source.url} target="_blank" rel="noreferrer">
              <span className={`source-badge ${source.type.toLowerCase().replace(/\s+/g, "-")}`}>{source.type}</span>
              <strong>{source.title}</strong>
              <small>{source.checkedAt}</small>
            </a>
          ))}
        </div>
      </div>
      <div className="case-strip">
        {caseStudies.slice(0, 4).map((caseStudy) => (
          <article key={caseStudy.id} className="case-study-card compact-card">
            <span>{caseStudy.conflict} · {caseStudy.confidenceLevel}</span>
            <strong>{caseStudy.equipmentName}</strong>
            <p>{caseStudy.operationalMeaning}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

function EquipmentHero({ equipment, variants }: { equipment: Equipment; variants: EquipmentVariant[] }) {
  return (
    <section className="equipment-hero">
      <div>
        <p className="eyebrow">{equipment.vehicleFamily}</p>
        <h2>{equipment.name}</h2>
        <p>{equipment.summaryKo}</p>
        <div className="meta-row">
          <span>{equipment.originCountry}</span>
          <span>{equipment.manufacturer}</span>
          <span>{equipment.roleTags.join(" / ")}</span>
          <span>{variants.length}개 파생형</span>
        </div>
      </div>
      <div className="hero-score-stack">
        <ScoreBar label="현대화 확장성" value={equipment.modernizationPotential} reason="파생형, 센서 통합, 공개 현대화 흐름을 종합한 지표입니다." />
        <ScoreBar label="출처 검증 수준" value={equipment.sourceConfidenceScore} reason={equipment.confidenceSummary} />
      </div>
    </section>
  );
}

function ComparableVehicles({ equipment, equipmentList, onSelect }: { equipment: Equipment; equipmentList: Equipment[]; onSelect: (id: string) => void }) {
  const comparable = equipmentList
    .filter((item) => item.id !== equipment.id && (item.category === equipment.category || item.vehicleFamily === equipment.vehicleFamily))
    .slice(0, 5);
  return (
    <section className="comparison-band">
      <div className="section-heading">
        <h2>Comparable Vehicles</h2>
        <span>{comparable.length}개 추천</span>
      </div>
      <div className="comparable-grid">
        {comparable.map((item) => (
          <button key={item.id} type="button" onClick={() => onSelect(item.id)}>
            <strong>{item.name}</strong>
            <span>{item.roleTags.join(" / ")}</span>
            <ScoreBar label="전장 적응성" value={Math.round((item.droneThreatPressure + item.fieldModificationSensitivity) / 2)} />
          </button>
        ))}
      </div>
    </section>
  );
}

function SourcePanel({ equipment }: { equipment: Equipment }) {
  return (
    <section className="source-panel-block">
      <div className="section-heading">
        <h2>Public Source Panel</h2>
        <span>{confidenceLabel(equipment.sourceConfidenceScore)}</span>
      </div>
      <div className="source-cards">
        {equipment.sources.map((source) => {
          const type = inferSourceType(source.url);
          return (
            <a key={source.url} href={source.url} target="_blank" rel="noreferrer">
              <span className={`source-badge ${type.toLowerCase().replace(/\s+/g, "-")}`}>{type}</span>
              <strong>{source.title}</strong>
              <small>{source.checkedAt}</small>
            </a>
          );
        })}
      </div>
    </section>
  );
}

function ComparePage({ equipment, variants, technologies }: { equipment: Equipment[]; variants: EquipmentVariant[]; technologies: BattlefieldTechnology[] }) {
  const [selected, setSelected] = useState(equipment.slice(0, 4).map((item) => item.id));
  const selectedEquipment = selected.map((id) => equipment.find((item) => item.id === id)).filter(Boolean) as Equipment[];
  const rows = [
    ["임무", (item: Equipment) => item.roleTags.join(", ")],
    ["분류", (item: Equipment) => item.vehicleFamily],
    ["주요 무장", (item: Equipment) => item.specs["주무장"] || item.specs["주요 무장"] || item.specs["주포"] || "출처별 상이"],
    ["플랫폼 계열성", (item: Equipment) => `${variants.filter((variant) => variant.equipmentId === item.id).length}개 파생형`],
    ["기술 연계", (item: Equipment) => `${technologies.filter((technology) => technology.relatedEquipmentIds.includes(item.id)).length}개 기술`],
    ["전장 적응성", (item: Equipment) => String(Math.round((item.droneThreatPressure + item.fieldModificationSensitivity) / 2))],
    ["출처 신뢰도", (item: Equipment) => `${confidenceLabel(item.sourceConfidenceScore)} (${item.sourceConfidenceScore})`]
  ] as const;
  return (
    <section className="compare-page">
      <div className="section-heading">
        <div>
          <p className="eyebrow">Comparison workbench</p>
          <h2>장비 비교 분석</h2>
        </div>
        <span>2~4개 선택</span>
      </div>
      <div className="selector-grid">
        {selected.map((id, index) => (
          <select key={index} value={id} onChange={(event) => setSelected((current) => current.map((value, itemIndex) => itemIndex === index ? event.target.value : value))}>
            {equipment.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}
          </select>
        ))}
      </div>
      <div className="comparison-table-wrap">
        <table className="comparison-table">
          <thead>
            <tr>
              <th>분석 항목</th>
              {selectedEquipment.map((item) => <th key={item.id}>{item.name}</th>)}
            </tr>
          </thead>
          <tbody>
            {rows.map(([label, getter]) => (
              <tr key={label}>
                <th>{label}</th>
                {selectedEquipment.map((item) => <td key={item.id}>{getter(item)}</td>)}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="overview-grid">
        {selectedEquipment.map((item) => (
          <article key={item.id} className="lens-card light">
            <strong>{item.name}</strong>
            <ScoreBar label="현대화 여지" value={item.modernizationPotential} />
            <ScoreBar label="센서/전력 통합" value={item.systemIntegrationLevel} />
            <ScoreBar label="야전 개조 민감도" value={item.fieldModificationSensitivity} />
          </article>
        ))}
      </div>
    </section>
  );
}

function TechnologyPage({ technologies, onEquipmentSelect }: { technologies: BattlefieldTechnology[]; onEquipmentSelect: (id: string) => void }) {
  return <TechnologyPanel technologies={technologies} relatedTechnologies={technologies} onEquipmentSelect={onEquipmentSelect} />;
}

function CasesPage({ cases, equipment }: { cases: AppData["caseStudies"]; equipment: Equipment[] }) {
  return (
    <section className="cases-page">
      <div className="section-heading">
        <div>
          <p className="eyebrow">Observed adaptation cases</p>
          <h2>현대 전장 사례</h2>
        </div>
        <span>{cases.length}건</span>
      </div>
      <div className="case-study-grid">
        {cases.map((caseStudy) => (
          <article key={caseStudy.id} className="case-study-card">
            <div className="tech-meta">
              <span>{caseStudy.conflict}</span>
              <span>{caseStudy.confidenceLevel}</span>
              <span>{caseStudy.sourceType}</span>
            </div>
            <h3>{caseStudy.equipmentName}</h3>
            <p>{caseStudy.observedChange}</p>
            <dl>
              <div><dt>위협 동인</dt><dd>{caseStudy.threatDriver}</dd></div>
              <div><dt>운용 의미</dt><dd>{caseStudy.operationalMeaning}</dd></div>
              <div><dt>연결 장비</dt><dd>{caseStudy.equipmentIds.map((id) => equipment.find((item) => item.id === id)?.name ?? id).join(", ")}</dd></div>
            </dl>
            {caseStudy.safetyNote ? <p className="safety-note">{caseStudy.safetyNote}</p> : null}
            <div className="source-list compact">
              {caseStudy.sourceUrls.map((url) => <a key={url} href={url} target="_blank" rel="noreferrer">{inferSourceType(url)} source</a>)}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
