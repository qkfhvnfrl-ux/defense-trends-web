import { z } from "zod";

const sourceSchema = z.object({
  id: z.string().min(1).optional(),
  title: z.string().min(1),
  url: z.string().url(),
  publisher: z.string().min(1).optional(),
  sourceType: z.enum(["Official", "Manufacturer", "Think Tank", "News", "OSINT", "Other"]).optional(),
  accessedDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  checkedAt: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  confidence: z.enum(["High", "Medium", "Low"]).optional(),
  relatedEquipmentIds: z.array(z.string().min(1)).optional(),
  notes: z.string().optional()
});

const scoreSchema = z.number().min(0).max(100);

export const equipmentSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  aliases: z.array(z.string()),
  category: z.enum(["wheeled-apc", "tracked-apc", "tracked-ifv", "tank", "air-defense", "artillery"]),
  country: z.string().min(1),
  originCountry: z.string().min(1),
  operatorCountries: z.array(z.string().min(1)),
  manufacturer: z.string().min(1),
  vehicleFamily: z.enum(["차륜형장갑차", "전차·궤도전투차"]),
  roleTags: z.array(z.string().min(1)),
  variantIds: z.array(z.string().min(1)),
  technologyTags: z.array(z.string().min(1)),
  battlefieldCaseIds: z.array(z.string().min(1)),
  sourceIds: z.array(z.string().min(1)),
  confidenceSummary: z.string().min(1),
  modernizationPotential: scoreSchema,
  droneThreatPressure: scoreSchema,
  systemIntegrationLevel: scoreSchema,
  fieldModificationSensitivity: scoreSchema,
  sourceConfidenceScore: scoreSchema,
  lastUpdated: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  status: z.string().min(1),
  summaryKo: z.string().min(1),
  specs: z.record(z.string(), z.string().min(1)),
  images: z.array(z.string().min(1)),
  modelPath: z.string().startsWith("/models/").endsWith(".glb"),
  sources: z.array(sourceSchema).min(1)
});

export const battlefieldCaseSchema = z.object({
  id: z.string().min(1),
  equipmentIds: z.array(z.string().min(1)).min(1),
  titleKo: z.string().min(1),
  country: z.string().min(1),
  location: z.string().min(1),
  lat: z.number().min(-90).max(90),
  lng: z.number().min(-180).max(180),
  period: z.string().min(1),
  summaryKo: z.string().min(1),
  sources: z.array(sourceSchema).min(1)
});

export const trendSchema = z.object({
  id: z.string().min(1),
  equipmentIds: z.array(z.string().min(1)).min(1),
  type: z.enum(["도입", "개량", "수출", "전장운용", "시험"]),
  region: z.string().min(1),
  titleKo: z.string().min(1),
  summaryKo: z.string().min(1),
  date: z.string().min(1),
  sources: z.array(sourceSchema).min(1)
});

export const componentSpecSchema = z.object({
  id: z.string().min(1),
  equipmentId: z.string().min(1),
  nameKo: z.string().min(1),
  type: z.string().min(1),
  hotspotPosition: z.tuple([z.number(), z.number(), z.number()]),
  modelPath: z.string().startsWith("/models/").endsWith(".glb"),
  specs: z.record(z.string(), z.string().min(1)),
  summaryKo: z.string().min(1),
  sources: z.array(sourceSchema).min(1)
});

export const equipmentVariantSchema = z.object({
  id: z.string().min(1),
  equipmentId: z.string().min(1),
  nameKo: z.string().min(1),
  role: z.string().min(1),
  armament: z.string().min(1),
  notesKo: z.string().min(1),
  maturity: z.enum(["운용", "도입", "제안", "시험", "전시", "급조"]),
  sources: z.array(sourceSchema).min(1)
});

export const battlefieldTechnologySchema = z.object({
  id: z.string().min(1),
  titleKo: z.string().min(1),
  category: z.enum(["드론 대응", "전자전", "방공", "무인화", "능동방호", "네트워크"]),
  maturity: z.enum(["급조", "전력화", "확산", "시험"]),
  summaryKo: z.string().min(1),
  battlefieldUseKo: z.string().min(1),
  vehicleImpactKo: z.string().min(1),
  relatedEquipmentIds: z.array(z.string().min(1)),
  images: z.array(z.object({
    url: z.string().min(1),
    captionKo: z.string().min(1),
    credit: z.string().min(1)
  })),
  sources: z.array(sourceSchema).min(1)
});

export const battlefieldCaseStudySchema = z.object({
  id: z.string().min(1),
  conflict: z.enum(["Russia-Ukraine War", "Nagorno-Karabakh", "Middle East", "Other"]),
  dateObserved: z.string().min(1),
  region: z.string().min(1),
  equipmentName: z.string().min(1),
  category: z.enum(["Tank", "IFV", "APC", "MRAP", "Artillery", "SHORAD", "UGV"]),
  adaptationType: z.enum([
    "Drone cage",
    "Drone net",
    "Improvised armor",
    "EW jammer",
    "RCWS",
    "APS",
    "Camouflage",
    "Medical evacuation",
    "UGV support",
    "C-UAS"
  ]),
  threatDriver: z.string().min(1),
  observedChange: z.string().min(1),
  operationalMeaning: z.string().min(1),
  confidenceLevel: z.enum(["High", "Medium", "Low"]),
  sourceType: z.enum(["Manufacturer", "Government", "Think tank", "News", "OSINT"]),
  sourceUrls: z.array(z.string().url()).min(1),
  equipmentIds: z.array(z.string().min(1)),
  safetyNote: z.string().optional()
});

