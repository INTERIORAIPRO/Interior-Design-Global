import type { InteriorStyle } from "@/lib/ai-render/catalogPick";
import {
  partnerProducts,
  uniqueProductImage,
  type PartnerProduct,
  type RoomKind,
} from "@/lib/partner-store/catalog";
import { MIX_VENDOR_ID } from "@/lib/partner-store/vendors";
import {
  defaultSelectedSlots,
  type PieceSlotId,
} from "@/lib/ai-render/furniturePieces";

export type CatalogSetIds = {
  bed?: string;
  nightstand?: string;
  lighting?: string;
  accessory?: string;
  sofa?: string;
  table?: string;
  lamp?: string;
  rug?: string;
};

const bedroomSets: Record<string, Partial<Record<InteriorStyle, string[]>>> = {
  "kave-home": {
    boho: ["th-bed-boho", "th-nightstand-boho", "th-pendant-boho", "th-pouf-boho"],
    midcentury: [
      "th-bed-midcentury",
      "th-nightstand-midcentury",
      "th-pendant-midcentury",
      "th-pouf-midcentury",
    ],
    japandi: ["th-bed-nordic", "th-nightstand-oak", "th-pendant-linen", "th-stool-oak"],
    scandinavian: [
      "th-bed-nordic",
      "th-nightstand-oak",
      "th-pendant-linen",
      "th-stool-oak",
    ],
    modern: ["th-bed-essential", "th-nightstand-metal", "th-lamp-minimal", "th-bench-oak"],
    contemporary: [
      "th-bed-essential",
      "th-nightstand-metal",
      "th-lamp-minimal",
      "th-bench-oak",
    ],
    minimalist: [
      "th-bed-essential",
      "th-nightstand-oak",
      "th-pendant-linen",
      "th-stool-oak",
    ],
    industrial: [
      "th-bed-essential",
      "th-nightstand-metal",
      "th-lamp-minimal",
      "th-stool-oak",
    ],
  },
  sklum: {
    boho: ["sk-bed", "sk-nightstand", "sk-lamp-steel", "sk-rug"],
    midcentury: ["sk-bed", "sk-nightstand", "sk-lamp-steel", "sk-rug"],
    japandi: ["sk-bed", "sk-nightstand", "sk-lamp-steel", "sk-rug"],
    scandinavian: ["sk-bed", "sk-nightstand", "sk-lamp-steel", "sk-rug"],
    modern: ["sk-bed", "sk-nightstand", "sk-lamp-steel", "sk-rug"],
    contemporary: ["sk-bed", "sk-nightstand", "sk-lamp-steel", "sk-rug"],
    minimalist: ["sk-bed", "sk-nightstand", "sk-lamp-steel", "sk-rug"],
    industrial: ["sk-bed", "sk-nightstand", "sk-lamp-steel", "sk-rug"],
  },
  westwing: {
    boho: ["ww-bed", "ww-nightstand", "ww-pendant-midcentury", "ww-pouf-midcentury"],
    midcentury: [
      "ww-bed-midcentury",
      "ww-nightstand-midcentury",
      "ww-pendant-midcentury",
      "ww-pouf-midcentury",
    ],
    japandi: ["ww-bed", "ww-nightstand", "ww-pendant-midcentury", "ww-bench"],
    scandinavian: ["ww-bed", "ww-nightstand", "ww-lamp", "ww-bench"],
    modern: ["ww-bed", "ww-nightstand", "ww-lamp", "ww-rug"],
    contemporary: ["ww-bed", "ww-nightstand", "ww-lamp", "ww-bench"],
    minimalist: ["ww-bed", "ww-nightstand", "ww-lamp", "ww-rug"],
    industrial: ["ww-bed", "ww-nightstand", "ww-pendant-midcentury", "ww-rug"],
  },
  ikea: {
    boho: ["ikea-malm-bed", "ikea-nightstand", "ikea-lamp", "ikea-stool"],
    midcentury: ["ikea-malm-bed", "ikea-nightstand", "ikea-lamp", "ikea-stool"],
    japandi: ["ikea-malm-bed", "ikea-nightstand", "ikea-lamp", "ikea-stool"],
    scandinavian: ["ikea-malm-bed", "ikea-nightstand", "ikea-lamp", "ikea-stool"],
    modern: ["ikea-malm-bed", "ikea-nightstand", "ikea-lamp", "ikea-stool"],
    contemporary: ["ikea-malm-bed", "ikea-nightstand", "ikea-lamp", "ikea-stool"],
    minimalist: ["ikea-malm-bed", "ikea-nightstand", "ikea-lamp", "ikea-stool"],
    industrial: ["ikea-malm-bed", "ikea-nightstand", "ikea-lamp", "ikea-stool"],
  },
  micadoni: {
    boho: ["mc-bed-linen", "mc-nightstand", "mc-pendant", "mc-stool"],
    midcentury: ["mc-bed-linen", "mc-nightstand", "mc-pendant", "mc-stool"],
    japandi: ["mc-bed-linen", "mc-nightstand", "mc-pendant", "mc-stool"],
    scandinavian: ["mc-bed-linen", "mc-nightstand", "mc-pendant", "mc-stool"],
    modern: ["mc-bed-velvet", "mc-nightstand", "mc-pendant", "mc-stool"],
    contemporary: ["mc-bed-luxe", "mc-nightstand-luxe", "mc-pendant", "mc-bench-luxe"],
    minimalist: ["mc-bed-linen", "mc-nightstand", "mc-lamp", "mc-stool"],
    industrial: ["mc-bed-velvet", "mc-nightstand", "mc-pendant", "mc-rug"],
  },
  "maisons-du-monde": {
    boho: ["mdm-bed", "mdm-nightstand", "mdm-lamp", "th-pouf-boho"],
    midcentury: ["mdm-bed", "mdm-nightstand", "mdm-lamp", "th-stool-oak"],
    japandi: ["mdm-bed", "mdm-nightstand", "mdm-lamp", "th-stool-oak"],
    scandinavian: ["mdm-bed", "mdm-nightstand", "mdm-lamp", "th-stool-oak"],
    modern: ["mdm-bed", "mdm-nightstand", "mdm-lamp", "th-stool-oak"],
    contemporary: ["mdm-bed", "mdm-nightstand", "mdm-lamp", "th-stool-oak"],
    minimalist: ["mdm-bed", "mdm-nightstand", "mdm-lamp", "th-stool-oak"],
    industrial: ["mdm-bed", "mdm-nightstand", "mdm-lamp", "th-stool-oak"],
  },
};

