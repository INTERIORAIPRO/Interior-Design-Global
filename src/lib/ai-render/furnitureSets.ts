import type { InteriorStyle } from "@/lib/ai-render/catalogPick";
import {
  productMatchesSlot,
  slotsForSelectedRoom,
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

function isForbiddenInRoom(product: PartnerProduct, roomType: RoomKind) {
  const name = product.name.toLowerCase();
  if (name.includes("vaz") || name.includes("vasă") || name.includes("vase")) {
    return true;
  }
  if (roomType !== "bedroom") {
    if (product.category === "beds") return true;
    if (name.startsWith("pat ") || name.includes("noptier")) return true;
  }
  if (roomType === "office" && (product.category === "sofas" || name.includes("canapea"))) {
    return true;
  }
  if (roomType === "living" && (name.includes("birou") || product.category === "beds")) {
    return true;
  }
  if (
    roomType === "kitchen" &&
    (product.category === "beds" || product.category === "sofas")
  ) {
    return true;
  }
  return false;
}

function pickForSlot(
  slot: PieceSlotId,
  style: InteriorStyle,
  vendorId: string | undefined,
  roomType: RoomKind,
  usedIds: Set<string>,
  usedImages: Set<string>,
  pool: PartnerProduct[],
) {
  const catalogPool = partnerProducts.length ? partnerProducts : pool;
  const matches = catalogPool.filter(
    (product) =>
      productMatchesSlot(product, slot) &&
      !isForbiddenInRoom(product, roomType) &&
      !usedIds.has(product.id),
  );
  if (!matches.length) return undefined;
  const selectedBrand = vendorId ? getVendor(vendorId)?.brandName : undefined;
  const inRoom = matches.filter((product) => product.rooms?.includes(roomType));
  const roomMatches = inRoom.length ? inRoom : matches;
  const brandPool =
    !vendorId || vendorId === MIX_VENDOR_ID
      ? roomMatches
      : roomMatches.filter(
          (product) =>
            product.vendorId === vendorId ||
            (selectedBrand && product.brand === selectedBrand),
        );
  const mixFallback = roomMatches.filter((product) => product.vendorId !== vendorId);
  const ranked = (
    brandPool.length ? brandPool : mixFallback.length ? mixFallback : roomMatches
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
) {
  const styleKey = normalizeStyle(style);
  const wanted = slotsForSelectedRoom(roomType, selectedSlots);
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

const ROOM_PROMPT_LEAD: Record<RoomKind, string> = {
  office:
    "A modern home office interior with a study desk, ergonomic chair, desk lamp",
  living:
    "A modern living room interior with a sofa, coffee table and TV cabinet",
  bedroom: "A modern bedroom interior with a bed, nightstand and lighting",
  kitchen:
    "A modern kitchen dining interior with a dining table, dining chairs and a suspended pendant light",
};

export function buildCatalogSetPrompt(input: {
  roomType: RoomKind;
  style: string;
  vendorName: string;
  products: PartnerProduct[];
}) {
  const lead = ROOM_PROMPT_LEAD[input.roomType] ?? ROOM_PROMPT_LEAD.living;
  const strictList = input.products
    .map(
      (product) =>
        `${product.name} (${product.brand || product.vendorId}): ${product.description || product.promptHint}`,
    )
    .join(", ");
  const roomLock =
    input.roomType === "office"
      ? "This is a HOME OFFICE, not a bedroom and not a living room. Do NOT render a bed, mattress, nightstands or a lounge sofa."
      : input.roomType === "living"
        ? "This is a LIVING ROOM, not a bedroom. Do NOT render a bed, mattress or nightstands."
        : input.roomType === "kitchen"
          ? "This is a KITCHEN / DINING room, not a bedroom. Do NOT render a bed or a living-room sofa as the main piece."
          : "This is a BEDROOM, not a living room. Do NOT render a lounge sofa as the main piece.";
  return [
    `${lead} in ${input.style} style.`,
    strictList
      ? `Containing strictly these catalog pieces: ${strictList}.`
      : "Keep only furniture that belongs to this room type.",
    "Do not add furniture that is not listed. Keep only these catalog pieces fully in frame.",
    roomLock,
    `VENDOR preference: ${input.vendorName}.`,
    "VIRTUAL STAGING of the USER'S OWN ROOM PHOTOGRAPH: keep the same walls, windows, doors, ceiling, floor and camera angle.",
    "wide angle interior photo, full view of the room, well framed composition, complete furniture pieces visible without clipping",
    "ultra-realistic, 8k resolution, interior design photography, magazine style, architectural digest lighting",
  ].join(" ");
}
