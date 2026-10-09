"use client";

import { useState } from "react";
import { useCursor } from "@react-three/drei";
import { useSafeMaterialTexture } from "@/engine/partner/useSafeMaterialTexture";
import type { IndicativeModel, ProductCategory } from "@/lib/partner-store/types";

type PartnerProductMeshProps = {
  model: IndicativeModel;
  selected: boolean;
  onSelect: (productId: string) => void;
};

function Silhouette({
  category,
  size,
  color,
  map,
}: {
  category: ProductCategory;
  size: IndicativeModel["size"];
  color: string;
  map: ReturnType<typeof useSafeMaterialTexture>;
}) {
  const { width: w, depth: d, height: h } = size;

  if (category === "floor-lamp") {
    return (
      <group>
        <mesh position={[0, 0.03, 0]} castShadow>
          <cylinderGeometry args={[w * 0.28, w * 0.34, 0.05, 24]} />
          <meshStandardMaterial color="#8a7358" metalness={0.55} roughness={0.35} />
        </mesh>
        <mesh position={[0, h * 0.42, 0]} castShadow>
          <cylinderGeometry args={[0.022, 0.028, h * 0.78, 16]} />
          <meshStandardMaterial color={color} metalness={0.75} roughness={0.25} />
        </mesh>
        <mesh position={[0, h * 0.88, 0]} castShadow>
          <coneGeometry args={[Math.max(w * 0.38, 0.16), h * 0.22, 24]} />
          <meshStandardMaterial
            map={map}
            color="#f4efe6"
            emissive="#f7f1e6"
            emissiveIntensity={0.22}
          />
        </mesh>
      </group>
    );
  }

  if (category === "rug") {
    return (
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.015, 0]}>
        <planeGeometry args={[w, d]} />
        <meshStandardMaterial map={map} color={color} roughness={0.95} />
      </mesh>
    );
  }

  if (category === "coffee-table" || category === "table") {
    return (
      <group>
        <mesh position={[0, h * 0.85, 0]} castShadow>
          <boxGeometry args={[w, h * 0.18, d]} />
          <meshStandardMaterial map={map} color={color} roughness={0.55} />
        </mesh>
        <mesh position={[-w * 0.38, h * 0.4, -d * 0.35]} castShadow>
          <boxGeometry args={[0.06, h * 0.75, 0.06]} />
          <meshStandardMaterial color="#8a7358" />
        </mesh>
        <mesh position={[w * 0.38, h * 0.4, -d * 0.35]} castShadow>
          <boxGeometry args={[0.06, h * 0.75, 0.06]} />
          <meshStandardMaterial color="#8a7358" />
        </mesh>
        <mesh position={[-w * 0.38, h * 0.4, d * 0.35]} castShadow>
          <boxGeometry args={[0.06, h * 0.75, 0.06]} />
          <meshStandardMaterial color="#8a7358" />
        </mesh>
        <mesh position={[w * 0.38, h * 0.4, d * 0.35]} castShadow>
          <boxGeometry args={[0.06, h * 0.75, 0.06]} />
          <meshStandardMaterial color="#8a7358" />
        </mesh>
      </group>
    );
  }

  if (category === "armchair") {
    return (
      <group>
        <mesh position={[0, h * 0.28, 0.02]} castShadow>
          <boxGeometry args={[w, h * 0.38, d * 0.78]} />
          <meshStandardMaterial map={map} color={color} roughness={0.88} />
        </mesh>
        <mesh position={[0, h * 0.62, -d * 0.28]} castShadow>
          <boxGeometry args={[w, h * 0.52, d * 0.18]} />
          <meshStandardMaterial map={map} color={color} roughness={0.88} />
        </mesh>
      </group>
    );
  }

  return (
    <group>
      <mesh position={[0, h * 0.28, 0.04]} castShadow>
        <boxGeometry args={[w, h * 0.4, d * 0.82]} />
        <meshStandardMaterial map={map} color={color} roughness={0.88} />
      </mesh>
      <mesh position={[0, h * 0.64, -d * 0.34]} castShadow>
        <boxGeometry args={[w, h * 0.58, 0.14]} />
        <meshStandardMaterial map={map} color={color} roughness={0.88} />
      </mesh>
    </group>
  );
}

export function PartnerProductMesh({
  model,
  selected,
  onSelect,
}: PartnerProductMeshProps) {
  const [hovered, setHovered] = useState(false);
  const texture = useSafeMaterialTexture(model.accentColor);
  useCursor(hovered);

  return (
    <group
      position={model.position}
      rotation={[0, model.rotationY, 0]}
      onClick={(event) => {
        event.stopPropagation();
        onSelect(model.productId);
      }}
      onPointerOver={(event) => {
        event.stopPropagation();
        setHovered(true);
      }}
      onPointerOut={() => setHovered(false)}
    >
      <Silhouette
        category={model.category}
        size={model.size}
        color={model.accentColor}
        map={texture}
      />
      {selected ? (
        <mesh position={[0, 0.01, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry
            args={[
              Math.max(model.size.width, model.size.depth) * 0.55,
              Math.max(model.size.width, model.size.depth) * 0.62,
              48,
            ]}
          />
          <meshBasicMaterial color="#c4a574" transparent opacity={0.85} />
        </mesh>
      ) : null}
    </group>
  );
}
