import { Canvas } from "@react-three/fiber";
import { Bounds, Html, OrbitControls, useGLTF } from "@react-three/drei";
import { Suspense, useEffect, useState } from "react";
import type { ComponentSpec, Equipment } from "../types";
import { publicPath } from "../publicPath";

type Props = {
  equipment: Equipment;
  components: ComponentSpec[];
  onComponentSelect: (component: ComponentSpec) => void;
};

type Preset = "Basic APC" | "IFV Upgrade" | "C-UAS Package" | "Medical Evacuation" | "Command Post" | "Field Adaptation Package";

function GltfVehicle({ path }: { path: string }) {
  const gltf = useGLTF(path);
  return <primitive object={gltf.scene} />;
}

function VehicleModel({ path, category }: { path: string; category: Equipment["category"] }) {
  const [hasModel, setHasModel] = useState(false);
  const modelUrl = publicPath(path);

  useEffect(() => {
    let active = true;
    fetch(modelUrl, { method: "HEAD" })
      .then((response) => {
        const contentType = response.headers.get("content-type") ?? "";
        const isModel =
          response.ok &&
          !contentType.includes("text/html") &&
          (contentType.includes("model/gltf") ||
            contentType.includes("application/octet-stream") ||
            contentType.includes("binary") ||
            modelUrl.endsWith(".glb") ||
            modelUrl.endsWith(".gltf"));
        if (active) setHasModel(isModel);
      })
      .catch(() => {
        if (active) setHasModel(false);
      });
    return () => {
      active = false;
    };
  }, [modelUrl]);

  return hasModel ? <GltfVehicle path={modelUrl} /> : <PlaceholderVehicle category={category} />;
}

function PlaceholderVehicle({ category }: { category: Equipment["category"] }) {
  const isTank = category === "tank";
  const isTracked = category === "tank" || category === "tracked-ifv" || category === "tracked-apc" || category === "air-defense";
  const isArtillery = category === "artillery";
  const isAirDefense = category === "air-defense";
  const bodyLength = isArtillery ? 4.5 : isTank ? 3.9 : 3.6;
  const bodyHeight = isArtillery ? 0.62 : isTank ? 0.78 : 0.9;
  const bodyWidth = isArtillery ? 1.45 : 1.65;
  return (
    <group>
      <mesh position={[0, 0.45, 0]}>
        <boxGeometry args={[bodyLength, bodyHeight, bodyWidth]} />
        <meshStandardMaterial color={isTank ? "#516052" : "#5d665e"} roughness={0.8} metalness={0.2} />
      </mesh>
      <mesh position={[0, 0.98, 0]}>
        <boxGeometry args={isTank ? [1.45, 0.45, 1.15] : isAirDefense ? [1.2, 0.72, 1.05] : [1.1, 0.35, 1]} />
        <meshStandardMaterial color="#687062" roughness={0.75} />
      </mesh>
      {isTank || isArtillery ? (
        <mesh position={[1.2, 1.02, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[isArtillery ? 0.06 : 0.08, isArtillery ? 0.06 : 0.08, isArtillery ? 3.3 : 2.3, 24]} />
          <meshStandardMaterial color="#333a35" />
        </mesh>
      ) : null}
      {isAirDefense ? (
        <>
          <mesh position={[0.88, 1.12, 0.42]} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.04, 0.04, 1.3, 16]} />
            <meshStandardMaterial color="#252d28" />
          </mesh>
          <mesh position={[0.88, 1.12, -0.42]} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.04, 0.04, 1.3, 16]} />
            <meshStandardMaterial color="#252d28" />
          </mesh>
          <mesh position={[-0.2, 1.55, 0]} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.34, 0.34, 0.08, 32]} />
            <meshStandardMaterial color="#2f3c36" wireframe />
          </mesh>
        </>
      ) : null}
      {Array.from({ length: 8 }).map((_, index) => {
        const x = -1.55 + index * 0.44;
        return (
          <group key={index}>
            {isTracked ? (
              <>
                <mesh position={[x, 0.12, 0.92]} rotation={[Math.PI / 2, 0, 0]}>
                  <cylinderGeometry args={[0.22, 0.22, 0.16, 24]} />
                  <meshStandardMaterial color="#202520" />
                </mesh>
                <mesh position={[x, 0.12, -0.92]} rotation={[Math.PI / 2, 0, 0]}>
                  <cylinderGeometry args={[0.22, 0.22, 0.16, 24]} />
                  <meshStandardMaterial color="#202520" />
                </mesh>
              </>
            ) : index % 2 === 0 ? (
              <>
                <mesh position={[x, 0.1, 0.82]} rotation={[Math.PI / 2, 0, 0]}>
                  <cylinderGeometry args={[0.25, 0.25, 0.18, 24]} />
                  <meshStandardMaterial color="#202520" />
                </mesh>
                <mesh position={[x, 0.1, -0.82]} rotation={[Math.PI / 2, 0, 0]}>
                  <cylinderGeometry args={[0.25, 0.25, 0.18, 24]} />
                  <meshStandardMaterial color="#202520" />
                </mesh>
              </>
            ) : null}
          </group>
        );
      })}
    </group>
  );
}

