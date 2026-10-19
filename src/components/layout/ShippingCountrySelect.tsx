"use client";

import { useTranslations } from "next-intl";
import { useIsMounted } from "@/lib/useIsMounted";
import { useProjectDestination } from "@/lib/partner-store/ProjectDestinationProvider";
import { shippingCountries } from "@/lib/partner-store/vendors";

export function ShippingCountrySelect() {
  const t = useTranslations("commerce");
  const isMounted = useIsMounted();
  const { countryId, setCountryId } = useProjectDestination();

  if (!isMounted) {
    return (
      <span className="rounded-full border border-white/15 px-3 py-1.5 text-xs text-linen/60">
        🇷🇴 RO
      </span>
    );
  }

  return (
    <label className="flex items-center gap-2 text-xs uppercase tracking-[0.12em] text-linen/60">
      <span className="hidden lg:inline">{t("shippingCountry")}</span>
      <select
        value={countryId}
        onChange={(event) =>
          setCountryId(event.target.value as typeof countryId)
        }
        className="max-w-[11rem] rounded-full border border-white/15 bg-white/5 px-3 py-1.5 text-xs tracking-normal text-linen outline-none"
      >
        {shippingCountries.map((country) => (
          <option key={country.id} value={country.id} className="text-ink">
            {country.flag} {country.name}
          </option>
        ))}
      </select>
    </label>
  );
}