const livingSets: Record<string, Partial<Record<InteriorStyle, string[]>>> = {
  "kave-home": {
    boho: ["th-sofa-nordic-1", "th-table-coffee-oak", "th-lamp-brass-arc", "th-rug-wool-beige"],
    midcentury: [
      "th-sofa-nordic-1",
      "th-table-coffee-oak",
      "th-lamp-brass-arc",
      "th-rug-wool-beige",
    ],
    japandi: [
      "th-sofa-nordic-1",
      "th-table-coffee-oak",
      "th-lamp-minimal",
      "th-rug-wool-beige",
    ],
    scandinavian: [
      "th-sofa-nordic-1",
      "th-table-coffee-oak",
      "th-lamp-brass-arc",
      "th-rug-wool-beige",
    ],
    modern: [
      "th-sofa-nordic-1",
      "th-table-coffee-oak",
      "th-lamp-minimal",
      "th-rug-wool-beige",
    ],
    contemporary: [
      "th-sofa-nordic-1",
      "th-table-coffee-oak",
      "th-lamp-minimal",
      "th-rug-wool-beige",
    ],
    minimalist: [
      "th-sofa-nordic-1",
      "th-table-coffee-oak",
      "th-lamp-minimal",
      "th-rug-wool-beige",
    ],
    industrial: [
      "th-sofa-nordic-1",
      "th-table-coffee-oak",
      "th-lamp-minimal",
      "th-rug-wool-beige",
    ],
  },
  westwing: {
    boho: ["ww-armchair-boucle", "mdm-table-oak", "ww-lamp", "ww-rug"],
    midcentury: ["ww-armchair-boucle", "mdm-table-oak", "ww-lamp", "ww-rug"],
    japandi: ["ww-armchair-boucle", "mdm-table-oak", "ww-lamp", "ww-rug"],
    scandinavian: ["ww-armchair-boucle", "mdm-table-oak", "ww-lamp", "ww-rug"],
    modern: ["ww-armchair-boucle", "mdm-table-oak", "ww-lamp", "ww-rug"],
    contemporary: ["ww-armchair-boucle", "mdm-table-oak", "ww-lamp", "ww-rug"],
    minimalist: ["ww-armchair-boucle", "mdm-table-oak", "ww-lamp", "ww-rug"],
    industrial: ["ww-armchair-boucle", "mdm-table-oak", "ww-lamp", "ww-rug"],
  },
  ikea: {
    boho: ["ikea-kivik-sofa", "th-table-coffee-oak", "ikea-lamp", "wf-rug-jute"],
    midcentury: ["ikea-kivik-sofa", "th-table-coffee-oak", "ikea-lamp", "wf-rug-jute"],
    japandi: ["ikea-kivik-sofa", "th-table-coffee-oak", "ikea-lamp", "wf-rug-jute"],
    scandinavian: ["ikea-kivik-sofa", "th-table-coffee-oak", "ikea-lamp", "wf-rug-jute"],
    modern: ["ikea-kivik-sofa", "th-table-coffee-oak", "ikea-lamp", "wf-rug-jute"],
    contemporary: ["ikea-kivik-sofa", "th-table-coffee-oak", "ikea-lamp", "wf-rug-jute"],
    minimalist: ["ikea-kivik-sofa", "th-table-coffee-oak", "ikea-lamp", "wf-rug-jute"],
    industrial: ["ikea-kivik-sofa", "th-table-coffee-oak", "ikea-lamp", "wf-rug-jute"],
  },
  sklum: {
    industrial: ["ikea-kivik-sofa", "mdm-table-oak", "sk-lamp-steel", "sk-rug"],
    modern: ["ikea-kivik-sofa", "mdm-table-oak", "sk-lamp-steel", "sk-rug"],
    contemporary: ["ikea-kivik-sofa", "mdm-table-oak", "sk-lamp-steel", "sk-rug"],
    scandinavian: ["ikea-kivik-sofa", "mdm-table-oak", "sk-lamp-steel", "sk-rug"],
    japandi: ["ikea-kivik-sofa", "mdm-table-oak", "sk-lamp-steel", "sk-rug"],
    midcentury: ["ikea-kivik-sofa", "mdm-table-oak", "sk-lamp-steel", "sk-rug"],
    boho: ["ikea-kivik-sofa", "mdm-table-oak", "sk-lamp-steel", "sk-rug"],
    minimalist: ["ikea-kivik-sofa", "mdm-table-oak", "sk-lamp-steel", "sk-rug"],
  },
  micadoni: {
    modern: ["mc-sofa-velvet", "th-table-coffee-oak", "mc-lamp", "mc-rug"],
    contemporary: ["mc-sofa-velvet", "th-table-coffee-oak", "mc-lamp-luxe", "mc-rug"],
    scandinavian: ["mc-sofa-velvet", "th-table-coffee-oak", "mc-lamp", "mc-rug"],
    japandi: ["mc-sofa-velvet", "th-table-coffee-oak", "mc-lamp", "mc-rug"],
    midcentury: ["mc-sofa-velvet", "th-table-coffee-oak", "mc-lamp", "mc-rug"],
    boho: ["mc-sofa-velvet", "th-table-coffee-oak", "mc-lamp", "mc-rug"],
    minimalist: ["mc-sofa-velvet", "th-table-coffee-oak", "mc-lamp", "mc-rug"],
    industrial: ["mc-sofa-velvet", "th-table-coffee-oak", "mc-lamp", "mc-rug"],
  },
};

