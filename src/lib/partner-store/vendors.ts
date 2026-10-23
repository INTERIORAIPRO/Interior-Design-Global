export const MIX_VENDOR_ID = "mix" as const;

export type VendorGroup =
  | "furnitureLuxury"
  | "furnitureAccessible"
  | "outdoor"
  | "commercial"
  | "lighting"
  | "bath"
  | "finishes"
  | "materials";

type VendorSeed = {
  id: string;
  brandName: string;
  storeUrl: string;
  group: VendorGroup;
};

const VENDOR_SEEDS: VendorSeed[] = [
  { id: "minotti", brandName: "Minotti", storeUrl: "https://www.minotti.com", group: "furnitureLuxury" },
  { id: "eichholtz", brandName: "Eichholtz", storeUrl: "https://www.eichholtz.com", group: "furnitureLuxury" },
  { id: "richmond-interiors", brandName: "Richmond Interiors", storeUrl: "https://www.richmond-interiors.com", group: "furnitureLuxury" },
  { id: "cb2", brandName: "CB2", storeUrl: "https://www.cb2.com", group: "furnitureLuxury" },
  { id: "vical-home", brandName: "Vical Home", storeUrl: "https://www.vicalhome.com", group: "furnitureLuxury" },
  { id: "bb-italia", brandName: "B&B Italia", storeUrl: "https://www.bebitalia.com", group: "furnitureLuxury" },
  { id: "poliform", brandName: "Poliform", storeUrl: "https://www.poliform.it", group: "furnitureLuxury" },
  { id: "boconcept", brandName: "BoConcept", storeUrl: "https://www.boconcept.com", group: "furnitureLuxury" },
  { id: "restoration-hardware", brandName: "Restoration Hardware (RH)", storeUrl: "https://rh.com", group: "furnitureLuxury" },
  { id: "ethan-allen", brandName: "Ethan Allen", storeUrl: "https://www.ethanallen.com", group: "furnitureLuxury" },
  { id: "dwr", brandName: "Design Within Reach (DWR)", storeUrl: "https://www.dwr.com", group: "furnitureLuxury" },
  { id: "crate-and-barrel", brandName: "Crate & Barrel", storeUrl: "https://www.crateandbarrel.com", group: "furnitureLuxury" },
  { id: "west-elm", brandName: "West Elm", storeUrl: "https://www.westelm.com", group: "furnitureLuxury" },
  { id: "pottery-barn", brandName: "Pottery Barn", storeUrl: "https://www.potterybarn.com", group: "furnitureLuxury" },
  { id: "article", brandName: "Article", storeUrl: "https://www.article.com", group: "furnitureLuxury" },
  { id: "zuiver", brandName: "Zuiver", storeUrl: "https://www.zuiver.com", group: "furnitureAccessible" },
  { id: "woood", brandName: "WOOOD", storeUrl: "https://www.woood.nl", group: "furnitureAccessible" },
  { id: "kave-home", brandName: "Kave Home", storeUrl: "https://kavehome.com", group: "furnitureAccessible" },
  { id: "westwing", brandName: "Westwing", storeUrl: "https://www.westwing.com", group: "furnitureAccessible" },
  { id: "sklum", brandName: "Sklum", storeUrl: "https://www.sklum.com", group: "furnitureAccessible" },
  { id: "wayfair", brandName: "Wayfair", storeUrl: "https://www.wayfair.com", group: "furnitureAccessible" },
  { id: "ikea", brandName: "IKEA", storeUrl: "https://www.ikea.com", group: "furnitureAccessible" },
  { id: "maisons-du-monde", brandName: "Maisons du Monde", storeUrl: "https://www.maisonsdumonde.com", group: "furnitureAccessible" },
  { id: "beliani", brandName: "Beliani", storeUrl: "https://www.beliani.com", group: "furnitureAccessible" },
  { id: "vidaxl", brandName: "VidaXL", storeUrl: "https://www.vidaxl.com", group: "furnitureAccessible" },
  { id: "somproduct", brandName: "Somproduct", storeUrl: "https://www.somproduct.ro", group: "furnitureAccessible" },
  { id: "vivre", brandName: "Vivre", storeUrl: "https://www.vivre.ro", group: "furnitureAccessible" },
  { id: "jysk", brandName: "Jysk", storeUrl: "https://jysk.com", group: "furnitureAccessible" },
  { id: "castlery", brandName: "Castlery", storeUrl: "https://www.castlery.com", group: "furnitureAccessible" },
  { id: "freedom-furniture", brandName: "Freedom Furniture", storeUrl: "https://www.freedom.com.au", group: "furnitureAccessible" },
  { id: "home-centre", brandName: "Home Centre", storeUrl: "https://www.homecentre.com", group: "furnitureAccessible" },
  { id: "micadoni", brandName: "Micadoni Home", storeUrl: "https://micadoni.com", group: "furnitureAccessible" },
  { id: "kettal", brandName: "Kettal", storeUrl: "https://www.kettal.com", group: "outdoor" },
  { id: "roda", brandName: "Roda", storeUrl: "https://www.rodaonline.com", group: "outdoor" },
  { id: "tribu", brandName: "Tribu", storeUrl: "https://www.tribu.com", group: "outdoor" },
  { id: "dedon", brandName: "Dedon", storeUrl: "https://www.dedon.de", group: "outdoor" },
  { id: "emu", brandName: "Emu", storeUrl: "https://www.emu.it", group: "outdoor" },
  { id: "vondom", brandName: "Vondom", storeUrl: "https://www.vondom.com", group: "outdoor" },
  { id: "fermob", brandName: "Fermob", storeUrl: "https://www.fermob.com", group: "outdoor" },
  { id: "nardi", brandName: "Nardi", storeUrl: "https://www.nardioutdoor.com", group: "outdoor" },
  { id: "kave-home-outdoor", brandName: "Kave Home Outdoor", storeUrl: "https://kavehome.com", group: "outdoor" },
  { id: "sklum-outdoor", brandName: "Sklum Outdoor", storeUrl: "https://www.sklum.com", group: "outdoor" },
  { id: "wayfair-outdoor", brandName: "Wayfair Outdoor", storeUrl: "https://www.wayfair.com", group: "outdoor" },
  { id: "pedrali", brandName: "Pedrali", storeUrl: "https://www.pedrali.com", group: "commercial" },
  { id: "scab-design", brandName: "Scab Design", storeUrl: "https://www.scabdesign.com", group: "commercial" },
  { id: "gervasoni", brandName: "Gervasoni", storeUrl: "https://www.gervasoni1892.com", group: "commercial" },
  { id: "richmond-commercial", brandName: "Richmond Interiors Commercial", storeUrl: "https://www.richmond-interiors.com", group: "commercial" },
  { id: "vical-contract", brandName: "Vical Contract", storeUrl: "https://www.vicalhome.com", group: "commercial" },
  { id: "eichholtz-contract", brandName: "Eichholtz Contract", storeUrl: "https://www.eichholtz.com", group: "commercial" },
  { id: "maytoni", brandName: "Maytoni Lighting", storeUrl: "https://maytoni.com", group: "lighting" },
  { id: "flos", brandName: "Flos", storeUrl: "https://flos.com", group: "lighting" },
  { id: "artemide", brandName: "Artemide", storeUrl: "https://www.artemide.com", group: "lighting" },
  { id: "louis-poulsen", brandName: "Louis Poulsen", storeUrl: "https://www.louispoulsen.com", group: "lighting" },
  { id: "tom-dixon", brandName: "Tom Dixon", storeUrl: "https://www.tomdixon.net", group: "lighting" },
  { id: "lampenwelt", brandName: "Lampenwelt", storeUrl: "https://www.lampenwelt.com", group: "lighting" },
  { id: "kichler", brandName: "Kichler Lighting", storeUrl: "https://www.kichler.com", group: "lighting" },
  { id: "lucide", brandName: "Lucide", storeUrl: "https://www.lucide.com", group: "lighting" },
  { id: "eglo", brandName: "Eglo Lighting", storeUrl: "https://www.eglo.com", group: "lighting" },
  { id: "porcelanosa", brandName: "Porcelanosa", storeUrl: "https://www.porcelanosa.com", group: "bath" },
  { id: "villeroy-boch", brandName: "Villeroy & Boch", storeUrl: "https://www.villeroy-boch.com", group: "bath" },
  { id: "antonio-lupi", brandName: "Antonio Lupi", storeUrl: "https://www.antoniolupi.it", group: "bath" },
  { id: "duravit", brandName: "Duravit", storeUrl: "https://www.duravit.com", group: "bath" },
  { id: "kohler", brandName: "Kohler", storeUrl: "https://www.kohler.com", group: "bath" },
  { id: "grohe", brandName: "Grohe", storeUrl: "https://www.grohe.com", group: "bath" },
  { id: "hansgrohe", brandName: "Hansgrohe", storeUrl: "https://www.hansgrohe.com", group: "bath" },
  { id: "roca", brandName: "Roca", storeUrl: "https://www.roca.com", group: "bath" },
  { id: "cersanit", brandName: "Cersanit", storeUrl: "https://www.cersanit.com", group: "bath" },
  { id: "ideal-standard", brandName: "Ideal Standard", storeUrl: "https://www.idealstandard.com", group: "bath" },
  { id: "novacolor", brandName: "Novacolor", storeUrl: "https://www.novacolor.it", group: "finishes" },
  { id: "san-marco", brandName: "San Marco", storeUrl: "https://www.san-marco.com", group: "finishes" },
  { id: "farrow-ball", brandName: "Farrow & Ball", storeUrl: "https://www.farrow-ball.com", group: "finishes" },
  { id: "benjamin-moore", brandName: "Benjamin Moore", storeUrl: "https://www.benjaminmoore.com", group: "finishes" },
  { id: "graham-brown", brandName: "Graham & Brown", storeUrl: "https://www.grahambrown.com", group: "finishes" },
  { id: "rebel-walls", brandName: "Rebel Walls", storeUrl: "https://www.rebelwalls.com", group: "finishes" },
  { id: "wall-and-deco", brandName: "Wall&decò", storeUrl: "https://www.wallanddeco.com", group: "finishes" },
  { id: "egger", brandName: "Egger", storeUrl: "https://www.egger.com", group: "materials" },
  { id: "kronospan", brandName: "Kronospan", storeUrl: "https://www.kronospan.com", group: "materials" },
  { id: "cleaf", brandName: "Cleaf", storeUrl: "https://www.cleaf.it", group: "materials" },
  { id: "fenix", brandName: "Fenix NTM", storeUrl: "https://www.fenixforinteriors.com", group: "materials" },
  { id: "cosentino", brandName: "Cosentino", storeUrl: "https://www.cosentino.com", group: "materials" },
];

