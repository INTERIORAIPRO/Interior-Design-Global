import { setRequestLocale } from "next-intl/server";
import { ReturnsOverview } from "@/components/returns/ReturnsOverview";
import type { ReturnRequest } from "@/lib/returns/types";
import { appConfig } from "../../../../config/interior-design.config";

type PageProps = {
  params: Promise<{ locale: string }>;
};

const sampleReturns: ReturnRequest[] = [
  {
    id: "rma_1042",
    orderId: "ord_8891",
    vendorId: "vnd_atelier_nord",
    status: "requested",
    reason: "Finish mismatch",
    openedAt: "2026-09-28",
  },
  {
    id: "rma_1038",
    orderId: "ord_8704",
    vendorId: "vnd_casa_lumen",
    status: "in_transit",
    reason: "Damaged in transit",
    openedAt: "2026-09-22",
  },
];

export default async function ReturnsPage({ params }: PageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <main className="mx-auto max-w-6xl px-6 pb-24 pt-28">
      <p className="text-xs uppercase tracking-[0.28em] text-brass">RMA</p>
      <h1 className="mt-3 font-serif text-5xl text-linen">Returns</h1>
      <p className="mt-4 max-w-2xl text-linen/65">
        Return window: {appConfig.returns.windowDays} days. Restocking fee:{" "}
        {appConfig.returns.restockingFeePercent}%.
      </p>
      <div className="mt-8">
        <ReturnsOverview requests={sampleReturns} />
      </div>
    </main>
  );
}
