export type RenderQuality = "draft" | "high" | "ultra";

export type EngineSettings = {
  quality: RenderQuality;
  maxSceneObjects: number;
  enableRealtimePreview: boolean;
};

export type SceneObjectKind = "floor" | "wall" | "furniture" | "light" | "decor";

export type SceneObject = {
  id: string;
  kind: SceneObjectKind;
  name: string;
};
