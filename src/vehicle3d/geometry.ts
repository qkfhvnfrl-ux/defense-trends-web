import * as THREE from "three";
import { ConvexGeometry } from "three/examples/jsm/geometries/ConvexGeometry.js";
import { mergeGeometries } from "three/examples/jsm/utils/BufferGeometryUtils.js";
import { vehicleProfiles, assemblies, type AssemblyKey, type VehicleProfile } from "./profiles";

type Point = [number, number, number];
type Palette = Record<string, THREE.MeshStandardMaterial>;

export function buildVehicleModel(id: string, variant = "base") {
  const p = vehicleProfiles[id];
  if (!p) throw new Error("등록되지 않은 차량 형상입니다.");
  const root = new THREE.Group();
  root.name = id + "-" + variant;
  root.userData = { equipmentId: id, variant, reconstruction: "사진 참고 외형 재현", scaleNote: "실측 치수가 아닌 시각적 비례. CAD/사진측량 모델이 아닙니다." };
  const groups = Object.fromEntries(assemblies.map(({ key, label }) => {
    const group = new THREE.Group(); group.name = label; group.userData.assembly = key; root.add(group); return [key, group];
  })) as Record<AssemblyKey, THREE.Group>;
  const materials: Palette = {};
  const material = (key: string, color: THREE.ColorRepresentation, metalness = .12, roughness = .7) => {
    const result = new THREE.MeshStandardMaterial({ color, metalness, roughness });
    result.name = key; materials[key] = result; return result;
  };
  material("paint", p.color);
  material("panel", new THREE.Color(p.color).multiplyScalar(.82));
  material("edge", new THREE.Color(p.color).multiplyScalar(1.15));
  material("rubber", "#242b2c", .05, .93);
  material("steel", "#555e60", .65, .46);
  material("dark", "#172326", .22);
  material("glass", "#385e68", .6, .2);
  material("lamp", "#d4ce9c", .1, .28);
  material("red", "#b25948");
  material("white", "#dddcc9");

  function add(g: THREE.Group, geo: THREE.BufferGeometry, pos: Point, mat = "paint", rotation?: Point) {
    const mesh = new THREE.Mesh(geo, materials[mat]);
    mesh.position.set(...pos); if (rotation) mesh.rotation.set(...rotation);
    mesh.castShadow = true; mesh.receiveShadow = true; g.add(mesh); return mesh;
  }
  function box(g: THREE.Group, pos: Point, size: Point, mat = "paint", rot?: Point) {
    return add(g, new THREE.BoxGeometry(...size), pos, mat, rot);
  }
  function cylinder(g: THREE.Group, pos: Point, radius: number, height: number, mat = "paint", rotation?: Point, segments = 20) {
    return add(g, new THREE.CylinderGeometry(radius, radius, height, segments), pos, mat, rotation);
  }
  function rod(g: THREE.Group, a: Point, b: Point, radius: number, mat = "steel", segments = 10) {
    const va = new THREE.Vector3(...a), vb = new THREE.Vector3(...b), direction = vb.clone().sub(va);
    const mesh = cylinder(g, va.clone().add(vb).multiplyScalar(.5).toArray() as Point, radius, direction.length(), mat, undefined, segments);
    mesh.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), direction.normalize());
    return mesh;
  }
  function shell(g: THREE.Group, length: number, width: number, bottom: number, top: number, slope = 1) {
    const points: THREE.Vector3[] = [];
    for (const side of [-1, 1]) {
      points.push(
        new THREE.Vector3(-length / 2, bottom, side * width * .4),
        new THREE.Vector3(length / 2 - .12, bottom, side * width * .4),
        new THREE.Vector3(length / 2, bottom + (top - bottom) * .28, side * width * .48),
        new THREE.Vector3(length / 2 - slope, top, side * width * .44),
        new THREE.Vector3(-length / 2 + .1, top, side * width * .49)
      );
    }
    add(g, new ConvexGeometry(points), [0, 0, 0]);
  }
  function hatch(g: THREE.Group, x: number, y: number, z: number, radius = .32) {
    cylinder(g, [x, y, z], radius, .09, "panel", undefined, 24);
    cylinder(g, [x, y + .052, z], radius * .84, .025, "edge", undefined, 24);
    box(g, [x, y + .09, z], [.22, .05, .055], "steel");
    for (let k = 0; k < 4; k++) box(g, [x + Math.cos(k * Math.PI / 2) * radius * .85, y + .07, z + Math.sin(k * Math.PI / 2) * radius * .85], [.07, .04, .07], "steel");
  }
  function aerial(g: THREE.Group, x: number, y: number, z: number, height = 1.05) {
    cylinder(g, [x, y + .1, z], .075, .2, "panel");
    rod(g, [x, y + .18, z], [x - .11, y + height, z], .013, "dark", 6);
  }
  function optic(g: THREE.Group, x: number, y: number, z: number, scale = 1) {
    box(g, [x, y, z], [.24 * scale, .27 * scale, .32 * scale], "panel");
    box(g, [x + .126 * scale, y + .015, z], [.015, .14 * scale, .21 * scale], "glass");
  }
  function grille(g: THREE.Group, x: number, y: number, z: number, length = 1.1, width = .65) {
    box(g, [x, y, z], [length, .035, width], "dark");
    for (let i = 0; i < 10; i++) box(g, [x - length / 2 + length * (i + .5) / 10, y + .025, z], [.04, .025, width], "panel");
  }
  function bustle(g: THREE.Group, x: number, y: number, z: number, width: number) {
    box(g, [x, y, z], [.65, .42, width], "panel");
    for (const edgeZ of [-width / 2, width / 2]) rod(g, [x - .34, y - .24, z + edgeZ], [x - .34, y + .3, z + edgeZ], .025);
    for (const level of [-.24, .04, .3]) rod(g, [x - .34, y + level, z - width / 2], [x - .34, y + level, z + width / 2], .024);
    for (let i = 0; i < 7; i++) rod(g, [x - .35, y - .24, z - width / 2 + i * width / 6], [x - .35, y + .3, z - width / 2 + i * width / 6], .012);
  }
  function wheel(g: THREE.Group, x: number, y: number, z: number, radius: number, width: number, tire = true) {
    cylinder(g, [x, y, z], radius, width, tire ? "rubber" : "panel", [Math.PI / 2, 0, 0], 32);
    const sign = Math.sign(z);
    cylinder(g, [x, y, z + sign * width * .5], radius * .68, .075, "paint", [Math.PI / 2, 0, 0]);
    cylinder(g, [x, y, z + sign * (width * .5 + .065)], radius * .28, .10, "panel", [Math.PI / 2, 0, 0], 16);
    for (let k = 0; k < 8; k++) {
      const a = k * Math.PI / 4;
      cylinder(g, [x + Math.cos(a) * radius * .43, y + Math.sin(a) * radius * .43, z + sign * (width * .5 + .048)], .025, .035, "steel", [Math.PI / 2, 0, 0], 6);
    }
    if (tire) for (let k = 0; k < 28; k++) {
      const a = k * Math.PI * 2 / 28;
      box(g, [x + Math.sin(a) * radius, y + Math.cos(a) * radius, z], [.10, .047, width * .92], "rubber", [0, 0, -a]);
    }
  }
  function runningGear() {
    const g = groups.running, wheeled = p.family === "wheeled" || p.family === "truck";
    if (wheeled) {
      const xs = p.family === "truck" ? [-3.8, -2.3, 2.15, 3.65] : [-.36, -.17, .17, .36].map(v => v * p.length);
      for (const z of [-1, 1]) for (const x of xs) {
        wheel(g, x, .7, z * (p.width / 2 - .10), .64, .45);
        box(groups.hull, [x, 1.40, z * (p.width / 2 - .025)], [1.37, .10, .57], "panel");
        rod(g, [x, .75, 0], [x, .75, z * p.width / 2], .07, "steel");
      }
    } else {
      const a = p.length / 2 - .95, r = .51, perimeter = 4 * a + 2 * Math.PI * r;
      for (const side of [-1, 1]) {
        const z = side * (p.width / 2 - .25);
        for (let i = 0; i < p.wheels; i++) wheel(g, -a + .22 + i * (2 * a - .44) / (p.wheels - 1), .62, z, .43, .43, false);
        for (const x of [-a - .21, a + .21]) wheel(g, x, .72, z, .34, .4, false);
        const count = Math.ceil(perimeter / .22);
        for (let i = 0; i < count; i++) {
          let s = perimeter * i / count, x: number, y: number, angle: number;
          if (s < 2 * a) { x = -a + s; y = .65 + r; angle = 0; }
          else if ((s -= 2 * a) < Math.PI * r) { const t = s / r; x = a + Math.sin(t) * r; y = .65 + Math.cos(t) * r; angle = -t; }
          else if ((s -= Math.PI * r) < 2 * a) { x = a - s; y = .65 - r; angle = Math.PI; }
          else { s -= 2 * a; const t = s / r; x = -a - Math.sin(t) * r; y = .65 - Math.cos(t) * r; angle = Math.PI - t; }
          box(g, [x, y, z], [.205, .11, .59], "steel", [0, 0, angle]);
          box(g, [x, y + (y > .65 ? .062 : -.062), z], [.115, .035, .43], "rubber", [0, 0, angle]);
        }
        if (p.family !== "carrier") for (let i = 0; i < 7; i++) {
          const x = -p.length * .36 + i * p.length * .12;
          box(groups.hull, [x, 1.28, side * (p.width / 2 + .02)], [p.length * .115, .43, .09], i % 2 ? "paint" : "panel");
          box(groups.details, [x, 1.41, side * (p.width / 2 + .075)], [.05, .055, .02], "steel");
        }
      }
    }
  }
  function cannon(g: THREE.Group, start: Point, length: number, radius = .09, pitch = .035) {
    const end: Point = [start[0] + length, start[1] + length * pitch, start[2]];
    rod(g, start, end, radius, "paint", 20);
    rod(g, start, [start[0] + length * .26, start[1] + length * pitch * .26, start[2]], radius * 1.6, "panel");
    for (const t of [.36, .74]) cylinder(g, [start[0] + length * t, start[1] + length * pitch * t, start[2]], radius * 1.2, .14, "panel", [0, 0, Math.PI / 2], 20);
    cylinder(g, end, radius * 1.02, .03, "dark", [0, 0, Math.PI / 2], 20);
  }
  function remoteStation(g: THREE.Group, x: number, y: number, z: number) {
    cylinder(g, [x, y + .08, z], .29, .16, "panel");
    box(g, [x, y + .36, z], [.36, .48, .3]);
    box(g, [x + .06, y + .59, z], [.6, .15, .15], "panel");
    cannon(g, [x + .29, y + .60, z], .67, .035, 0);
    optic(g, x + .02, y + .53, z - .28, .9);
    box(g, [x - .04, y + .34, z + .28], [.38, .29, .25], "panel");
  }
  function openMount(g: THREE.Group, x: number, y: number, z: number) {
    cylinder(g, [x, y + .07, z], .23, .13, "panel");
    rod(g, [x, y + .1, z], [x, y + .40, z], .04, "steel");
    box(g, [x + .08, y + .43, z], [.48, .12, .15], "dark");
    cannon(g, [x + .31, y + .43, z], .66, .031, 0);
    box(g, [x - .01, y + .32, z + .19], [.28, .24, .18], "panel");
  }
  function turret(kind: "tank" | "ifv" | "mortar" | "shorad" = "ifv", override?: Partial<VehicleProfile>) {
    const q = { ...p, ...override }, g = groups.mission;
    const x = q.turretX ?? -.25, y = p.roof + .08;
    const l = q.turretLength ?? 1.7, w = q.turretWidth ?? 1.55, h = q.turretHeight ?? .72;
    const sub = new THREE.Group(); sub.position.set(x, y, 0); g.add(sub);
    cylinder(sub, [0, .02, 0], Math.min(w * .43, .95), .18, "panel", undefined, 32);
    shell(sub, l, w, .1, h, kind === "tank" ? .8 : .45);
    if (id === "leopard-2a7" || id === "challenger-3") for (const side of [-1, 1]) {
      const points = [[l / 2 - .9, .12, side * .18], [l / 2 + .42, .21, side * .45], [l / 2 - .2, .68, side * .48], [l / 2 - .7, .66, side * w * .52], [l / 2 + .15, .22, side * w * .48]].map(a => new THREE.Vector3(...a as Point));
      add(sub, new ConvexGeometry(points), [0, 0, 0], "panel");
    }
    const barrel = q.barrel ?? (kind === "mortar" ? 1.05 : 1.8);
    if (kind === "mortar") {
      const twins = id === "cv90";
      for (const z of twins ? [-.19, .19] : [0]) cannon(sub, [l * .42, h * .52, z], barrel, .085, .12);
    } else {
      box(sub, [l * .45, h * .53, 0], [.45, .35, .46], "panel");
      cannon(sub, [l * .55, h * .55, 0], barrel, kind === "tank" ? .085 : .045);
    }
    hatch(sub, -.3, h + .015, .40, kind === "tank" ? .33 : .24);
    optic(sub, .26, h + .14, -.37, kind === "tank" ? 1.35 : 1.05);
    if (kind === "tank") {
      hatch(sub, -.55, h + .015, -.52, .29);
      bustle(sub, -l / 2 - .18, h * .53, 0, w * .88);
      if (id === "t90m" || id === "leclerc-xlr") remoteStation(sub, -.56, h + .07, .56);
      else openMount(sub, -.56, h + .07, .56);
      aerial(sub, -l * .4, h, -w * .37, 1.12);
      aerial(sub, -l * .36, h, w * .36, .93);
    } else aerial(sub, -.58, h, .42, .82);
    for (const side of [-1, 1]) for (let i = 0; i < 4; i++)
      cylinder(sub, [.12 + i * .16, .38, side * (w / 2 + .025)], .052, .22, "panel", [side * .45, 0, -.45], 10);
    if (id === "t90m") {
      for (const side of [-1, 1]) for (let i = 0; i < 6; i++) box(sub, [l * .46 - i * .27, .39, side * (w * .48)], [.24, .30, .16], "edge", [0, side * .12, .1]);
      bustle(sub, -l * .52, .36, 0, 1.8);
    }
    if (id === "m2a2-bradley" || id === "puma-ifv" || kind === "shorad") {
      box(sub, [-.05, .48, w / 2 + .26], [.85, .42, .43], "panel");
      for (const yy of [.35, .61]) cylinder(sub, [.40, yy, w / 2 + .26], .10, .03, "dark", [0, 0, Math.PI / 2]);
    }
    if (kind === "shorad") {
      for (const side of [-1, 1]) box(sub, [-.33, .68, side * (w / 2 + .035)], [.55, .37, .055], "dark");
      optic(sub, .12, h + .27, .18, 1.1);
    }
  }
  function ambulance() {
    const g = groups.mission;
    const length = id === "boxer" ? p.length * .57 : p.length * .7;
    box(g, [-.58, p.roof + .2, 0], [length, .45, p.width * .88]);
    for (const side of [-1, 1]) {
      box(g, [-1, p.roof + .13, side * p.width * .448], [.70, .60, .025], "white");
      box(g, [-1, p.roof + .13, side * p.width * .455], [.42, .12, .026], "red");
      box(g, [-1, p.roof + .13, side * p.width * .456], [.12, .42, .027], "red");
    }
  }
  function cage() {
    const g = groups.mission, top = p.roof + (p.family === "tank" ? 1.8 : 1.55), l = p.length * .58, w = p.width * .9;
    for (const x of [-l / 2, l / 2]) for (const z of [-w / 2, w / 2]) rod(g, [x, p.roof + .1, z], [x, top, z], .022);
    for (let i = 0; i <= 8; i++) rod(g, [-l / 2 + i * l / 8, top, -w / 2], [-l / 2 + i * l / 8, top, w / 2], .013, "panel", 6);
    for (let i = 0; i <= 6; i++) rod(g, [-l / 2, top, -w / 2 + i * w / 6], [l / 2, top, -w / 2 + i * w / 6], .013, "panel", 6);
  }
  function truck() {
    const g = groups.hull, cab = new THREE.Group(); cab.position.x = 3.3; g.add(cab);
    box(g, [0, 1.13, 0], [p.length, .33, 1.75], "dark");
    box(g, [-1.1, 1.43, 0], [6.8, .18, 2.45]);
    shell(cab, 2.8, 2.55, 1.40, 3.15, .40);
    for (const side of [-1, 1]) {
      box(groups.details, [4.43, 2.66, side * .61], [.025, .67, 1.03], "glass", [0, 0, -.12]);
      box(groups.details, [3.66, 2.68, side * 1.19], [1.0, .6, .025], "glass");
      box(groups.details, [3.65, 1.70, side * 1.34], [1.05, .10, .24], "steel");
      rod(groups.details, [4.0, 2.65, side * 1.25], [4.1, 2.7, side * 1.65], .025);
      box(groups.details, [4.1, 2.7, side * 1.65], [.17, .35, .1], "dark");
      box(g, [-.2, 1.79, side * .93], [1.55, .70, .58], "panel");
      box(g, [-3.5, 1.76, side * .96], [1.15, .60, .58], "panel");
    }
    box(groups.details, [4.65, 1.84, 0], [.08, .27, 1.27], "dark");
    const mission = groups.mission;
    cylinder(mission, [-2.25, 1.69, 0], .72, .3, "steel");
    box(mission, [-2.45, 2.27, 0], [1.65, .89, 1.28]);
    cannon(mission, [-1.75, 2.74, 0], 6.7, .13, .075);
    for (const side of [-1, 1]) rod(mission, [-3.7, 1.5, side * .7], [-4.6, 1.15, side * 1.05], .13);
    box(mission, [-4.68, .95, 0], [.27, .67, 2.2], "panel", [0, 0, -.30]);
  }

  if (p.family === "truck") truck();
  else {
    shell(groups.hull, p.length, p.width * .93, .85, p.roof, p.slope ?? 1.2);
    if (id === "boxer") {
      box(groups.hull, [-1.08, p.roof - .38, 0], [p.length * .58, .85, p.width * .95], "paint");
      for (const side of [-1, 1]) for (let i = 0; i < 5; i++) {
        box(groups.details, [-2.7 + i * .76, p.roof - .25, side * p.width * .48], [.70, .70, .055], i % 2 ? "panel" : "paint");
      }
    }
    if (id === "m2a2-bradley" || id === "puma-ifv") for (const side of [-1, 1]) for (let i = 0; i < 6; i++) {
      box(groups.hull, [-p.length * .32 + i * p.length * .12, p.roof - .31, side * (p.width / 2 - .07)], [p.length * .112, .66, .17], "panel");
    }
    const d = groups.details;
    hatch(d, p.length * .27, p.roof + .04, p.width * .22, .30);
    for (let i = 0; i < 3; i++) optic(d, p.length * .28 + .20, p.roof + .07, p.width * .22 - .25 + i * .23, .52);
    grille(d, -p.length * .33, p.roof + .02, -p.width * .20, 1.1, .75);
    grille(d, -p.length * .33, p.roof + .02, p.width * .18, 1.1, .65);
    if (p.family === "wheeled" || p.family === "carrier" || p.family === "ifv") {
      box(d, [-p.length / 2 - .015, (p.roof + .91) / 2, 0], [.07, (p.roof - .9) * .81, p.width * .62], "panel");
      box(d, [-p.length / 2 - .058, 1.18, .54], [.05, .35, .025], "steel");
      for (const z of [-.6, .6]) box(d, [-p.length / 2 - .055, .97, z], [.10, .08, .22], "steel");
      for (const x of [-p.length * .27, -p.length * .08]) hatch(d, x, p.roof + .025, -.2, .30);
      aerial(d, -p.length * .37, p.roof, p.width * .35);
    }
    for (const side of [-1, 1]) {
      box(d, [p.length / 2 - .20, 1.19, side * p.width * .35], [.13, .23, .36], "panel");
      cylinder(d, [p.length / 2 - .11, 1.22, side * p.width * .35], .078, .028, "lamp", [0, 0, Math.PI / 2], 16);
      box(d, [-p.length / 2 - .03, 1.07, side * p.width * .36], [.04, .13, .12], "red");
      rod(d, [p.length / 2 - .28, 1.42, side * p.width * .40], [p.length / 2 - .70, 1.45, side * p.width * .40], .025);
      for (let i = 0; i < 4; i++) box(d, [-p.length * .29 + i * .46, p.roof - .16, side * p.width * .47], [.33, .17, .065], "panel");
    }
  }
  runningGear();

  if (p.family === "tank") turret("tank");
  else if (p.family === "ifv") {
    if (variant === "cv90-mortar") turret("mortar", { turretLength: 2.45, turretHeight: 1.1, barrel: 1.15 });
    else turret("ifv");
  }
  else if (p.family === "radar") {
    const g = groups.mission, t = new THREE.Group(); t.position.y = p.roof; g.add(t);
    shell(t, 2.55, 2.0, .05, 1.35, .45);
    for (const side of [-1, 1]) {
      box(t, [.12, .70, side * 1.28], [1.3, .65, .5], "panel");
      cannon(t, [.69, .91, side * 1.30], 2.6, .058, .065);
      rod(t, [-.2, .91, side * 1.3], [1.1, 1.0, side * 1.3], .08);
    }
    rod(t, [-.80, 1.12, 0], [-.80, 2.13, 0], .09);
    box(t, [-.82, 2.14, 0], [.15, .82, 1.45], "panel", [0, 0, .13]);
    for (let i = 0; i < 10; i++) box(t, [-.72, 2.14, -.67 + i * .149], [.035, .74, .023], "steel", [0, 0, .13]);
    add(t, new THREE.SphereGeometry(.40, 24, 14), [1.29, .91, 0], "panel");
    hatch(t, -.24, 1.40, .42, .27);
  } else if (p.family === "wheeled") {
    if (variant.includes("ambulance")) ambulance();
    else if (variant.includes("nemo")) turret("mortar", { turretLength: 1.6, turretWidth: 1.5, turretHeight: .9, barrel: 1.05 });
    else if (variant.includes("skyranger") || variant.includes("mshorad")) turret("shorad", { turretLength: 2.0, turretWidth: 1.75, turretHeight: .95, barrel: 1.6 });
    else if (variant.includes("dragoon") || variant.includes("rct30") || variant.includes("-ifv") || (id === "vbci" && variant !== "vbci-vpc"))
      turret("ifv", { turretLength: id === "vbci" ? 1.55 : 1.9, turretWidth: 1.55, turretHeight: .78, barrel: 1.9 });
    else if (variant === "stryker-atgm") {
      const g = groups.mission;
      cylinder(g, [-.6, p.roof + .22, 0], .34, .45, "panel");
      for (const z of [-.23, .23]) box(g, [-.5, p.roof + .64, z], [1.35, .26, .30], "panel");
      optic(g, .20, p.roof + .55, .53);
    } else {
      remoteStation(groups.mission, .1, p.roof + .04, -.12);
      if (variant === "vbci-vpc") for (const z of [-.5, .5]) aerial(groups.mission, -1.4, p.roof, z, 1.55);
    }
  } else if (p.family === "carrier") {
    if (variant.includes("ambulance")) ambulance();
    else {
      hatch(groups.mission, .6, p.roof + .03, 0, .43);
      openMount(groups.mission, .55, p.roof + .06, 0);
      if (variant.includes("mortar")) {
        cylinder(groups.mission, [-.7, p.roof + .025, 0], .65, .03, "dark", undefined, 32);
        rod(groups.mission, [-.72, p.roof - .1, 0], [-.15, p.roof + .62, 0], .073, "panel");
      }
    }
  }
  if (variant.includes("cage")) cage();

  // Bake repeated visible details into a few draw calls per assembly for phones.
  root.updateMatrixWorld(true);
  for (const group of Object.values(groups)) {
    const batches = new Map<THREE.Material, THREE.BufferGeometry[]>();
    group.traverse(object => {
      if (!(object instanceof THREE.Mesh)) return;
      const geo = object.geometry.index ? object.geometry.toNonIndexed() : object.geometry.clone();
      geo.applyMatrix4(object.matrixWorld);
      for (const key of Object.keys(geo.attributes)) if (key !== "position" && key !== "normal") geo.deleteAttribute(key);
      if (!geo.getAttribute("normal")) geo.computeVertexNormals();
      const mat = object.material as THREE.Material;
      const batch = batches.get(mat) ?? []; batch.push(geo); batches.set(mat, batch);
      object.geometry.dispose();
    });
    group.clear();
    for (const [mat, geometries] of batches) {
      const geometry = mergeGeometries(geometries);
      geometries.forEach(geo => geo.dispose());
      if (!geometry) throw new Error("외형 결합에 실패했습니다.");
      const mesh = new THREE.Mesh(geometry, mat); mesh.castShadow = true; mesh.receiveShadow = true;
      mesh.name = group.name + "-" + mat.name; group.add(mesh);
    }
  }
  return { root, groups };
}

export function disposeVehicle(root: THREE.Object3D) {
  const materials = new Set<THREE.Material>();
  root.traverse(object => {
    if (object instanceof THREE.Mesh) {
      object.geometry.dispose();
      (Array.isArray(object.material) ? object.material : [object.material]).forEach(mat => materials.add(mat));
    }
  });
  materials.forEach(mat => mat.dispose());
}
