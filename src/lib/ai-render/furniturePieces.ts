import type { PartnerProduct } from "@/lib/partner-store/catalog";

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
  | "barStool";

export type PieceOption = {
  id: PieceSlotId;
  label: string;
  category: string;
  defaultOn: boolean;
};

export const GLOBAL_CHECKLIST: PieceOption[] = [
  { id: "bed", label: "Pat", category: "beds", defaultOn: true },
  { id: "nightstand", label: "Noptieră", category: "tables", defaultOn: true },
  { id: "desk", label: "Birou", category: "tables", defaultOn: false },
  { id: "officeChair", label: "Scaun birou", category: "armchair", defaultOn: false },
  { id: "tv", label: "Comodă TV", category: "sideboard", defaultOn: false },
  { id: "sofa", label: "Canapea", category: "sofas", defaultOn: false },
  { id: "table", label: "Măsuță de cafea", category: "tables", defaultOn: false },
  { id: "diningTable", label: "Masă Dining", category: "tables", defaultOn: false },
  { id: "diningChair", label: "Scaune Dining", category: "armchair", defaultOn: false },
  { id: "pendant", label: "Corp iluminat", category: "lighting", defaultOn: true },
  { id: "rug", label: "Covor", category: "rugs", defaultOn: false },
  { id: "pouf", label: "Cuvertură / Pouf", category: "decor", defaultOn: false },
  { id: "artwork", label: "Tablou / Vază", category: "decor", defaultOn: false },
];

export function pieceOptionsForRoom(_roomType?: string | null): PieceOption[] {
  return GLOBAL_CHECKLIST;
}

export function defaultSelectedSlots(_roomType?: string | null): PieceSlotId[] {
  return GLOBAL_CHECKLIST.filter((option) => option.defaultOn).map(
    (option) => option.id,
  );
}

export function slotsForSelectedRoom(
  _roomType?: string | null,
  selectedSlots?: string[] | null,
): PieceSlotId[] {
  const allowed = new Set(GLOBAL_CHECKLIST.map((option) => option.id));
  const filtered = (selectedSlots ?? []).filter((slot): slot is PieceSlotId =>
    allowed.has(slot as PieceSlotId),
  );
  return filtered.length > 0 ? filtered : defaultSelectedSlots();
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
  const option = pieceOptionById(slot);
  if (product.slot === slot) return true;
  if (option && product.category === option.category && product.slot === slot) {
    return true;
  }
  const name = nameOf(product);
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
    case "deskLamp":
    case "pendant":
    case "diningPendant":
      return (
        category === "lighting" ||
        name.includes("lamp") ||
        name.includes("lampadar") ||
        name.includes("veioz") ||
        name.includes("pendul") ||
        name.includes("iluminat")
      );
    case "rug":
    case "officeRug":
      return category === "rugs" || name.includes("covor");
    case "armchair":
      return (
        (category === "armchair" || name.includes("fotoliu")) &&
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
    case "pouf":
    case "bedding":
      return (
        name.includes("pouf") ||
        name.includes("puf") ||
        name.includes("banchet") ||
        name.includes("cuvertur") ||
        name.includes("throw") ||
        name.includes("ottoman")
      );
    case "wardrobe":
      return (
        name.includes("dulap") ||
        name.includes("sifonier") ||
        name.includes("șifonier") ||
        name.includes("wardrobe")
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
    case "wallOrganizer":
      return name.includes("organizator");
    case "diningTable":
      return name.includes("dining") && !name.includes("scaun");
    case "diningChair":
      return name.includes("scaun") && name.includes("dining");
    case "buffet":
      return name.includes("bufet");
    case "island":
      return name.includes("insul");
    case "barStool":
      return name.includes("bar") && name.includes("scaun");
    case "artwork":
      return (
        category === "decor" ||
        name.includes("vaz") ||
        name.includes("vasă") ||
        name.includes("vase") ||
        name.includes("tablou")
      );
    default:
      return option ? category === option.category : false;
  }
}
