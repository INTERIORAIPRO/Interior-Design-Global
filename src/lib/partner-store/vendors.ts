export const MIX_VENDOR_ID = "mix" as const;

export type VendorGroup =
  | "furniture"
  | "bath"
  | "finishes"
  | "materials"
  | "lighting";

export type DedicatedVendorId =
  | "kave-home"
  | "micadoni"
  | "sklum"
  | "westwing"
  | "maisons-du-monde"
  | "ikea"
  | "wayfair"
  | "cb2"
  | "crate-and-barrel"
  | "castlery"
  | "beliani"
  | "boconcept"
  | "porcelanosa"
  | "villeroy-boch"
  | "duravit"
  | "kohler"
  | "grohe"
  | "novacolor"
  | "san-marco"
  | "farrow-ball"
  | "rebel-walls"
  | "benjamin-moore"
  | "egger"
  | "kronospan"
  | "cleaf"
  | "fenix"
  | "cosentino"
  | "flos"
  | "artemide"
  | "lampenwelt"
  | "tom-dixon";

export type VendorId = typeof MIX_VENDOR_ID | DedicatedVendorId;

export type ShippingCountryId =
  | "RO"
  | "FR"
  | "DE"
  | "ES"
  | "IT"
  | "NL"
  | "PT"
  | "UK"
  | "US"
  | "CA"
  | "AU"
  | "SG";

export type ShippingZone = "EU" | "UK" | "US" | "CA" | "AU" | "SG" | "GLOBAL";

export type FurnitureVendor = {
  id: DedicatedVendorId;
  brandName: string;
  shortName: string;
  badge: string;
  accent: string;
  status: "active" | "coming";
  shippingLabel: string;
  zones: ShippingZone[];
  storeUrl: string;
  group: VendorGroup;
};

export type ShippingCountry = {
  id: ShippingCountryId;
  flag: string;
  name: string;
  zone: Exclude<ShippingZone, "GLOBAL">;
};

export const shippingCountries: ShippingCountry[] = [
  { id: "RO", flag: "🇷🇴", name: "Romania", zone: "EU" },
  { id: "FR", flag: "🇫🇷", name: "France", zone: "EU" },
  { id: "DE", flag: "🇩🇪", name: "Germany", zone: "EU" },
  { id: "ES", flag: "🇪🇸", name: "Spain", zone: "EU" },
  { id: "IT", flag: "🇮🇹", name: "Italy", zone: "EU" },
  { id: "NL", flag: "🇳🇱", name: "Netherlands", zone: "EU" },
  { id: "PT", flag: "🇵🇹", name: "Portugal", zone: "EU" },
  { id: "UK", flag: "🇬🇧", name: "United Kingdom", zone: "UK" },
  { id: "US", flag: "🇺🇸", name: "United States", zone: "US" },
  { id: "CA", flag: "🇨🇦", name: "Canada", zone: "CA" },
  { id: "AU", flag: "🇦🇺", name: "Australia", zone: "AU" },
  { id: "SG", flag: "🇸🇬", name: "Singapore", zone: "SG" },
];

