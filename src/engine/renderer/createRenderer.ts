import { appConfig } from "../../../config/interior-design.config";
import type { EngineSettings } from "@/lib/engine3d/types";

export function createRendererSettings(
  overrides: Partial<EngineSettings> = {},
): EngineSettings {
  return {
    quality: appConfig.engine3d.defaultQuality,
    maxSceneObjects: appConfig.engine3d.maxSceneObjects,
    enableRealtimePreview: appConfig.engine3d.enableRealtimePreview,
    ...overrides,
  };
}
