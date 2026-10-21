import type { RoomKind } from "@/lib/partner-store/catalog";

export type PieceSlotId =
  | "sofa"
  | "table"
  | "tv"
  | "lamp"
  | "rug"
  | "bed"
  | "nightstand"
  | "pendant"
  | "pouf";

export type PieceOption = {
  id: PieceSlotId;
  label: string;
  defaultOn: boolean;
};

export const livingPieceOptions: PieceOption[] = [
  { id: "sofa", label: "Canapea", defaultOn: true },
  { id: "table", label: "Măsuță de cafea", defaultOn: true },
  { id: "tv", label: "TV Unit", defaultOn: false },
  { id: "lamp", label: "Lampadar", defaultOn: true },
  { id: "rug", label: "Covor", defaultOn: true },
];

export const bedroomPieceOptions: PieceOption[] = [
  { id: "bed", label: "Pat", defaultOn: true },
  { id: "nightstand", label: "Noptieră", defaultOn: true },
  { id: "pendant", label: "Lampă / Pendul", defaultOn: true },
  { id: "pouf", label: "Banchetă / Pouf", defaultOn: true },
];

export function pieceOptionsForRoom(roomType: RoomKind): PieceOption[] {
  if (roomType === "living") return livingPieceOptions;
  if (roomType === "bedroom") return bedroomPieceOptions;
  return [];
}

export function defaultSelectedSlots(roomType: RoomKind): PieceSlotId[] {
  return pieceOptionsForRoom(roomType)
    .filter((option) => option.defaultOn)
    .map((option) => option.id);
}

export function studioImageForSlot(slot: PieceSlotId) {
  const file =
    slot === "pendant"
      ? "pendant"
      : slot === "pouf"
        ? "pouf"
        : slot === "nightstand"
          ? "nightstand"
          : slot === "tv"
            ? "tv"
            : slot;
  return `/products/studio/${file}.jpg`;
}
