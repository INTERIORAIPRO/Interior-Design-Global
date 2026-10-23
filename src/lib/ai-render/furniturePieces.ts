import type { PartnerProduct, RoomKind } from "@/lib/partner-store/catalog";

export type PieceSlotId =
  | "bed"
  | "nightstand"
  | "desk"
  | "officeChair"
  | "tv"
  | "sofa"
  | "table"
  | "diningTable"
  | "diningChair"
  | "pendant"
  | "rug"
  | "pouf"
  | "artwork"
  | "lamp"
  | "armchair"
  | "shelf"
  | "wardrobe"
  | "bedding"
  | "deskLamp"
  | "officeShelf"
  | "officeRug"
  | "wallOrganizer"
  | "diningPendant"
  | "buffet"
  | "island"
  | "barStool"
  | "countertop"
  | "vanity"
  | "shower"
  | "faucet"
  | "toilet"
  | "tile"
  | "wetPaint"
  | "paint"
  | "wallpaper"
  | "panels"
  | "terraceLounge"
  | "terraceTable"
  | "terraceUmbrella"
  | "terraceLight";

export type PieceOption = {
  id: PieceSlotId;
  label: string;
  category: string;
  defaultOn: boolean;
};

export const GLOBAL_FINISHES: PieceOption[] = [
  { id: "paint", label: "Vopsea decorativă / Novacolor", category: "finishes", defaultOn: false },
  { id: "wallpaper", label: "Tapet / Fototapet", category: "finishes", defaultOn: false },
  { id: "panels", label: "Panouri decorative PAL/MDF", category: "materials", defaultOn: false },
];

export const CHECKLIST_BY_ROOM: Record<RoomKind, PieceOption[]> = {
  bathroom: [
    { id: "vanity", label: "Măschiță chiuvetă / Oglindă", category: "bath", defaultOn: true },
    { id: "shower", label: "Duș walk-in / Cadă", category: "bath", defaultOn: true },
    { id: "faucet", label: "Baterie sanitară", category: "sanitary", defaultOn: true },
    { id: "toilet", label: "Vas WC / Bidet", category: "sanitary", defaultOn: true },
    { id: "tile", label: "Placare ceramică / Marmură", category: "materials", defaultOn: false },
    { id: "wetPaint", label: "Vopsea rezistentă la apă / Microciment", category: "finishes", defaultOn: false },
  ],
  office: [
    { id: "desk", label: "Birou", category: "tables", defaultOn: true },
    { id: "officeChair", label: "Scaun ergonomic", category: "armchair", defaultOn: true },
    { id: "deskLamp", label: "Lampă de birou / Lampadar", category: "lighting", defaultOn: true },
    { id: "officeShelf", label: "Etajeră / Rafturi", category: "decor", defaultOn: false },
    { id: "rug", label: "Covor", category: "rugs", defaultOn: false },
  ],
  kitchen: [
    { id: "diningTable", label: "Masă Dining", category: "tables", defaultOn: true },
    { id: "diningChair", label: "Scaune Dining", category: "armchair", defaultOn: true },
    { id: "diningPendant", label: "Corp iluminat suspendat", category: "lighting", defaultOn: true },
    { id: "island", label: "Insulă / Scaune de bar", category: "tables", defaultOn: false },
    { id: "countertop", label: "Blat bucătărie", category: "materials", defaultOn: false },
  ],
  living: [
    { id: "sofa", label: "Canapea", category: "sofas", defaultOn: true },
    { id: "table", label: "Măsuță de cafea", category: "tables", defaultOn: true },
    { id: "tv", label: "Comodă TV", category: "sideboard", defaultOn: true },
    { id: "lamp", label: "Lampadar", category: "lighting", defaultOn: false },
    { id: "rug", label: "Covor", category: "rugs", defaultOn: false },
  ],
  bedroom: [
    { id: "bed", label: "Pat", category: "beds", defaultOn: true },
    { id: "nightstand", label: "Noptieră", category: "tables", defaultOn: true },
    { id: "pendant", label: "Corp Iluminat", category: "lighting", defaultOn: true },
    { id: "pouf", label: "Banchetă / Pouf", category: "decor", defaultOn: false },
  ],
  terrace: [
    { id: "terraceLounge", label: "Lounge exterior", category: "sofas", defaultOn: true },
    { id: "terraceTable", label: "Măsuță terasă", category: "tables", defaultOn: true },
    { id: "terraceUmbrella", label: "Umbrela / Pergolă", category: "decor", defaultOn: false },
    { id: "terraceLight", label: "Iluminat exterior", category: "lighting", defaultOn: false },
  ],
};

export const GLOBAL_CHECKLIST: PieceOption[] = [
  ...CHECKLIST_BY_ROOM.living,
  ...CHECKLIST_BY_ROOM.bedroom,
  ...CHECKLIST_BY_ROOM.office,
  ...CHECKLIST_BY_ROOM.kitchen,
  ...CHECKLIST_BY_ROOM.bathroom,
  ...CHECKLIST_BY_ROOM.terrace,
  ...GLOBAL_FINISHES,
];

export function pieceOptionsForRoom(roomType?: string | null): PieceOption[] {
  if (roomType && roomType in CHECKLIST_BY_ROOM) {
    return CHECKLIST_BY_ROOM[roomType as RoomKind];
  }
  return CHECKLIST_BY_ROOM.living;
}

