"use client";

import { Canvas } from "@react-three/fiber";
import { ContactShadows, OrbitControls } from "@react-three/drei";
import { materialPalettes } from "@/engine/materials/palettes";
import { createIndicativeModels } from "@/engine/partner/createIndicativeModel";
import { partnerProducts } from "@/lib/partner-store/catalog";
import { PartnerProductMesh } from "./PartnerProductMesh";

function RoomShell() {
  return (
    <group>
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[8, 8]} />
        <meshStandardMaterial color={materialPalettes.oak} />
      </mesh>
      <mesh position={[0, 1.4, -3.2]} receiveShadow>
        <boxGeometry args={[8, 2.8, 0.12]} />
        <meshStandardMaterial color={materialPalettes.plaster} />
      </mesh>
      <mesh position={[-3.4, 1.4, 0]} receiveShadow>
        <boxGeometry args={[0.12, 2.8, 6.4]} />
        <meshStandardMaterial color={materialPalettes.plaster} />
      </mesh>
    </group>
  );
}

type SceneCanvasProps = {
  selectedId: string | null;
  onSelect: (productId: string | null) => void;
};

export function SceneCanvas({ selectedId, onSelect }: SceneCanvasProps) {
  const models = createIndicativeModels(partnerProducts);

  return (
    <div className="h-full min-h-[320px] w-full overflow-hidden rounded-[28px] border border-white/10 bg-[#2a231c]">
      <Canvas
        shadows
        camera={{ position: [4.2, 2.6, 4.8], fov: 38 }}
        onPointerMissed={() => onSelect(null)}
      >
        <color attach="background" args={["#2a231c"]} />
        <ambientLight intensity={0.45} />
        <directionalLight
          position={[4, 6, 3]}
          intensity={1.4}
          castShadow
          shadow-mapSize-width={1024}
          shadow-mapSize-height={1024}
        />
        <RoomShell />
        {models.map((model) => (
          <PartnerProductMesh
            key={model.productId}
            model={model}
            selected={selectedId === model.productId}
            onSelect={onSelect}
          />
        ))}
        <ContactShadows position={[0, 0.01, 0]} opacity={0.4} scale={10} blur={2.2} />
        <OrbitControls
          enablePan={false}
          minDistance={4}
          maxDistance={9}
          maxPolarAngle={Math.PI / 2.1}
        />
      </Canvas>
    </div>
  );
}
