export type VendorStatus = "pending" | "active" | "suspended";

export type Vendor = {
  id: string;
  brandName: string;
  country: string;
  status: VendorStatus;
  commissionPercent: number;
};
