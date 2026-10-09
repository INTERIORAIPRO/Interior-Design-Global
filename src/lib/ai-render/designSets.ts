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
    "th-rug-wool-beige",
    "th-armchair-nordic",
  ],
  "bedroom:japandi": [
    "th-bed-nordic",
    "th-nightstand-oak",
    "th-bedside-lamps",
    "th-rug-wool-beige",
    "th-decor-vase-ceramic",
  ],
  "bedroom:minimalist": [
    "th-bed-nordic",
    "th-nightstand-oak",
    "th-lamp-minimal",
    "th-rug-wool-beige",
  ],
  "bedroom:modern": [
    "th-bed-nordic",
    "th-nightstand-metal",
    "th-lamp-minimal",
    "th-armchair-nordic",
  ],
  "bedroom:contemporary": [
    "th-bed-nordic",
    "th-nightstand-metal",
    "th-lamp-minimal",
    "th-armchair-nordic",
  ],
  "bedroom:industrial": [
    "th-bed-nordic",
    "th-nightstand-metal",
    "th-lamp-minimal",
  ],
  "bedroom:midcentury": [
    "th-bed-nordic",
    "th-nightstand-oak",
    "th-lamp-brass-arc",
    "th-armchair-nordic",
  ],
  "bedroom:boho": [
    "th-bed-nordic",
    "th-nightstand-oak",
    "th-throw-boho",
    "th-decor-vase-ceramic",
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

function productsByIds(ids: string[]) {
  return ids
    .map((id) => partnerProducts.find((product) => product.id === id))
    .filter((product): product is PartnerProduct => Boolean(product));
}

export function sceneKey(
  roomType: RoomKind,
  style: InteriorStyle,
  budget: BudgetTier = "medium",
) {
  return `${roomType}:${style}:${budget}`;
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
): DesignScene {
  const packKey = `${roomType}:${style}`;
  const ids =
    productIdsByRoomStyle[packKey] ??
    productIdsByRoomStyle[`${roomType}:scandinavian`] ??
    [];
  const roomScenes = sceneByRoom[roomType];
  const sceneUrl =
    roomScenes[style] ?? roomScenes.default ?? roomScenes.scandinavian;

  return {
    key: sceneKey(roomType, style, budget),
    sceneUrl,
    products: filterByBudget(productsByIds(ids), budget),
  };
}
