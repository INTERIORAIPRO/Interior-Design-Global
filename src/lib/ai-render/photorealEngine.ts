import type { RoomAnalysis } from "@/lib/ai-render/analyzeRoom";
import type { InteriorStyle, PartnerProduct } from "@/lib/partner-store/types";

export type PlacedProduct = {
  product: PartnerProduct;
  x: number;
  y: number;
  width: number;
  height: number;
  spriteUrl: string;
};

export const DEMO_SCENE = "/ai-render/sample-room.jpg";

/**
 * One photograph is the entire render. No sprites, overlays, or extra layers.
 */
export async function composePhotorealRender(input: {
  photo: HTMLImageElement;
  mask: HTMLCanvasElement | null;
  analysis: RoomAnalysis;
  products: PartnerProduct[];
  style: InteriorStyle;
}) {
  const { photo, products } = input;
  const src = photo.currentSrc || photo.src;

  return {
    engine: "single-frame" as const,
    dataUrl: src,
    placements: products.map((product) => ({
      product,
      x: 0,
      y: 0,
      width: 0,
      height: 0,
      spriteUrl: product.image2d,
    })),
  };
}