const roomSetTable: Record<RoomKind, Record<string, Partial<Record<InteriorStyle, string[]>>>> = {
  bedroom: bedroomSets,
  living: livingSets,
  office: {
    "kave-home": {
      scandinavian: ["th-desk-oak", "th-lamp-minimal", "th-decor-vase-ceramic"],
      japandi: ["th-desk-oak", "th-lamp-minimal", "th-decor-vase-ceramic"],
      modern: ["th-desk-oak", "th-lamp-minimal", "th-decor-vase-ceramic"],
      contemporary: ["th-desk-oak", "th-lamp-minimal", "th-decor-vase-ceramic"],
      minimalist: ["th-desk-oak", "th-lamp-minimal", "th-decor-vase-ceramic"],
      industrial: ["th-desk-oak", "th-lamp-minimal", "th-decor-vase-ceramic"],
      midcentury: ["th-desk-oak", "th-lamp-brass-arc", "th-decor-vase-ceramic"],
      boho: ["th-desk-oak", "th-lamp-brass-arc", "th-decor-vase-ceramic"],
    },
    ikea: {
      scandinavian: ["ikea-norrasen-desk", "ikea-lamp", "wf-rug-jute"],
      japandi: ["ikea-norrasen-desk", "ikea-lamp", "wf-rug-jute"],
      modern: ["ikea-norrasen-desk", "ikea-lamp", "wf-rug-jute"],
      contemporary: ["ikea-norrasen-desk", "ikea-lamp", "wf-rug-jute"],
      minimalist: ["ikea-norrasen-desk", "ikea-lamp", "wf-rug-jute"],
      industrial: ["ikea-norrasen-desk", "ikea-lamp", "wf-rug-jute"],
      midcentury: ["ikea-norrasen-desk", "ikea-lamp", "wf-rug-jute"],
      boho: ["ikea-norrasen-desk", "ikea-lamp", "wf-rug-jute"],
    },
  },
  kitchen: {
    "kave-home": {
      scandinavian: ["th-dining-oak", "th-decor-vase-ceramic", "th-pendant-linen"],
      japandi: ["th-dining-oak", "th-decor-vase-ceramic", "th-pendant-linen"],
      boho: ["th-dining-oak", "th-decor-vase-ceramic", "th-pendant-boho"],
      modern: ["th-dining-oak", "th-decor-vase-ceramic", "th-lamp-minimal"],
      contemporary: ["th-dining-oak", "th-decor-vase-ceramic", "th-lamp-minimal"],
      minimalist: ["th-dining-oak", "th-decor-vase-ceramic", "th-lamp-minimal"],
      industrial: ["th-dining-oak", "th-decor-vase-ceramic", "th-lamp-minimal"],
      midcentury: ["th-dining-oak", "th-decor-vase-ceramic", "th-pendant-midcentury"],
    },
  },
};

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

