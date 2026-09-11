import { describe, expect, it } from "vitest";
import { equipmentBriefHtml } from "./equipmentBrief";
import data from "../../public/data/equipment.json";
import variants from "../../public/data/variants.json";
import type { Equipment, EquipmentVariant } from "../types";
const equipment = data[0] as unknown as Equipment;
describe("equipment brief", () => {
  it("escapes source and equipment markup, rejects executable links", () => {
    const html = equipmentBriefHtml({ ...equipment, name: '<img src=x onerror="alert(1)">', sources: [{ title: "unsafe", url: "javascript:alert(1)", checkedAt: "2026-09-10" }] }, undefined, undefined, "javascript:alert(1)");
    expect(html).toContain("&lt;img");
    expect(html).not.toContain('href="javascript:');
    expect(html).not.toContain('<img src=x');
    expect(html).toContain("외형 이미지를 제외");
  });
  it("identifies variant and keeps base specifications explicitly labelled", () => {
    const variant = variants.find(v => v.equipmentId === equipment.id) as EquipmentVariant;
    const html = equipmentBriefHtml(equipment, variant, "data:image/png;base64,AAAA", "https://example.com/equipment");
    expect(html).toContain(variant.nameKo);
    expect(html).toContain("기본형 참고 제원");
    expect(html).toContain("data:image/png;base64,AAAA");
    expect(html).toContain("window.print()");
  });
});
