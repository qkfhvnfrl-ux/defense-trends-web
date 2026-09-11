import { openEquipmentBrief } from "../export/equipmentBrief";
import { VariantComparison } from "./VariantComparison";
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
  capture: () => string; root: THREE.Group; groups: Record<AssemblyKey, THREE.Group>; camera: THREE.PerspectiveCamera;
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
  const [photoIndex, setPhotoIndex] = useState(0);
  const [failedPhoto, setFailedPhoto] = useState("");
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
    scene.background = new THREE.Color("#12212c");
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
    const floor = new THREE.Mesh(new THREE.CircleGeometry(radius * 1.6, 64), new THREE.MeshStandardMaterial({ color: "#203342", roughness: 1 }));
    floor.rotation.x = -Math.PI / 2; floor.position.y = .055; floor.receiveShadow = true; scene.add(floor);
    const grid = new THREE.GridHelper(radius * 2.9, 24, "#557288", "#2c4355");
    grid.position.y = .06; scene.add(grid);
    const highlight = new THREE.BoxHelper(root, "#e0c774"); highlight.visible = false; scene.add(highlight);
    runtimeRef.current = { root, groups, camera, controls, center, radius, highlight, capture: () => { renderer.render(scene, camera); return renderer.domElement.toDataURL("image/png"); } };
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
  function saveBrief() {
    let capture: string | undefined;
    try { capture = runtimeRef.current?.capture(); } catch { /* Text-only export remains available. */ }
    const opened = openEquipmentBrief(equipment, currentVariant, capture);
    setSaveStatus(opened ? "요약 화면을 열었습니다. ‘인쇄 / PDF로 저장’을 누른 뒤 PDF로 저장을 선택하세요." : "요약 화면을 열지 못했습니다. 이 사이트의 팝업을 허용한 뒤 다시 눌러 주세요.");
  }
  const selectedAssembly = assemblies.find(item => item.key === selectedPart);
  const missionTitle = currentVariant?.nameKo ?? equipment.name + " 기본 구성";
  const missionArmament = currentVariant?.armament ?? equipment.specs["주무장"] ?? equipment.specs["무장"] ?? equipment.specs["주요 무장"] ?? equipment.specs["주포"];
  const closeInfo = () => setSelectedPart(null);
  const photoSources = reference?.sources.filter(source => source.imageUrl) ?? [];
  const photo = photoSources[photoIndex] ?? photoSources[0];
  const partWords: Record<AssemblyKey, RegExp> = { hull: /차체|전면|측면|장갑|램프|병력실/, running: /바퀴|타이어|차륜|궤도|휠|현수/, mission: /포탑|포신|주포|무장|레이더|모듈|미사일/, details: /안테나|해치|적재|부속|배기|그릴/ };
  const observations = photo?.observedFeatures ?? reference?.externalFeaturesKo ?? [];
  const relatedObservations = selectedPart ? observations.filter(text => partWords[selectedPart].test(text)) : observations;

  return (
    <section className="vehicle-model-section" id="vehicle-3d" aria-labelledby="vehicle-model-title">
      <div className="model-section-heading">
        <div><p className="eyebrow">Vehicle exterior</p><h2 id="vehicle-model-title">{equipment.name} 3D 외형</h2></div>
        <span className="model-reconstruction-badge">사진 참고 · 비례 추정</span>
      </div>
      <div className="vehicle-model-layout">
        <div className="model-main">
          <div className="model-stage" ref={mountRef} onKeyDown={e => { if (e.key === "Escape") closeInfo(); }}>
            <span className="model-stage-label">{equipment.name} · {currentVariant?.nameKo ?? "기본 외형"}</span>
            {error ? <p className="model-error" role="status">{error}</p> : null}
            {selectedAssembly && visible[selectedAssembly.key] ? (
              <aside className="model-part-popover" aria-label="선택 장비 정보" aria-live="polite">
                <div className="model-popover-heading"><span>{selectedAssembly.label}</span><button type="button" onClick={closeInfo} aria-label="장비 정보 닫기">×</button></div>
                <h3>{selectedPart === "mission" ? missionTitle : selectedAssembly.label}</h3>
                {selectedPart === "mission" ? <>
                  {missionArmament ? <p><strong>탑재 장비</strong> {missionArmament}</p> : null}
                  <p>{currentVariant?.role ?? equipment.roleTags.join(" · ")}</p>
                  <p>{currentVariant?.notesKo ?? reference?.missionEquipmentKo[0] ?? selectedAssembly.description}</p>
                  <small>선택 구성의 대표 장비입니다. 세부 장착품은 운용형마다 다를 수 있습니다.</small>
                  {(currentVariant?.sources[0] ?? reference?.sources[0]) ? <a href={(currentVariant?.sources[0] ?? reference?.sources[0])?.url} target="_blank" rel="noreferrer">장비 출처 보기 ↗</a> : null}
                </> : <p>{selectedAssembly.description}</p>}
              </aside>
            ) : null}
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
          <p className="model-help">드래그로 회전 · 휠 또는 두 손가락으로 확대 · 임무장비를 누르면 장비 정보 표시</p>
          <section className="photo-correspondence" aria-label="실사진과 3D 대응 보기">
            <h3>실사진과 함께 보기</h3>
            <p>{reference?.exactVariant ?? equipment.name}</p>
            {variant !== "base" && <p className="model-uncertainty">현재 선택한 파생형의 사진이 아닐 수 있습니다. 아래 사진은 기본 외형의 참고 자료입니다.</p>}
            {photoSources.length > 1 && <label>참고 사진 <select value={photoIndex} onChange={e => { setPhotoIndex(Number(e.target.value)); setFailedPhoto(""); }}>{photoSources.map((source, i) => <option key={source.url} value={i}>{source.title}</option>)}</select></label>}
            {photo?.imageUrl && failedPhoto !== photo.imageUrl ? <a href={photo.imageUrl} target="_blank" rel="noreferrer"><img src={photo.imageUrl} alt={`${reference?.exactVariant ?? equipment.name} 공개 참고 사진`} loading="lazy" referrerPolicy="no-referrer" onError={() => setFailedPhoto(photo.imageUrl ?? "")} /></a> : <p role="status">{photo ? "원본 서버에서 사진을 불러오지 못했습니다. 아래 원문에서 확인해 주세요." : "직접 표시할 사진이 확인되지 않았습니다. 아래 사진·원문 출처에서 확인해 주세요."}</p>}
            <div className="model-view-controls" aria-label="사진에서 비교할 부위">{assemblies.map(part => <button type="button" key={part.key} aria-pressed={selectedPart === part.key} onClick={() => { setSelectedPart(part.key); setVisible(previous => ({ ...previous, [part.key]: true })); }}>{part.label}</button>)}</div>
            <strong>{selectedAssembly ? `${selectedAssembly.label} · 사진 관찰 항목` : "사진 관찰 항목"}</strong>
            {relatedObservations.length ? <ul>{relatedObservations.map(text => <li key={text}>{text}</li>)}</ul> : <p>이 부위의 사진 관찰 기록은 없습니다. 3D 형상은 추정이 포함됩니다.</p>}
            {photo && <a href={photo.url} target="_blank" rel="noreferrer">{photo.publisher} · {photo.title} ↗</a>}
            <small>부위를 고르면 3D의 같은 구성 그룹을 강조합니다. 사진의 특정 픽셀이나 치수를 자동 정합한 결과는 아닙니다.</small>
          </section>
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
          <button type="button" className="model-download" onClick={saveBrief}>장비 요약 PDF 저장</button>
          {saveStatus ? <p className="model-help" role="status">{saveStatus}</p> : null}
        </aside>
      </div>
      <VariantComparison equipment={equipment} variants={variants} onPreview={id => { setVariant(id); setSelectedPart("mission"); setVisible(previous => ({ ...previous, mission: true })); mountRef.current?.scrollIntoView({ behavior: "smooth", block: "center" }); }} />
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