function vendorKey(vendorId?: string) {
  if (!vendorId || vendorId === MIX_VENDOR_ID) return "kave-home";
  return vendorId;
}

export function lookupFurnitureSetIds(
  roomType: RoomKind,
  style: InteriorStyle | string | undefined,
  vendorId?: string,
) {
  const styleKey = normalizeStyle(style);
  const vendor = vendorKey(vendorId);
  const table = roomSetTable[roomType] ?? {};
  return (
    table[vendor]?.[styleKey] ||
    table[vendor]?.scandinavian ||
    table["kave-home"]?.[styleKey] ||
    table["kave-home"]?.scandinavian ||
    []
  );
}

const livingTvByVendor: Record<string, string> = {
  "kave-home": "th-tv-unit",
  westwing: "ww-tv-unit",
  ikea: "ikea-tv-unit",
  sklum: "sk-tv-unit",
  micadoni: "mc-tv-unit",
  "maisons-du-monde": "th-tv-unit",
};

function slotsFromSetIds(
  roomType: RoomKind,
  ids: string[],
  vendorId?: string,
): Partial<Record<PieceSlotId, string>> {
  if (roomType === "bedroom") {
    return {
      bed: ids[0],
      nightstand: ids[1],
      pendant: ids[2],
      pouf: ids[3],
    };
  }
  if (roomType === "living") {
    return {
      sofa: ids[0],
      table: ids[1],
      lamp: ids[2],
      rug: ids[3],
      tv: livingTvByVendor[vendorKey(vendorId)] || "th-tv-unit",
    };
  }
  return {};
}

