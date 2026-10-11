export interface PartnerProduct {
  id: string;
  name: string;
  brand: string;
  price: number;
  currency: string;
  imageUrl: string;
  affiliateUrl: string;
  category: string;
  sku?: string;
  description?: string;
  styles?: string[];
  dimensions?: { width?: number; height?: number; depth?: number; };
}

export const KAVE_HOME_PRODUCTS: PartnerProduct[] = [
  {
    id: "kh-1",
    name: "Canapea extensibilă Kave Home Diko",
    brand: "Kave Home",
    price: 3499,
    currency: "RON",
    imageUrl: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=800&q=80",
    affiliateUrl: "https://kavehome.com",
    category: "Living",
    sku: "KH-DIKO-01",
    description: "Canapea design modern Kave Home, confortabilă și elegantă, ideală pentru livinguri contemporane.",
    styles: ["Modern", "Scandinav"]
  },
  {
    id: "kh-2",
    name: "Masă de dining Kave Home Oak",
    brand: "Kave Home",
    price: 2299,
    currency: "RON",
    imageUrl: "https://images.unsplash.com/photo-1615066390971-03e4e1c36ddf?auto=format&fit=crop&w=800&q=80",
    affiliateUrl: "https://kavehome.com",
    category: "Dining",
    sku: "KH-OAK-02",
    description: "Masă din lemn masiv finisaj natural, potrivită pentru 6 persoane.",
    styles: ["Scandinav", "Minimalist"]
  },
  {
    id: "kh-3",
    name: "Fotoliu catifea Kave Home Adele",
    brand: "Kave Home",
    price: 1199,
    currency: "RON",
    imageUrl: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=800&q=80",
    affiliateUrl: "https://kavehome.com",
    category: "Living",
    sku: "KH-ADELE-03",
    description: "Fotoliu elegant tapițat cu catifea fină și picioare metalice negre.",
    styles: ["Mid-Century", "Modern"]
  },
  {
    id: "kh-4",
    name: "Lampadar design Kave Home Nala",
    brand: "Kave Home",
    price: 699,
    currency: "RON",
    imageUrl: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=800&q=80",
    affiliateUrl: "https://kavehome.com",
    category: "Iluminat",
    sku: "KH-NALA-04",
    description: "Corp de iluminat minimalist pentru atmosferă caldă în cameră.",
    styles: ["Minimalist", "Industrial"]
  }
];

export function getPartnerProducts(): PartnerProduct[] {
  return KAVE_HOME_PRODUCTS;
}
