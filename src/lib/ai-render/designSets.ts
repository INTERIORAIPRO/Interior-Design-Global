import {
  isRealProductPhoto,
  partnerProducts,
  uniqueProductImage,
  type PartnerProduct,
  type RoomKind,
} from "@/lib/partner-store/catalog";
import type { InteriorStyle } from "@/lib/ai-render/catalogPick";
import { resolveFurnitureSet } from "@/lib/ai-render/furnitureSets";

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
  products: PartnerProduct[];
};

const styleAliases: Record<string, string[]> = {
  scandinavian: ["scandinavian", "japandi"],
  modern: ["modern", "contemporary"],
  contemporary: ["contemporary", "modern"],
  classic: ["classic"],
  industrial: ["industrial"],
  minimal: ["minimal", "minimalist", "japandi"],
  minimalist: ["minimalist", "minimal", "japandi"],
  midcentury: ["midcentury"],
  japandi: ["japandi", "scandinavian", "minimalist", "minimal"],
  boho: ["boho"],
};

function productStyleTags(product: PartnerProduct) {
  return [...(product.styles ?? []), ...(product.style ?? [])];
}

function hasExactStyle(product: PartnerProduct, style: InteriorStyle) {
  const tags = productStyleTags(product);
  if (tags.includes(style)) return true;
  if (style === "minimalist") return tags.includes("minimal");
  return false;
}

function hasRelatedStyle(product: PartnerProduct, style: InteriorStyle) {
  const wanted = styleAliases[style] ?? [style];
  return productStyleTags(product).some((tag) => wanted.includes(tag));
}

function nameOf(product: PartnerProduct) {
  return product.name.toLowerCase();
}

