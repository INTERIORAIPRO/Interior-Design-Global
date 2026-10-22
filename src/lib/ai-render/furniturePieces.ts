import type { PartnerProduct, RoomKind } from "@/lib/partner-store/catalog";

export type PieceSlotId =
  | "sofa"
  | "table"
  | "tv"
  | "lamp"
  | "rug"
  | "armchair"
  | "shelf"
  | "bed"
  | "nightstand"
  | "pendant"
  | "pouf"
  | "wardrobe"
  | "bedding"
  | "desk"
  | "officeChair"
  | "deskLamp"
  | "officeShelf"
  | "officeRug"
  | "wallOrganizer"
  | "diningTable"
  | "diningChair"
  | "diningPendant"
  | "buffet"
  | "island"
  | "barStool";

export type PieceOption = {
  id: PieceSlotId;
  label: string;
  defaultOn: boolean;
};

export const CHECKLIST_BY_ROOM: Record<RoomKind, PieceOption[]> = {
  office: [
    { id: "desk", label: "Birou", defaultOn: true },
    { id: "officeChair", label: "Scaun birou / ergonomic", defaultOn: true },
    { id: "deskLamp", label: "Lampă de birou / Lampadar", defaultOn: true },
    { id: "officeShelf", label: "Etajeră / Rafturi", defaultOn: false },
    { id: "officeRug", label: "Covor", defaultOn: false },
    { id: "armchair", label: "Fotoliu citit", defaultOn: false },
  ],
  kitchen: [
    { id: "diningTable", label: "Masă Dining", defaultOn: true },
    { id: "diningChair", label: "Scaune Dining", defaultOn: true },
    { id: "diningPendant", label: "Corp iluminat suspendat", defaultOn: true },
    { id: "buffet", label: "Bufet / Comodă", defaultOn: false },
    { id: "barStool", label: "Scaune de bar", defaultOn: false },
  ],
  living: [
    { id: "sofa", label: "Canapea", defaultOn: true },
    { id: "table", label: "Măsuță de cafea", defaultOn: true },
    { id: "tv", label: "Comodă TV", defaultOn: true },
    { id: "lamp", label: "Lampadar", defaultOn: false },
    { id: "rug", label: "Covor", defaultOn: false },
    { id: "armchair", label: "Fotoliu", defaultOn: false },
  ],
  bedroom: [
    { id: "bed", label: "Pat", defaultOn: true },
    { id: "nightstand", label: "Noptieră", defaultOn: true },
    { id: "pendant", label: "Corp Iluminat", defaultOn: true },
    { id: "pouf", label: "Banchetă / Pouf", defaultOn: false },
    { id: "wardrobe", label: "Dulap", defaultOn: false },
  ],
};

export const livingPieceOptions = CHECKLIST_BY_ROOM.living;
export const bedroomPieceOptions = CHECKLIST_BY_ROOM.bedroom;
export const officePieceOptions = CHECKLIST_BY_ROOM.office;
export const kitchenPieceOptions = CHECKLIST_BY_ROOM.kitchen;

export function pieceOptionsForRoom(roomType?: string | null): PieceOption[] {
  if (roomType === "living") return CHECKLIST_BY_ROOM.living;
  if (roomType === "bedroom") return CHECKLIST_BY_ROOM.bedroom;
  if (roomType === "office") return CHECKLIST_BY_ROOM.office;
  if (roomType === "kitchen") return CHECKLIST_BY_ROOM.kitchen;
  return CHECKLIST_BY_ROOM.living;
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
  const allowed = pieceOptionsForRoom(roomType).map((option) => option.id);
  const allowedSet = new Set(allowed);
  const filtered = (selectedSlots ?? []).filter((slot): slot is PieceSlotId =>
    allowedSet.has(slot as PieceSlotId),
  );
  return filtered.length > 0 ? filtered : defaultSelectedSlots(roomType);
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
  if (name.includes("vaz") || name.includes("vasă") || name.includes("vase")) {
    return false;
  }
  const category = product.category;
  switch (slot) {
    case "sofa":
      return category === "sofas" || name.includes("canapea");
    case "table":
      return (
        (name.includes("cafea") ||
          name.includes("masut") ||
          name.includes("coffee") ||
          category === "coffee-table") &&
        !name.includes("dining") &&
        !name.includes("noptier") &&
        !name.includes("birou")
      );
    case "tv":
      return (
        name.includes("tv") ||
        name.includes("media") ||
        name.includes("comodă tv") ||
        name.includes("comoda tv")
      );
    case "lamp":
      return (
        (category === "lighting" ||
          name.includes("lampadar") ||
          name.includes("veioz") ||
          name.includes("lamp")) &&
        !name.includes("pendul") &&
        !name.includes("birou") &&
        !name.includes("desk")
      );
    case "rug":
    case "officeRug":
      return category === "rugs" || name.includes("covor");
    case "armchair":
      return (
        (category === "armchair" ||
          name.includes("fotoliu") ||
          name.includes("citit")) &&
        !name.includes("puf") &&
        !name.includes("pouf") &&
        !name.includes("taburet") &&
        !name.includes("banchet") &&
        !name.includes("scaun")
      );
    case "shelf":
    case "officeShelf":
      return (
        name.includes("etajer") ||
        name.includes("bibliotec") ||
        name.includes("raft")
      );
    case "bed":
      return category === "beds" || name.startsWith("pat ") || name.includes("pat tapi");
    case "nightstand":
      return name.includes("noptier");
    case "pendant":
    case "diningPendant":
      return (
        name.includes("pendul") ||
        name.includes("pendant") ||
        name.includes("suspend")
      );
    case "pouf":
      return (
        name.includes("pouf") ||
        name.includes("puf") ||
        name.includes("banchet") ||
        name.includes("ottoman")
      );
    case "wardrobe":
      return (
        name.includes("dulap") ||
        name.includes("sifonier") ||
        name.includes("șifonier") ||
        name.includes("wardrobe")
      );
    case "bedding":
      return (
        name.includes("cuvertur") ||
        name.includes("perni") ||
        name.includes("patur") ||
        name.includes("pătur") ||
        name.includes("throw")
      );
    case "desk":
      return (
        name.includes("birou") &&
        category !== "lighting" &&
        !name.includes("scaun") &&
        !name.includes("lamp")
      );
    case "officeChair":
      return (
        name.includes("scaun") &&
        (name.includes("ergonomic") ||
          name.includes("birou") ||
          name.includes("office"))
      );
    case "deskLamp":
      return (
        (category === "lighting" ||
          name.includes("lamp") ||
          name.includes("lampadar") ||
          name.includes("veioz")) &&
        !name.includes("pendul") &&
        !name.includes("pendant")
      );
    case "wallOrganizer":
      return name.includes("organizator");
    case "diningTable":
      return (
        (name.includes("dining") || name.includes("masă dining") || name.includes("masa dining")) &&
        !name.includes("scaun")
      );
    case "diningChair":
      return name.includes("scaun") && name.includes("dining");
    case "buffet":
      return (
        name.includes("bufet") ||
        name.includes("comodă dining") ||
        name.includes("comoda dining")
      );
    case "island":
      return name.includes("insul");
    case "barStool":
      return (
        name.includes("scaun") &&
        (name.includes("bar") || name.includes("insul"))
      ) || name.includes("scaun de bar") || name.includes("scaune de bar");
    default:
      return false;
  }
}
