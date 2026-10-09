export type RoomKind = "living" | "bedroom" | "office" | "kitchen";

export interface PartnerProduct {
  id: string;
  name: string;
  price: number;
  currency: string;
  category: "sofas" | "lighting" | "decor" | "tables" | "rugs" | "beds";
  rooms: RoomKind[];
  style: string[];
  image2d: string;
  accentColor: string;
  affiliateUrl: string;
  promptHint: string;
}

export const primaryPartnerStore = {
  brandName: "The Home",
  domain: "thehome.ro",
};

export function getPartnerProduct(id: string): PartnerProduct | undefined {
  return partnerProducts.find((p) => p.id === id);
}

export function formatProductDimensions(product?: {
  dimensions?: { width?: number; height?: number; depth?: number };
}) {
  const dimensions = product?.dimensions;
  if (!dimensions) return "";
  const { width, height, depth } = dimensions;
  const parts = [];
  if (width) parts.push(`L: ${width}cm`);
  if (height) parts.push(`H: ${height}cm`);
  if (depth) parts.push(`A: ${depth}cm`);
  return parts.join(" x ");
}

export function withAffiliateParams(url: string, campaign = "room-studio") {
  if (!url || typeof url !== "string") return "#";
  try {
    const parsed = new URL(url);
    parsed.searchParams.set("ref", "idg");
    parsed.searchParams.set("utm_source", "interior-design-global");
    parsed.searchParams.set("utm_medium", "affiliate");
    parsed.searchParams.set("utm_campaign", campaign);
    return parsed.toString();
  } catch {
    return url;
  }
}

export function formatProductPrice(
  product: { price: number; currency: string },
  locale = "ro",
) {
  try {
    return new Intl.NumberFormat(locale === "ro" ? "ro-RO" : "en-US", {
      style: "currency",
      currency: product.currency || "RON",
      maximumFractionDigits: 0,
    }).format(product.price);
  } catch {
    return `${product.price} ${product.currency || "RON"}`;
  }
}