export function resolveFurnitureSet(
  roomType: RoomKind,
  style: InteriorStyle | string | undefined,
  vendorId?: string,
  pool: PartnerProduct[] = partnerProducts,
  selectedSlots?: PieceSlotId[],
) {
  const ids = lookupFurnitureSetIds(roomType, style, vendorId);
  const byId = new Map(pool.map((product) => [product.id, product]));
  const catalog = new Map(partnerProducts.map((product) => [product.id, product]));
  const slots = slotsFromSetIds(roomType, ids, vendorId);
  const wanted =
    selectedSlots && selectedSlots.length > 0
      ? selectedSlots
      : defaultSelectedSlots(roomType);
  const chosenIds =
    wanted.length > 0
      ? wanted.map((slot) => slots[slot]).filter((id): id is string => Boolean(id))
      : ids;
  return chosenIds
    .map((id) => byId.get(id) || catalog.get(id))
    .filter((product): product is PartnerProduct => Boolean(product));
}

export function toRenderProduct(product: PartnerProduct) {
  const imageUrl = uniqueProductImage(product);
  return {
    id: product.id,
    sku: product.sku,
    name: product.name,
    title: product.title || product.name,
    description: product.description,
    promptHint: product.promptHint,
    category: product.category,
    price: product.price,
    currency: product.currency,
    imageUrl,
    image: imageUrl,
    image2d: imageUrl || product.image2d,
    buyUrl: product.buyUrl || product.affiliateUrl,
    affiliateUrl: product.affiliateUrl,
    vendorId: product.vendorId,
    accentColor: product.accentColor,
    styles: product.styles,
    style: product.style,
    rooms: product.rooms,
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
          : "kitchen";
  const pieces = input.products.map(
    (product) => product.promptHint || product.description || product.name,
  );
  const named = input.products
    .map((product) => `${product.name}: ${product.description}`)
    .join("; ");
  const [first, second, third, fourth] = [
    pieces[0] || "catalog furniture",
    pieces[1] || "matching companion piece",
    pieces[2] || "coordinated lighting",
    pieces[3] || "textile accessory",
  ];
  const strictList = input.products
    .map((product) => product.description || product.promptHint || product.name)
    .join(", ");
  return [
    `Render a ${roomWord} in ${input.style} style containing strictly: ${strictList}.`,
    `A high-end photorealistic interior design render of a ${roomWord}. Include a ${first}, ${second}, ${third}, and ${fourth}. Style: ${input.style}. Clean lighting, architectural digest photo quality.`,
    `VENDOR: ${input.vendorName}. Render ONLY these catalog pieces, recognizable and fully in frame: ${named}.`,
    "VIRTUAL STAGING of the USER'S OWN ROOM PHOTOGRAPH: keep the same walls, windows, doors, ceiling, floor and camera angle.",
    "wide angle interior photo, full view of the room, well framed composition, complete furniture pieces visible without clipping",
    "ultra-realistic, 8k resolution, interior design photography, magazine style, architectural digest lighting",
  ].join(" ");
}
