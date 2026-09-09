import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { GLTFExporter } from "three/examples/jsm/exporters/GLTFExporter.js";
import { buildVehicleModel, disposeVehicle } from "../vehicle3d/geometry";
import { assemblies, unavailableVariants, type AssemblyKey } from "../vehicle3d/profiles";
import referenceData from "../vehicle3d/photo-references.json";
import type { ModelReference } from "../vehicle3d/references";
import type { Equipment, EquipmentVariant } from "../types";

type Runtime = {
  root: THREE.Group; groups: Record<AssemblyKey, THREE.Group>; camera: THREE.PerspectiveCamera;
  controls: OrbitControls; center: THREE.Vector3; radius: number; highlight: THREE.BoxHelper;
};
type Props = { equipment: Equipment; variants: EquipmentVariant[] };
const referenceIndex = new Map((referenceData as ModelReference[]).map(item => [item.equipmentId, item]));

export default function VehicleModelPanel({ equipment, variants }: Props) {
  const mountRef = useRef<HTMLDivElement>(null);
  const runtimeRef = useRef<Runtime | null>(null);
  const [variant, setVariant] = useState("base");
  const [rotating, setRotating] = useState(false);
  const [visible, setVisible] = useState<Record<AssemblyKey, boolean>>({ hull: true, running: true, mission: true, details: true });
  const [selectedPart, setSelectedPart] = useState<AssemblyKey | null>(null);
  const [error, setError] = useState("");
  const [saveStatus, setSaveStatus] = useState("");
  const [saving, setSaving] = useState(false);
  const reference = referenceIndex.get(equipment.id);
  const currentVariant = variants.find(item => item.id === variant);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;
    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false, powerPreference: "low-power" });
    } catch {
      const timeout = window.setTimeout(() => setError("이 브라우저에서는 3D 화면을 열 수 없습니다. 아래 외형 설명과 참고 사진을 확인해 주세요."), 0);
      return () => window.clearTimeout(timeout);
    }
    const scene = new THREE.Scene();
    scene.background = new THREE.Color("#19282f");
    const camera = new THREE.PerspectiveCamera(36, 1, .05, 120);
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = .09;
    controls.minPolarAngle = .03;
    controls.maxPolarAngle = Math.PI * .52;
    controls.enablePan = true;
    controls.autoRotateSpeed = .6;
    controls.listenToKeyEvents(renderer.domElement);
    renderer.domElement.tabIndex = 0;
    renderer.domElement.setAttribute("aria-label", equipment.name + " 3D 외형. 드래그로 회전하고 두 손가락으로 확대합니다.");
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.75));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.25;
    mount.appendChild(renderer.domElement);
    const { root, groups } = buildVehicleModel(equipment.id, variant);
    root.userData.sources = reference?.sources.map(s => s.url) ?? [];
    root.userData.referenceVariant = reference?.exactVariant ?? equipment.name;
    scene.add(root);
    const bounds = new THREE.Box3().setFromObject(root);
    const center = bounds.getCenter(new THREE.Vector3());
    const size = bounds.getSize(new THREE.Vector3());
    const radius = Math.max(size.x, size.y, size.z);
    controls.target.copy(center);
    camera.position.copy(center).add(new THREE.Vector3(1.25, .78, 1.25).multiplyScalar(radius));
    controls.minDistance = radius * .42;
    controls.maxDistance = radius * 3.6;
    controls.update();
    const hemi = new THREE.HemisphereLight("#d8e9f2", "#606057", 2.6); scene.add(hemi);
    const key = new THREE.DirectionalLight("#fff3df", 3.7);
    key.position.set(6, 12, 9); key.castShadow = true;
    key.shadow.mapSize.set(1024, 1024);
    key.shadow.camera.left = key.shadow.camera.bottom = -12;
    key.shadow.camera.right = key.shadow.camera.top = 12;
    key.shadow.normalBias = .035; scene.add(key);
    const fill = new THREE.DirectionalLight("#89adca", 1.8); fill.position.set(-8, 5, -6); scene.add(fill);
    const floor = new THREE.Mesh(new THREE.CircleGeometry(radius * 1.6, 64), new THREE.MeshStandardMaterial({ color: "#23343b", roughness: 1 }));
    floor.rotation.x = -Math.PI / 2; floor.position.y = .055; floor.receiveShadow = true; scene.add(floor);
    const grid = new THREE.GridHelper(radius * 2.9, 24, "#547079", "#344b53");
    grid.position.y = .06; scene.add(grid);
    const highlight = new THREE.BoxHelper(root, "#e0c774"); highlight.visible = false; scene.add(highlight);
    runtimeRef.current = { root, groups, camera, controls, center, radius, highlight };
    const resize = () => {
      const width = Math.max(mount.clientWidth, 1), height = Math.max(mount.clientHeight, 1);
      camera.aspect = width / height; camera.updateProjectionMatrix(); renderer.setSize(width, height, false);
    };
    resize();
    const observer = new ResizeObserver(resize); observer.observe(mount);
    let onScreen = true;
    const intersection = new IntersectionObserver(entries => { onScreen = entries[0]?.isIntersecting ?? true; });
    intersection.observe(mount);
    let animation = 0;
    const animate = () => {
      animation = requestAnimationFrame(animate);
      if (!onScreen || document.hidden) return;
      controls.update(); renderer.render(scene, camera);
    };
    animate();
    let pointerStart: [number, number] = [0, 0];
    const down = (e: PointerEvent) => { pointerStart = [e.clientX, e.clientY]; };
    const up = (e: PointerEvent) => {
      if (Math.hypot(e.clientX - pointerStart[0], e.clientY - pointerStart[1]) > 6) return;
      const rect = renderer.domElement.getBoundingClientRect();
      const pointer = new THREE.Vector2((e.clientX - rect.left) / rect.width * 2 - 1, -(e.clientY - rect.top) / rect.height * 2 + 1);
      const ray = new THREE.Raycaster(); ray.setFromCamera(pointer, camera);
      const candidates = Object.values(groups).filter(group => group.visible);
      const hit = ray.intersectObjects(candidates, true)[0];
      let node: THREE.Object3D | null = hit?.object ?? null;
      while (node && !node.userData.assembly) node = node.parent;
      setSelectedPart((node?.userData.assembly as AssemblyKey | undefined) ?? null);
    };
    renderer.domElement.addEventListener("pointerdown", down);
    renderer.domElement.addEventListener("pointerup", up);
    return () => {
      cancelAnimationFrame(animation); observer.disconnect(); intersection.disconnect();
      renderer.domElement.removeEventListener("pointerdown", down);
      renderer.domElement.removeEventListener("pointerup", up);
      controls.dispose(); disposeVehicle(root);
      floor.geometry.dispose(); floor.material.dispose();
      grid.geometry.dispose(); (grid.material as THREE.Material).dispose();
      highlight.geometry.dispose(); (highlight.material as THREE.Material).dispose();
      renderer.dispose(); renderer.forceContextLoss(); renderer.domElement.remove(); runtimeRef.current = null;
    };
  }, [equipment.id, equipment.name, variant, reference]);

  useEffect(() => {
    const runtime = runtimeRef.current;
    if (runtime) runtime.controls.autoRotate = rotating;
  }, [rotating, variant]);

  useEffect(() => {
    const runtime = runtimeRef.current;
    if (!runtime) return;
    for (const { key } of assemblies) runtime.groups[key].visible = visible[key];
    runtime.highlight.visible = Boolean(selectedPart && visible[selectedPart]);
    if (selectedPart && visible[selectedPart]) runtime.highlight.setFromObject(runtime.groups[selectedPart]);
  }, [visible, selectedPart, variant]);

  function view(direction: "perspective" | "front" | "side" | "rear" | "top") {
    const runtime = runtimeRef.current; if (!runtime) return;
    const directions = { perspective: [1.25, .78, 1.25], front: [1.9, .25, 0], side: [0, .25, 1.9], rear: [-1.9, .25, 0], top: [.001, 2.15, 0] };
    runtime.controls.target.copy(runtime.center);
    runtime.camera.position.copy(runtime.center).add(new THREE.Vector3(...directions[direction] as [number, number, number]).multiplyScalar(runtime.radius));
    runtime.controls.update();
  }
  function zoom(factor: number) {
    const runtime = runtimeRef.current; if (!runtime) return;
    const delta = runtime.camera.position.clone().sub(runtime.controls.target);
    delta.setLength(THREE.MathUtils.clamp(delta.length() * factor, runtime.controls.minDistance, runtime.controls.maxDistance));
    runtime.camera.position.copy(runtime.controls.target).add(delta); runtime.controls.update();
  }
  async function saveModel() {
    const runtime = runtimeRef.current; if (!runtime || saving) return;
    setSaving(true); setSaveStatus("");
    const exportRoot = runtime.root.clone(true);
    // Always export the complete selected configuration, even when a layer is hidden.
    exportRoot.traverse(object => { object.visible = true; });
    try {
      const binary = await new GLTFExporter().parseAsync(exportRoot, { binary: true, onlyVisible: false });
      if (!(binary instanceof ArrayBuffer)) throw new Error("GLB export failed");
      const url = URL.createObjectURL(new Blob([binary], { type: "model/gltf-binary" }));
      const a = document.createElement("a"); a.href = url; a.download = equipment.id + "-" + variant + "-reference.glb"; a.click();
      setTimeout(() => URL.revokeObjectURL(url), 1000);
      setSaveStatus("선택한 구성의 외형 모델을 저장했습니다. 실측 CAD가 아닌 참고 모델입니다.");
    } catch { setSaveStatus("모델을 저장하지 못했습니다. 다시 시도해 주세요."); }
    finally { setSaving(false); }
  }
  const selectedAssembly = assemblies.find(item => item.key === selectedPart);
  return (
    <section className="vehicle-model-section" id="vehicle-3d" aria-labelledby="vehicle-model-title">
      <div className="model-section-heading">
        <div><p className="eyebrow">Vehicle exterior</p><h2 id="vehicle-model-title">{equipment.name} 3D 외형</h2></div>
        <span className="model-reconstruction-badge">사진 참고 · 비례 추정</span>
      </div>
      <div className="vehicle-model-layout">
        <div className="model-main">
          <div className="model-stage" ref={mountRef}>
            {error ? <p className="model-error" role="status">{error}</p> : null}
          </div>
          <div className="model-view-controls" aria-label="3D 시점">
            <button type="button" onClick={() => view("perspective")}>기본 시점</button>
            <button type="button" onClick={() => view("front")}>전면</button>
            <button type="button" onClick={() => view("side")}>측면</button>
            <button type="button" onClick={() => view("rear")}>후면</button>
            <button type="button" onClick={() => view("top")}>상부</button>
            <button type="button" onClick={() => zoom(.8)} aria-label="3D 확대">확대 +</button>
            <button type="button" onClick={() => zoom(1.25)} aria-label="3D 축소">축소 −</button>
            <button type="button" aria-pressed={rotating} onClick={() => setRotating(!rotating)}>{rotating ? "회전 멈춤" : "자동 회전"}</button>
          </div>
          <p className="model-help">드래그로 회전 · 휠 또는 두 손가락으로 확대 · 형상을 누르면 구성 선택</p>
        </div>
        <aside className="model-sidebar" aria-label="3D 구성과 형상 설명">
          <label className="model-variant-label">임무장비 구성
            <select value={variant} onChange={e => { setVariant(e.target.value); setSelectedPart(null); setSaveStatus(""); setError(""); }}>
              <option value="base">기본 외형</option>
              {variants.map(item => <option key={item.id} value={item.id} disabled={unavailableVariants.has(item.id)}>{item.nameKo}{unavailableVariants.has(item.id) ? " — 형상 미확인" : ""}</option>)}
            </select>
          </label>
          <p className="model-variant-note">{currentVariant ? currentVariant.nameKo + "의 임무장비 배치를 단순화한 참고 외형입니다. 세부 장착 형상은 차량마다 다릅니다." : (reference?.exactVariant ?? equipment.name) + "의 대표적인 외형을 참고했습니다."}</p>
          <div className="model-assembly-list">
            {assemblies.map(item => <div className="model-assembly-row" key={item.key}>
              <label><input type="checkbox" checked={visible[item.key]} onChange={e => setVisible({ ...visible, [item.key]: e.target.checked })} /><span>{item.label}</span></label>
              <button type="button" aria-pressed={selectedPart === item.key} onClick={() => setSelectedPart(selectedPart === item.key ? null : item.key)}>선택</button>
            </div>)}
          </div>
          <p className="model-selection" role="status">{selectedAssembly ? selectedAssembly.description : "차체·주행장치·임무장비·외부 부속을 각각 확인할 수 있습니다."}</p>
          <button type="button" className="model-download" onClick={saveModel} disabled={saving || Boolean(error)}>{saving ? "모델 저장 중…" : "3D 모델 저장 (.glb)"}</button>
          {saveStatus ? <p className="model-help" role="status">{saveStatus}</p> : null}
        </aside>
      </div>
      <div className="model-reference-grid">
        <article><h3>{reference?.inspectionStatus === "photo-checked" ? "사진에서 확인한 외형" : "외형 확인 항목"}</h3><p className="model-help">{reference?.inspectionStatus === "photo-checked" ? "참고 사진을 직접 확인했습니다. 3D의 비례와 세부 부품은 단순화했습니다." : "공개 자료는 확인했으며, 사진 직접 검토가 필요한 항목이 있습니다."}</p><ul>{(reference?.externalFeaturesKo ?? ["차체, 주행장치와 상부 장비의 대표 외형을 구분합니다."]).map(text => <li key={text}>{text}</li>)}</ul></article>
        <article><h3>임무장비와 재현 범위</h3><ul>{(reference?.missionEquipmentKo ?? ["선택한 임무형의 상부 장비 배치를 참고용으로 표시합니다."]).map(text => <li key={text}>{text}</li>)}</ul><p className="model-uncertainty">{reference?.uncertaintyKo} 사진으로 확인되지 않는 부분과 치수는 추정입니다. 실측 CAD·사진측량 복원 모델이 아닙니다.</p></article>
      </div>
      <div className="model-photo-sources" aria-label="외형 참고 사진 출처">
        {(reference?.sources ?? equipment.sources.map(s => ({ title: s.title, url: s.url, publisher: "공개 출처" }))).map(source =>
          <a key={source.url} href={source.url} target="_blank" rel="noreferrer"><span>{source.publisher}</span><strong>{source.title}</strong><small>사진·원문 보기 ↗</small></a>
        )}
      </div>
    </section>
  );
}
