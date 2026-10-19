import {
  partnerProducts,
  type PartnerProduct,
  type RoomKind,
} from "@/lib/partner-store/catalog";
import type { InteriorStyle } from "@/lib/ai-render/catalogPick";

export type BudgetTier = "economic" | "medium" | "premium";

export const budgetTiers: BudgetTier[] = ["economic", "medium", "premium"];

const budgetCaps: Record<BudgetTier, number> = {
  economic: 1600,
  medium: 3500,
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

const roomSlots: Record<RoomKind, PartnerProduct["category"][]> = {
  bedroom: ["beds", "tables", "lighting", "rugs"],
  living: ["sofas", "tables", "lighting", "rugs"],
  office: ["tables", "lighting", "rugs", "decor"],
  kitchen: ["tables", "decor", "lighting", "rugs"],
};

function pickForBudget(items: PartnerProduct[], budget: BudgetTier) {
  const sorted = [...items].sort((a, b) => a.price - b.price);
  if (sorted.length === 0) return null;
  if (budget === "economic") return sorted[0];
  if (budget === "premium") return sorted[sorted.length - 1];
  return sorted[Math.floor(sorted.length / 2)];
}

function remainingByBudget(items: PartnerProduct[], budget: BudgetTier) {
  return [...items].sort((a, b) =>
    budget === "premium" ? b.price - a.price : a.price - b.price,
  );
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
  const forRoom = source.filter((product) => product.rooms?.includes(roomType));
  const base = forRoom.length > 0 ? forRoom : source;
  const picked: PartnerProduct[] = [];
  const used = new Set<string>();

  for (const category of roomSlots[roomType] ?? []) {
    const options = base.filter(
      (product) => product.category === category && !used.has(product.id),
    );
    const styled = options.filter((product) => hasStyle(product, style));
    const choice = pickForBudget(styled.length > 0 ? styled : options, budget);
    if (!choice) continue;
    picked.push(choice);
    used.add(choice.id);
  }

  if (picked.length < 3) {
    for (const product of remainingByBudget(
      pickForRoom(source, roomType, style, 4),
      budget,
    )) {
      if (used.has(product.id)) continue;
      picked.push(product);
      used.add(product.id);
      if (picked.length >= 4) break;
    }
  }

  const withinBudget = filterByBudget(picked, budget);
  if (withinBudget.length >= 3) return withinBudget.slice(0, 4);
  return picked.slice(0, 4);
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

