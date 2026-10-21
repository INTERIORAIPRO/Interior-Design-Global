import type { InteriorStyle } from "@/lib/ai-render/catalogPick";
import {
  defaultSelectedSlots,
  productMatchesSlot,
  type PieceSlotId,
} from "@/lib/ai-render/furniturePieces";
import {
  officialManufacturerUrl,
  partnerProducts,
  uniqueProductImage,
  type PartnerProduct,
  type RoomKind,
} from "@/lib/partner-store/catalog";
import { MIX_VENDOR_ID, getVendor } from "@/lib/partner-store/vendors";

function normalizeStyle(style?: string): InteriorStyle {
  if (style === "minimal") return "minimalist";
  if (style === "classic") return "contemporary";
  if (
    style === "scandinavian" ||
    style === "modern" ||
    style === "contemporary" ||
    style === "minimalist" ||
    style === "industrial" ||
    style === "midcentury" ||
    style === "japandi" ||
    style === "boho"
  ) {
    return style;
  }
  return "scandinavian";
}

function styleTags(product: PartnerProduct) {
  return [...(product.styles ?? []), ...(product.style ?? [])];
}

function styleScore(product: PartnerProduct, style: InteriorStyle) {
  const tags = styleTags(product);
  if (tags.includes(style)) return 3;
  if (style === "minimalist" && tags.includes("minimal")) return 3;
  if (style === "japandi" && (tags.includes("scandinavian") || tags.includes("minimalist"))) {
    return 2;
  }
  if (style === "modern" && tags.includes("contemporary")) return 2;
  if (style === "contemporary" && tags.includes("modern")) return 2;
  return tags.length ? 1 : 0;
}

function pickForSlot(
  slot: PieceSlotId,
  style: InteriorStyle,
  vendorId: string | undefined,
  pool: PartnerProduct[],
) {
  const catalogPool = partnerProducts.length ? partnerProducts : pool;
  const matches = catalogPool.filter((product) => productMatchesSlot(product, slot));
  if (!matches.length) return undefined;
  const selectedBrand = vendorId ? getVendor(vendorId)?.brandName : undefined;
  const brandPool =
    !vendorId || vendorId === MIX_VENDOR_ID
      ? matches
      : matches.filter(
          (product) =>
            product.vendorId === vendorId ||
            (selectedBrand && product.brand === selectedBrand),
        );
  const mixFallback = matches.filter((product) => product.vendorId !== vendorId);
  const ranked = (brandPool.length ? brandPool : mixFallback.length ? mixFallback : matches).sort(
    (a, b) => {
      const styleDelta = styleScore(b, style) - styleScore(a, style);
      if (styleDelta) return styleDelta;
      const brandBoost =
        vendorId && vendorId !== MIX_VENDOR_ID
          ? Number(b.vendorId === vendorId) - Number(a.vendorId === vendorId)
          : 0;
      if (brandBoost) return brandBoost;
      return a.price - b.price;
    },
  );
  return ranked[0];
}

export function resolveFurnitureSet(
  roomType: RoomKind,
  style: InteriorStyle | string | undefined,
  vendorId?: string,
  pool: PartnerProduct[] = partnerProducts,
  selectedSlots?: PieceSlotId[],
) {
  const styleKey = normalizeStyle(style);
  const wanted =
    selectedSlots && selectedSlots.length > 0
      ? selectedSlots
      : defaultSelectedSlots(roomType);
  const seen = new Set<string>();
  const picked: PartnerProduct[] = [];
  for (const slot of wanted) {
    const product = pickForSlot(slot, styleKey, vendorId, pool);
    if (!product || seen.has(product.id)) continue;
    seen.add(product.id);
    picked.push(product);
  }
  return picked;
}

export function toRenderProduct(product: PartnerProduct) {
  const imageUrl = uniqueProductImage(product);
  return {
    id: product.id,
    sku: product.sku,
    name: product.name,
    title: product.title || product.name,
    brand: product.brand,
    description: product.description,
    promptHint: product.promptHint,
    category: product.category,
    price: product.price,
    currency: product.currency,
    imageUrl,
    image: imageUrl,
    image2d: imageUrl || product.image2d,
    buyUrl: officialManufacturerUrl(product.vendorId, product.buyUrl),
    affiliateUrl: officialManufacturerUrl(
      product.vendorId,
      product.affiliateUrl,
    ),
    vendorId: product.vendorId,
    accentColor: product.accentColor,
    styles: product.styles,
    style: product.style,
    rooms: product.rooms,
    slot: product.slot,
  };
}

export function buildCatalogSetPrompt(input: {
  roomType: RoomKind;
  style: string;
  vendorName: string;
  products: PartnerProduct[];
}) {
  const roomWord =
    input.roomType === "bedroom"
      ? "bedroom"
      : input.roomType === "living"
        ? "living room"
        : input.roomType === "office"
          ? "home office"
          : "kitchen / dining";
  const strictList = input.products
    .map(
      (product) =>
        `${product.name} (${product.brand || product.vendorId}): ${product.description || product.promptHint}`,
    )
    .join(", ");
  return [
    `Render a ${roomWord} in ${input.style} style containing strictly: ${strictList}.`,
    `Do not add furniture that is not listed. Keep only these catalog pieces fully in frame.`,
    `VENDOR preference: ${input.vendorName}.`,
    "VIRTUAL STAGING of the USER'S OWN ROOM PHOTOGRAPH: keep the same walls, windows, doors, ceiling, floor and camera angle.",
    "wide angle interior photo, full view of the room, well framed composition, complete furniture pieces visible without clipping",
    "ultra-realistic, 8k resolution, interior design photography, magazine style, architectural digest lighting",
  ].join(" ");
}
