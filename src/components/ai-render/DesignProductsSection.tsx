"use client";

import { useState } from "react";
import { useIsMounted } from "@/lib/useIsMounted";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { CatalogPhoto } from "@/components/catalog/CatalogPhoto";
import { addRoomSet } from "@/lib/cart/designCart";
import {
  formatProductPrice,
  officialManufacturerUrl,
  uniqueProductImage,
  withAffiliateParams,
  type PartnerProduct,
} from "@/lib/partner-store/catalog";
import { getVendor } from "@/lib/partner-store/vendors";
import { budgetRanges, type BudgetTier } from "@/lib/ai-render/designSets";

type DesignProductsSectionProps = {
  products: PartnerProduct[];
  locale: string;
  vendorName: string;
  selectedBudget: BudgetTier;
};

export function DesignProductsSection({
  products,
  locale,
  vendorName,
  selectedBudget,
}: DesignProductsSectionProps) {
  const t = useTranslations("aiRender");
  const isMounted = useIsMounted();
  const [added, setAdded] = useState(false);
  const total = products.reduce((sum, product) => sum + product.price, 0);
  const totalCurrency = products[0]?.currency ?? "EUR";
  const formattedTotal = formatProductPrice(
    { price: total, currency: totalCurrency },
    locale,
  );

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
        affiliateUrl: withAffiliateParams(
          officialManufacturerUrl(product.vendorId, product.affiliateUrl),
          "ai-render-set",
        ),
      })),
    );
    setAdded(true);
  }

  return (
    <section className="rounded-[28px] border border-white/10 bg-white/[0.04] p-5 sm:p-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-[10px] uppercase tracking-[0.22em] text-brass">
            {vendorName}
          </p>
          <h2 className="mt-2 font-serif text-3xl text-linen sm:text-4xl">
            {locale.startsWith("ro")
              ? `Produsele din acest design - ${vendorName}`
              : t("designProductsTitle", { vendor: vendorName })}
          </h2>
          <p className="mt-2 text-sm text-linen/60">
            {t("designProductsBody", {
              count: products.length,
              vendor: vendorName,
            })}
          </p>
        </div>
        <p className="text-sm text-linen/70">
          {t("setTotal")}{" "}
          <span className="font-semibold text-brass">
            {isMounted ? formattedTotal : `${total} ${totalCurrency}`}
          </span>
        </p>
      </div>

      <div className="mt-6 grid gap-3 rounded-2xl border border-brass/25 bg-brass/10 p-4 sm:grid-cols-3">
        <div>
          <p className="text-[10px] uppercase tracking-[0.18em] text-brass/80">
            Nivel selectat
          </p>
          <p className="mt-1 font-serif text-lg text-linen">
            {budgetRanges[selectedBudget].label}
            <span className="mt-0.5 block font-sans text-[11px] tracking-normal text-linen/55">
              {budgetRanges[selectedBudget].hint}
            </span>
          </p>
        </div>
        <div>
          <p className="text-[10px] uppercase tracking-[0.18em] text-brass/80">
            Cost Total Set
          </p>
          <p className="mt-1 font-serif text-lg text-linen">
            {isMounted ? formattedTotal : `${total} ${totalCurrency}`}
          </p>
        </div>
        <div>
          <p className="text-[10px] uppercase tracking-[0.18em] text-brass/80">
            Garanție & Livrare
          </p>
          <p className="mt-1 text-sm leading-snug text-linen/85">
            Livrare directă prin {vendorName}.
          </p>
        </div>
      </div>

      <ul className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {products
          .filter((product, index, list) => {
            if (!product.id) return false;
            return list.findIndex((item) => item.id === product.id) === index;
          })
          .map((product) => {
          const title = product.title || product.name;
          const buyUrl = officialManufacturerUrl(
            product.vendorId,
            product.buyUrl || product.affiliateUrl,
          );
          const imageUrl = uniqueProductImage(product);
          const cardImage = imageUrl;
          const productVendor =
            getVendor(product.vendorId)?.brandName ?? product.brand ?? vendorName;
          return (
          <li
            key={product.id}
            className="flex flex-col overflow-hidden rounded-2xl border border-white/10 bg-ink/50"
          >
            <div className="aspect-[4/3] overflow-hidden bg-white">
              <CatalogPhoto
                key={`${product.id}-${cardImage || "placeholder"}`}
                src={cardImage}
                alt={title}
                fallbackColor="#f5f5f5"
                className="h-full w-full bg-white object-contain p-4"
              />
            </div>
            <div className="flex flex-1 flex-col p-4">
              <p className="text-[10px] uppercase tracking-[0.18em] text-brass/80">
                {productVendor}
              </p>
              <h3 className="mt-1 font-serif text-xl leading-snug text-linen">
                {title}
              </h3>
              <p className="mt-2 text-sm font-semibold text-brass">
                {isMounted
                  ? formatProductPrice(product, locale)
                  : `${product.price} ${product.currency}`}
              </p>
              <a
                href={withAffiliateParams(buyUrl, "ai-render")}
                target="_blank"
                rel="sponsored noopener noreferrer"
                className="mt-4 inline-flex justify-center rounded-full border border-brass/50 px-4 py-2.5 text-sm font-medium text-brass hover:bg-brass hover:text-ink"
              >
                {t("viewOnVendor", { vendor: productVendor })}
              </a>
            </div>
          </li>
          );
        })}
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

