import { composePhotorealRender, DEMO_SCENE, type PlacedProduct } from "@/lib/ai-render/photorealEngine";

/**
 * Pass-through: the room photo (demo: DEMO_SCENE) is the only frame.
 * Catalog cards keep The Home prices and affiliate URLs.
 */
export { composePhotorealRender, DEMO_SCENE };
export type { PlacedProduct };

export async function composeRender(
  input: Parameters<typeof composePhotorealRender>[0],
) {
  return composePhotorealRender(input);
}
