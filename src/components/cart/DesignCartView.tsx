"use client";

import { useEffect, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { CatalogPhoto } from "@/components/catalog/CatalogPhoto";
import {
  cartTotal,
  clearCart,
  emptyCart,
  readCart,
  subscribeCart,
  type DesignCart,
} from "@/lib/cart/designCart";
import { formatProductPrice } from "@/lib/partner-store/catalog";

export function DesignCartView() {
  const t = useTranslations("cart");
  const locale = useLocale();
  const [cart, setCart] = useState<DesignCart>(emptyCart());

  useEffect(() => {
    setCart(readCart());
    return subscribeCart(() => setCart(readCart()));
  }, []);

  const total = cartTotal(cart);

  return (
    <main className="mx-auto max-w-3xl px-6 pb-24 pt-28">
      <p className="text-xs uppercase tracking-[0.28em] text-brass">The Home</p>
      <h1 className="mt-3 font-serif text-5xl text-linen">{t("title")}</h1>
      <p className="mt-4 text-linen/65">{t("body")}</p>

      {cart.lines.length === 0 ? (
        <p className="mt-10 text-linen/60">
          {t("empty")}{" "}
          <Link href="/ai-studio" className="text-brass hover:underline">
            {t("backToStudio")}
          </Link>
        </p>
      ) : (
        <>
          <ul className="mt-10 space-y-3">
            {cart.lines.map((line) => (
              <li
                key={line.id}
                className="flex gap-4 rounded-2xl border border-white/10 bg-white/5 p-4"
              >
                <div className="h-20 w-20 overflow-hidden rounded-xl bg-white/[0.06]">
                  <CatalogPhoto
                    src={line.image2d}
                    alt={line.name}
                    fallbackColor={line.accentColor}
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-medium">{line.name}</p>
                  <p className="mt-1 text-sm text-linen/55">
                    {t("qty", { count: line.quantity })}
                  </p>
                  <p className="mt-1 text-brass">
                    {formatProductPrice(line, locale)}
                  </p>
                </div>
                <a
                  href={line.affiliateUrl}
                  target="_blank"
                  rel="sponsored noopener noreferrer"
                  className="self-center rounded-full border border-brass/40 px-4 py-2 text-xs text-brass hover:bg-brass/10"
                >
                  {t("view")}
                </a>
              </li>
            ))}
          </ul>
          <div className="mt-8 flex flex-wrap items-center justify-between gap-4">
            <p className="text-lg">
              <span className="text-linen/60">{t("total")} </span>
              <span className="font-semibold text-brass">
                {total.toLocaleString(locale)} RON
              </span>
            </p>
            <button
              type="button"
              onClick={() => {
                clearCart();
                setCart(emptyCart());
              }}
              className="rounded-full border border-white/15 px-5 py-2 text-sm text-linen/70 hover:text-linen"
            >
              {t("clear")}
            </button>
          </div>
        </>
      )}
    </main>
  );
}
