export type ProductCategory =
  | "sofa"
  | "armchair"
  | "coffee-table"
  | "table"
  | "floor-lamp"
  | "rug"
  | "sideboard";

export type InteriorStyle =
  | "scandinavian"
  | "modern"
  | "classic"
  | "industrial"
  | "minimal";

export type ProductDimensions = {
  widthCm: number;
  depthCm: number;
  heightCm: number;
};

export type ProductPlacement = {
  x: number;
  z: number;
  rotationY: number;
};

export type PartnerProduct = {
  id: string;
  sku: string;
  name: string;
  description: string;
  category: ProductCategory;
  image2d: string;
  accentColor: string;
  styles: InteriorStyle[];
  dimensions: ProductDimensions;
  price: number;
  currency: string;
  affiliateUrl: string;
  placement?: ProductPlacement;
};

export type PartnerStore = {
  id: string;
  brandName: string;
  country: string;
  status: "pending" | "active" | "suspended";
  commissionPercent: number;
  storeUrl: string;
  affiliateBaseUrl: string;
};

export type SizeMeters = {
  width: number;
  depth: number;
  height: number;
};

export type IndicativeModel = {
  productId: string;
  category: ProductCategory;
  size: SizeMeters;
  position: [number, number, number];
  rotationY: number;
  imageUrl: string;
  accentColor: string;
};