export const furnitureVendors: FurnitureVendor[] = [
  {
    id: "kave-home",
    brandName: "Kave Home",
    shortName: "Kave",
    badge: "KH",
    accent: "#c4a574",
    status: "active",
    shippingLabel: "Global / EU",
    zones: ["GLOBAL", "EU"],
    storeUrl: "https://kavehome.com",
    group: "furniture",
  },
  {
    id: "micadoni",
    brandName: "Micadoni Home",
    shortName: "Micadoni",
    badge: "MH",
    accent: "#8a9a84",
    status: "active",
    shippingLabel: "EU",
    zones: ["EU"],
    storeUrl: "https://micadoni.com",
    group: "furniture",
  },
  {
    id: "sklum",
    brandName: "Sklum",
    shortName: "Sklum",
    badge: "SK",
    accent: "#6b6b6b",
    status: "active",
    shippingLabel: "EU",
    zones: ["EU"],
    storeUrl: "https://www.sklum.com",
    group: "furniture",
  },
  {
    id: "westwing",
    brandName: "Westwing",
    shortName: "Westwing",
    badge: "WW",
    accent: "#d4a373",
    status: "active",
    shippingLabel: "EU",
    zones: ["EU"],
    storeUrl: "https://www.westwing.com",
    group: "furniture",
  },
  {
    id: "maisons-du-monde",
    brandName: "Maisons du Monde",
    shortName: "MdM",
    badge: "MD",
    accent: "#c47a5a",
    status: "active",
    shippingLabel: "EU",
    zones: ["EU"],
    storeUrl: "https://www.maisonsdumonde.com",
    group: "furniture",
  },
  {
    id: "ikea",
    brandName: "IKEA",
    shortName: "IKEA",
    badge: "IK",
    accent: "#0058a3",
    status: "active",
    shippingLabel: "Global",
    zones: ["GLOBAL"],
    storeUrl: "https://www.ikea.com",
    group: "furniture",
  },
  {
    id: "wayfair",
    brandName: "Wayfair",
    shortName: "Wayfair",
    badge: "WF",
    accent: "#7b2d8e",
    status: "active",
    shippingLabel: "US / UK / DE",
    zones: ["US", "UK"],
    storeUrl: "https://www.wayfair.com",
    group: "furniture",
  },
  {
    id: "cb2",
    brandName: "CB2 / Crate & Barrel",
    shortName: "CB2",
    badge: "CB",
    accent: "#1c1c1c",
    status: "active",
    shippingLabel: "US / CA",
    zones: ["US", "CA"],
    storeUrl: "https://www.cb2.com",
    group: "furniture",
  },
  {
    id: "castlery",
    brandName: "Castlery",
    shortName: "Castlery",
    badge: "CA",
    accent: "#3d5a4c",
    status: "active",
    shippingLabel: "US / AU / SG",
    zones: ["US", "AU", "SG"],
    storeUrl: "https://www.castlery.com",
    group: "furniture",
  },
  {
    id: "crate-and-barrel",
    brandName: "Crate & Barrel",
    shortName: "Crate",
    badge: "C&B",
    accent: "#2c2c2c",
    status: "active",
    shippingLabel: "US / CA",
    zones: ["US", "CA"],
    storeUrl: "https://www.crateandbarrel.com",
    group: "furniture",
  },
  {
    id: "beliani",
    brandName: "Beliani",
    shortName: "Beliani",
    badge: "BE",
    accent: "#b08d57",
    status: "active",
    shippingLabel: "EU",
    zones: ["EU"],
    storeUrl: "https://www.beliani.com",
    group: "furniture",
  },
  {
    id: "boconcept",
    brandName: "BoConcept",
    shortName: "BoConcept",
    badge: "BC",
    accent: "#4a4a4a",
    status: "active",
    shippingLabel: "Global",
    zones: ["GLOBAL"],
    storeUrl: "https://www.boconcept.com",
    group: "furniture",
  },
  {
    id: "porcelanosa",
    brandName: "Porcelanosa",
    shortName: "Porcelanosa",
    badge: "PO",
    accent: "#8c7b6b",
    status: "active",
    shippingLabel: "Global",
    zones: ["GLOBAL"],
    storeUrl: "https://www.porcelanosa.com",
    group: "bath",
  },
  {
    id: "villeroy-boch",
    brandName: "Villeroy & Boch",
    shortName: "Villeroy",
    badge: "VB",
    accent: "#1f4e79",
    status: "active",
    shippingLabel: "Global",
    zones: ["GLOBAL"],
    storeUrl: "https://www.villeroy-boch.com",
    group: "bath",
  },
  {
    id: "duravit",
    brandName: "Duravit",
    shortName: "Duravit",
    badge: "DU",
    accent: "#2e2e2e",
    status: "active",
    shippingLabel: "Global",
    zones: ["GLOBAL"],
    storeUrl: "https://www.duravit.com",
    group: "bath",
  },
  {
    id: "kohler",
    brandName: "Kohler",
    shortName: "Kohler",
    badge: "KO",
    accent: "#7a1f1f",
    status: "active",
    shippingLabel: "Global",
    zones: ["GLOBAL"],
    storeUrl: "https://www.kohler.com",
    group: "bath",
  },
  {
    id: "grohe",
    brandName: "Grohe",
    shortName: "Grohe",
    badge: "GR",
    accent: "#c41230",
    status: "active",
    shippingLabel: "Global",
    zones: ["GLOBAL"],
    storeUrl: "https://www.grohe.com",
    group: "bath",
  },
  {
    id: "novacolor",
    brandName: "Novacolor",
    shortName: "Novacolor",
    badge: "NC",
    accent: "#c45c26",
    status: "active",
    shippingLabel: "EU",
    zones: ["EU", "GLOBAL"],
    storeUrl: "https://www.novacolor.it",
    group: "finishes",
  },
  {
    id: "san-marco",
    brandName: "San Marco",
    shortName: "San Marco",
    badge: "SM",
    accent: "#d4a017",
    status: "active",
    shippingLabel: "EU",
    zones: ["EU"],
    storeUrl: "https://www.san-marco.com",
    group: "finishes",
  },
  {
    id: "farrow-ball",
    brandName: "Farrow & Ball",
    shortName: "Farrow",
    badge: "FB",
    accent: "#5b4636",
    status: "active",
    shippingLabel: "Global",
    zones: ["GLOBAL"],
    storeUrl: "https://www.farrow-ball.com",
    group: "finishes",
  },
  {
    id: "rebel-walls",
    brandName: "Rebel Walls",
    shortName: "Rebel",
    badge: "RW",
    accent: "#6b3fa0",
    status: "active",
    shippingLabel: "Global",
    zones: ["GLOBAL"],
    storeUrl: "https://www.rebelwalls.com",
    group: "finishes",
  },
  {
    id: "benjamin-moore",
    brandName: "Benjamin Moore",
    shortName: "Benjamin",
    badge: "BM",
    accent: "#0033a0",
    status: "active",
    shippingLabel: "US / CA",
    zones: ["US", "CA", "GLOBAL"],
    storeUrl: "https://www.benjaminmoore.com",
    group: "finishes",
  },
  {
    id: "egger",
    brandName: "Egger",
    shortName: "Egger",
    badge: "EG",
    accent: "#e87722",
    status: "active",
    shippingLabel: "Global",
    zones: ["GLOBAL"],
    storeUrl: "https://www.egger.com",
    group: "materials",
  },
  {
    id: "kronospan",
    brandName: "Kronospan",
    shortName: "Kronospan",
    badge: "KR",
    accent: "#0b6e4f",
    status: "active",
    shippingLabel: "Global",
    zones: ["GLOBAL"],
    storeUrl: "https://www.kronospan.com",
    group: "materials",
  },
  {
    id: "cleaf",
    brandName: "Cleaf",
    shortName: "Cleaf",
    badge: "CL",
    accent: "#8d6e4c",
    status: "active",
    shippingLabel: "EU",
    zones: ["EU"],
    storeUrl: "https://www.cleaf.it",
    group: "materials",
  },
  {
    id: "fenix",
    brandName: "Fenix",
    shortName: "Fenix",
    badge: "FX",
    accent: "#111111",
    status: "active",
    shippingLabel: "Global",
    zones: ["GLOBAL"],
    storeUrl: "https://www.fenixforinteriors.com",
    group: "materials",
  },
  {
    id: "cosentino",
    brandName: "Cosentino",
    shortName: "Cosentino",
    badge: "CO",
    accent: "#4b5563",
    status: "active",
    shippingLabel: "Global",
    zones: ["GLOBAL"],
    storeUrl: "https://www.cosentino.com",
    group: "materials",
  },
  {
    id: "flos",
    brandName: "Flos",
    shortName: "Flos",
    badge: "FL",
    accent: "#f2f2f2",
    status: "active",
    shippingLabel: "Global",
    zones: ["GLOBAL"],
    storeUrl: "https://flos.com",
    group: "lighting",
  },
  {
    id: "artemide",
    brandName: "Artemide",
    shortName: "Artemide",
    badge: "AR",
    accent: "#c8102e",
    status: "active",
    shippingLabel: "Global",
    zones: ["GLOBAL"],
    storeUrl: "https://www.artemide.com",
    group: "lighting",
  },
  {
    id: "lampenwelt",
    brandName: "Lampenwelt",
    shortName: "Lampenwelt",
    badge: "LW",
    accent: "#ffcd00",
    status: "active",
    shippingLabel: "EU",
    zones: ["EU"],
    storeUrl: "https://www.lampenwelt.com",
    group: "lighting",
  },
  {
    id: "tom-dixon",
    brandName: "Tom Dixon",
    shortName: "Tom Dixon",
    badge: "TD",
    accent: "#c5a572",
    status: "active",
    shippingLabel: "Global",
    zones: ["GLOBAL"],
    storeUrl: "https://www.tomdixon.net",
    group: "lighting",
  },
];

