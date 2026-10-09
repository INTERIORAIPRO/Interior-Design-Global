import type { PartnerProduct, RoomKind } from "@/lib/partner-store/catalog";

export type InteriorStyle =
  | "scandinavian"
  | "modern"
  | "contemporary"
  | "minimalist"
  | "industrial"
  | "midcentury"
  | "japandi"
  | "boho";

export const interiorStyles: InteriorStyle[] = [
  "scandinavian",
  "modern",
  "contemporary",
  "minimalist",
  "industrial",
  "midcentury",
  "japandi",
  "boho",
];

const styleAliases: Record<string, string[]> = {
  scandinavian: ["scandinavian"],
  modern: ["modern", "contemporary"],
  contemporary: ["contemporary", "modern"],
  minimalist: ["minimalist", "minimal"],
  industrial: ["industrial"],
  midcentury: ["midcentury"],
  japandi: ["japandi", "scandinavian", "minimalist"],
  boho: ["boho"],
};

function matchesStyle(product: PartnerProduct, style: string) {
  const wanted = styleAliases[style] ?? [style];
  return (product.style ?? []).some((item) => wanted.includes(item));
}

const heroCategory: Record<RoomKind, PartnerProduct["category"]> = {
  living: "sofas",
  bedroom: "beds",
  office: "tables",
  kitchen: "tables",
};

export function pickCatalogForBudget(
  products: PartnerProduct[],
  style: InteriorStyle,
  maxBudget: number,
  roomType?: RoomKind,
): PartnerProduct[] {
  if (!products || !Array.isArray(products)) return [];

  const forRoom = roomType
    ? products.filter((product) => product.rooms?.includes(roomType))
    : products;

  const pool = forRoom.length > 0 ? forRoom : products;
  const hero = roomType ? heroCategory[roomType] : undefined;
  const ranked = [...pool].sort((a, b) => {
    const aHero = hero && a.category === hero ? 1 : 0;
    const bHero = hero && b.category === hero ? 1 : 0;
    if (aHero !== bHero) return bHero - aHero;
    const aFit = matchesStyle(a, style) ? 1 : 0;
    const bFit = matchesStyle(b, style) ? 1 : 0;
    if (aFit !== bFit) return bFit - aFit;
    return b.price - a.price;
  });

  const selected: PartnerProduct[] = [];
  let total = 0;
  for (const product of ranked) {
    if (total + product.price <= maxBudget) {
      selected.push(product);
      total += product.price;
    }
  }
  return selected;
}
