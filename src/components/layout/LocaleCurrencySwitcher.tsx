"use client";

import { useLocale } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import { useIsMounted } from "@/lib/useIsMounted";
import { useProjectDestination } from "@/lib/partner-store/ProjectDestinationProvider";
import {
  DISPLAY_CURRENCIES,
  HEADER_LOCALES,
} from "@/lib/i18n/displayCurrency";

export function LocaleCurrencySwitcher({
  languagesOnly = false,
}: {
  languagesOnly?: boolean;
}) {
  const locale = useLocale();
  const pathname = usePathname();
  const isMounted = useIsMounted();
  const { currency, setCurrency } = useProjectDestination();

  if (!isMounted) {
    return (
      <span className="rounded-full border border-white/10 px-2 py-1 text-[10px] uppercase tracking-widest text-linen/60">
        {locale.toUpperCase()}
        {languagesOnly ? "" : ` / ${currency}`}
      </span>
    );
  }

  return (
    <div className="flex items-center gap-1">
      <div className="flex overflow-hidden rounded-full border border-white/10">
        {HEADER_LOCALES.map((code) => (
          <Link
            key={code}
            href={pathname}
            locale={code}
            className={`px-1.5 py-1 text-[10px] uppercase tracking-wider ${
              locale === code ? "bg-brass text-ink" : "text-linen/65 hover:text-linen"
            }`}
          >
            {code}
          </Link>
        ))}
      </div>
      {languagesOnly ? null : (
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
      )}
    </div>
  );
}
