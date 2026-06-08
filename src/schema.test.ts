import equipment from "../public/data/equipment.json";
import incidents from "../public/data/incidents.json";
import trends from "../public/data/trends.json";
import components from "../public/data/components.json";
import variants from "../public/data/variants.json";
import technologies from "../public/data/technologies.json";
import caseStudies from "../public/data/battlefieldCases.json";
import developmentLens from "../public/data/developmentLens.json";
import engineeringReferences from "../public/data/engineeringReferences.json";
import { describe, expect, it } from "vitest";
import { appDataSchema, validateCrossReferences } from "./schema";

describe("public data", () => {
  const data = { equipment, incidents, trends, components, variants, technologies, caseStudies, developmentLens, engineeringReferences };

  it("matches the application schema", () => {
    const parsed = appDataSchema.safeParse(data);
    expect(parsed.success).toBe(true);
  });

  it("keeps all equipment references valid", () => {
    const parsed = appDataSchema.parse(data);
    expect(validateCrossReferences(parsed)).toEqual([]);
  });

  it("ships an expanded equipment and battlefield technology set", () => {
    expect(equipment.length).toBeGreaterThanOrEqual(14);
    expect(equipment.filter((item) => item.category === "tank")).toHaveLength(5);
    expect(equipment.filter((item) => item.category === "tracked-ifv").length).toBeGreaterThanOrEqual(3);
    expect(variants.length).toBeGreaterThanOrEqual(30);
    expect(technologies.length).toBeGreaterThanOrEqual(6);
    expect(caseStudies.length).toBeGreaterThanOrEqual(7);
    expect(developmentLens.length).toBeGreaterThanOrEqual(5);
    expect(engineeringReferences.length).toBeGreaterThanOrEqual(8);
  });
});
