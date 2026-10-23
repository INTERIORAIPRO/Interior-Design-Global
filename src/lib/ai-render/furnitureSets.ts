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
  _roomType: RoomKind,
  usedIds: Set<string>,
  usedImages: Set<string>,
  pool: PartnerProduct[],
) {
  const option = pieceOptionById(slot);
  const catalogPool = partnerProducts.length ? partnerProducts : pool;
  const matches = catalogPool.filter((product) => {
    if (usedIds.has(product.id)) return false;
    if (product.slot === slot) return true;
    if (option && product.category === option.category && productMatchesSlot(product, slot)) {
      return true;
    }
    return productMatchesSlot(product, slot);
  });
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
  const ranked = (
    brandPool.length ? brandPool : mixFallback.length ? mixFallback : matches
  ).sort((a, b) => {
    const styleDelta = styleScore(b, style) - styleScore(a, style);
    if (styleDelta) return styleDelta;
    const brandBoost =
      vendorId && vendorId !== MIX_VENDOR_ID
        ? Number(b.vendorId === vendorId) - Number(a.vendorId === vendorId)
        : 0;
    if (brandBoost) return brandBoost;
    return a.price - b.price;
  });
  return ranked.find((product) => {
    const image = uniqueProductImage(product);
    return !usedImages.has(image);
  }) ?? ranked[0];
}

export function resolveFurnitureSet(
  roomType: RoomKind,
  style: InteriorStyle | string | undefined,
  vendorId?: string,
  pool: PartnerProduct[] = partnerProducts,
  selectedSlots?: PieceSlotId[],
  selectedPieces?: string[],
) {
  const styleKey = normalizeStyle(style);
  const wanted = checkedChecklistSlots(selectedSlots, selectedPieces, roomType);
  const seen = new Set<string>();
  const usedImages = new Set<string>();
  const picked: PartnerProduct[] = [];
  for (const slot of wanted) {
    const product = pickForSlot(
      slot,
      styleKey,
      vendorId,
      roomType,
      seen,
      usedImages,
      pool,
    );
    if (!product || seen.has(product.id)) continue;
    seen.add(product.id);
    usedImages.add(uniqueProductImage(product));
    picked.push({ ...product, slot });
  }
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
  return `A photorealistic interior photo of a ${roomName} in ${selectedStyle} style, featuring strictly these exact items: ${piecesText}. Architectural digest quality, clean studio illumination.`;
}
