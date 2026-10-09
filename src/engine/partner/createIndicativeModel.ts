import type {
  IndicativeModel,
  PartnerProduct,
  ProductCategory,
  ProductPlacement,
  SizeMeters,
} from "@/lib/partner-store/types";

export function cmToMeters(cm: number) {
  return cm / 100;
}

const FALLBACK_CM = { widthCm: 80, depthCm: 80, heightCm: 80 };

const categorySizeCm: Record<string, { widthCm: number; depthCm: number; heightCm: number }> = {
  sofa: { widthCm: 210, depthCm: 90, heightCm: 85 },
  sofas: { widthCm: 210, depthCm: 90, heightCm: 85 },
  armchair: { widthCm: 80, depthCm: 85, heightCm: 85 },
  "coffee-table": { widthCm: 110, depthCm: 60, heightCm: 42 },
  table: { widthCm: 140, depthCm: 80, heightCm: 75 },
  tables: { widthCm: 140, depthCm: 80, heightCm: 75 },
  "floor-lamp": { widthCm: 35, depthCm: 35, heightCm: 160 },
  lighting: { widthCm: 35, depthCm: 35, heightCm: 160 },
  rug: { widthCm: 200, depthCm: 140, heightCm: 2 },
  rugs: { widthCm: 200, depthCm: 140, heightCm: 2 },
  sideboard: { widthCm: 160, depthCm: 45, heightCm: 75 },
  beds: { widthCm: 180, depthCm: 200, heightCm: 90 },
  decor: { widthCm: 25, depthCm: 25, heightCm: 40 },
};

type SizedProduct = {
  category?: string;
  dimensions?: {
    widthCm?: number;
    depthCm?: number;
    heightCm?: number;
  };
};

export function toSizeMeters(product: SizedProduct): SizeMeters {
  const fallback =
    (product.category && categorySizeCm[product.category]) || FALLBACK_CM;
  const dimensions = product.dimensions;
  const widthCm = dimensions?.widthCm ?? fallback.widthCm;
  const depthCm = dimensions?.depthCm ?? fallback.depthCm;
  const heightCm = dimensions?.heightCm ?? fallback.heightCm;

  return {
    width: cmToMeters(Number.isFinite(widthCm) ? widthCm : fallback.widthCm),
    depth: cmToMeters(Number.isFinite(depthCm) ? depthCm : fallback.depthCm),
    height: Math.max(
      cmToMeters(Number.isFinite(heightCm) ? heightCm : fallback.heightCm),
      0.02,
    ),
  };
}

const categorySlots: Record<string, ProductPlacement> = {
  rug: { x: 0.2, z: -0.2, rotationY: 0 },
  rugs: { x: 0.2, z: -0.2, rotationY: 0 },
  sofa: { x: 0, z: -1.8, rotationY: 0 },
  sofas: { x: 0, z: -1.8, rotationY: 0 },
  "coffee-table": { x: 0.15, z: 0.2, rotationY: 0 },
  table: { x: 0.15, z: 0.4, rotationY: 0 },
  tables: { x: 0.15, z: 0.4, rotationY: 0 },
  armchair: { x: 1.8, z: -0.5, rotationY: -0.5 },
  "floor-lamp": { x: 1.9, z: 1.1, rotationY: 0 },
  lighting: { x: 1.9, z: 1.1, rotationY: 0 },
  sideboard: { x: -2.5, z: 0, rotationY: Math.PI / 2 },
  beds: { x: 0, z: -1.6, rotationY: 0 },
  decor: { x: 0.8, z: 0.3, rotationY: 0 },
};

const defaultSlot: ProductPlacement = { x: 0, z: 0, rotationY: 0 };

function autoPlacement(product: { category?: string; placement?: ProductPlacement }): ProductPlacement {
  if (product.placement) return product.placement;
  if (product.category && categorySlots[product.category]) {
    return categorySlots[product.category];
  }
  return defaultSlot;
}

function floorY(category: string | undefined, height: number) {
  if (category === "rug" || category === "rugs") return 0.012;
  return height / 2;
}

/**
 * Turns a partner catalog item (2D photo + real-world cm) into an
 * indicative in-room 3D stand-in. This is a volume sketch, not a CAD model.
 */
const categoryAlias: Record<string, ProductCategory> = {
  sofa: "sofa",
  sofas: "sofa",
  armchair: "armchair",
  "coffee-table": "coffee-table",
  table: "table",
  tables: "table",
  "floor-lamp": "floor-lamp",
  lighting: "floor-lamp",
  rug: "rug",
  rugs: "rug",
  sideboard: "sideboard",
  beds: "table",
  decor: "table",
};

export function createIndicativeModel(product: PartnerProduct): IndicativeModel {
  const size = toSizeMeters(product);
  const placement = autoPlacement(product);
  const category = categoryAlias[product.category] ?? "table";

  return {
    productId: product.id,
    category,
    size,
    imageUrl: product.image2d,
    accentColor: product.accentColor,
    rotationY: placement.rotationY,
    position: [placement.x, floorY(product.category, size.height), placement.z],
  };
}

export function createIndicativeModels(products: PartnerProduct[]) {
  return products.map(createIndicativeModel);
}
