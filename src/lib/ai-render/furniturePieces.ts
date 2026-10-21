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
  | "island";

export type PieceOption = {
  id: PieceSlotId;
  label: string;
  defaultOn: boolean;
};

export const livingPieceOptions: PieceOption[] = [
  { id: "sofa", label: "Canapea", defaultOn: true },
  { id: "table", label: "Măsuță de cafea", defaultOn: true },
  { id: "tv", label: "Comodă TV / Unit", defaultOn: false },
  { id: "lamp", label: "Lampadar / Veioză", defaultOn: true },
  { id: "rug", label: "Covor", defaultOn: true },
  { id: "armchair", label: "Fotoliu", defaultOn: false },
  { id: "shelf", label: "Etajeră / Bibliotecă", defaultOn: false },
];

export const bedroomPieceOptions: PieceOption[] = [
  { id: "bed", label: "Pat", defaultOn: true },
  { id: "nightstand", label: "Noptieră", defaultOn: true },
  { id: "pendant", label: "Corp Iluminat / Pendul", defaultOn: true },
  { id: "pouf", label: "Banchetă / Pouf", defaultOn: true },
  { id: "wardrobe", label: "Dulap / Șifonier", defaultOn: false },
  { id: "bedding", label: "Cuvertură / Pernițe dekor", defaultOn: false },
];

export const officePieceOptions: PieceOption[] = [
  { id: "desk", label: "Birou", defaultOn: true },
  { id: "officeChair", label: "Scaun ergonomic / Birou", defaultOn: true },
  { id: "deskLamp", label: "Lampă de birou", defaultOn: true },
  { id: "officeShelf", label: "Rafturi / Etajeră", defaultOn: true },
  { id: "officeRug", label: "Covor birou", defaultOn: false },
  { id: "wallOrganizer", label: "Organizator perete", defaultOn: false },
];

export const kitchenPieceOptions: PieceOption[] = [
  { id: "diningTable", label: "Masă Dining", defaultOn: true },
  { id: "diningChair", label: "Scaune Dining", defaultOn: true },
  { id: "diningPendant", label: "Corp iluminat suspendat (Pendul)", defaultOn: true },
  { id: "buffet", label: "Comodă / Bufet Dining", defaultOn: false },
  { id: "island", label: "Insulă bucătărie / Scaune bar", defaultOn: false },
];

export function pieceOptionsForRoom(roomType: RoomKind): PieceOption[] {
  if (roomType === "living") return livingPieceOptions;
  if (roomType === "bedroom") return bedroomPieceOptions;
  if (roomType === "office") return officePieceOptions;
  if (roomType === "kitchen") return kitchenPieceOptions;
  return [];
}

export function defaultSelectedSlots(roomType: RoomKind): PieceSlotId[] {
  return pieceOptionsForRoom(roomType)
    .filter((option) => option.defaultOn)
    .map((option) => option.id);
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
        !name.includes("birou")
      );
    case "rug":
    case "officeRug":
      return category === "rugs" || name.includes("covor");
    case "armchair":
      return (
        (category === "armchair" || name.includes("fotoliu")) &&
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
        name.includes("taburet") ||
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
        (category === "lighting" || name.includes("lamp")) &&
        (name.includes("birou") || name.includes("desk"))
      );
    case "wallOrganizer":
      return name.includes("organizator");
    case "diningTable":
      return name.includes("dining") && !name.includes("scaun");
    case "diningChair":
      return name.includes("scaun") && name.includes("dining");
    case "buffet":
      return name.includes("bufet") || name.includes("comodă dining") || name.includes("comoda dining");
    case "island":
      return name.includes("insul") || (name.includes("bar") && name.includes("scaun"));
    default:
      return false;
  }
}