export const VENDOR_GROUP_LABELS: Record<VendorGroup, string> = {
  furniture: "Mobilă",
  bath: "Baie & Sanitare",
  finishes: "Finisaje & Vopsele",
  materials: "Plăci & Materiale",
  lighting: "Iluminat",
};

export const DEFAULT_SHIPPING_COUNTRY: ShippingCountryId = "RO";
export const DEFAULT_VENDOR_ID: VendorId = MIX_VENDOR_ID;

export function getShippingCountry(id: string | null | undefined) {
  return (
    shippingCountries.find((country) => country.id === id) ??
    shippingCountries[0]
  );
}

export function getVendor(id: string | null | undefined) {
  return furnitureVendors.find((vendor) => vendor.id === id);
}

export function getActiveVendorName(
  vendorId: VendorId,
  mixLabel = "Mix & Match",
) {
  if (vendorId === MIX_VENDOR_ID) return mixLabel;
  return getVendor(vendorId)?.brandName ?? mixLabel;
}

export function vendorShipsTo(
  vendor: FurnitureVendor,
  country: ShippingCountry,
) {
  if (vendor.zones.includes("GLOBAL")) return true;
  if (vendor.zones.includes(country.zone)) return true;
  if (vendor.id === "wayfair" && country.id === "DE") return true;
  return false;
}

export function vendorsForCountry(countryId: ShippingCountryId) {
  const country = getShippingCountry(countryId);
  return furnitureVendors.filter((vendor) => vendorShipsTo(vendor, country));
}

export function isVendorId(value: string | null | undefined): value is VendorId {
  if (!value) return false;
  if (value === MIX_VENDOR_ID) return true;
  return furnitureVendors.some((vendor) => vendor.id === value);
}
