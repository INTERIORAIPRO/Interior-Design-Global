import type {
  InteriorStyle,
  PartnerProduct as TypedPartnerProduct,
  PartnerStore,
  ProductCategory,
} from "./types";

export type RoomKind = "living" | "bedroom" | "office" | "kitchen";

export type PartnerProduct = TypedPartnerProduct & {
  rooms: RoomKind[];
  style: string[];
  promptHint: string;
};

export type { TypedPartnerProduct };

export const primaryPartnerStore: PartnerStore = {
  id: "vnd_the_home",
  brandName: "The Home",
  country: "RO",
  status: "active",
  commissionPercent: 12,
  storeUrl: "https://www.thehome.ro",
  affiliateBaseUrl: "https://www.thehome.ro",
};

const AFFILIATE_REF = "interior-design-global";

function product(input: {
  id: string;
  sku: string;
  name: string;
  description: string;
  category: ProductCategory;
  image2d: string;
  accentColor: string;
  styles: InteriorStyle[];
  rooms: RoomKind[];
  promptHint: string;
  price: number;
  affiliateUrl: string;
  dimensions?: TypedPartnerProduct["dimensions"];
}): PartnerProduct {
  return {
    currency: "RON",
    dimensions: input.dimensions ?? { widthCm: 80, depthCm: 80, heightCm: 80 },
    ...input,
    style: input.styles,
  };
}