export const partnerProducts: PartnerProduct[] = [
  {
    id: "th-sofa-nordic-1",
    name: "Canapea 3 locuri Nordic Velvet",
    price: 3499,
    currency: "RON",
    category: "sofas",
    rooms: ["living"],
    style: ["scandinavian", "modern", "contemporary"],
    image2d:
      "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=600&q=80",
    accentColor: "#d4af37",
    affiliateUrl: "https://www.thehome.ro/canapele",
    promptHint:
      "wide three-seat low Scandinavian sofa in oatmeal-sand velvet, deep seat cushions, slim rectangular back, short tapered pale-oak legs, no tufting",
  },
  {
    id: "th-lamp-brass-arc",
    name: "Lampadar arcuit din alamă",
    price: 899,
    currency: "RON",
    category: "lighting",
    rooms: ["living", "bedroom", "office"],
    style: ["modern", "midcentury", "scandinavian"],
    image2d:
      "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=600&q=80",
    accentColor: "#e5c158",
    affiliateUrl: "https://www.thehome.ro/lampadare",
    promptHint:
      "tall arched floor lamp, slender brushed-brass stem curving over seating, round warm-linen drum shade, circular pale-oak base, warm 2700K glow",
  },
  {
    id: "th-table-coffee-oak",
    name: "Măsuță de cafea din lemn masiv",
    price: 1299,
    currency: "RON",
    category: "tables",
    rooms: ["living"],
    style: ["scandinavian", "japandi", "boho"],
    image2d:
      "https://images.unsplash.com/photo-1533779283484-8ad4940aa78f?auto=format&fit=crop&w=600&q=80",
    accentColor: "#c8ad83",
    affiliateUrl: "https://www.thehome.ro/mese",
    promptHint:
      "low rectangular solid pale-oak coffee table, thick top with straight wood grain, simple Nordic legs, placed in front of the sofa",
  },
  {
    id: "th-rug-wool-beige",
    name: "Covor pufos din lână naturală",
    price: 1599,
    currency: "RON",
    category: "rugs",
    rooms: ["living", "bedroom", "office"],
    style: ["scandinavian", "minimalist", "japandi"],
    image2d:
      "https://images.unsplash.com/photo-1600121848594-d8644e57abab?auto=format&fit=crop&w=600&q=80",
    accentColor: "#e8e1d7",
    affiliateUrl: "https://www.thehome.ro",
    promptHint:
      "large plush high-pile natural-wool area rug in warm beige-sand under the main furniture",
  },
  {
    id: "th-decor-vase-ceramic",
    name: "Vază ceramică design organic",
    price: 249,
    currency: "RON",
    category: "decor",
    rooms: ["living", "bedroom", "office", "kitchen"],
    style: ["japandi", "minimalist", "boho", "scandinavian"],
    image2d:
      "https://images.unsplash.com/photo-1581783342308-f792dbdd27c5?auto=format&fit=crop&w=600&q=80",
    accentColor: "#d9d2cb",
    affiliateUrl: "https://www.thehome.ro",
    promptHint:
      "medium matte stoneware vase, irregular organic silhouette, sand and off-white glaze, on a table or nightstand",
  },
  {
    id: "th-bed-nordic",
    name: "Pat tapițat Nordic",
    price: 4299,
    currency: "RON",
    category: "beds",
    rooms: ["bedroom"],
    style: ["scandinavian", "minimalist", "japandi", "modern"],
    image2d:
      "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=600&q=80",
    accentColor: "#e8dfd2",
    affiliateUrl: "https://www.thehome.ro/paturi",
    promptHint:
      "low Scandinavian upholstered bed as the hero: wide rectangular oatmeal-linen headboard with slim piping, pale-oak platform, white linen duvet, two pillows, clearly a bed not a sofa",
  },
  {
    id: "th-nightstand-oak",
    name: "Noptieră stejar deschis",
    price: 799,
    currency: "RON",
    category: "tables",
    rooms: ["bedroom"],
    style: ["scandinavian", "japandi", "minimalist", "midcentury"],
    image2d:
      "https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=600&q=80",
    accentColor: "#c8ad83",
    affiliateUrl: "https://www.thehome.ro/noptiere",
    promptHint:
      "compact square light-oak nightstand with one drawer, slender tapered legs, pale Nordic grain, tight beside the bed",
  },
  {
    id: "th-desk-oak",
    name: "Birou stejar scandinav",
    price: 1899,
    currency: "RON",
    category: "tables",
    rooms: ["office"],
    style: ["scandinavian", "minimalist", "modern", "japandi"],
    image2d:
      "https://images.unsplash.com/photo-1518455027359-f3f65423a47c?auto=format&fit=crop&w=600&q=80",
    accentColor: "#c8ad83",
    affiliateUrl: "https://www.thehome.ro/mese",
    promptHint:
      "long Scandinavian writing desk in pale oak, slim rectangular top, tapered legs, uncluttered surface",
  },
  {
    id: "th-dining-oak",
    name: "Masă dining stejar",
    price: 2499,
    currency: "RON",
    category: "tables",
    rooms: ["kitchen"],
    style: ["scandinavian", "japandi", "classic", "boho"],
    image2d:
      "https://images.unsplash.com/photo-1617806118233-18e1de247200?auto=format&fit=crop&w=600&q=80",
    accentColor: "#b08968",
    affiliateUrl: "https://www.thehome.ro/mese",
    promptHint:
      "solid pale-oak dining table, thick rectangular top, simple Nordic legs, dining scale",
  },
  {
    id: "th-lamp-minimal",
    name: "Lampadar minimal negru",
    price: 649,
    currency: "RON",
    category: "lighting",
    rooms: ["bedroom", "office", "living"],
    style: ["minimalist", "industrial", "modern", "contemporary"],
    image2d:
      "https://images.unsplash.com/photo-1543198126-a8ad8e47fb22?auto=format&fit=crop&w=600&q=80",
    accentColor: "#4a4a4a",
    affiliateUrl: "https://www.thehome.ro/lampadare",
    promptHint:
      "slim matte-black contemporary floor lamp, thin stem, small drum shade",
  },
  {
    id: "th-nightstand-metal",
    name: "Noptieră metal industrial",
    price: 699,
    currency: "RON",
    category: "tables",
    rooms: ["bedroom"],
    style: ["industrial", "modern", "contemporary"],
    image2d:
      "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=600&q=70",
    accentColor: "#6b6b6b",
    affiliateUrl: "https://www.thehome.ro/noptiere",
    promptHint:
      "compact industrial bedside table, black metal frame, oak top, open shelf, beside the bed",
  },
  {
    id: "th-throw-boho",
    name: "Pătură textilă boho",
    price: 349,
    currency: "RON",
    category: "decor",
    rooms: ["bedroom", "living"],
    style: ["boho", "japandi"],
    image2d:
      "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=600&q=80",
    accentColor: "#c4a484",
    affiliateUrl: "https://www.thehome.ro",
    promptHint:
      "folded layered throw in sand and terracotta weave, draped on the bed or sofa edge",
  },
  {
    id: "th-armchair-nordic",
    name: "Fotoliu lounge Nordic",
    price: 1899,
    currency: "RON",
    category: "sofas",
    rooms: ["living", "bedroom"],
    style: ["scandinavian", "modern", "japandi", "minimalist"],
    image2d:
      "https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?auto=format&fit=crop&w=600&q=80",
    accentColor: "#e8dfd2",
    affiliateUrl: "https://www.thehome.ro/fotolii",
    promptHint:
      "sculptural Scandinavian lounge armchair in oatmeal boucle, rounded back, visible pale-oak legs, one-seat accent chair not a sofa",
  },
  {
    id: "th-bedside-lamps",
    name: "Veioze ceramice scandinave",
    price: 459,
    currency: "RON",
    category: "lighting",
    rooms: ["bedroom"],
    style: ["scandinavian", "japandi", "minimalist", "modern"],
    image2d:
      "https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?auto=format&fit=crop&w=600&q=80",
    accentColor: "#f2ebe3",
    affiliateUrl: "https://www.thehome.ro/veioze",
    promptHint:
      "matching pair of ceramic bedside table lamps, round matte off-white bases, linen drum shades, one on each nightstand, warm glow",
  },
];
