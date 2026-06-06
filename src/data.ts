import type { BattlefieldCase, BattlefieldCaseStudy, BattlefieldTechnology, ComponentSpec, Equipment, EquipmentVariant, Trend } from "./types";
import { appDataSchema, validateCrossReferences } from "./schema";
import { publicPath } from "./publicPath";

async function loadJson<T>(path: string): Promise<T> {
  const response = await fetch(publicPath(path));
  if (!response.ok) {
    throw new Error(`${path} 로드 실패: ${response.status}`);
  }
  return response.json() as Promise<T>;
}

export async function loadAppData() {
  const [equipment, incidents, trends, components, variants, technologies, caseStudies] = await Promise.all([
    loadJson<Equipment[]>("/data/equipment.json"),
    loadJson<BattlefieldCase[]>("/data/incidents.json"),
    loadJson<Trend[]>("/data/trends.json"),
    loadJson<ComponentSpec[]>("/data/components.json"),
    loadJson<EquipmentVariant[]>("/data/variants.json"),
    loadJson<BattlefieldTechnology[]>("/data/technologies.json"),
    loadJson<BattlefieldCaseStudy[]>("/data/battlefieldCases.json")
  ]);

  const parsed = appDataSchema.safeParse({ equipment, incidents, trends, components, variants, technologies, caseStudies });
  if (!parsed.success) {
    throw new Error("데이터 스키마 검증에 실패했습니다.");
  }

  const referenceErrors = validateCrossReferences(parsed.data);
  if (referenceErrors.length) {
    throw new Error(referenceErrors.join(", "));
  }

  return parsed.data as {
    equipment: Equipment[];
    incidents: BattlefieldCase[];
    trends: Trend[];
    components: ComponentSpec[];
    variants: EquipmentVariant[];
    technologies: BattlefieldTechnology[];
    caseStudies: BattlefieldCaseStudy[];
  };
}
