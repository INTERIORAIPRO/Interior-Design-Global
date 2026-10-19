import {
  partnerProducts,
  type PartnerProduct,
  type RoomKind,
} from "@/lib/partner-store/catalog";
import type { InteriorStyle } from "@/lib/ai-render/catalogPick";

export type BudgetTier = "economic" | "medium" | "premium";

export const budgetTiers: BudgetTier[] = ["economic", "medium", "premium"];

const budgetCaps: Record<BudgetTier, number> = {
  economic: 6000,
  medium: 10000,
  premium: Number.POSITIVE_INFINITY,
};

export type DesignScene = {
  key: string;
  sceneUrl: string;
  products: PartnerProduct[];
};

const sceneByRoom: Record<RoomKind, Record<string, string>> = {
  bedroom: {
    scandinavian:
      "https://images.unsplash.com/photo-1616594039964-ae9021a400a0?auto=format&fit=crop&w=1400&q=80",
    modern:
      "https://images.unsplash.com/photo-1615874958473-d2780e0a9e8d?auto=format&fit=crop&w=1400&q=80",
    contemporary:
      "https://images.unsplash.com/photo-1615874958473-d2780e0a9e8d?auto=format&fit=crop&w=1400&q=80",
    minimalist:
      "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1400&q=80",
    industrial:
      "https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=1400&q=80",
    midcentury:
      "https://images.unsplash.com/photo-1616594039964-ae9021a400a0?auto=format&fit=crop&w=1400&q=80",
    japandi:
      "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1400&q=80",
    boho:
      "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=1400&q=80",
  },
  living: {
    scandinavian:
      "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1400&q=80",
    modern:
      "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=1400&q=80",
    contemporary:
      "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=1400&q=80",
    minimalist:
      "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1400&q=80",
    industrial:
      "https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=1400&q=80",
    midcentury:
      "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=1400&q=80",
    japandi:
      "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1400&q=80",
    boho:
      "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=1400&q=80",
  },
  office: {
    default:
      "https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=1400&q=80",
  },
  kitchen: {
    default:
      "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=1400&q=80",
  },
};

const productIdsByRoomStyle: Record<string, string[]> = {
  "bedroom:scandinavian": [
    "th-bed-nordic",
    "th-nightstand-oak",
    "th-bedside-lamps",
  ],
  "bedroom:japandi": [
    "th-bed-nordic",
    "th-nightstand-oak",
    "th-bedside-lamps",
  ],
  "bedroom:minimalist": [
    "th-bed-nordic",
    "th-nightstand-oak",
    "th-lamp-minimal",
  ],
  "bedroom:modern": [
    "th-bed-nordic",
    "th-nightstand-metal",
    "th-lamp-minimal",
  ],
  "bedroom:contemporary": [
    "th-bed-nordic",
    "th-nightstand-metal",
    "th-lamp-minimal",
  ],
  "bedroom:industrial": [
    "th-bed-nordic",
    "th-nightstand-metal",
    "th-lamp-minimal",
  ],
  "bedroom:midcentury": [
    "th-bed-nordic",
    "th-nightstand-oak",
    "th-bedside-lamps",
  ],
  "bedroom:boho": [
    "th-bed-nordic",
    "th-nightstand-oak",
    "th-bedside-lamps",
  ],
  "living:scandinavian": [
    "th-sofa-nordic-1",
    "th-table-coffee-oak",
    "th-lamp-brass-arc",
    "th-rug-wool-beige",
    "th-decor-vase-ceramic",
  ],
  "living:japandi": [
    "th-sofa-nordic-1",
    "th-table-coffee-oak",
    "th-rug-wool-beige",
    "th-decor-vase-ceramic",
  ],
  "living:minimalist": [
    "th-sofa-nordic-1",
    "th-lamp-minimal",
    "th-rug-wool-beige",
  ],
  "living:modern": [
    "th-sofa-nordic-1",
    "th-armchair-nordic",
    "th-lamp-minimal",
  ],
  "living:contemporary": [
    "th-sofa-nordic-1",
    "th-armchair-nordic",
    "th-lamp-minimal",
  ],
  "living:industrial": ["th-sofa-nordic-1", "th-lamp-minimal"],
  "living:midcentury": [
    "th-sofa-nordic-1",
    "th-lamp-brass-arc",
    "th-table-coffee-oak",
  ],
  "living:boho": [
    "th-sofa-nordic-1",
    "th-table-coffee-oak",
    "th-throw-boho",
    "th-decor-vase-ceramic",
  ],
  "office:scandinavian": [
    "th-desk-oak",
    "th-lamp-brass-arc",
    "th-rug-wool-beige",
    "th-decor-vase-ceramic",
  ],
  "office:minimalist": ["th-desk-oak", "th-lamp-minimal"],
  "office:modern": ["th-desk-oak", "th-lamp-minimal"],
  "office:industrial": ["th-desk-oak", "th-lamp-minimal"],
  "kitchen:scandinavian": ["th-dining-oak", "th-decor-vase-ceramic"],
  "kitchen:japandi": ["th-dining-oak", "th-decor-vase-ceramic"],
  "kitchen:boho": ["th-dining-oak", "th-throw-boho", "th-decor-vase-ceramic"],
};

