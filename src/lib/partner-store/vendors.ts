export const MIX_VENDOR_ID = "mix" as const;

export type DedicatedVendorId =
  | "kave-home"
  | "micadoni"
  | "sklum"
  | "westwing"
  | "maisons-du-monde"
  | "ikea"
  | "wayfair"
  | "cb2"
  | "castlery";

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
  },
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
