"use client";

import { useLocale } from "next-intl";
import { useIsMounted } from "@/lib/useIsMounted";
import { formatProductPrice } from "@/lib/partner-store/catalog";
import { useProjectDestination } from "@/lib/partner-store/ProjectDestinationProvider";

export function FormattedPrice({
  product,
}: {
  product: { price: number; currency?: string };
}) {
  const locale = useLocale();
  const isMounted = useIsMounted();
  const { currency } = useProjectDestination();
  if (!isMounted) {
    return <>{`${product.price} ${product.currency ?? currency}`}</>;
  }
  return <>{formatProductPrice(product, locale, currency)}</>;
}
