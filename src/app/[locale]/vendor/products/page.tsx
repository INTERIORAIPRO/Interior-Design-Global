import { CatalogPhoto } from "@/components/catalog/CatalogPhoto";
import { setRequestLocale } from "next-intl/server";
import { VendorShell } from "@/components/vendor/VendorShell";
import {
  formatProductDimensions,
  formatProductPrice,
  partnerProducts,
  withAffiliateParams,
} from "@/lib/partner-store/catalog";

type PageProps = {
  params: Promise<{ locale: string }>;
};

export default async function VendorProductsPage({ params }: PageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <VendorShell title="The Home catalog">
      <p className="mb-8 max-w-2xl text-linen/65">
        Edit demo products in{" "}
        <code className="text-brass">data/partner-store/products.json</code>.
        Each row needs a 2D image, centimetre dimensions, price, and a The Home
        URL. The 3D engine builds an in-room stand-in automatically.
      </p>
      <ul className="space-y-4">
        {partnerProducts.map((product) => (
          <li
            key={product.id}
            className="grid gap-4 rounded-3xl border border-white/10 bg-white/5 p-4 sm:grid-cols-[140px_1fr]"
          >
            <div className="relative h-28 overflow-hidden rounded-2xl">
              <CatalogPhoto
                src={product.image2d}
                alt={product.name}
                fallbackColor={product.accentColor}
                className="h-full w-full object-cover"
              />
            </div>
            <div>
              <p className="text-xs uppercase tracking-widest text-brass">
                {product.sku}
              </p>
              <h2 className="mt-1 font-serif text-2xl">{product.name}</h2>
              <p className="mt-1 text-sm text-linen/60">
                {formatProductDimensions(product)} ·{" "}
                {formatProductPrice(product, locale)}
              </p>
              <a
                href={withAffiliateParams(product.affiliateUrl)}
                target="_blank"
                rel="sponsored noopener noreferrer"
                className="mt-3 inline-block text-sm text-brass"
              >
                Affiliate link →
              </a>
            </div>
          </li>
        ))}
      </ul>
    </VendorShell>
  );
}
