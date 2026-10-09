"use client";

import { useTranslations } from "next-intl";
import { CatalogPhoto } from "@/components/catalog/CatalogPhoto";
import {
  formatProductDimensions,
  formatProductPrice,
  primaryPartnerStore,
  withAffiliateParams,
} from "@/lib/partner-store/catalog";
import type { PartnerProduct } from "@/lib/partner-store/types";

type ProductDetailPanelProps = {
  product: PartnerProduct;
  locale: string;
  onClose: () => void;
};

export function ProductDetailPanel({
  product,
  locale,
  onClose,
}: ProductDetailPanelProps) {
  const t = useTranslations("product");
  const orderUrl = withAffiliateParams(product.affiliateUrl);

  return (
    <aside className="absolute bottom-4 left-4 right-4 z-10 max-h-[70%] overflow-auto rounded-2xl border border-white/15 bg-ink/90 p-4 shadow-2xl backdrop-blur-md sm:left-auto sm:w-80">
      <div className="flex items-start justify-between gap-3">
        <p className="text-[10px] uppercase tracking-[0.22em] text-brass">
          {primaryPartnerStore.brandName}
        </p>
        <button
          type="button"
          onClick={onClose}
          className="text-xs text-linen/50 hover:text-linen"
        >
          {t("close")}
        </button>
      </div>
      <CatalogPhoto
        src={product.image2d}
        alt={product.name}
        fallbackColor={product.accentColor}
        className="mt-3 h-28 w-full rounded-xl object-cover"
      />
      <h2 className="mt-3 font-serif text-2xl text-linen">{product.name}</h2>
      <p className="mt-2 text-sm leading-relaxed text-linen/65">
        {product.description}
      </p>
      <dl className="mt-4 space-y-1 text-sm">
        <div className="flex justify-between gap-4">
          <dt className="text-linen/50">{t("dimensions")}</dt>
          <dd>{formatProductDimensions(product)}</dd>
        </div>
        <div className="flex justify-between gap-4">
          <dt className="text-linen/50">{t("price")}</dt>
          <dd className="text-brass">{formatProductPrice(product, locale)}</dd>
        </div>
      </dl>
      <a
        href={orderUrl}
        target="_blank"
        rel="sponsored noopener noreferrer"
        className="mt-5 flex w-full items-center justify-center rounded-full bg-brass px-4 py-3 text-sm font-medium text-ink hover:bg-[#d4b88a]"
      >
        {t("order")}
      </a>
      <p className="mt-2 text-center text-[11px] text-linen/40">
        {t("affiliateNote")}
      </p>
    </aside>
  );
}
