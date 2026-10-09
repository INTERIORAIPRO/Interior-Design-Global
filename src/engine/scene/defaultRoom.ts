import type { SceneObject } from "@/lib/engine3d/types";

export const defaultRoom: SceneObject[] = [
  { id: "floor-01", kind: "floor", name: "Oak herringbone" },
  { id: "wall-n", kind: "wall", name: "North plaster" },
  { id: "sofa-01", kind: "furniture", name: "Linen sofa" },
  { id: "lamp-01", kind: "light", name: "Brass floor lamp" },
];
