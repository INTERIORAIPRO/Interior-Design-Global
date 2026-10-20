import {
  partnerProducts,
  type PartnerProduct,
  type RoomKind,
} from "@/lib/partner-store/catalog";
import type { InteriorStyle } from "@/lib/ai-render/catalogPick";

export type BudgetTier = "economic" | "medium" | "premium" | "lux";

export const budgetTiers: BudgetTier[] = [
  "economic",
  "medium",
  "premium",
  "lux",
];

export const budgetRanges: Record<
  BudgetTier,
  { min: number; max: number; label: string; hint: string }
> = {
  economic: { min: 0, max: 1499.99, label: "Economic", hint: "< 1.500 EUR" },
  medium: {
    min: 1500,
    max: 3500,
    label: "Mediu",
    hint: "1.500 EUR – 3.500 EUR",
  },
  premium: {
    min: 3500,
    max: 7000,
    label: "Premium",
    hint: "3.500 EUR – 7.000 EUR",
  },
  lux: {
    min: 7000.01,
    max: Number.POSITIVE_INFINITY,
    label: "Lux",
    hint: "> 7.000 EUR",
  },
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

function nameOf(product: PartnerProduct) {
  return product.name.toLowerCase();
}

function isLivingLeak(product: PartnerProduct) {
  const name = nameOf(product);
  return (
    product.category === "sofas" ||
    product.category === "sideboard" ||
    name.includes("canapea") ||
    name.includes("tv") ||
    name.includes("sufrager") ||
    name.includes("corp tv") ||
    name.includes("cafea") ||
    name.includes("dining")
  );
}

function belongsToRoom(product: PartnerProduct, roomType: RoomKind) {
  if (!product.rooms?.includes(roomType)) return false;
  const name = nameOf(product);
  if (roomType === "bedroom") {
    if (isLivingLeak(product)) return false;
    if (name.includes("birou") || name.includes("dining")) return false;
    return true;
  }
  if (roomType === "living") {
    if (product.category === "beds") return false;
    if (name.includes("noptier") || name.startsWith("pat ") || name.includes("pat tapi")) {
      return false;
    }
    return true;
  }
  if (roomType === "office") {
    return product.category !== "beds" && product.category !== "sofas";
  }
  if (roomType === "kitchen") {
    return (
      product.category !== "beds" &&
      product.category !== "sofas" &&
      !name.includes("noptier")
    );
  }
  return true;
}

type RoomSlot = {
  id: string;
  required: boolean;
  match: (product: PartnerProduct) => boolean;
};

const roomSlots: Record<RoomKind, RoomSlot[]> = {
  bedroom: [
    {
      id: "bed",
      required: true,
      match: (product) =>
        product.category === "beds" ||
        nameOf(product).includes("pat tapi") ||
        nameOf(product).startsWith("pat "),
    },
    {
      id: "nightstand",
      required: true,
      match: (product) => nameOf(product).includes("noptier"),
    },
    {
      id: "lamp",
      required: true,
      match: (product) =>
        product.category === "lighting" &&
        (nameOf(product).includes("veioz") ||
          nameOf(product).includes("lamp") ||
          nameOf(product).includes("noptier")),
    },
    {
      id: "stool",
      required: false,
      match: (product) =>
        nameOf(product).includes("taburet") ||
        nameOf(product).includes("ottoman") ||
        product.category === "armchair",
    },
  ],
  living: [
    {
      id: "sofa",
      required: true,
      match: (product) =>
        product.category === "sofas" || nameOf(product).includes("canapea"),
    },
    {
      id: "table",
      required: true,
      match: (product) =>
        nameOf(product).includes("cafea") ||
        (product.category === "tables" &&
          !nameOf(product).includes("noptier") &&
          !nameOf(product).includes("birou") &&
          !nameOf(product).includes("dining")),
    },
    {
      id: "lamp",
      required: false,
      match: (product) => product.category === "lighting",
    },
    {
      id: "rug",
      required: false,
      match: (product) => product.category === "rugs",
    },
  ],
  office: [
    {
      id: "desk",
      required: true,
      match: (product) =>
        nameOf(product).includes("birou") || product.category === "tables",
    },
    {
      id: "lamp",
      required: true,
      match: (product) => product.category === "lighting",
    },
    {
      id: "rug",
      required: false,
      match: (product) =>
        product.category === "rugs" || product.category === "decor",
    },
  ],
  kitchen: [
    {
      id: "dining",
      required: true,
      match: (product) =>
        nameOf(product).includes("dining") || product.category === "tables",
    },
    {
      id: "decor",
      required: false,
      match: (product) => product.category === "decor",
    },
    {
      id: "lighting",
      required: false,
      match: (product) => product.category === "lighting",
    },
  ],
};

function setTotal(products: PartnerProduct[]) {
  return products.reduce((sum, product) => sum + product.price, 0);
}

function scoreSet(products: PartnerProduct[], budget: BudgetTier) {
  const { min, max } = budgetRanges[budget];
  const sum = setTotal(products);
  const inRange = sum >= min && sum <= max;
  const midpoint = Number.isFinite(max) ? (min + max) / 2 : min + 2500;
  const distance = inRange ? 0 : sum < min ? min - sum : sum - max;
  return (
    (inRange ? 1_000_000 : 0) +
    products.length * 250 -
    distance * 4 -
    Math.abs(sum - midpoint) * 0.02
  );
}

function bestSetForBudget(
  slots: PartnerProduct[][],
  extras: PartnerProduct[],
  budget: BudgetTier,
) {
  const { min, max } = budgetRanges[budget];
  const filledSlots = slots.filter((slot) => slot.length > 0);
  let best: PartnerProduct[] = [];
  let bestScore = Number.NEGATIVE_INFINITY;

  function consider(set: PartnerProduct[]) {
    const unique = set.filter(
      (product, index, all) =>
        all.findIndex((item) => item.id === product.id) === index,
    );
    if (!unique.length) return;
    const score = scoreSet(unique, budget);
    if (score > bestScore) {
      best = unique;
      bestScore = score;
    }
  }

  function addExtras(base: PartnerProduct[]) {
    const used = new Set(base.map((product) => product.id));
    let current = [...base];
    let sum = setTotal(current);
    const ordered = [...extras]
      .filter((product) => !used.has(product.id))
      .sort((a, b) =>
        budget === "economic" ? a.price - b.price : b.price - a.price,
      );
    for (const product of ordered) {
      const next = sum + product.price;
      if (next <= max || (budget === "lux" && sum < min)) {
        current.push(product);
        used.add(product.id);
        sum = next;
        if (sum >= min && sum <= max && current.length >= 4) break;
      }
    }
    consider(current);
  }

  function walk(index: number, acc: PartnerProduct[]) {
    if (index >= filledSlots.length) {
      addExtras(acc);
      consider(acc);
      return;
    }
    const slot = filledSlots[index];
    const isRequired = index === 0;
    for (const product of slot) {
      if (acc.some((item) => item.id === product.id)) continue;
      walk(index + 1, [...acc, product]);
    }
    if (!isRequired) walk(index + 1, acc);
  }

  walk(0, []);

  if (!best.length && filledSlots[0]?.length) {
    return [filledSlots[0][0]];
  }
  return best;
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
  const roomPool = vendorPool.filter((product) =>
    belongsToRoom(product, roomType),
  );
  const slots = (roomSlots[roomType] ?? []).map((slot) => {
    const matches = roomPool.filter((product) => slot.match(product));
    const styled = matches.filter((product) => hasStyle(product, style));
    const options = styled.length > 0 ? styled : matches;
    return [...options].sort((a, b) => a.price - b.price);
  });
  const usedTypes = new Set(
    slots.flatMap((slotProducts, index) =>
      slotProducts.length ? [roomSlots[roomType][index].id] : [],
    ),
  );
  const extras = roomPool.filter((product) => {
    const claimed = (roomSlots[roomType] ?? []).some(
      (slot, index) => usedTypes.has(slot.id) && slot.match(product),
    );
    return !claimed;
  });
  return bestSetForBudget(slots, extras, budget);
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