export const developmentLensItemSchema = z.object({
  id: z.string().min(1),
  titleKo: z.string().min(1),
  themeKo: z.string().min(1),
  lifecyclePhaseKo: z.string().min(1),
  summaryKo: z.string().min(1),
  sourceConfidenceScore: scoreSchema,
  relatedEquipmentIds: z.array(z.string().min(1)),
  tags: z.array(z.string().min(1)),
  threatDrivers: z.array(z.string().min(1)).min(1),
  requirementSignals: z.array(z.string().min(1)).min(1),
  architectureImpacts: z.array(z.object({
    areaKo: z.string().min(1),
    implicationKo: z.string().min(1),
    designTradeoffKo: z.string().min(1)
  })).min(1),
  verificationItems: z.array(z.object({
    phaseKo: z.string().min(1),
    itemKo: z.string().min(1),
    evidenceKo: z.string().min(1)
  })).min(1),
  riskRegister: z.array(z.object({
    riskKo: z.string().min(1),
    mitigationKo: z.string().min(1),
    ownerKo: z.string().min(1),
    level: z.enum(["High", "Medium", "Low"])
  })).min(1),
  sources: z.array(sourceSchema).min(1)
});

export const engineeringReferenceSchema = z.object({
  id: z.string().min(1),
  titleKo: z.string().min(1),
  organization: z.string().min(1),
  categoryKo: z.string().min(1),
  url: z.string().url(),
  usageKo: z.string().min(1),
  priority: z.enum(["Core", "Useful", "Watch"]),
  checkedAt: z.string().regex(/^\d{4}-\d{2}-\d{2}$/)
});

export const appDataSchema = z.object({
  equipment: z.array(equipmentSchema).min(1),
  incidents: z.array(battlefieldCaseSchema),
  trends: z.array(trendSchema),
  components: z.array(componentSpecSchema),
  variants: z.array(equipmentVariantSchema),
  technologies: z.array(battlefieldTechnologySchema),
  caseStudies: z.array(battlefieldCaseStudySchema),
  developmentLens: z.array(developmentLensItemSchema),
  engineeringReferences: z.array(engineeringReferenceSchema)
});

export type AppDataSchema = z.infer<typeof appDataSchema>;

export function validateCrossReferences(data: AppDataSchema) {
  const equipmentIds = new Set(data.equipment.map((equipment) => equipment.id));
  const errors: string[] = [];

  for (const incident of data.incidents) {
    for (const equipmentId of incident.equipmentIds) {
      if (!equipmentIds.has(equipmentId)) errors.push(`incidents.${incident.id} references unknown equipment ${equipmentId}`);
    }
  }

  for (const trend of data.trends) {
    for (const equipmentId of trend.equipmentIds) {
      if (!equipmentIds.has(equipmentId)) errors.push(`trends.${trend.id} references unknown equipment ${equipmentId}`);
    }
  }

  for (const component of data.components) {
    if (!equipmentIds.has(component.equipmentId)) {
      errors.push(`components.${component.id} references unknown equipment ${component.equipmentId}`);
    }
  }

  for (const variant of data.variants) {
    if (!equipmentIds.has(variant.equipmentId)) {
      errors.push(`variants.${variant.id} references unknown equipment ${variant.equipmentId}`);
    }
  }

  for (const technology of data.technologies) {
    for (const equipmentId of technology.relatedEquipmentIds) {
      if (!equipmentIds.has(equipmentId)) errors.push(`technologies.${technology.id} references unknown equipment ${equipmentId}`);
    }
  }

  for (const caseStudy of data.caseStudies) {
    for (const equipmentId of caseStudy.equipmentIds) {
      if (!equipmentIds.has(equipmentId)) errors.push(`caseStudies.${caseStudy.id} references unknown equipment ${equipmentId}`);
    }
  }

  for (const lensItem of data.developmentLens) {
    for (const equipmentId of lensItem.relatedEquipmentIds) {
      if (!equipmentIds.has(equipmentId)) errors.push(`developmentLens.${lensItem.id} references unknown equipment ${equipmentId}`);
    }
  }

  for (const collection of ["equipment", "incidents", "trends", "components", "variants", "technologies", "caseStudies", "developmentLens", "engineeringReferences"] as const) {
    const ids = new Set<string>();
    for (const item of data[collection]) {
      if (ids.has(item.id)) errors.push(`${collection} contains duplicate id ${item.id}`);
      ids.add(item.id);
    }
  }

  for (const equipment of data.equipment) {
    if (!equipment.sources.length) errors.push(`equipment.${equipment.id} has no sources`);
    for (const score of [
      "modernizationPotential",
      "droneThreatPressure",
      "systemIntegrationLevel",
      "fieldModificationSensitivity",
      "sourceConfidenceScore"
    ] as const) {
      const value = equipment[score];
      if (value < 0 || value > 100) errors.push(`equipment.${equipment.id}.${score} must be 0-100`);
    }
  }

  return errors;
}
