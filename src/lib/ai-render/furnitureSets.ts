import type { InteriorStyle } from "@/lib/ai-render/catalogPick";
import {
  checkedChecklistSlots,
  pieceOptionById,
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
import { MIX_VENDOR_ID, dedicatedBrandIds, getVendor } from "@/lib/partner-store/vendors";

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
  vendorIds: string[],
  usedIds: Set<string>,
  pool: PartnerProduct[],
  slotIndex: number,
  _roomType: RoomKind,
) {
  const option = pieceOptionById(slot);
  const catalogPool = partnerProducts.length ? partnerProducts : pool;
  const brandIds = dedicatedBrandIds(vendorIds);
  const brandNames = new Set(
    brandIds
      .map((id) => getVendor(id)?.brandName)
      .filter((name): name is string => Boolean(name)),
  );
  const matches = catalogPool.filter((product) => {
    if (usedIds.has(product.id)) return false;
    const name = product.name.toLowerCase();
    if (
      _roomType !== "bedroom" &&
      (product.category === "beds" ||
        product.slot === "bed" ||
        product.slot === "nightstand" ||
        name.includes("noptier") ||
        name.startsWith("pat "))
    ) {
      return false;
    }
    if (product.slot === slot) return true;
    if (option && product.category === option.category && productMatchesSlot(product, slot)) {
      return true;
    }
    return productMatchesSlot(product, slot);
  });
  if (!matches.length) return undefined;
  const brandPool = brandIds.length
    ? matches.filter(
        (product) =>
          brandIds.includes(product.vendorId as (typeof brandIds)[number]) ||
          (product.brand && brandNames.has(product.brand)),
      )
    : matches;
  const ranked = [...brandPool].sort((a, b) => {
    const preferred = brandIds[slotIndex % Math.max(brandIds.length, 1)];
    const brandDelta =
      Number(b.vendorId === preferred) - Number(a.vendorId === preferred);
    if (brandDelta) return brandDelta;
    const styleDelta = styleScore(b, style) - styleScore(a, style);
    if (styleDelta) return styleDelta;
    return a.price - b.price;
  });
  return ranked[0];
}

export function resolveFurnitureSet(
  roomType: RoomKind,
  style: InteriorStyle | string | undefined,
  vendorId?: string | string[],
  pool: PartnerProduct[] = partnerProducts,
  selectedSlots?: PieceSlotId[],
  selectedPieces?: string[],
) {
  const styleKey = normalizeStyle(style);
  const wanted = checkedChecklistSlots(selectedSlots, selectedPieces, roomType);
  const vendorIds = Array.isArray(vendorId)
    ? vendorId
    : vendorId && vendorId !== MIX_VENDOR_ID
      ? [vendorId]
      : [];
  const seen = new Set<string>();
  const picked: PartnerProduct[] = [];
  wanted.forEach((slot, index) => {
    const product = pickForSlot(
      slot,
      styleKey,
      vendorIds,
      seen,
      pool,
      index,
      roomType,
    );
    if (!product || seen.has(product.id)) return;
    seen.add(product.id);
    picked.push({ ...product, slot });
  });
  return picked.slice(0, wanted.length);
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
  roomType: RoomKind | string;
  style: string;
  vendorName: string;
  products: PartnerProduct[];
}) {
  return buildDynamicRenderPrompt(
    input.roomType,
    input.style,
    input.products.map((product) => product.name),
  );
}

export function buildDynamicRenderPrompt(
  selectedRoom: string,
  selectedStyle: string,
  selectedPieces: string[],
) {
  const roomName = selectedRoom;
  const piecesText = selectedPieces.join(", ");
  return `A photorealistic render of a ${roomName} in ${selectedStyle} style, containing strictly: ${piecesText}. Completely remove any beds or bedroom furniture.`;
}