function VirtualModules({ activeModules, compareMode }: { activeModules: string[]; compareMode: boolean }) {
  return (
    <group position={compareMode ? [0.9, 0, 0] : [0, 0, 0]}>
      {activeModules.includes("Drone Cage") ? (
        <mesh position={[0, 1.55, 0]}>
          <boxGeometry args={[4.2, 0.08, 1.95]} />
          <meshStandardMaterial color="#f0d58a" transparent opacity={0.42} wireframe />
        </mesh>
      ) : null}
      {activeModules.includes("RCWS") ? (
        <mesh position={[-0.25, 1.55, 0]}>
          <boxGeometry args={[0.45, 0.28, 0.45]} />
          <meshStandardMaterial color="#2f7569" />
        </mesh>
      ) : null}
      {activeModules.includes("30mm") ? (
        <mesh position={[1.15, 1.28, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.055, 0.055, 1.55, 18]} />
          <meshStandardMaterial color="#1b2420" />
        </mesh>
      ) : null}
      {activeModules.includes("APS") ? (
        <>
          <mesh position={[0.95, 1.1, 0.9]}>
            <sphereGeometry args={[0.12, 18, 18]} />
            <meshStandardMaterial color="#356a8a" />
          </mesh>
          <mesh position={[-0.95, 1.1, -0.9]}>
            <sphereGeometry args={[0.12, 18, 18]} />
            <meshStandardMaterial color="#356a8a" />
          </mesh>
        </>
      ) : null}
      {activeModules.includes("EW") ? (
        <mesh position={[0.2, 1.82, -0.35]}>
          <coneGeometry args={[0.14, 0.55, 16]} />
          <meshStandardMaterial color="#b98228" />
        </mesh>
      ) : null}
    </group>
  );
}

export function ModelViewer({ equipment, components, onComponentSelect }: Props) {
  const [showLabels, setShowLabels] = useState(true);
  const [compareMode, setCompareMode] = useState(false);
  const [preset, setPreset] = useState<Preset>("Field Adaptation Package");
  const presetModules: Record<Preset, string[]> = {
    "Basic APC": ["RCWS"],
    "IFV Upgrade": ["30mm", "RCWS"],
    "C-UAS Package": ["30mm", "EW"],
    "Medical Evacuation": [],
    "Command Post": ["EW"],
    "Field Adaptation Package": ["Drone Cage", "EW", "RCWS"]
  };
  const activeModules = presetModules[preset];

  return (
    <article className="viewer-panel">
      <div className="viewer-heading">
        <div>
          <p className="eyebrow">Interactive 3D</p>
          <h2>{equipment.name} 형상</h2>
        </div>
        <span className="model-badge">GLB 교체 가능</span>
      </div>
      <div className="viewer-controls">
        <label>
          <input type="checkbox" checked={showLabels} onChange={(event) => setShowLabels(event.target.checked)} />
          라벨
        </label>
        <label>
          <input type="checkbox" checked={compareMode} onChange={(event) => setCompareMode(event.target.checked)} />
          비교 모드
        </label>
        <select value={preset} onChange={(event) => setPreset(event.target.value as Preset)}>
          {Object.keys(presetModules).map((key) => <option key={key}>{key}</option>)}
        </select>
      </div>
      <div className="canvas-frame">
        <Canvas camera={{ position: [4, 3, 4], fov: 42 }}>
          <ambientLight intensity={0.8} />
          <directionalLight position={[5, 6, 4]} intensity={1.8} />
          <Suspense fallback={null}>
            <Bounds fit clip observe margin={1.35}>
              <VehicleModel path={equipment.modelPath} category={equipment.category} />
              {compareMode ? <group position={[-1.9, 0, 0]}><PlaceholderVehicle category={equipment.category} /></group> : null}
              <VirtualModules activeModules={activeModules} compareMode={compareMode} />
              {showLabels
                ? components.map((component) => (
                    <Html key={component.id} position={component.hotspotPosition} center>
                      <button className="hotspot" type="button" onClick={() => onComponentSelect(component)}>
                        {component.nameKo}
                      </button>
                    </Html>
                  ))
                : null}
            </Bounds>
          </Suspense>
          <OrbitControls makeDefault enablePan={false} minDistance={2.5} maxDistance={8} />
        </Canvas>
      </div>
      <p className="viewer-caption">
        현재 형상은 플레이스홀더 또는 GLB 기반입니다. 오버레이는 개념 비교용이며 제작법이나 취약점 설명이 아닌 공개 자료 기반 시각화입니다.
      </p>
    </article>
  );
}
