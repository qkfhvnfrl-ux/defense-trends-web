import { describe, expect, it } from "vitest";
import equipmentData from "../public/data/equipment.json";
import variantData from "../public/data/variants.json";
import { matchesEquipmentQuery } from "./search";
import { equipmentSchema, equipmentVariantSchema } from "./schema";

const equipment = equipmentSchema.array().parse(equipmentData);
const variants = equipmentVariantSchema.array().parse(variantData);

function search(query: string) {
  return equipment.filter((item) => matchesEquipmentQuery(
    item,
    variants.filter((variant) => variant.equipmentId === item.id),
    query,
    ""
  )).map((item) => item.id);
}

describe("equipment search with the published catalog", () => {
  it("keeps the complete catalog for blank input", () => {
    expect(search(" \t\n ")).toEqual(equipment.map((item) => item.id));
  });

  it("combines terms across fields regardless of their order", () => {
    expect(search("독일 8x8")).toEqual(["boxer"]);
    expect(search("  8x8 \t 독일 ")).toEqual(["boxer"]);
    expect(search("독일 8x8 스트라이커")).toEqual([]);
  });

  it.each([
    ["스트라이커", "stryker"],
    ["복서", "boxer"],
    ["파트리아", "patria-amv"],
    ["에이브럼스", "m1a2-abrams"],
    ["레오파르트", "leopard-2a7"],
    ["챌린저", "challenger-3"],
    ["르클레르", "leclerc-xlr"],
    ["브래들리", "m2a2-bradley"],
    ["푸마", "puma-ifv"],
    ["게파르트", "gepard"],
    ["시저", "caesar-8x8"]
  ])("finds the Korean equipment name %s", (query, expectedId) => {
    expect(search(query)).toEqual([expectedId]);
  });

  it("tolerates name spacing, case, hyphens and full-width characters", () => {
    expect(search("Leopard2A7")).toEqual(["leopard-2a7"]);
    expect(search("leopard 2a7")).toEqual(["leopard-2a7"]);
    expect(search("T90M")).toEqual(["t90m"]);
    expect(search("Ｔ－９０Ｍ")).toEqual(["t90m"]);
    expect(search("T–90M")).toEqual(["t90m"]);
  });

  it("treats common wheel-layout spellings as the same complete term", () => {
    expect(search("독일 8×8")).toEqual(["boxer"]);
    expect(search("독일 8 x 8")).toEqual(["boxer"]);
    expect(search("독일 ８ × ８")).toEqual(["boxer"]);
  });

  it("continues searching variant names alongside equipment fields", () => {
    expect(search("스트라이커 Dragoon")).toEqual(["stryker"]);
    expect(search("Boxer 의무")).toEqual(["boxer"]);
    expect(search("Boxer Dragoon")).toEqual([]);
  });

  it("searches the visible equipment classification", () => {
    const cv90 = equipment.find((item) => item.id === "cv90")!;
    expect(matchesEquipmentQuery(cv90, [], "스웨덴 보병전투차", "보병전투차")).toBe(true);
    expect(matchesEquipmentQuery(cv90, [], "스웨덴 자주포", "보병전투차")).toBe(false);
  });

  it("preserves ordinary searches and rejects unknown terms", () => {
    expect(search("Boxer")).toEqual(["boxer"]);
    expect(search("General Dynamics")).toEqual(["stryker", "m1a2-abrams"]);
    expect(search("존재하지않는장비")).toEqual([]);
    expect(search("독일 존재하지않는장비")).toEqual([]);
  });
});
