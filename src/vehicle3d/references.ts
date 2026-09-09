export type ModelSource = { title: string; url: string; imageUrl?: string; publisher: string; observedFeatures?: string[] };
export type ModelReference = {
  inspectionStatus: "photo-checked" | "source-only"; equipmentId: string; exactVariant: string; sources: ModelSource[];
  externalFeaturesKo: string[]; missionEquipmentKo: string[]; uncertaintyKo: string;
};
