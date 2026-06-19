import { useEffect, useMemo, useState } from "react";
import type {
  BattlefieldCase,
  BattlefieldCaseStudy,
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
import { ComponentSpecPanel } from "./components/ComponentSpecPanel";
import { TechnologyPanel } from "./components/TechnologyPanel";
import { BattlefieldLens } from "./components/BattlefieldLens";
import { normalizeRoute, routeHref } from "./routing";

type AppData = {
  equipment: Equipment[];
  incidents: BattlefieldCase[];
  trends: Trend[];
  components: ComponentSpec[];
  variants: EquipmentVariant[];
  technologies: BattlefieldTechnology[];
  caseStudies: BattlefieldCaseStudy[];
  developmentLens: DevelopmentLensItem[];
  engineeringReferences: EngineeringReference[];
};

type EquipmentFamily = "all" | "wheeled" | "tracked";
type FilterValue = string;
type CatalogSortMode = "default" | "confidence-desc" | "cases-desc" | "variants-desc" | "updated-desc";
type DataStatusFilter = "all" | "ready" | "needs-review";

type CatalogFilters = {
  role: FilterValue;
  country: FilterValue;
  status: FilterValue;
  variantMaturity: FilterValue;
  confidence: FilterValue;
  casePresence: FilterValue;
  dataStatus: DataStatusFilter;
};

type CatalogPreset = {
  id: string;
  label: string;
  description: string;
  family?: EquipmentFamily;
  category?: EquipmentCategory | "all";
  filters?: Partial<CatalogFilters>;
  sortMode?: CatalogSortMode;
  query?: string;
};

type FilterOptions = {
  roles: string[];
  countries: string[];
  statuses: string[];
  variantMaturities: string[];
};

type CatalogUrlState = {
  family: EquipmentFamily;
  category: EquipmentCategory | "all";
  filters: CatalogFilters;
  sortMode: CatalogSortMode;
  query: string;
  selectedId: string;
};

const defaultCatalogFilters: CatalogFilters = {
  role: "all",
  country: "all",
  status: "all",
  variantMaturity: "all",
  confidence: "all",
  casePresence: "all",
  dataStatus: "all"
};

const defaultCatalogSortMode: CatalogSortMode = "default";
const defaultSelectedEquipmentId = "m1a2-abrams";

const categoryLabels: Record<EquipmentCategory | "all", string> = {
  all: "전체",
  "wheeled-apc": "차륜형 장갑차",
  "tracked-apc": "궤도형 APC",
  "tracked-ifv": "보병전투차",
  tank: "전차",
  "air-defense": "방공 차량",
  artillery: "자주포"
};

const familyLabels: Record<EquipmentFamily, string> = {
  all: "전체",
  wheeled: "차륜형",
  tracked: "전차/궤도형"
};

const familyCategories: Record<Exclude<EquipmentFamily, "all">, EquipmentCategory[]> = {
  wheeled: ["wheeled-apc", "artillery"],
  tracked: ["tank", "tracked-ifv", "tracked-apc", "air-defense"]
};

const confidenceOptions = ["High", "Medium", "Low"];

const casePresenceOptions = [
  { value: "with-cases", label: "사례 있음" },
  { value: "without-cases", label: "사례 없음" }
];

const dataStatusOptions: Array<{ value: Exclude<DataStatusFilter, "all">; label: string }> = [
  { value: "ready", label: "검증 양호" },
  { value: "needs-review", label: "보강 필요" }
];

const sortOptions: Array<{ value: CatalogSortMode; label: string }> = [
  { value: "default", label: "기본순" },
  { value: "confidence-desc", label: "출처 신뢰도 높은순" },
  { value: "cases-desc", label: "전장 사례 많은순" },
  { value: "variants-desc", label: "계열 많은순" },
  { value: "updated-desc", label: "최근 확인일순" }
];

const catalogPresets: CatalogPreset[] = [
  {
    id: "needs-review",
    label: "보강 필요",
    description: "출처/계열 데이터 점검 대상",
    filters: { dataStatus: "needs-review" }
  },
  {
    id: "field-proven",
    label: "실전 사례",
    description: "전장 사례가 있는 장비 우선",
    filters: { casePresence: "with-cases" },
    sortMode: "cases-desc"
  },
  {
    id: "trusted-sources",
    label: "고신뢰 출처",
    description: "출처 신뢰도 높은 장비",
    filters: { confidence: "High" },
    sortMode: "confidence-desc"
  },
  {
    id: "variant-rich",
    label: "계열 많은 장비",
    description: "파생형/운용형 비교 우선",
    sortMode: "variants-desc"
  }
];

const navItems = [
  { path: "/", label: "장비 검색" },
  { path: "/equipment", label: "전체 장비" },
  { path: "/insights", label: "전장 인사이트" },
  { path: "/sources", label: "출처" }
];

function inferSourceType(url: string): "Official" | "Manufacturer" | "Think Tank" | "News" | "OSINT" | "Other" {
  if (url.includes("gdls.com") || url.includes("rheinmetall.com") || url.includes("knds") || url.includes("baesystems.com") || url.includes("patriagroup.com") || url.includes("kongsberg.com")) return "Manufacturer";
  if (
    url.includes("army.mil") ||
    url.includes("defense.gov") ||
    url.includes("war.gov") ||
    url.includes("gov.uk") ||
    url.includes("mod.gov.ua") ||
    url.includes("defense.gouv.fr") ||
    url.includes("nato.int") ||
    url.includes("natogva.org") ||
    url.includes("dau.edu") ||
    url.includes("dla.mil") ||
    url.includes("dsca.mil") ||
    url.includes("eda.europa.eu")
  ) return "Official";
  if (url.includes("rusi.org") || url.includes("csis.org") || url.includes("iiss.org") || url.includes("sipri.org")) return "Think Tank";
  if (url.includes("commons.wikimedia.org") || url.includes("wikimedia.org")) return "OSINT";
  if (url.includes("apnews.com") || url.includes("kyivpost.com") || url.includes("armyrecognition.com") || url.includes("rferl.org") || url.includes("bellingcat.com")) return "News";
  return "Other";
}

function confidenceLabel(score: number) {
  if (score >= 82) return "High";
  if (score >= 68) return "Medium";
  return "Low";
}

function confidenceClass(score: number) {
  return confidenceLabel(score).toLowerCase();
}

function getDataReadiness(equipment: Equipment, variantCount: number) {
  const reasons: string[] = [];
  if (equipment.sourceConfidenceScore < 68) reasons.push("출처 신뢰도 낮음");
  if (equipment.sources.length < 2) reasons.push("공개 출처 2건 미만");
  if (variantCount === 0) reasons.push("계열 데이터 없음");
  return {
    status: reasons.length ? "needs-review" : "ready",
    label: reasons.length ? "보강 필요" : "검증 양호",
    reasons
  } as const;
}

function latestSourceCheckDate(equipment: Equipment) {
  const checkedDates = equipment.sources.map((source) => source.checkedAt).sort();
  return checkedDates.length ? checkedDates[checkedDates.length - 1] : equipment.lastUpdated;
}

function getSourceFreshness(checkedAt: string) {
  const checkedTime = new Date(`${checkedAt}T00:00:00Z`).getTime();
  const ageDays = Number.isFinite(checkedTime) ? Math.floor((Date.now() - checkedTime) / 86_400_000) : Number.POSITIVE_INFINITY;
  return {
    status: ageDays > 180 ? "stale" : "current",
    label: ageDays > 180 ? "재확인 필요" : "최근 확인",
    ageDays
  } as const;
}

function normalizeSearchText(value: string) {
  return value.trim().toLowerCase();
}

function uniqueSorted(values: string[]) {
  return Array.from(new Set(values.filter(Boolean))).sort((a, b) => a.localeCompare(b, "ko"));
}

function isEquipmentFamily(value: string | null): value is EquipmentFamily {
  return value === "all" || value === "wheeled" || value === "tracked";
}

function isEquipmentCategory(value: string | null): value is EquipmentCategory | "all" {
  return Boolean(value && value in categoryLabels);
}

function isCatalogSortMode(value: string | null): value is CatalogSortMode {
  return Boolean(value && sortOptions.some((option) => option.value === value));
}

function isDataStatusFilter(value: string | null): value is DataStatusFilter {
  return value === "all" || Boolean(value && dataStatusOptions.some((option) => option.value === value));
}

function isCatalogPath(path: string) {
  return path === "/" || path === "/equipment" || path === "/compare";
}

function readCatalogStateFromLocation(): CatalogUrlState {
  const params = new URLSearchParams(window.location.search);
  const family = params.get("family");
  const category = params.get("category");
  const sort = params.get("sort");
  const dataStatus = params.get("data");
  return {
    family: isEquipmentFamily(family) ? family : "all",
    category: isEquipmentCategory(category) ? category : "all",
    filters: {
      role: params.get("role") || "all",
      country: params.get("country") || "all",
      status: params.get("status") || "all",
      variantMaturity: params.get("maturity") || "all",
      confidence: params.get("confidence") || "all",
      casePresence: params.get("cases") || "all",
      dataStatus: isDataStatusFilter(dataStatus) ? dataStatus : "all"
    },
    sortMode: isCatalogSortMode(sort) ? sort : defaultCatalogSortMode,
    query: params.get("q") || "",
    selectedId: params.get("eq") || defaultSelectedEquipmentId
  };
}

function buildCatalogHref(path: string, state: CatalogUrlState) {
  const params = new URLSearchParams();
  if (state.query.trim()) params.set("q", state.query.trim());
  if (state.family !== "all") params.set("family", state.family);
  if (state.category !== "all") params.set("category", state.category);
  if (state.filters.role !== "all") params.set("role", state.filters.role);
  if (state.filters.country !== "all") params.set("country", state.filters.country);
  if (state.filters.status !== "all") params.set("status", state.filters.status);
  if (state.filters.variantMaturity !== "all") params.set("maturity", state.filters.variantMaturity);
  if (state.filters.confidence !== "all") params.set("confidence", state.filters.confidence);
  if (state.filters.casePresence !== "all") params.set("cases", state.filters.casePresence);
  if (state.filters.dataStatus !== "all") params.set("data", state.filters.dataStatus);
  if (state.sortMode !== defaultCatalogSortMode) params.set("sort", state.sortMode);
  if (state.selectedId !== defaultSelectedEquipmentId) params.set("eq", state.selectedId);
  const query = params.toString();
  return `${routeHref(path)}${query ? `?${query}` : ""}`;
}

function escapeCsv(value: string | number) {
  const text = String(value);
  return `"${text.replace(/"/g, "\"\"")}"`;
}

function getVariantCountByEquipment(variants: EquipmentVariant[]) {
  return variants.reduce<Record<string, number>>((accumulator, variant) => {
    accumulator[variant.equipmentId] = (accumulator[variant.equipmentId] ?? 0) + 1;
    return accumulator;
  }, {});
}

function compareCatalogEquipment(a: Equipment, b: Equipment, sortMode: CatalogSortMode, variantCountByEquipment: Record<string, number>) {
  const byName = () => a.name.localeCompare(b.name);
  if (sortMode === "confidence-desc") return b.sourceConfidenceScore - a.sourceConfidenceScore || byName();
  if (sortMode === "cases-desc") return b.battlefieldCaseIds.length - a.battlefieldCaseIds.length || byName();
  if (sortMode === "variants-desc") return (variantCountByEquipment[b.id] ?? 0) - (variantCountByEquipment[a.id] ?? 0) || byName();
  if (sortMode === "updated-desc") return latestSourceCheckDate(b).localeCompare(latestSourceCheckDate(a)) || byName();
  return 0;
}

function buildResultSummary(equipmentList: Equipment[], variants: EquipmentVariant[]) {
  const variantCountByEquipment = getVariantCountByEquipment(variants);
  const rows = equipmentList.map((item, index) => {
    const variantCount = variantCountByEquipment[item.id] ?? 0;
    const readiness = getDataReadiness(item, variantCount);
    return `${index + 1}. ${item.name} | ${categoryLabels[item.category]} | ${item.originCountry} | ${item.roleTags.slice(0, 3).join(", ")} | 계열 ${variantCount}건 | 전장 사례 ${item.battlefieldCaseIds.length}건 | 데이터 ${readiness.label}${readiness.reasons.length ? `(${readiness.reasons.join("; ")})` : ""} | 출처 ${confidenceLabel(item.sourceConfidenceScore)} ${item.sourceConfidenceScore} | 확인 ${latestSourceCheckDate(item)}`;
  });
  return [`장비 검색 결과 ${equipmentList.length}건`, ...rows].join("\n");
}

function buildEquipmentCsv(equipmentList: Equipment[], variants: EquipmentVariant[]) {
  const variantCountByEquipment = getVariantCountByEquipment(variants);
  const headers = ["장비명", "분류", "국가", "원산국", "제조사", "운용 상태", "임무 태그", "계열 수", "전장 사례 수", "데이터 상태", "보강 사유", "출처 신뢰도", "출처 등급", "최근 확인일", "출처 수", "상세 ID"];
  const rows = equipmentList.map((item) => {
    const variantCount = variantCountByEquipment[item.id] ?? 0;
    const readiness = getDataReadiness(item, variantCount);
    return [
      item.name,
      categoryLabels[item.category],
      item.country,
      item.originCountry,
      item.manufacturer,
      item.status,
      item.roleTags.join(" / "),
      variantCount,
      item.battlefieldCaseIds.length,
      readiness.label,
      readiness.reasons.join(" / "),
      item.sourceConfidenceScore,
      confidenceLabel(item.sourceConfidenceScore),
      latestSourceCheckDate(item),
      item.sources.length,
      item.id
    ];
  });
  return [
    headers.map(escapeCsv).join(","),
    ...rows.map((row) => row.map(escapeCsv).join(","))
  ].join("\r\n");
}

function buildSourceSummary(sources: Array<{ title: string; url: string; type: string; checkedAt: string }>) {
  const rows = sources.map((source, index) => {
    const freshness = getSourceFreshness(source.checkedAt);
    return `${index + 1}. ${source.title} | ${source.type} | ${freshness.label} | 확인 ${source.checkedAt} | ${source.url}`;
  });
  return [`출처 인덱스 결과 ${sources.length}건`, ...rows].join("\n");
}

function buildSourceCsv(sources: Array<{ title: string; url: string; type: string; checkedAt: string }>) {
  const headers = ["제목", "유형", "확인일", "확인 상태", "URL"];
  const rows = sources.map((source) => {
    const freshness = getSourceFreshness(source.checkedAt);
    return [source.title, source.type, source.checkedAt, freshness.label, source.url];
  });
  return [
    headers.map(escapeCsv).join(","),
    ...rows.map((row) => row.map(escapeCsv).join(","))
  ].join("\r\n");
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
  const [initialCatalogState] = useState(() => readCatalogStateFromLocation());
  const [data, setData] = useState<AppData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [path, setPath] = useState(() => normalizeRoute(window.location.pathname));
  const [family, setFamily] = useState<EquipmentFamily>(initialCatalogState.family);
  const [category, setCategory] = useState<EquipmentCategory | "all">(initialCatalogState.category);
  const [catalogFilters, setCatalogFilters] = useState<CatalogFilters>(initialCatalogState.filters);
  const [sortMode, setSortMode] = useState<CatalogSortMode>(initialCatalogState.sortMode);
  const [query, setQuery] = useState(initialCatalogState.query);
  const [selectedId, setSelectedId] = useState(initialCatalogState.selectedId);
  const [selectedIncidentId, setSelectedIncidentId] = useState<string | null>(null);
  const [selectedComponent, setSelectedComponent] = useState<ComponentSpec | null>(null);
  const [shareStatus, setShareStatus] = useState("");
  const [exportStatus, setExportStatus] = useState("");

  useEffect(() => {
    loadAppData().then(setData).catch((reason: unknown) => {
      setError(reason instanceof Error ? reason.message : "데이터를 불러오지 못했습니다.");
    });
  }, []);

  useEffect(() => {
    const onPopState = () => {
      const nextCatalogState = readCatalogStateFromLocation();
      setPath(normalizeRoute(window.location.pathname));
      setFamily(nextCatalogState.family);
      setCategory(nextCatalogState.category);
      setCatalogFilters(nextCatalogState.filters);
      setSortMode(nextCatalogState.sortMode);
      setQuery(nextCatalogState.query);
      setSelectedId(nextCatalogState.selectedId);
    };
    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, []);

  useEffect(() => {
    if (!isCatalogPath(path)) return;
    const catalogPath = path === "/equipment" ? "/equipment" : "/";
    const nextHref = buildCatalogHref(catalogPath, {
      family,
      category,
      filters: catalogFilters,
      sortMode,
      query,
      selectedId
    });
    const currentHref = `${window.location.pathname}${window.location.search}`;
    if (currentHref !== nextHref) {
      window.history.replaceState(null, "", nextHref);
    }
  }, [catalogFilters, category, family, path, query, selectedId, sortMode]);

  const filteredEquipment = useMemo(() => {
    if (!data) return [];
    const normalizedQuery = normalizeSearchText(query);
    const variantCountByEquipment = getVariantCountByEquipment(data.variants);
    return data.equipment.filter((item) => {
      const itemVariants = data.variants.filter((variant) => variant.equipmentId === item.id);
      const matchesFamily =
        family === "all" ||
        (family === "wheeled" && familyCategories.wheeled.includes(item.category)) ||
        (family === "tracked" && familyCategories.tracked.includes(item.category));
      const matchesCategory = category === "all" || item.category === category;
      const matchesRole =
        catalogFilters.role === "all" ||
        item.roleTags.includes(catalogFilters.role) ||
        itemVariants.some((variant) =>
          [variant.role, variant.nameKo, variant.armament].some((value) => value.includes(catalogFilters.role))
        );
      const matchesCountry =
        catalogFilters.country === "all" ||
        item.country.includes(catalogFilters.country) ||
        item.originCountry.includes(catalogFilters.country) ||
        item.operatorCountries.some((countryName) => countryName.includes(catalogFilters.country));
      const matchesStatus = catalogFilters.status === "all" || item.status === catalogFilters.status;
      const matchesVariantMaturity =
        catalogFilters.variantMaturity === "all" ||
        itemVariants.some((variant) => variant.maturity === catalogFilters.variantMaturity);
      const matchesConfidence =
        catalogFilters.confidence === "all" ||
        confidenceLabel(item.sourceConfidenceScore) === catalogFilters.confidence;
      const matchesCasePresence =
        catalogFilters.casePresence === "all" ||
        (catalogFilters.casePresence === "with-cases" && item.battlefieldCaseIds.length > 0) ||
        (catalogFilters.casePresence === "without-cases" && item.battlefieldCaseIds.length === 0);
      const matchesDataStatus =
        catalogFilters.dataStatus === "all" ||
        getDataReadiness(item, variantCountByEquipment[item.id] ?? 0).status === catalogFilters.dataStatus;
      const searchable = [
        item.name,
        item.country,
        item.originCountry,
        item.manufacturer,
        item.operatorCountries.join(" "),
        item.aliases.join(" "),
        item.roleTags.join(" "),
        item.status,
        item.summaryKo,
        itemVariants.map((variant) => `${variant.nameKo} ${variant.role} ${variant.armament} ${variant.maturity}`).join(" ")
      ].join(" ").toLowerCase();
      const matchesQuery = !normalizedQuery || searchable.includes(normalizedQuery);
      return matchesFamily && matchesCategory && matchesRole && matchesCountry && matchesStatus && matchesVariantMaturity && matchesConfidence && matchesCasePresence && matchesDataStatus && matchesQuery;
    }).sort((a, b) => compareCatalogEquipment(a, b, sortMode, variantCountByEquipment));
  }, [catalogFilters, category, data, family, query, sortMode]);

  const availableCategoryKeys = useMemo(() => {
    if (family === "all") return Object.keys(categoryLabels) as Array<EquipmentCategory | "all">;
    return ["all", ...familyCategories[family]] as Array<EquipmentCategory | "all">;
  }, [family]);

  const filterOptions = useMemo<FilterOptions>(() => {
    if (!data) return { roles: [], countries: [], statuses: [], variantMaturities: [] };
    return {
      roles: uniqueSorted([
        ...data.equipment.flatMap((item) => item.roleTags),
        ...data.variants.map((variant) => variant.role)
      ]),
      countries: uniqueSorted(data.equipment.flatMap((item) => [item.country, item.originCountry, ...item.operatorCountries])),
      statuses: uniqueSorted(data.equipment.map((item) => item.status)),
      variantMaturities: uniqueSorted(data.variants.map((variant) => variant.maturity))
    };
  }, [data]);

  function navigate(nextPath: string) {
    window.history.pushState(null, "", routeHref(nextPath));
    setPath(nextPath);
  }

  function selectEquipment(id: string) {
    setSelectedId(id);
    setSelectedComponent(null);
  }

  function applyCatalogPreset(preset: CatalogPreset) {
    setFamily(preset.family ?? "all");
    setCategory(preset.category ?? "all");
    setCatalogFilters({ ...defaultCatalogFilters, ...preset.filters });
    setSortMode(preset.sortMode ?? defaultCatalogSortMode);
    setQuery(preset.query ?? "");
    setSelectedComponent(null);
    setShareStatus("");
    setExportStatus("");
  }

  async function copySearchLink() {
    const catalogPath = path === "/equipment" ? "/equipment" : "/";
    const href = buildCatalogHref(catalogPath, {
      family,
      category,
      filters: catalogFilters,
      sortMode,
      query,
      selectedId
    });
    const fullUrl = new URL(href, window.location.origin).href;
    try {
      await navigator.clipboard.writeText(fullUrl);
      setShareStatus("검색 링크 복사됨");
    } catch {
      setShareStatus("브라우저에서 URL을 직접 복사하세요");
    }
    window.setTimeout(() => setShareStatus(""), 2200);
  }

  async function copyFilteredResults() {
    const summary = buildResultSummary(filteredEquipment, data?.variants ?? []);
    try {
      await navigator.clipboard.writeText(summary);
      setExportStatus("검색 결과 요약 복사됨");
    } catch {
      setExportStatus("브라우저에서 복사를 허용하지 않았습니다");
    }
    window.setTimeout(() => setExportStatus(""), 2200);
  }

  function downloadFilteredCsv() {
    const csv = `\uFEFF${buildEquipmentCsv(filteredEquipment, data?.variants ?? [])}`;
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "equipment-search-results.csv";
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
    setExportStatus("CSV 다운로드 준비됨");
    window.setTimeout(() => setExportStatus(""), 2200);
  }

  if (error) {
    return <main className="state-page">데이터 오류: {error}</main>;
  }

  if (!data) {
    return <main className="state-page">장비 데이터를 불러오는 중입니다.</main>;
  }

  const selectedEquipment = data.equipment.find((item) => item.id === selectedId) ?? data.equipment[0];
  const selectedIncident = data.incidents.find((incident) => incident.id === selectedIncidentId) ?? null;
  const relatedIncidents = data.incidents.filter((incident) => incident.equipmentIds.includes(selectedEquipment.id));
  const relatedComponents = data.components.filter((component) => component.equipmentId === selectedEquipment.id);
  const relatedVariants = data.variants.filter((variant) => variant.equipmentId === selectedEquipment.id);
  const relatedTechnologies = data.technologies.filter((technology) => technology.relatedEquipmentIds.includes(selectedEquipment.id));

  const equipmentPathMatch = path.match(/^\/equipment\/([^/]+)$/);
  const routeSelectedEquipment = equipmentPathMatch
    ? data.equipment.find((item) => item.id === equipmentPathMatch[1]) ?? selectedEquipment
    : selectedEquipment;
  const routeVariants = data.variants.filter((variant) => variant.equipmentId === routeSelectedEquipment.id);
  const routeIncidents = data.incidents.filter((incident) => incident.equipmentIds.includes(routeSelectedEquipment.id));
  const routeComponents = data.components.filter((component) => component.equipmentId === routeSelectedEquipment.id);
  const routeTechnologies = data.technologies.filter((technology) => technology.relatedEquipmentIds.includes(routeSelectedEquipment.id));

  const uniqueSources = buildSourceIndex(data);
  const isInsightsPath = ["/insights", "/development", "/technologies", "/cases"].includes(path);
  const isSourcesPath = path === "/sources";

  function isNavActive(itemPath: string) {
    if (itemPath === "/insights") return isInsightsPath;
    if (itemPath === "/sources") return isSourcesPath;
    if (itemPath === "/equipment") return path === "/equipment" || Boolean(equipmentPathMatch);
    return path === "/" || path === "/compare";
  }

  return (
    <main className="app-shell">
      <nav className="site-nav" aria-label="주요 메뉴">
        {navItems.map((item) => (
          <button key={item.path} className={isNavActive(item.path) ? "active" : ""} type="button" onClick={() => navigate(item.path)}>
            {item.label}
          </button>
        ))}
      </nav>

      <header className="topbar">
        <div>
          <p className="eyebrow">Global equipment catalog</p>
          <h1>전 세계 지상 장비 검색</h1>
          <p className="hero-subtitle">팀원이 필요한 장비를 빠르게 찾고 제원, 계열차량, 전장 사례, 공개 출처를 한 화면에서 확인하는 검색 중심 카탈로그입니다.</p>
        </div>
        <div className="kpi-strip" aria-label="자료 현황">
          <div><strong>{data.equipment.length}</strong><span>장비</span></div>
          <div><strong>{data.variants.length}</strong><span>계열/파생형</span></div>
          <div><strong>{data.incidents.length}</strong><span>전장 사례</span></div>
          <div><strong>{uniqueSources.length}</strong><span>공개 출처</span></div>
        </div>
      </header>

      {isInsightsPath ? (
        <FieldInsightsPage
          technologies={data.technologies}
          cases={data.caseStudies}
          developmentLens={data.developmentLens}
          references={data.engineeringReferences}
          equipment={data.equipment}
          onEquipmentSelect={(id) => {
            selectEquipment(id);
            navigate(`/equipment/${id}`);
          }}
        />
      ) : isSourcesPath ? (
        <SourceIndexPage sources={uniqueSources} equipment={data.equipment} />
      ) : equipmentPathMatch ? (
        <EquipmentDetailPage
          equipment={routeSelectedEquipment}
          variants={routeVariants}
          incidents={routeIncidents}
          components={routeComponents}
          technologies={routeTechnologies}
          equipmentList={data.equipment}
          onComponentSelect={setSelectedComponent}
          onEquipmentOpen={(id) => {
            selectEquipment(id);
            navigate(`/equipment/${id}`);
          }}
        />
      ) : (
        <CatalogPage
          equipment={data.equipment}
          filteredEquipment={filteredEquipment}
          selectedEquipment={selectedEquipment}
          incidents={data.incidents}
          selectedIncident={selectedIncident}
          relatedIncidents={relatedIncidents}
          relatedVariants={relatedVariants}
          relatedComponents={relatedComponents}
          relatedTechnologies={relatedTechnologies}
          variants={data.variants}
          family={family}
          category={category}
          filters={catalogFilters}
          sortMode={sortMode}
          filterOptions={filterOptions}
          query={query}
          shareStatus={shareStatus}
          exportStatus={exportStatus}
          availableCategoryKeys={availableCategoryKeys}
          sources={uniqueSources}
          onFamilyChange={(nextFamily) => {
            setFamily(nextFamily);
            setCategory("all");
          }}
          onCategoryChange={setCategory}
          onFilterChange={(key, value) => setCatalogFilters((current) => ({ ...current, [key]: value }))}
          onSortChange={setSortMode}
          onResetFilters={() => {
            setFamily("all");
            setCategory("all");
            setCatalogFilters(defaultCatalogFilters);
            setSortMode(defaultCatalogSortMode);
            setQuery("");
          }}
          onApplyPreset={applyCatalogPreset}
          onShareSearch={copySearchLink}
          onCopyResults={copyFilteredResults}
          onDownloadCsv={downloadFilteredCsv}
          onQueryChange={setQuery}
          onEquipmentSelect={selectEquipment}
          onEquipmentOpen={(id) => navigate(`/equipment/${id}`)}
          onIncidentSelect={setSelectedIncidentId}
          onComponentSelect={setSelectedComponent}
        />
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

function buildSourceIndex(data: AppData) {
  const uniqueSources = new Map<string, { title: string; url: string; type: string; checkedAt: string }>();
  const addSource = (source: { title: string; url: string; checkedAt: string }) => {
    uniqueSources.set(source.url, {
      title: source.title,
      url: source.url,
      type: inferSourceType(source.url),
      checkedAt: source.checkedAt
    });
  };

  data.equipment.forEach((item) => item.sources.forEach(addSource));
  data.components.forEach((item) => item.sources.forEach(addSource));
  data.technologies.forEach((item) => item.sources.forEach(addSource));
  data.developmentLens.forEach((item) => item.sources.forEach(addSource));
  data.engineeringReferences.forEach((reference) => {
    uniqueSources.set(reference.url, {
      title: reference.titleKo,
      url: reference.url,
      type: inferSourceType(reference.url),
      checkedAt: reference.checkedAt
    });
  });

  return Array.from(uniqueSources.values()).sort((a, b) => a.type.localeCompare(b.type) || a.title.localeCompare(b.title));
}

function CatalogPage({
  equipment,
  filteredEquipment,
  selectedEquipment,
  incidents,
  selectedIncident,
  relatedIncidents,
  relatedVariants,
  relatedComponents,
  relatedTechnologies,
  variants,
  family,
  category,
  filters,
  sortMode,
  filterOptions,
  query,
  shareStatus,
  exportStatus,
  availableCategoryKeys,
  sources,
  onFamilyChange,
  onCategoryChange,
  onFilterChange,
  onSortChange,
  onResetFilters,
  onApplyPreset,
  onShareSearch,
  onCopyResults,
  onDownloadCsv,
  onQueryChange,
  onEquipmentSelect,
  onEquipmentOpen,
  onIncidentSelect,
  onComponentSelect
}: {
  equipment: Equipment[];
  filteredEquipment: Equipment[];
  selectedEquipment: Equipment;
  incidents: BattlefieldCase[];
  selectedIncident: BattlefieldCase | null;
  relatedIncidents: BattlefieldCase[];
  relatedVariants: EquipmentVariant[];
  relatedComponents: ComponentSpec[];
  relatedTechnologies: BattlefieldTechnology[];
  variants: EquipmentVariant[];
  family: EquipmentFamily;
  category: EquipmentCategory | "all";
  filters: CatalogFilters;
  sortMode: CatalogSortMode;
  filterOptions: FilterOptions;
  query: string;
  shareStatus: string;
  exportStatus: string;
  availableCategoryKeys: Array<EquipmentCategory | "all">;
  sources: Array<{ title: string; url: string; type: string; checkedAt: string }>;
  onFamilyChange: (family: EquipmentFamily) => void;
  onCategoryChange: (category: EquipmentCategory | "all") => void;
  onFilterChange: (key: keyof CatalogFilters, value: string) => void;
  onSortChange: (sortMode: CatalogSortMode) => void;
  onResetFilters: () => void;
  onApplyPreset: (preset: CatalogPreset) => void;
  onShareSearch: () => void;
  onCopyResults: () => void;
  onDownloadCsv: () => void;
  onQueryChange: (query: string) => void;
  onEquipmentSelect: (id: string) => void;
  onEquipmentOpen: (id: string) => void;
  onIncidentSelect: (id: string) => void;
  onComponentSelect: (component: ComponentSpec) => void;
}) {
  const activeFilterCount = [
    family !== "all",
    category !== "all",
    filters.role !== "all",
    filters.country !== "all",
    filters.status !== "all",
    filters.variantMaturity !== "all",
    filters.confidence !== "all",
    filters.casePresence !== "all",
    filters.dataStatus !== "all",
    sortMode !== defaultCatalogSortMode,
    query.trim().length > 0
  ].filter(Boolean).length;
  const variantCountByEquipment = variants.reduce<Record<string, number>>((accumulator, variant) => {
    accumulator[variant.equipmentId] = (accumulator[variant.equipmentId] ?? 0) + 1;
    return accumulator;
  }, {});

  return (
    <>
      <CatalogOverview equipment={equipment} variantsCount={relatedVariants.length} incidents={incidents} sources={sources} />
      <section className="dashboard-grid catalog-grid">
        <aside className="equipment-rail" aria-label="장비 목록">
          <div className="rail-header">
            <div>
              <p className="eyebrow">Equipment index</p>
              <h2>장비 검색</h2>
            </div>
            <span>{filteredEquipment.length}건</span>
          </div>
          <label className="search-box">
            <span>모델, 국가, 제조사 검색</span>
            <input
              type="search"
              value={query}
              onChange={(event) => onQueryChange(event.target.value)}
              placeholder="예: Leopard, Patria, Germany"
            />
          </label>
          <div className="catalog-preset-grid" aria-label="업무 검색 프리셋">
            {catalogPresets.map((preset) => (
              <button key={preset.id} type="button" onClick={() => onApplyPreset(preset)}>
                <strong>{preset.label}</strong>
                <span>{preset.description}</span>
              </button>
            ))}
          </div>
          <div className="family-tabs">
            {(Object.keys(familyLabels) as EquipmentFamily[]).map((key) => (
              <button key={key} className={family === key ? "active" : ""} type="button" onClick={() => onFamilyChange(key)}>
                {familyLabels[key]}
              </button>
            ))}
          </div>
          <div className="segmented-control">
            {availableCategoryKeys.map((key) => (
              <button key={key} className={category === key ? "active" : ""} type="button" onClick={() => onCategoryChange(key)}>
                {categoryLabels[key]}
              </button>
            ))}
          </div>
          <div className="filter-grid" aria-label="세부 검색 필터">
            <label>
              <span>임무/파생형</span>
              <select value={filters.role} onChange={(event) => onFilterChange("role", event.target.value)}>
                <option value="all">전체 임무</option>
                {filterOptions.roles.map((role) => <option key={role} value={role}>{role}</option>)}
              </select>
            </label>
            <label>
              <span>국가</span>
              <select value={filters.country} onChange={(event) => onFilterChange("country", event.target.value)}>
                <option value="all">전체 국가</option>
                {filterOptions.countries.map((country) => <option key={country} value={country}>{country}</option>)}
              </select>
            </label>
            <label>
              <span>운용 상태</span>
              <select value={filters.status} onChange={(event) => onFilterChange("status", event.target.value)}>
                <option value="all">전체 상태</option>
                {filterOptions.statuses.map((status) => <option key={status} value={status}>{status}</option>)}
              </select>
            </label>
            <label>
              <span>계열 성숙도</span>
              <select value={filters.variantMaturity} onChange={(event) => onFilterChange("variantMaturity", event.target.value)}>
                <option value="all">전체 성숙도</option>
                {filterOptions.variantMaturities.map((maturity) => <option key={maturity} value={maturity}>{maturity}</option>)}
              </select>
            </label>
            <label>
              <span>출처 신뢰도</span>
              <select value={filters.confidence} onChange={(event) => onFilterChange("confidence", event.target.value)}>
                <option value="all">전체 신뢰도</option>
                {confidenceOptions.map((confidence) => <option key={confidence} value={confidence}>{confidence}</option>)}
              </select>
            </label>
            <label>
              <span>전장 사례</span>
              <select value={filters.casePresence} onChange={(event) => onFilterChange("casePresence", event.target.value)}>
                <option value="all">전체 사례</option>
                {casePresenceOptions.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
              </select>
            </label>
            <label>
              <span>데이터 상태</span>
              <select value={filters.dataStatus} onChange={(event) => onFilterChange("dataStatus", event.target.value)}>
                <option value="all">전체 상태</option>
                {dataStatusOptions.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
              </select>
            </label>
            <label>
              <span>정렬 기준</span>
              <select value={sortMode} onChange={(event) => onSortChange(event.target.value as CatalogSortMode)}>
                {sortOptions.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
              </select>
            </label>
          </div>
          <div className="active-filter-bar">
            <span>{activeFilterCount ? `${activeFilterCount}개 조건 적용` : "필터 없음"}</span>
            <div className="active-filter-actions">
              <button type="button" onClick={onResetFilters}>초기화</button>
              <button className="share-search-button" type="button" onClick={onShareSearch}>검색 링크 복사</button>
            </div>
          </div>
          {shareStatus ? <p className="share-status" role="status">{shareStatus}</p> : null}
          <div className="result-action-grid" aria-label="검색 결과 내보내기">
            <button type="button" onClick={onCopyResults}>결과 요약 복사</button>
            <button type="button" onClick={onDownloadCsv}>CSV 다운로드</button>
          </div>
          {exportStatus ? <p className="share-status" role="status">{exportStatus}</p> : null}
          <div className="equipment-list">
            {filteredEquipment.map((item) => {
              const variantCount = variantCountByEquipment[item.id] ?? 0;
              const sourceCheckDate = latestSourceCheckDate(item);
              const readiness = getDataReadiness(item, variantCount);
              return (
                <button
                  key={item.id}
                  type="button"
                  className={`equipment-row ${item.id === selectedEquipment.id ? "active" : ""}`}
                  onClick={() => onEquipmentSelect(item.id)}
                  onDoubleClick={() => onEquipmentOpen(item.id)}
                >
                  <span className="equipment-row-heading">
                    <strong>{item.name}</strong>
                    <span className="equipment-row-badges">
                      <b className={`trust-pill ${confidenceClass(item.sourceConfidenceScore)}`}>
                        출처 {confidenceLabel(item.sourceConfidenceScore)} {item.sourceConfidenceScore}
                      </b>
                      <b className={`data-readiness-pill ${readiness.status}`}>
                        {readiness.label}
                      </b>
                    </span>
                  </span>
                  <small>{item.country} · {categoryLabels[item.category]}</small>
                  <em>{item.roleTags.slice(0, 3).join(" / ")} · 계열 {variantCount}건</em>
                  <span className="equipment-metric-strip" aria-label={`${item.name} 핵심 지표`}>
                    <span><b>{item.operatorCountries.length}</b><small>운용국</small></span>
                    <span><b>{variantCount}</b><small>계열</small></span>
                    <span><b>{item.battlefieldCaseIds.length}</b><small>전장 사례</small></span>
                    <span><b>{item.sources.length}</b><small>출처</small></span>
                  </span>
                  <small className="source-quickline">
                    공개 출처 {item.sources.length}건 · 최근 확인 {sourceCheckDate}
                    {readiness.reasons.length ? ` · ${readiness.reasons.join(" / ")}` : ""}
                  </small>
                </button>
              );
            })}
            {!filteredEquipment.length ? <p className="empty-state">검색 조건에 맞는 장비가 없습니다.</p> : null}
          </div>
        </aside>

        <section className="map-panel catalog-map">
          <EquipmentMap
            incidents={incidents}
            selectedEquipmentId={selectedEquipment.id}
            selectedIncident={selectedIncident}
            onIncidentSelect={onIncidentSelect}
            onEquipmentSelect={onEquipmentSelect}
          />
        </section>

        <CatalogQuickFacts equipment={selectedEquipment} variants={relatedVariants} incidents={relatedIncidents} technologies={relatedTechnologies} onOpen={onEquipmentOpen} />
      </section>

      <section className="detail-grid">
        <EquipmentDetail equipment={selectedEquipment} incidents={relatedIncidents} variants={relatedVariants} />
        <ComponentSpecPanel equipment={selectedEquipment} components={relatedComponents} onComponentSelect={onComponentSelect} />
      </section>

      <BattlefieldLens equipment={selectedEquipment} variants={relatedVariants} technologies={relatedTechnologies} />
    </>
  );
}

function CatalogOverview({ equipment, incidents, sources }: {
  equipment: Equipment[];
  variantsCount: number;
  incidents: BattlefieldCase[];
  sources: Array<{ title: string; url: string; type: string; checkedAt: string }>;
}) {
  const categoryCount = new Set(equipment.map((item) => item.category)).size;
  const countryCount = new Set(equipment.flatMap((item) => [item.originCountry, ...item.operatorCountries])).size;
  return (
    <section className="catalog-overview">
      <div>
        <p className="eyebrow">Search-first catalog</p>
        <h2>찾고, 좁히고, 근거를 확인하는 장비 데이터베이스</h2>
        <p>현재 수록 데이터는 시작점이며, 같은 JSON 구조로 국가와 장비를 계속 확장할 수 있습니다. 공개 출처와 계열차량 정보를 기준으로 검색 품질을 계속 강화합니다.</p>
      </div>
      <div className="catalog-stat-grid">
        <span><strong>{equipment.length}</strong>장비</span>
        <span><strong>{categoryCount}</strong>분류</span>
        <span><strong>{countryCount}</strong>관련 국가</span>
        <span><strong>{incidents.length}</strong>사례</span>
        <span><strong>{sources.length}</strong>출처</span>
      </div>
    </section>
  );
}

function CatalogQuickFacts({ equipment, variants, incidents, technologies, onOpen }: {
  equipment: Equipment;
  variants: EquipmentVariant[];
  incidents: BattlefieldCase[];
  technologies: BattlefieldTechnology[];
  onOpen: (id: string) => void;
}) {
  return (
    <aside className="trend-panel catalog-summary-panel">
      <div className="panel-title">
        <div>
          <p className="eyebrow">Selected equipment</p>
          <h2>{equipment.name}</h2>
        </div>
        <span>{confidenceLabel(equipment.sourceConfidenceScore)}</span>
      </div>
      <p className="summary">{equipment.summaryKo}</p>
      <dl className="catalog-fact-list">
        <div><dt>분류</dt><dd>{categoryLabels[equipment.category]}</dd></div>
        <div><dt>원산국</dt><dd>{equipment.originCountry}</dd></div>
        <div><dt>제조사</dt><dd>{equipment.manufacturer}</dd></div>
        <div><dt>출처 신뢰도</dt><dd>{confidenceLabel(equipment.sourceConfidenceScore)} {equipment.sourceConfidenceScore}</dd></div>
        <div><dt>최근 확인</dt><dd>{latestSourceCheckDate(equipment)}</dd></div>
        <div><dt>공개 출처</dt><dd>{equipment.sources.length}건</dd></div>
        <div><dt>계열/파생형</dt><dd>{variants.length}건</dd></div>
        <div><dt>전장 사례</dt><dd>{incidents.length}건</dd></div>
        <div><dt>연계 기술</dt><dd>{technologies.length}건</dd></div>
      </dl>
      <button className="primary-action" type="button" onClick={() => onOpen(equipment.id)}>
        상세 페이지 열기
      </button>
    </aside>
  );
}

function EquipmentDetailPage({ equipment, variants, incidents, components, technologies, equipmentList, onComponentSelect, onEquipmentOpen }: {
  equipment: Equipment;
  variants: EquipmentVariant[];
  incidents: BattlefieldCase[];
  components: ComponentSpec[];
  technologies: BattlefieldTechnology[];
  equipmentList: Equipment[];
  onComponentSelect: (component: ComponentSpec) => void;
  onEquipmentOpen: (id: string) => void;
}) {
  return (
    <>
      <EquipmentHero equipment={equipment} variants={variants} />
      <section className="detail-grid">
        <EquipmentDetail equipment={equipment} incidents={incidents} variants={variants} />
        <ComponentSpecPanel equipment={equipment} components={components} onComponentSelect={onComponentSelect} />
      </section>
      <BattlefieldLens equipment={equipment} variants={variants} technologies={technologies} />
      <ComparableVehicles equipment={equipment} equipmentList={equipmentList} onSelect={onEquipmentOpen} />
      <SourcePanel equipment={equipment} />
    </>
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
          <span>{variants.length}개 계열</span>
        </div>
      </div>
      <div className="hero-score-stack">
        <ScoreBar label="현대화 잠재력" value={equipment.modernizationPotential} reason="계열 확장성, 센서 통합, 공개 현대화 흐름을 종합한 참고 지표입니다." />
        <ScoreBar label="출처 신뢰도" value={equipment.sourceConfidenceScore} reason={equipment.confidenceSummary} />
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
        <h2>유사 장비</h2>
        <span>{comparable.length}건</span>
      </div>
      <div className="comparable-grid">
        {comparable.map((item) => (
          <button key={item.id} type="button" onClick={() => onSelect(item.id)}>
            <strong>{item.name}</strong>
            <span>{item.roleTags.join(" / ")}</span>
            <ScoreBar label="전장 적응 지표" value={Math.round((item.droneThreatPressure + item.fieldModificationSensitivity) / 2)} />
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
        <h2>공개 출처</h2>
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

function FieldInsightsPage({ technologies, cases, developmentLens, references, equipment, onEquipmentSelect }: {
  technologies: BattlefieldTechnology[];
  cases: BattlefieldCaseStudy[];
  developmentLens: DevelopmentLensItem[];
  references: EngineeringReference[];
  equipment: Equipment[];
  onEquipmentSelect: (id: string) => void;
}) {
  return (
    <section className="insights-page">
      <div className="section-heading">
        <div>
          <p className="eyebrow">Field insights</p>
          <h2>전장 기술·사례 인사이트</h2>
        </div>
        <span>{technologies.length + cases.length + developmentLens.length}건</span>
      </div>
      <div className="overview-grid">
        {developmentLens.slice(0, 3).map((item) => (
          <article key={item.id} className="lens-card light">
            <span className="source-badge official">{item.lifecyclePhaseKo}</span>
            <strong>{item.titleKo}</strong>
            <p>{item.summaryKo}</p>
          </article>
        ))}
      </div>
      <TechnologyPanel technologies={technologies} relatedTechnologies={technologies} onEquipmentSelect={onEquipmentSelect} />
      <CasesPage cases={cases} equipment={equipment} />
      <section className="source-panel-block">
        <div className="section-heading">
          <h2>개발 참고자료</h2>
          <span>{references.length}건</span>
        </div>
        <div className="source-cards reference-grid">
          {references.map((reference) => (
            <a key={reference.id} href={reference.url} target="_blank" rel="noreferrer">
              <span className="source-badge official">{reference.priority}</span>
              <strong>{reference.titleKo}</strong>
              <small>{reference.organization} · {reference.categoryKo}</small>
            </a>
          ))}
        </div>
      </section>
    </section>
  );
}

function CasesPage({ cases, equipment }: { cases: BattlefieldCaseStudy[]; equipment: Equipment[] }) {
  return (
    <section className="cases-page">
      <div className="section-heading">
        <div>
          <p className="eyebrow">Observed adaptation cases</p>
          <h2>공개 전장 사례</h2>
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

function SourceIndexPage({ sources, equipment }: { sources: Array<{ title: string; url: string; type: string; checkedAt: string }>; equipment: Equipment[] }) {
  const [sourceQuery, setSourceQuery] = useState("");
  const [sourceType, setSourceType] = useState("all");
  const [freshness, setFreshness] = useState("all");
  const [sourceExportStatus, setSourceExportStatus] = useState("");
  const sourceTypes = Array.from(new Set(sources.map((source) => source.type))).sort((a, b) => a.localeCompare(b));
  const freshnessByUrl = Object.fromEntries(sources.map((source) => [source.url, getSourceFreshness(source.checkedAt)]));
  const filteredSources = sources.filter((source) => {
    const normalizedQuery = normalizeSearchText(sourceQuery);
    const matchesQuery =
      !normalizedQuery ||
      [source.title, source.url, source.type, source.checkedAt].join(" ").toLowerCase().includes(normalizedQuery);
    const matchesType = sourceType === "all" || source.type === sourceType;
    const matchesFreshness = freshness === "all" || freshnessByUrl[source.url].status === freshness;
    return matchesQuery && matchesType && matchesFreshness;
  });
  const currentSources = sources.filter((source) => freshnessByUrl[source.url].status === "current").length;
  const staleSources = sources.length - currentSources;

  async function copySourceResults() {
    const summary = buildSourceSummary(filteredSources);
    try {
      await navigator.clipboard.writeText(summary);
      setSourceExportStatus("출처 요약을 복사했습니다.");
    } catch {
      setSourceExportStatus("브라우저 권한 때문에 복사하지 못했습니다. CSV 다운로드를 사용하세요.");
    }
  }

  function downloadSourceCsv() {
    const csv = `\uFEFF${buildSourceCsv(filteredSources)}`;
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "source-index-results.csv";
    anchor.click();
    URL.revokeObjectURL(url);
    setSourceExportStatus("출처 CSV를 생성했습니다.");
  }

  return (
    <section className="source-index-page">
      <div className="section-heading">
        <div>
          <p className="eyebrow">Source index</p>
          <h2>공개 출처 인덱스</h2>
        </div>
        <span>{sources.length}건</span>
      </div>
      <div className="catalog-overview compact">
        <p>장비 데이터는 제조사, 정부/군, 연구기관, 보도, 공개 이미지 출처를 구분해 관리합니다. 새 장비를 추가할 때는 출처 URL과 확인일을 함께 넣는 것을 기본 규칙으로 둡니다.</p>
        <div className="catalog-stat-grid">
          <span><strong>{equipment.length}</strong>장비</span>
          <span><strong>{sourceTypes.length}</strong>출처 유형</span>
          <span><strong>{sources.filter((source) => source.type === "Official").length}</strong>공식</span>
          <span><strong>{sources.filter((source) => source.type === "Manufacturer").length}</strong>제조사</span>
        </div>
      </div>
      <div className="source-health-strip">
        <span><strong>{currentSources}</strong>최근 확인</span>
        <span><strong>{staleSources}</strong>재확인 필요</span>
        <span><strong>{filteredSources.length}</strong>현재 표시</span>
      </div>
      <div className="source-filter-bar" aria-label="출처 인덱스 필터">
        <label>
          <span>출처 검색</span>
          <input value={sourceQuery} onChange={(event) => setSourceQuery(event.target.value)} placeholder="예: Army, Rheinmetall, RUSI" />
        </label>
        <label>
          <span>출처 유형</span>
          <select value={sourceType} onChange={(event) => setSourceType(event.target.value)}>
            <option value="all">전체 유형</option>
            {sourceTypes.map((type) => <option key={type} value={type}>{type}</option>)}
          </select>
        </label>
        <label>
          <span>확인 상태</span>
          <select value={freshness} onChange={(event) => setFreshness(event.target.value)}>
            <option value="all">전체 상태</option>
            <option value="current">최근 확인</option>
            <option value="stale">재확인 필요</option>
          </select>
        </label>
        <button type="button" onClick={() => {
          setSourceQuery("");
          setSourceType("all");
          setFreshness("all");
        }}>초기화</button>
      </div>
      <div className="source-action-grid" aria-label="출처 결과 내보내기">
        <button type="button" onClick={copySourceResults}>출처 요약 복사</button>
        <button type="button" onClick={downloadSourceCsv}>출처 CSV 다운로드</button>
      </div>
      {sourceExportStatus ? <p className="share-status" role="status">{sourceExportStatus}</p> : null}
      <div className="source-cards reference-grid">
        {filteredSources.map((source) => (
          <a key={source.url} className="source-card" href={source.url} target="_blank" rel="noreferrer">
            <span className={`source-badge ${source.type.toLowerCase().replace(/\s+/g, "-")}`}>{source.type}</span>
            <strong>{source.title}</strong>
            <small>{source.checkedAt} · {freshnessByUrl[source.url].label}</small>
          </a>
        ))}
        {!filteredSources.length ? <p className="empty-state">조건에 맞는 출처가 없습니다.</p> : null}
      </div>
    </section>
  );
}
