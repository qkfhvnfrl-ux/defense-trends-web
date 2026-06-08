export type Source = {
  id?: string;
  title: string;
  url: string;
  publisher?: string;
  sourceType?: "Official" | "Manufacturer" | "Think Tank" | "News" | "OSINT" | "Other";
  accessedDate?: string;
  checkedAt: string;
  confidence?: "High" | "Medium" | "Low";
  relatedEquipmentIds?: string[];
  notes?: string;
};

export type EquipmentCategory = "wheeled-apc" | "tracked-apc" | "tracked-ifv" | "tank" | "air-defense" | "artillery";

export type Equipment = {
  id: string;
  name: string;
  aliases: string[];
  category: EquipmentCategory;
  country: string;
  originCountry: string;
  operatorCountries: string[];
  manufacturer: string;
  vehicleFamily: "차륜형장갑차" | "전차·궤도전투차";
  roleTags: string[];
  variantIds: string[];
  technologyTags: string[];
  battlefieldCaseIds: string[];
  sourceIds: string[];
  confidenceSummary: string;
  modernizationPotential: number;
  droneThreatPressure: number;
  systemIntegrationLevel: number;
  fieldModificationSensitivity: number;
  sourceConfidenceScore: number;
  lastUpdated: string;
  status: string;
  summaryKo: string;
  specs: Record<string, string>;
  images: string[];
  modelPath: string;
  sources: Source[];
};

export type BattlefieldCase = {
  id: string;
  equipmentIds: string[];
  titleKo: string;
  country: string;
  location: string;
  lat: number;
  lng: number;
  period: string;
  summaryKo: string;
  sources: Source[];
};

export type Trend = {
  id: string;
  equipmentIds: string[];
  type: "도입" | "개량" | "수출" | "전장운용" | "시험";
  region: string;
  titleKo: string;
  summaryKo: string;
  date: string;
  sources: Source[];
};

export type ComponentSpec = {
  id: string;
  equipmentId: string;
  nameKo: string;
  type: string;
  hotspotPosition: [number, number, number];
  modelPath: string;
  specs: Record<string, string>;
  summaryKo: string;
  sources: Source[];
};

export type EquipmentVariant = {
  id: string;
  equipmentId: string;
  nameKo: string;
  role: string;
  armament: string;
  notesKo: string;
  maturity: "운용" | "도입" | "제안" | "시험" | "전시" | "급조";
  sources: Source[];
};

export type BattlefieldTechnology = {
  id: string;
  titleKo: string;
  category: "드론 대응" | "전자전" | "방공" | "무인화" | "능동방호" | "네트워크";
  maturity: "급조" | "전력화" | "확산" | "시험";
  summaryKo: string;
  battlefieldUseKo: string;
  vehicleImpactKo: string;
  relatedEquipmentIds: string[];
  images: Array<{
    url: string;
    captionKo: string;
    credit: string;
  }>;
  sources: Source[];
};

export type BattlefieldCaseStudy = {
  id: string;
  conflict: "Russia-Ukraine War" | "Nagorno-Karabakh" | "Middle East" | "Other";
  dateObserved: string;
  region: string;
  equipmentName: string;
  category: "Tank" | "IFV" | "APC" | "MRAP" | "Artillery" | "SHORAD" | "UGV";
  adaptationType:
    | "Drone cage"
    | "Drone net"
    | "Improvised armor"
    | "EW jammer"
    | "RCWS"
    | "APS"
    | "Camouflage"
    | "Medical evacuation"
    | "UGV support"
    | "C-UAS";
  threatDriver: string;
  observedChange: string;
  operationalMeaning: string;
  confidenceLevel: "High" | "Medium" | "Low";
  sourceType: "Manufacturer" | "Government" | "Think tank" | "News" | "OSINT";
  sourceUrls: string[];
  equipmentIds: string[];
  safetyNote?: string;
};

export type DevelopmentRiskLevel = "High" | "Medium" | "Low";

export type DevelopmentLensItem = {
  id: string;
  titleKo: string;
  themeKo: string;
  lifecyclePhaseKo: string;
  summaryKo: string;
  sourceConfidenceScore: number;
  relatedEquipmentIds: string[];
  tags: string[];
  threatDrivers: string[];
  requirementSignals: string[];
  architectureImpacts: Array<{
    areaKo: string;
    implicationKo: string;
    designTradeoffKo: string;
  }>;
  verificationItems: Array<{
    phaseKo: string;
    itemKo: string;
    evidenceKo: string;
  }>;
  riskRegister: Array<{
    riskKo: string;
    mitigationKo: string;
    ownerKo: string;
    level: DevelopmentRiskLevel;
  }>;
  sources: Source[];
};

export type EngineeringReference = {
  id: string;
  titleKo: string;
  organization: string;
  categoryKo: string;
  url: string;
  usageKo: string;
  priority: "Core" | "Useful" | "Watch";
  checkedAt: string;
};
