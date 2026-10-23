"use client";

import { useTranslations } from "next-intl";
import { useIsMounted } from "@/lib/useIsMounted";
import { useProjectDestination } from "@/lib/partner-store/ProjectDestinationProvider";
import {
  MIX_VENDOR_ID,
  VENDOR_GROUP_LABELS,
  type VendorGroup,
} from "@/lib/partner-store/vendors";

export function HeaderVendorSelect() {
  const t = useTranslations("commerce");
  const isMounted = useIsMounted();
  const { vendorId, setVendorId, availableVendors } = useProjectDestination();

  if (!isMounted) {
    return (
      <span className="rounded-full border border-white/15 px-3 py-1.5 text-xs text-linen/60">
        Mix
      </span>
    );
  }

  return (
    <label className="flex items-center gap-2 text-xs uppercase tracking-[0.12em] text-linen/60">
      <span className="hidden xl:inline">{t("vendor")}</span>
      <select
        value={vendorId}
        onChange={(event) =>
          setVendorId(event.target.value as typeof vendorId)
        }
        className="max-w-[12rem] rounded-full border border-white/15 bg-white/5 px-3 py-1.5 text-xs tracking-normal text-linen outline-none"
      >
        <option value={MIX_VENDOR_ID} className="text-ink">
          {t("mixMatch")}
        </option>
        {(Object.keys(VENDOR_GROUP_LABELS) as VendorGroup[]).map((group) => {
          const vendors = availableVendors.filter((vendor) => vendor.group === group);
          if (!vendors.length) return null;
          return (
            <optgroup key={group} label={VENDOR_GROUP_LABELS[group]} className="text-ink">
              {vendors.map((vendor) => (
                <option key={vendor.id} value={vendor.id} className="text-ink">
                  {vendor.brandName}
                </option>
              ))}
            </optgroup>
          );
        })}
      </select>
    </label>
  );
}

export function VendorChipBar() {
  const t = useTranslations("commerce");
  const { vendorId, setVendorId, availableVendors, country } =
    useProjectDestination();

  return (
    <section className="space-y-3 rounded-2xl border border-white/10 bg-white/5 p-4">
      <div className="flex flex-wrap items-end justify-between gap-2">
        <div>
          <p className="text-[10px] uppercase tracking-[0.22em] text-brass">
            {t("vendor")}
          </p>
          <p className="mt-1 text-sm text-linen/70">{t("vendorHint")}</p>
        </div>
        <p className="text-xs text-linen/55">
          {country.flag} {country.name}
        </p>
      </div>
      <div className="space-y-4">
        <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => setVendorId(MIX_VENDOR_ID)}
          className={`inline-flex items-center gap-2 rounded-full px-3 py-2 text-xs font-medium transition ${
            vendorId === MIX_VENDOR_ID
              ? "bg-brass text-ink"
              : "border border-white/15 text-linen/80 hover:border-brass/50"
          }`}
        >
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-ink/20 text-[10px]">
            ALL
          </span>
          {t("mixMatch")}
        </button>
        </div>
        {(Object.keys(VENDOR_GROUP_LABELS) as VendorGroup[]).map((group) => {
          const vendors = availableVendors.filter((vendor) => vendor.group === group);
          if (!vendors.length) return null;
          return (
            <div key={group} className="space-y-2">
              <p className="text-[10px] uppercase tracking-[0.18em] text-linen/45">
                {VENDOR_GROUP_LABELS[group]}
              </p>
              <div className="flex flex-wrap gap-2">
                {vendors.map((vendor) => {
                  const active = vendorId === vendor.id;
                  return (
                    <button
                      key={vendor.id}
                      type="button"
                      onClick={() => setVendorId(vendor.id)}
                      className={`inline-flex items-center gap-2 rounded-full px-3 py-2 text-xs font-medium transition ${
                        active
                          ? "bg-brass text-ink"
                          : "border border-white/15 text-linen/80 hover:border-brass/50"
                      }`}
                    >
                      <span
                        className="flex h-6 w-6 items-center justify-center rounded-full text-[9px] font-semibold text-ink"
                        style={{ backgroundColor: vendor.accent }}
                      >
                        {vendor.badge}
                      </span>
                      {active ? t("exclusive", { brand: vendor.shortName }) : vendor.shortName}
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