export function visibleChecklist(roomType?: string | null): PieceOption[] {
  return [...pieceOptionsForRoom(roomType), ...GLOBAL_FINISHES];
}

export function defaultSelectedSlots(roomType?: string | null): PieceSlotId[] {
  return pieceOptionsForRoom(roomType)
    .filter((option) => option.defaultOn)
    .map((option) => option.id);
}

export function slotsForSelectedRoom(
  roomType?: string | null,
  selectedSlots?: string[] | null,
): PieceSlotId[] {
  return checkedChecklistSlots(selectedSlots, null, roomType);
}

export function checkedChecklistSlots(
  selectedSlots?: string[] | null,
  selectedPieces?: string[] | null,
  roomType?: string | null,
): PieceSlotId[] {
  const allowed = new Set(GLOBAL_CHECKLIST.map((option) => option.id));
  const fromSlots = (selectedSlots ?? []).filter((slot): slot is PieceSlotId =>
    allowed.has(slot as PieceSlotId),
  );
  if (fromSlots.length > 0) return [...new Set(fromSlots)];
  const fromLabels = (selectedPieces ?? [])
    .map((label) => {
      const needle = label.trim().toLowerCase();
      return GLOBAL_CHECKLIST.find(
        (option) => option.label.toLowerCase() === needle,
      )?.id;
    })
    .filter((slot): slot is PieceSlotId => Boolean(slot));
  if (fromLabels.length > 0) return [...new Set(fromLabels)];
  return defaultSelectedSlots(roomType);
}

export function pieceOptionById(slot: PieceSlotId) {
  return GLOBAL_CHECKLIST.find((option) => option.id === slot);
}

function nameOf(product: Pick<PartnerProduct, "name">) {
  return product.name.toLowerCase();
}

export function productMatchesSlot(
  product: PartnerProduct,
  slot: PieceSlotId,
) {
  if (product.slot === slot) return true;
  const name = nameOf(product);
  const category = product.category;
  switch (slot) {
    case "sofa":
    case "terraceLounge":
      return category === "sofas" || name.includes("canapea") || name.includes("lounge");
    case "table":
    case "terraceTable":
      return (
        (name.includes("cafea") ||
          name.includes("masut") ||
          name.includes("coffee") ||
          name.includes("teras") ||
          category === "coffee-table") &&
        !name.includes("dining") &&
        !name.includes("noptier") &&
        !name.includes("birou")
      );
    case "tv":
      return name.includes("tv") || name.includes("media");
    case "lamp":
    case "deskLamp":
      return (
        (category === "lighting" ||
          name.includes("lamp") ||
          name.includes("lampadar")) &&
        !name.includes("pendul") &&
        !name.includes("suspend")
      );
    case "pendant":
    case "diningPendant":
    case "terraceLight":
      return (
        category === "lighting" ||
        name.includes("pendul") ||
        name.includes("suspend") ||
        name.includes("iluminat")
      );
    case "rug":
    case "officeRug":
      return category === "rugs" || name.includes("covor");
    case "armchair":
      return category === "armchair" || name.includes("fotoliu");
    case "shelf":
    case "officeShelf":
      return name.includes("etajer") || name.includes("bibliotec") || name.includes("raft");
    case "bed":
      return category === "beds" || name.startsWith("pat ");
    case "nightstand":
      return name.includes("noptier");
    case "pouf":
    case "bedding":
      return (
        name.includes("pouf") ||
        name.includes("puf") ||
        name.includes("banchet") ||
        name.includes("cuvertur")
      );
    case "wardrobe":
      return name.includes("dulap") || name.includes("șifonier") || name.includes("sifonier");
    case "desk":
      return name.includes("birou") && category !== "lighting" && !name.includes("scaun");
    case "officeChair":
      return name.includes("scaun") && (name.includes("ergonomic") || name.includes("birou"));
    case "diningTable":
      return name.includes("dining") && !name.includes("scaun");
    case "diningChair":
      return name.includes("scaun") && name.includes("dining");
    case "island":
    case "barStool":
      return name.includes("insul") || (name.includes("bar") && name.includes("scaun"));
    case "countertop":
      return name.includes("blat") || name.includes("counter") || name.includes("fenix") || name.includes("silestone");
    case "vanity":
      return name.includes("chiuvet") || name.includes("oglind") || name.includes("masca") || name.includes("măschi");
    case "shower":
      return name.includes("duș") || name.includes("dus") || name.includes("cadă") || name.includes("cada");
    case "faucet":
      return name.includes("baterie") || name.includes("grohe") || name.includes("robinet");
    case "toilet":
      return name.includes("wc") || name.includes("bidet") || name.includes("toalet");
    case "tile":
      return name.includes("plac") || name.includes("marmur") || name.includes("gresie") || name.includes("faiant");
    case "wetPaint":
    case "paint":
      return name.includes("vopsea") || name.includes("novacolor") || name.includes("microciment");
    case "wallpaper":
      return name.includes("tapet") || name.includes("fototapet") || name.includes("rebel");
    case "panels":
      return name.includes("panou") || name.includes("pal") || name.includes("mdf") || name.includes("egger");
    case "terraceUmbrella":
      return name.includes("umbrel") || name.includes("pergol");
    case "artwork":
      return category === "decor" || name.includes("vaz") || name.includes("tablou");
    default:
      return false;
  }
}
