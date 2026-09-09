import { describe, expect, it, vi } from "vitest";
import { Box3, Mesh, Vector3 } from "three";
import { GLTFExporter } from "three/examples/jsm/exporters/GLTFExporter.js";
import equipment from "../../public/data/equipment.json";
import variants from "../../public/data/variants.json";
import references from "./photo-references.json";
import { buildVehicleModel, disposeVehicle } from "./geometry";
import { assemblies, unavailableVariants, vehicleProfiles } from "./profiles";

describe("vehicle exterior models", () => {
  it("provides finite, visible geometry for every equipment and supported mission configuration", () => {
    const configurations = equipment.flatMap(item => [
      { id: item.id, variant: "base" },
      ...variants.filter(v => v.equipmentId === item.id && !unavailableVariants.has(v.id)).map(v => ({ id: item.id, variant: v.id }))
    ]);
    expect(Object.keys(vehicleProfiles).sort()).toEqual(equipment.map(item => item.id).sort());
    for (const { id, variant } of configurations) {
      const { root, groups } = buildVehicleModel(id, variant);
      const size = new Box3().setFromObject(root).getSize(new Vector3());
      expect(size.toArray().every(value => Number.isFinite(value) && value > 1 && value < 20), id + "/" + variant).toBe(true);
      let draws = 0;
      for (const { key } of assemblies) expect(groups[key].children.length, id + "/" + key).toBeGreaterThan(0);
      root.traverse(object => {
        if (!(object instanceof Mesh)) return;
        draws++;
        expect(object.geometry.getAttribute("position").array.every(Number.isFinite)).toBe(true);
      });
      expect(draws).toBeLessThan(40);
      disposeVehicle(root);
    }
  });

  it("exports a binary glTF with all named assemblies and the reference-model qualification", async () => {
    class TestFileReader {
      result: ArrayBuffer | null = null;
      onloadend: (() => void) | null = null;
      readAsArrayBuffer(blob: Blob) {
        void blob.arrayBuffer().then(result => { this.result = result; this.onloadend?.(); });
      }
    }
    vi.stubGlobal("FileReader", TestFileReader);
    const { root } = buildVehicleModel("boxer", "boxer-ambulance");
    try {
      const result = await new GLTFExporter().parseAsync(root, { binary: true });
      expect(result).toBeInstanceOf(ArrayBuffer);
      const view = new DataView(result as ArrayBuffer);
      expect(view.getUint32(0, true)).toBe(0x46546c67);
      expect(view.getUint32(4, true)).toBe(2);
      expect(view.getUint32(8, true)).toBe((result as ArrayBuffer).byteLength);
      const json = JSON.parse(new TextDecoder().decode(new Uint8Array(result as ArrayBuffer, 20, view.getUint32(12, true))));
      const nodes = json.nodes as Array<{ name?: string; extras?: { scaleNote?: string } }>;
      for (const { label } of assemblies) expect(nodes.some(node => node.name === label)).toBe(true);
      expect(nodes.some(node => node.extras?.scaleNote?.includes("실측"))).toBe(true);
    } finally { disposeVehicle(root); vi.unstubAllGlobals(); }
  });

  it("keeps a source-linked exterior description for every equipment", () => {
    expect(references.map(item => item.equipmentId).sort()).toEqual(equipment.map(item => item.id).sort());
    for (const item of references) {
      expect(item.sources.length).toBeGreaterThan(0);
      expect(item.externalFeaturesKo.length).toBeGreaterThanOrEqual(3);
      expect(item.uncertaintyKo.length).toBeGreaterThan(0);
      for (const source of item.sources) expect(new URL(source.url).protocol).toBe("https:");
    }
  });
});
