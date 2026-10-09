import { CatalogPhoto } from "@/components/catalog/CatalogPhoto";
import { setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import {
  formatProductDimensions,
  formatProductPrice,
  partnerProducts,
  primaryPartnerStore,
  withAffiliateParams,
} from "@/lib/partner-store/catalog";

type PageProps = {
  params: Promise<{ locale: string }>;
};

export default async function MarketplacePage({ params }: PageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <main className="mx-auto max-w-6xl px-6 pb-24 pt-28">
      <p className="text-xs uppercase tracking-[0.28em] text-brass">
        {primaryPartnerStore.brandName}
      </p>
      <h1 className="mt-3 font-serif text-5xl text-linen">Marketplace</h1>
      <p className="mt-4 max-w-2xl text-linen/65">
        Demo collection inspired by The Home. Preview in the studio, then order
        on the partner site through the affiliate link.
      </p>
      <div className="mt-10 grid gap-4 sm:grid-cols-3">
        {partnerProducts.map((product) => (
          <article
            key={product.id}
            className="overflow-hidden rounded-3xl border border-white/10 bg-white/5"
          >
            <div className="relative h-44 overflow-hidden">
              <CatalogPhoto
                src={product.image2d}
                alt={product.name}
                fallbackColor={product.accentColor}
                className="h-full w-full object-cover"
              />
            </div>
            <div className="p-5">
              <h2 className="font-serif text-2xl">{product.name}</h2>
              <p className="mt-1 text-sm text-linen/60">
                {formatProductDimensions(product)}
              </p>
              <p className="mt-2 text-brass">
                {formatProductPrice(product, locale)}
              </p>
              <a
                href={withAffiliateParams(product.affiliateUrl)}
                target="_blank"
                rel="sponsored noopener noreferrer"
                className="mt-4 inline-block text-sm text-linen hover:text-brass"
              >
                Order on The Home →
              </a>
            </div>
          </article>
        ))}
      </div>
      <Link href="/studio" className="mt-8 inline-block text-sm text-brass">
        Place them in the 3D studio →
      </Link>
    </main>
  );
}