function productsByIds(ids: string[], pool: PartnerProduct[]) {
  return ids
    .map((id) => pool.find((product) => product.id === id))
    .filter((product): product is PartnerProduct => Boolean(product));
}

function hasStyle(product: PartnerProduct, style: InteriorStyle) {
  return product.styles?.includes(style) || product.style?.includes(style);
}

function diversify(products: PartnerProduct[], limit = 5) {
  const unique: PartnerProduct[] = [];
  const usedCategories = new Set<string>();
  for (const product of products) {
    if (usedCategories.has(product.category)) continue;
    unique.push(product);
    usedCategories.add(product.category);
    if (unique.length >= limit) return unique;
  }
  for (const product of products) {
    if (unique.some((item) => item.id === product.id)) continue;
    unique.push(product);
    if (unique.length >= limit) break;
  }
  return unique;
}

function pickForRoom(
  pool: PartnerProduct[],
  roomType: RoomKind,
  style: InteriorStyle,
  minCount = 4,
) {
  const forRoom = pool.filter((product) => product.rooms?.includes(roomType));
  const styled = forRoom.filter((product) => hasStyle(product, style));
  const primary = styled.length > 0 ? styled : forRoom;
  const merged = [...primary];
  const seen = new Set(merged.map((product) => product.id));
  if (merged.length < minCount) {
    for (const product of pool) {
      if (seen.has(product.id)) continue;
      merged.push(product);
      seen.add(product.id);
      if (merged.length >= minCount) break;
    }
  }
  return diversify(merged, Math.max(minCount, 4));
}

export function getRecommendedProducts(
  roomType: RoomKind,
  style: InteriorStyle,
  budget: BudgetTier,
  pool: PartnerProduct[],
  vendorId = "mix",
) {
  const vendorPool =
    vendorId === "mix"
      ? pool
      : pool.filter((product) => product.vendorId === vendorId);
  const source = vendorPool.length > 0 ? vendorPool : pool;
  const packKey = `${roomType}:${style}`;
  const ids =
    productIdsByRoomStyle[packKey] ??
    productIdsByRoomStyle[`${roomType}:scandinavian`] ??
    [];
  const fromPack =
    vendorId === "mix"
      ? mixMatchPack(ids, source, roomType)
      : productsByIds(ids, source).filter((product) =>
          product.rooms?.includes(roomType),
        );
  const products =
    fromPack.length >= 3
      ? fromPack
      : pickForRoom(source, roomType, style, 4);
  const withinBudget = filterByBudget(products, budget);
  if (withinBudget.length >= 3 || withinBudget.length === products.length) {
    return withinBudget;
  }
  return products.slice(0, 4);
}

function mixMatchPack(
  ids: string[],
  pool: PartnerProduct[],
  roomType: RoomKind,
) {
  const preferred = productsByIds(ids, pool).filter((product) =>
    product.rooms?.includes(roomType),
  );
  if (preferred.length === 0) return [];
  const usedVendors = new Set<string>();
  return preferred.map((product) => {
    const alternative = pool.find(
      (candidate) =>
        candidate.category === product.category &&
        candidate.vendorId !== product.vendorId &&
        !usedVendors.has(candidate.vendorId) &&
        candidate.rooms?.includes(roomType),
    );
    const chosen = alternative ?? product;
    usedVendors.add(chosen.vendorId);
    return chosen;
  });
}

export function sceneKey(
  roomType: RoomKind,
  style: InteriorStyle,
  budget: BudgetTier = "medium",
  vendorId = "mix",
  countryId = "RO",
) {
  return `${roomType}:${style}:${budget}:${vendorId}:${countryId}`;
}

function filterByBudget(products: PartnerProduct[], budget: BudgetTier) {
  const cap = budgetCaps[budget];
  const selected: PartnerProduct[] = [];
  let total = 0;
  for (const product of products) {
    if (selected.length === 0 || total + product.price <= cap) {
      selected.push(product);
      total += product.price;
    }
  }
  return selected;
}

export function getDesignScene(
  roomType: RoomKind,
  style: InteriorStyle,
  budget: BudgetTier = "medium",
  pool: PartnerProduct[] = partnerProducts,
  vendorId = "mix",
  countryId = "RO",
): DesignScene {
  const roomScenes = sceneByRoom[roomType];
  const sceneUrl =
    roomScenes[style] ?? roomScenes.default ?? roomScenes.scandinavian;

  return {
    key: sceneKey(roomType, style, budget, vendorId, countryId),
    sceneUrl,
    products: getRecommendedProducts(roomType, style, budget, pool, vendorId),
  };
}

