"use client";

import { useLocale } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";
import { useIsMounted } from "@/lib/useIsMounted";
import { useProjectDestination } from "@/lib/partner-store/ProjectDestinationProvider";
import {
  DISPLAY_CURRENCIES,
  HEADER_LOCALES,
} from "@/lib/i18n/displayCurrency";

export function LocaleCurrencySwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const isMounted = useIsMounted();
  const { currency, setCurrency } = useProjectDestination();

  if (!isMounted) {
    return (
      <span className="rounded-full border border-white/10 px-2 py-1 text-[10px] uppercase tracking-widest text-linen/60">
        {locale.toUpperCase()} / {currency}
      </span>
    );
  }

  return (
    <div className="flex items-center gap-1">
      <div className="flex overflow-hidden rounded-full border border-white/10">
        {HEADER_LOCALES.map((code) => (
          <button
            key={code}
            type="button"
            onClick={() => router.replace(pathname, { locale: code })}
            className={`px-1.5 py-1 text-[10px] uppercase tracking-wider ${
              locale === code ? "bg-brass text-ink" : "text-linen/65 hover:text-linen"
            }`}
          >
            {code}
          </button>
        ))}
      </div>
      <div className="flex overflow-hidden rounded-full border border-white/10">
        {DISPLAY_CURRENCIES.map((code) => (
          <button
            key={code}
            type="button"
            onClick={() => setCurrency(code, true)}
            className={`px-1.5 py-1 text-[10px] uppercase tracking-wider ${
              currency === code ? "bg-brass text-ink" : "text-linen/65 hover:text-linen"
            }`}
          >
            {code}
          </button>
        ))}
      </div>
    </div>
  );
}
