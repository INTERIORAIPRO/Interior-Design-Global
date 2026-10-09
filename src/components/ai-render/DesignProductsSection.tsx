"use client";

import { useState } from "react";
import { useIsMounted } from "@/lib/useIsMounted";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { CatalogPhoto } from "@/components/catalog/CatalogPhoto";
import { addRoomSet } from "@/lib/cart/designCart";
import {
  formatProductPrice,
  primaryPartnerStore,
  withAffiliateParams,
  type PartnerProduct,
} from "@/lib/partner-store/catalog";

type DesignProductsSectionProps = {
  products: PartnerProduct[];
  locale: string;
};

export function DesignProductsSection({
  products,
  locale,
}: DesignProductsSectionProps) {
  const t = useTranslations("aiRender");
  const isMounted = useIsMounted();
  const [added, setAdded] = useState(false);
  const total = products.reduce((sum, product) => sum + product.price, 0);

  function addSet() {
    if (!products.length) return;
    addRoomSet(
      products.map((product) => ({
        id: product.id,
        name: product.name,
        price: product.price,
        currency: product.currency,
        image2d: product.image2d,
        accentColor: product.accentColor,
        affiliateUrl: withAffiliateParams(product.affiliateUrl, "ai-render-set"),
      })),
    );
    setAdded(true);
  }

  return (
    <section className="rounded-[28px] border border-white/10 bg-white/[0.04] p-5 sm:p-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-[10px] uppercase tracking-[0.22em] text-brass">
            {primaryPartnerStore.brandName}
          </p>
          <h2 className="mt-2 font-serif text-3xl text-linen sm:text-4xl">
            {t("designProductsTitle")}
          </h2>
          <p className="mt-2 text-sm text-linen/60">
            {t("designProductsBody", { count: products.length })}
          </p>
        </div>
        <p className="text-sm text-linen/70">
          {t("setTotal")}{" "}
          <span className="font-semibold text-brass">
            {isMounted ? `${total.toLocaleString(locale)} RON` : `${total} RON`}
          </span>
        </p>
      </div>

      <ul className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {products.map((product) => (
          <li
            key={product.id}
            className="flex flex-col overflow-hidden rounded-2xl border border-white/10 bg-ink/50"
          >
            <div className="aspect-[4/3] overflow-hidden bg-white/[0.06]">
              <CatalogPhoto
                src={product.image2d}
                alt={product.name}
                fallbackColor={product.accentColor}
                className="h-full w-full object-cover"
              />
            </div>
            <div className="flex flex-1 flex-col p-4">
              <h3 className="font-serif text-xl leading-snug text-linen">
                {product.name}
              </h3>
              <p className="mt-2 text-sm font-semibold text-brass">
                {isMounted
                  ? formatProductPrice(product, locale)
                  : `${product.price} ${product.currency}`}
              </p>
              <a
                href={withAffiliateParams(product.affiliateUrl, "ai-render")}
                target="_blank"
                rel="sponsored noopener noreferrer"
                className="mt-4 inline-flex justify-center rounded-full border border-brass/50 px-4 py-2.5 text-sm font-medium text-brass hover:bg-brass hover:text-ink"
              >
                {t("viewOnTheHome")}
              </a>
            </div>
          </li>
        ))}
      </ul>

      <div className="mt-8 border-t border-white/10 pt-6">
        <button
          type="button"
          disabled={!products.length}
          onClick={addSet}
          className="w-full rounded-full bg-brass py-3.5 text-sm font-medium text-ink disabled:opacity-40 sm:w-auto sm:px-10"
        >
          {t("addSetToCart")}
        </button>
        {added ? (
          <p className="mt-3 text-sm text-linen/75">
            {t("setAdded", { count: products.length })}{" "}
            <Link href="/cart" className="text-brass hover:underline">
              {t("openCart")}
            </Link>
          </p>
        ) : null}
      </div>
    </section>
  );
}