export const partnerProducts: PartnerProduct[] = [
  product({
    id: "th-sofa-nordic-1",
    sku: "TH-SOFA-NORDIC",
    name: "Canapea Nordic linen",
    description: "Canapea 3 locuri tapițată, picioare stejar, linie scandinavă.",
    category: "sofas",
    image2d: "/partner-store/sofa.svg",
    accentColor: "#e8dfd2",
    styles: ["scandinavian", "japandi", "minimalist", "modern", "contemporary"],
    rooms: ["living"],
    promptHint:
      "a light oatmeal linen 3-seat sofa with slender oak legs, Scandinavian, clearly visible in the living room",
    price: 3499,
    affiliateUrl: "https://www.thehome.ro/canapele",
    dimensions: { widthCm: 210, depthCm: 90, heightCm: 85 },
  }),
  product({
    id: "th-table-coffee-oak",
    sku: "TH-TABLE-OAK",
    name: "Măsuță cafea stejar",
    description: "Măsuță joasă din stejar deschis, blat rotund.",
    category: "tables",
    image2d: "/partner-store/table.svg",
    accentColor: "#d4a373",
    styles: ["scandinavian", "japandi", "midcentury", "boho"],
    rooms: ["living"],
    promptHint: "a round pale-oak coffee table in front of the sofa",
    price: 899,
    affiliateUrl: "https://www.thehome.ro/mese",
    dimensions: { widthCm: 90, depthCm: 90, heightCm: 42 },
  }),
  product({
    id: "th-lamp-brass-arc",
    sku: "TH-LAMP-ARC",
    name: "Lampadar arc alămuit",
    description: "Lampadar cu arc din alamă mată și abajur textil.",
    category: "lighting",
    image2d: "/partner-store/lamp.svg",
    accentColor: "#c4a574",
    styles: ["midcentury", "scandinavian", "modern"],
    rooms: ["living", "office", "bedroom"],
    promptHint: "a brass arc floor lamp with a warm linen shade",
    price: 1299,
    affiliateUrl: "https://www.thehome.ro/corpuri-de-iluminat",
    dimensions: { widthCm: 40, depthCm: 120, heightCm: 175 },
  }),
  product({
    id: "th-rug-wool-beige",
    sku: "TH-RUG-WOOL",
    name: "Covor pufos din lână naturală",
    description: "Covor din lână, nuanță nisip, tesătură densă.",
    category: "rugs",
    image2d: "/partner-store/rug.svg",
    accentColor: "#f4f1de",
    styles: ["scandinavian", "japandi", "minimalist", "boho"],
    rooms: ["living", "bedroom", "office"],
    promptHint: "a plush beige wool rug covering the floor under the furniture",
    price: 1599,
    affiliateUrl: "https://www.thehome.ro/covoare",
    dimensions: { widthCm: 200, depthCm: 300, heightCm: 2 },
  }),
  product({
    id: "th-throw-boho",
    sku: "TH-THROW-BOHO",
    name: "Pătură textilă boho",
    description: "Pătură țesută, franjuri, tonuri teracotă.",
    category: "decor",
    image2d: "/partner-store/vase.svg",
    accentColor: "#c47a5a",
    styles: ["boho"],
    rooms: ["living", "bedroom", "kitchen"],
    promptHint: "a terracotta woven throw with fringe draped on furniture",
    price: 249,
    affiliateUrl: "https://www.thehome.ro/decoratiuni",
    dimensions: { widthCm: 130, depthCm: 20, heightCm: 8 },
  }),
  product({
    id: "th-bed-nordic",
    sku: "TH-BED-NORDIC",
    name: "Pat tapițat Nordic",
    description: "Pat cu tăblie tapițată, picioare stejar, saltea vizibilă.",
    category: "beds",
    image2d: "/partner-store/bed.svg",
    accentColor: "#e8dfd2",
    styles: ["scandinavian", "japandi", "minimalist", "modern", "contemporary", "industrial", "midcentury", "boho"],
    rooms: ["bedroom"],
    promptHint:
      "an upholstered oatmeal Nordic bed as the main bedroom piece, oak legs, neatly made linen bedding",
    price: 4299,
    affiliateUrl: "https://www.thehome.ro/paturi",
    dimensions: { widthCm: 180, depthCm: 200, heightCm: 110 },
  }),
  product({
    id: "th-nightstand-oak",
    sku: "TH-NS-OAK",
    name: "Noptieră stejar deschis",
    description: "Noptieră compactă din stejar, un sertar.",
    category: "tables",
    image2d: "/partner-store/nightstand.svg",
    accentColor: "#d4a373",
    styles: ["scandinavian", "japandi", "minimalist", "midcentury", "boho"],
    rooms: ["bedroom"],
    promptHint: "a pale oak bedside nightstand with one drawer beside the bed",
    price: 799,
    affiliateUrl: "https://www.thehome.ro/noptiere",
    dimensions: { widthCm: 45, depthCm: 40, heightCm: 55 },
  }),
  product({
    id: "th-armchair-nordic",
    sku: "TH-CHAIR-NORDIC",
    name: "Fotoliu lounge Nordic",
    description: "Fotoliu lounge, tapițerie textilă, picioare lemn.",
    category: "armchair",
    image2d: "/partner-store/armchair.svg",
    accentColor: "#8a9a84",
    styles: ["scandinavian", "modern", "contemporary", "midcentury"],
    rooms: ["living", "bedroom"],
    promptHint: "a Nordic lounge armchair in oatmeal fabric with oak legs",
    price: 1899,
    affiliateUrl: "https://www.thehome.ro/fotolii",
    dimensions: { widthCm: 80, depthCm: 85, heightCm: 90 },
  }),
  product({
    id: "th-dining-oak",
    sku: "TH-DINING-OAK",
    name: "Masă dining stejar",
    description: "Masă de dining dreptunghiulară, blat stejar masiv.",
    category: "tables",
    image2d: "/partner-store/table.svg",
    accentColor: "#cbb79a",
    styles: ["scandinavian", "japandi", "boho"],
    rooms: ["kitchen"],
    promptHint: "a rectangular pale-oak dining table in the kitchen dining area",
    price: 2499,
    affiliateUrl: "https://www.thehome.ro/mese-dining",
    dimensions: { widthCm: 180, depthCm: 90, heightCm: 75 },
  }),
  product({
    id: "th-nightstand-metal",
    sku: "TH-NS-METAL",
    name: "Noptieră metal grafit",
    description: "Noptieră cu cadru metalic și blat lemn.",
    category: "tables",
    image2d: "/partner-store/nightstand.svg",
    accentColor: "#6b6b6b",
    styles: ["modern", "contemporary", "industrial"],
    rooms: ["bedroom"],
    promptHint: "a graphite metal bedside table with a thin wood top",
    price: 649,
    affiliateUrl: "https://www.thehome.ro/noptiere",
    dimensions: { widthCm: 42, depthCm: 38, heightCm: 52 },
  }),
  product({
    id: "th-desk-oak",
    sku: "TH-DESK-OAK",
    name: "Birou stejar",
    description: "Birou de lucru din stejar, linie simplă.",
    category: "tables",
    image2d: "/partner-store/table.svg",
    accentColor: "#cbb79a",
    styles: ["scandinavian", "minimalist", "modern", "industrial"],
    rooms: ["office"],
    promptHint: "a pale oak writing desk as the main home-office piece",
    price: 1899,
    affiliateUrl: "https://www.thehome.ro/birouri",
    dimensions: { widthCm: 140, depthCm: 70, heightCm: 75 },
  }),
  product({
    id: "th-decor-vase-ceramic",
    sku: "TH-VASE",
    name: "Vază ceramică mată",
    description: "Vază stoneware, glazură mată, formă organică.",
    category: "decor",
    image2d: "/partner-store/vase.svg",
    accentColor: "#d9cfc3",
    styles: ["scandinavian", "japandi", "boho"],
    rooms: ["living", "bedroom", "office", "kitchen"],
    promptHint: "a matte ceramic vase with a simple organic silhouette",
    price: 349,
    affiliateUrl: "https://www.thehome.ro/decoratiuni",
    dimensions: { widthCm: 18, depthCm: 18, heightCm: 32 },
  }),
  product({
    id: "th-lamp-minimal",
    sku: "TH-LAMP-MIN",
    name: "Lampadar minimalist",
    description: "Lampadar subțire, negru mat, abajur discret.",
    category: "lighting",
    image2d: "/partner-store/lamp.svg",
    accentColor: "#3a3a3a",
    styles: ["minimalist", "modern", "contemporary", "industrial"],
    rooms: ["living", "bedroom", "office"],
    promptHint: "a slim matte-black minimalist floor lamp",
    price: 699,
    affiliateUrl: "https://www.thehome.ro/corpuri-de-iluminat",
    dimensions: { widthCm: 28, depthCm: 28, heightCm: 155 },
  }),
  product({
    id: "th-bedside-lamps",
    sku: "TH-LAMPS-SET",
    name: "Veioze ceramice scandinave",
    description: "Pereche de veioze ceramice, abajur textil, pentru noptiere.",
    category: "lighting",
    image2d: "/partner-store/lamp.svg",
    accentColor: "#f0ebe3",
    styles: ["scandinavian", "japandi"],
    rooms: ["bedroom"],
    promptHint: "a pair of ceramic Scandinavian bedside table lamps on the nightstands",
    price: 459,
    affiliateUrl: "https://www.thehome.ro/corpuri-de-iluminat",
    dimensions: { widthCm: 22, depthCm: 22, heightCm: 38 },
  }),
];

