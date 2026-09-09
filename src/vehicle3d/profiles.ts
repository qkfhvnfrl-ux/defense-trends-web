export type ModelFamily = "wheeled" | "tank" | "ifv" | "radar" | "carrier" | "truck";
export type VehicleProfile = {
  family: ModelFamily; length: number; width: number; roof: number; wheels: number;
  color: string; turretLength?: number; turretWidth?: number; turretHeight?: number;
  barrel?: number; turretX?: number; slope?: number;
};

// Relative artistic proportions, not measured CAD dimensions or scale drawings.
export const vehicleProfiles: Record<string, VehicleProfile> = {
  stryker: { family: "wheeled", length: 7, width: 2.9, roof: 2.05, wheels: 4, color: "#667054", slope: 1.15 },
  boxer: { family: "wheeled", length: 7.8, width: 3.05, roof: 2.55, wheels: 4, color: "#637354", slope: 1.2 },
  "patria-amv": { family: "wheeled", length: 7.3, width: 2.85, roof: 2.15, wheels: 4, color: "#707658", slope: 1.5 },
  vbci: { family: "wheeled", length: 7.6, width: 3.0, roof: 2.35, wheels: 4, color: "#718063", slope: 1.0 },
  "m1a2-abrams": { family: "tank", length: 7.7, width: 3.45, roof: 1.55, wheels: 7, color: "#b4a17a", turretLength: 3.75, turretWidth: 2.7, turretHeight: .85, barrel: 3.8, turretX: -.2 },
  "leopard-2a7": { family: "tank", length: 7.7, width: 3.45, roof: 1.58, wheels: 7, color: "#667451", turretLength: 3.5, turretWidth: 2.85, turretHeight: .85, barrel: 4.2, turretX: -.1 },
  "challenger-3": { family: "tank", length: 7.9, width: 3.4, roof: 1.6, wheels: 6, color: "#697453", turretLength: 3.65, turretWidth: 2.7, turretHeight: 1.05, barrel: 4.25 },
  "leclerc-xlr": { family: "tank", length: 7.1, width: 3.25, roof: 1.5, wheels: 6, color: "#75806a", turretLength: 3.55, turretWidth: 2.4, turretHeight: .9, barrel: 3.8, turretX: .25 },
  t90m: { family: "tank", length: 6.8, width: 3.25, roof: 1.45, wheels: 6, color: "#78825a", turretLength: 2.75, turretWidth: 2.65, turretHeight: .73, barrel: 4.4, turretX: .05 },
  "m2a2-bradley": { family: "ifv", length: 6.7, width: 3.05, roof: 2.1, wheels: 6, color: "#a59671", turretLength: 1.9, turretWidth: 1.8, turretHeight: .8, barrel: 2.2 },
  cv90: { family: "ifv", length: 6.8, width: 3.0, roof: 1.85, wheels: 7, color: "#6f7759", turretLength: 2.2, turretWidth: 1.85, turretHeight: .85, barrel: 2.3 },
  "puma-ifv": { family: "ifv", length: 7.1, width: 3.25, roof: 2.0, wheels: 6, color: "#737c59", turretLength: 2.1, turretWidth: 1.65, turretHeight: .8, barrel: 2.1, turretX: -.35 },
  gepard: { family: "radar", length: 6.9, width: 3.25, roof: 1.7, wheels: 7, color: "#687854", turretLength: 2.8, turretWidth: 2.05, turretHeight: 1.6 },
  "caesar-8x8": { family: "truck", length: 10.3, width: 2.6, roof: 2.85, wheels: 4, color: "#7c8060" },
  m113: { family: "carrier", length: 5.1, width: 2.65, roof: 2.0, wheels: 5, color: "#74815d" }
};

export type AssemblyKey = "hull" | "running" | "mission" | "details";
export const assemblies: Array<{ key: AssemblyKey; label: string; description: string }> = [
  { key: "hull", label: "차체", description: "차체 윤곽, 전면 경사와 상부 구조의 외형입니다." },
  { key: "running", label: "주행장치", description: "차륜 또는 궤도, 전륜과 외부 휠 허브의 시각적 배치입니다." },
  { key: "mission", label: "임무장비", description: "선택한 임무형의 상부 장비와 외부 부속 형상을 표시합니다." },
  { key: "details", label: "외부 부속", description: "해치, 외부 관측창, 조명, 안테나와 적재함을 구분해 표시합니다." }
];

// These records have no single verified exterior configuration in this catalog.
export const unavailableVariants = new Set(["abrams-sepv4-cancelled", "leopard-2a8", "vbci-mkii"]);