const GROUP_ACCENT: Record<VendorGroup, string> = {
  furnitureLuxury: "#c4a574",
  furnitureAccessible: "#8a9a84",
  outdoor: "#6b8f71",
  commercial: "#7a6a58",
  lighting: "#d9c48a",
  bath: "#8c7b6b",
  finishes: "#c45c26",
  materials: "#4b5563",
};

export type DedicatedVendorId = (typeof VENDOR_SEEDS)[number]["id"];
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

function badgeFromName(name: string) {
  const parts = name.replace(/&/g, " ").split(/\s+/).filter(Boolean);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
}

export const furnitureVendors: FurnitureVendor[] = VENDOR_SEEDS.map((seed) => ({
  id: seed.id,
  brandName: seed.brandName,
  shortName: seed.brandName.replace(" Lighting", "").replace(" Furniture", ""),
  badge: badgeFromName(seed.brandName),
  accent: GROUP_ACCENT[seed.group],
  status: "active",
  shippingLabel: "Global",
  zones: ["GLOBAL"],
  storeUrl: seed.storeUrl,
  group: seed.group,
}));

export const VENDOR_GROUP_LABELS: Record<VendorGroup, string> = {
  furnitureLuxury: "Mobilă Luxury & High-End",
  furnitureAccessible: "Mobilă Design & Accesibilă",
  outdoor: "Outdoor & Landscape",
  commercial: "Commercial & HoReCa",
  lighting: "Iluminat",
  bath: "Baie & Sanitare",
  finishes: "Vopsele Decorative & Finisaje",
  materials: "Plăci PAL/MDF & Materiale",
};

export const VENDOR_GROUP_ORDER: VendorGroup[] = [
  "furnitureLuxury",
  "furnitureAccessible",
  "outdoor",
  "commercial",
  "lighting",
  "bath",
  "finishes",
  "materials",
];

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

export function dedicatedBrandIds(ids?: string[] | null): DedicatedVendorId[] {
  return [...new Set((ids ?? []).filter((id): id is DedicatedVendorId => {
    if (!id || id === MIX_VENDOR_ID) return false;
    return furnitureVendors.some((vendor) => vendor.id === id);
  }))];
}

export function selectedBrandsLabel(
  ids: string[] | null | undefined,
  mixLabel = "Mix & Match",
) {
  const brands = dedicatedBrandIds(ids);
  if (!brands.length) return mixLabel;
  const names = brands
    .map((id) => getVendor(id)?.brandName)
    .filter((name): name is string => Boolean(name));
  if (names.length <= 2) return names.join(" + ");
  return `${names.slice(0, 2).join(", ")} +${names.length - 2}`;
}

export function vendorShipsTo(
  vendor: FurnitureVendor,
  country: ShippingCountry,
) {
  if (vendor.zones.includes("GLOBAL")) return true;
  if (vendor.zones.includes(country.zone)) return true;
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