export function getPartnerProducts() {
  return partnerProducts;
}

export function getPartnerProduct(id: string) {
  return partnerProducts.find((item) => item.id === id);
}

export function withAffiliateParams(
  url: string,
  campaignOrParams?: string | Record<string, string>,
) {
  try {
    const parsed = new URL(url);
    parsed.searchParams.set("ref", AFFILIATE_REF);
    if (typeof campaignOrParams === "string" && campaignOrParams) {
      parsed.searchParams.set("utm_campaign", campaignOrParams);
    } else if (campaignOrParams && typeof campaignOrParams === "object") {
      for (const [key, value] of Object.entries(campaignOrParams)) {
        parsed.searchParams.set(key, value);
      }
    }
    return parsed.toString();
  } catch {
    return url;
  }
}

export function formatProductDimensions(product: {
  dimensions?: { widthCm?: number; depthCm?: number; heightCm?: number };
}) {
  const dimensions = product.dimensions;
  if (!dimensions?.widthCm || !dimensions.depthCm || !dimensions.heightCm) {
    return "";
  }
  return `${dimensions.widthCm} × ${dimensions.depthCm} × ${dimensions.heightCm} cm`;
}

export function formatProductPrice(
  product: { price: number; currency?: string },
  locale = "ro-RO",
) {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: product.currency || "RON",
    maximumFractionDigits: 0,
  }).format(product.price);
}