function dedupeProducts(products: PartnerProduct[]) {
  const seen = new Set<string>();
  return products.filter((product) => {
    const key = `${product.id}::${product.sku}`;
    if (seen.has(key) || seen.has(product.id)) return false;
    seen.add(key);
    seen.add(product.id);
    return true;
  });
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

function isBed(product: PartnerProduct) {
  const name = nameOf(product);
  return (
    product.category === "beds" ||
    name.includes("pat tapi") ||
    name.startsWith("pat ")
  );
}

function isNightstand(product: PartnerProduct) {
  return nameOf(product).includes("noptier");
}

function isLighting(product: PartnerProduct) {
  const name = nameOf(product);
  return (
    product.category === "lighting" ||
    name.includes("veioz") ||
    name.includes("lamp") ||
    name.includes("pendul") ||
    name.includes("pendant") ||
    name.includes("lustra") ||
    name.includes("plafonier")
  );
}

function isRugOrBench(product: PartnerProduct) {
  const name = nameOf(product);
  if (isBed(product) || isNightstand(product) || isLighting(product)) return false;
  return (
    product.category === "rugs" ||
    name.includes("covor") ||
    name.includes("banchet") ||
    name.includes("banquette") ||
    name.includes("bench") ||
    name.includes("taburet") ||
    name.includes("ottoman") ||
    name.includes("puf") ||
    name.includes("pouf")
  );
}

function isBedroomPendant(product: PartnerProduct) {
  const name = nameOf(product);
  return (
    name.includes("pendul") ||
    name.includes("pendant") ||
    name.includes("suspend") ||
    name.includes("applique") ||
    name.includes("perete")
  );
}

function isSofa(product: PartnerProduct) {
  return product.category === "sofas" || nameOf(product).includes("canapea");
}

function isCoffeeTable(product: PartnerProduct) {
  const name = nameOf(product);
  if (name.includes("noptier") || name.includes("birou") || name.includes("dining")) {
    return false;
  }
  return (
    name.includes("cafea") ||
    name.includes("masut") ||
    name.includes("coffee") ||
    product.category === "tables" ||
    product.category === "coffee-table"
  );
}

function isLivingLamp(product: PartnerProduct) {
  const name = nameOf(product);
  if (name.includes("veioz") || name.includes("noptier")) return false;
  return (
    product.category === "lighting" ||
    name.includes("lampadar") ||
    name.includes("floor lamp")
  );
}

function isLivingRug(product: PartnerProduct) {
  return product.category === "rugs" || nameOf(product).includes("covor");
}

function isBedroomFurniture(product: PartnerProduct) {
  const name = nameOf(product);
  if (isLivingLeak(product)) return false;
  if (name.includes("birou") || name.includes("dining")) return false;
  if (product.category === "armchair" && !isRugOrBench(product)) return false;
  return isBed(product) || isNightstand(product) || isLighting(product) || isRugOrBench(product);
}

function belongsToRoom(product: PartnerProduct, roomType: RoomKind) {
  if (!product.rooms?.includes(roomType)) return false;
  const name = nameOf(product);
  if (roomType === "bedroom") {
    return isBedroomFurniture(product);
  }
  if (roomType === "living") {
    if (product.category === "beds") return false;
    if (name.includes("noptier") || name.startsWith("pat ") || name.includes("pat tapi")) {
      return false;
    }
    return (
      isSofa(product) ||
      isCoffeeTable(product) ||
      isLivingLamp(product) ||
      isLivingRug(product)
    );
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
      match: isBed,
    },
    {
      id: "nightstand",
      required: true,
      match: isNightstand,
    },
    {
      id: "lamp",
      required: true,
      match: (product) =>
        isBedroomPendant(product) || isLighting(product),
    },
    {
      id: "rugBench",
      required: true,
      match: isRugOrBench,
    },
  ],
  living: [
    {
      id: "sofa",
      required: true,
      match: isSofa,
    },
    {
      id: "table",
      required: true,
      match: isCoffeeTable,
    },
    {
      id: "lamp",
      required: true,
      match: isLivingLamp,
    },
    {
      id: "rug",
      required: false,
      match: isLivingRug,
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

function scoreSet(
  products: PartnerProduct[],
  budget: BudgetTier,
  style?: InteriorStyle,
) {
  const { min, max } = budgetRanges[budget];
  const sum = setTotal(products);
  const inRange = sum >= min && sum <= max;
  const midpoint = Number.isFinite(max) ? (min + max) / 2 : min + 2500;
  const distance = inRange ? 0 : sum < min ? min - sum : sum - max;
  const styleHits = style
    ? products.filter((product) => hasExactStyle(product, style)).length
    : 0;
  return (
    (inRange ? 1_000_000 : 0) +
    products.length * 250 +
    styleHits * 400 -
    distance * 4 -
    Math.abs(sum - midpoint) * 0.02
  );
}

function rankedSlotOptions(
  matches: PartnerProduct[],
  style: InteriorStyle,
  allowUnstyled: boolean,
) {
  const unique = dedupeProducts(matches);
  const exact = unique.filter((product) => hasExactStyle(product, style));
  const related = unique.filter(
    (product) =>
      !hasExactStyle(product, style) && hasRelatedStyle(product, style),
  );
  const rest = unique.filter(
    (product) =>
      !hasExactStyle(product, style) && !hasRelatedStyle(product, style),
  );
  if (exact.length || related.length) {
    return [...exact, ...related];
  }
  return allowUnstyled ? rest : [];
}

function bestSetForBudget(
  slots: { required: boolean; options: PartnerProduct[] }[],
  extras: PartnerProduct[],
  budget: BudgetTier,
  style?: InteriorStyle,
) {
  const { min, max } = budgetRanges[budget];
  let best: PartnerProduct[] = [];
  let bestScore = Number.NEGATIVE_INFINITY;

  function consider(set: PartnerProduct[]) {
    const unique = dedupeProducts(set);
    if (!unique.length) return;
    const score = scoreSet(unique, budget, style);
    if (score > bestScore) {
      best = unique;
      bestScore = score;
    }
  }

  function addExtras(base: PartnerProduct[]) {
    const used = new Set(base.map((product) => product.id));
    let current = [...base];
    let sum = setTotal(current);
    const ordered = dedupeProducts(extras)
      .filter((product) => !used.has(product.id))
      .sort((a, b) =>
        budget === "economic" ? a.price - b.price : b.price - a.price,
      );
    for (const product of ordered) {
      const next = sum + product.price;
      const underMax = next <= max;
      const needsLux = budget === "lux" && sum < min;
      if (underMax || needsLux) {
        current.push(product);
        used.add(product.id);
        sum = next;
        if (sum >= min && sum <= max && current.length >= 4) break;
      }
    }
    consider(current);
  }

  function walk(index: number, acc: PartnerProduct[]) {
    if (index >= slots.length) {
      addExtras(acc);
      consider(acc);
      return;
    }
    const slot = slots[index];
    const options = slot.options.slice(0, 8);
    let branched = false;
    for (const product of options) {
      if (acc.some((item) => item.id === product.id)) continue;
      branched = true;
      walk(index + 1, [...acc, product]);
    }
    if (!slot.required || !branched) walk(index + 1, acc);
  }

  walk(0, []);

  if (!best.length) {
    return dedupeProducts(slots.flatMap((slot) => slot.options.slice(0, 1)));
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
  const lockedSet = resolveFurnitureSet(roomType, style, vendorId, pool);
  if (lockedSet.length >= 3) {
    return lockedSet.slice(0, 4);
  }
  const vendorPool = dedupeProducts(
    vendorId === "mix"
      ? pool
      : pool.filter((product) => product.vendorId === vendorId),
  );
  const roomPool = vendorPool.filter((product) =>
    belongsToRoom(product, roomType),
  );
  const definedSlots = roomSlots[roomType] ?? [];
  const slots = definedSlots.map((slot) => {
    const matches = roomPool.filter((product) => slot.match(product));
    const options = rankedSlotOptions(matches, style, slot.required);
    const sorted = [...options].sort((a, b) => {
      if (roomType === "bedroom" && slot.id === "lamp") {
        const pendantDelta =
          Number(isBedroomPendant(b)) - Number(isBedroomPendant(a));
        if (pendantDelta) return pendantDelta;
      }
      if (roomType === "bedroom" && slot.id === "rugBench") {
        const poufDelta =
          Number(nameOf(b).includes("puf") || nameOf(b).includes("pouf")) -
          Number(nameOf(a).includes("puf") || nameOf(a).includes("pouf"));
        if (poufDelta) return poufDelta;
      }
      return budget === "economic" ? a.price - b.price : b.price - a.price;
    });
    return {
      required: slot.required,
      options: sorted,
    };
  });
  const extras =
    roomType === "bedroom"
      ? roomPool.filter(
          (product) =>
            (isLighting(product) || isRugOrBench(product)) &&
            rankedSlotOptions([product], style, false).length > 0,
        )
      : roomPool.filter((product) => {
          const claimed = definedSlots.some(
            (slot, index) =>
              slot.match(product) &&
              slots[index]?.options.some((item) => item.id === product.id),
          );
          return (
            !claimed && rankedSlotOptions([product], style, false).length > 0
          );
        });
  const picked = bestSetForBudget(slots, extras, budget, style);
  const filled = fillComplementarySlots(
    picked,
    definedSlots,
    roomPool,
    style,
  );
  if (roomType === "bedroom") {
    return dedupeProducts(filled.filter(isBedroomFurniture))
      .filter((product) => isRealProductPhoto(uniqueProductImage(product)))
      .slice(0, 4);
  }
  if (roomType === "living") {
    return dedupeProducts(
      filled.filter(
        (product) =>
          isSofa(product) ||
          isCoffeeTable(product) ||
          isLivingLamp(product) ||
          isLivingRug(product),
      ),
    )
      .filter((product) => isRealProductPhoto(uniqueProductImage(product)))
      .slice(0, 4);
  }
  return dedupeProducts(filled).filter((product) =>
    isRealProductPhoto(uniqueProductImage(product)),
  );
}

function fillComplementarySlots(
  picked: PartnerProduct[],
  definedSlots: RoomSlot[],
  roomPool: PartnerProduct[],
  style: InteriorStyle,
) {
  const result = [...picked];
  for (const slot of definedSlots) {
    if (result.some((product) => slot.match(product))) continue;
    const options = rankedSlotOptions(
      roomPool.filter((product) => slot.match(product)),
      style,
      true,
    );
    const next = options.find(
      (product) => !result.some((item) => item.id === product.id),
    );
    if (next) result.push(next);
  }
  return result;
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
  return {
    key: sceneKey(roomType, style, budget, vendorId, countryId),
    products: getRecommendedProducts(roomType, style, budget, pool, vendorId),
  };
}

