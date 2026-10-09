import { setRequestLocale } from "next-intl/server";
import { VendorShell } from "@/components/vendor/VendorShell";
import {
  partnerProducts,
  primaryPartnerStore,
} from "@/lib/partner-store/catalog";

type PageProps = {
  params: Promise<{ locale: string }>;
};

export default async function VendorDashboardPage({ params }: PageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <VendorShell title="Partner control panel">
      <p className="mb-8 max-w-2xl text-linen/65">
        Primary storefront: {primaryPartnerStore.brandName} (
        {primaryPartnerStore.country}). Commission{" "}
        {primaryPartnerStore.commissionPercent}%. Catalog items render in the 3D
        studio and open The Home with an affiliate query string.
      </p>
      <div className="grid gap-4 sm:grid-cols-3">
        {[
          { label: "Partner", value: primaryPartnerStore.brandName },
          { label: "Demo listings", value: String(partnerProducts.length) },
          {
            label: "Commission",
            value: `${primaryPartnerStore.commissionPercent}%`,
          },
        ].map((stat) => (
          <article
            key={stat.label}
            className="rounded-3xl border border-white/10 bg-white/5 p-5"
          >
            <p className="text-xs uppercase tracking-widest text-linen/50">
              {stat.label}
            </p>
            <p className="mt-2 font-serif text-3xl">{stat.value}</p>
          </article>
        ))}
      </div>
    </VendorShell>
  );
}
