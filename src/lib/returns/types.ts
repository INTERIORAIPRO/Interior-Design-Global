export type ReturnStatus =
  | "requested"
  | "approved"
  | "in_transit"
  | "received"
  | "refunded"
  | "rejected";

export type ReturnRequest = {
  id: string;
  orderId: string;
  vendorId: string;
  status: ReturnStatus;
  reason: string;
  openedAt: string;
};
