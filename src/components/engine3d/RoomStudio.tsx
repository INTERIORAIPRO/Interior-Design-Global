"use client";

import { useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import {
  formatProductPrice,
  getPartnerProduct,
  partnerProducts,
} from "@/lib/partner-store/catalog";
import { ProductDetailPanel } from "./ProductDetailPanel";

import dynamic from "next/dynamic";

const SceneCanvas = dynamic(
  () => import("./SceneCanvas").then((mod) => mod.SceneCanvas),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-full min-h-[320px] items-center justify-center rounded-[28px] border border-white/10 bg-[#2a231c] text-sm text-linen/50">
        Loading 3D studio…
      </div>
    ),
  },
);

type RoomStudioProps = {
  showList?: boolean;
  canvasHeightClass?: string;
};

export function RoomStudio({
  showList = false,
  canvasHeightClass = "min-h-[320px] h-[360px] lg:h-full",
}: RoomStudioProps) {
  const locale = useLocale();
  const t = useTranslations("product");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const selected = selectedId ? getPartnerProduct(selectedId) : undefined;

  return (
    <div className="space-y-4">
      <div className={`relative w-full ${canvasHeightClass}`}>
        <SceneCanvas selectedId={selectedId} onSelect={setSelectedId} />
        {selected ? (
          <ProductDetailPanel
            product={selected}
            locale={locale}
            onClose={() => setSelectedId(null)}
          />
        ) : (
          <p className="pointer-events-none absolute left-4 top-4 rounded-full border border-white/10 bg-ink/70 px-3 py-1 text-xs text-linen/70">
            {t("clickHint")}
          </p>
        )}
      </div>
      {showList ? (
        <ul className="grid gap-3 sm:grid-cols-3">
          {partnerProducts.map((product) => {
            const active = product.id === selectedId;
            return (
              <li key={product.id}>
                <button
                  type="button"
                  onClick={() => setSelectedId(product.id)}
                  className={`w-full rounded-2xl border px-4 py-3 text-left text-sm transition ${
                    active
                      ? "border-brass bg-brass/10 text-linen"
                      : "border-white/10 text-linen/75 hover:border-brass/40"
                  }`}
                >
                  <span className="block font-medium">{product.name}</span>
                  <span className="mt-1 block text-brass">
                    {formatProductPrice(product, locale)}
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      ) : null}
    </div>
  );
}
