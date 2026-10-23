"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { useIsMounted } from "@/lib/useIsMounted";
import { useProjectDestination } from "@/lib/partner-store/ProjectDestinationProvider";
import {
  MIX_VENDOR_ID,
  VENDOR_GROUP_LABELS,
  VENDOR_GROUP_ORDER,
  getVendor,
  type VendorGroup,
  type VendorId,
} from "@/lib/partner-store/vendors";

function VendorSearchDropdown({
  compact = false,
}: {
  compact?: boolean;
}) {
  const t = useTranslations("commerce");
  const { vendorId, setVendorId, availableVendors } = useProjectDestination();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const rootRef = useRef<HTMLDivElement>(null);
  const selected =
    vendorId === MIX_VENDOR_ID
      ? t("mixMatch")
      : getVendor(vendorId)?.brandName ?? t("mixMatchShort");

  const groups = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return VENDOR_GROUP_ORDER.map((group) => {
      const vendors = availableVendors.filter((vendor) => {
        if (vendor.group !== group) return false;
        if (!needle) return true;
        return (
          vendor.brandName.toLowerCase().includes(needle) ||
          vendor.shortName.toLowerCase().includes(needle) ||
          VENDOR_GROUP_LABELS[group].toLowerCase().includes(needle)
        );
      });
      return { group, vendors };
    }).filter((entry) => entry.vendors.length > 0);
  }, [availableVendors, query]);

  useEffect(() => {
    function onPointer(event: MouseEvent) {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", onPointer);
    return () => document.removeEventListener("mousedown", onPointer);
  }, []);

  function choose(id: VendorId) {
    setVendorId(id);
    setOpen(false);
    setQuery("");
  }

  return (
    <div ref={rootRef} className={`relative ${compact ? "min-w-[12rem]" : "w-full"}`}>
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        className={`flex w-full items-center justify-between gap-3 rounded-full border px-3 py-2 text-left text-xs tracking-normal outline-none ${
          compact
            ? "border-white/15 bg-white/5 text-linen"
            : "border-white/15 bg-ink/40 text-linen"
        }`}
      >
        <span className="truncate">{selected}</span>
        <span className="text-linen/45">{open ? "▴" : "▾"}</span>
      </button>
      {open ? (
        <div className="absolute z-50 mt-2 max-h-[22rem] w-[min(100vw-2rem,22rem)] overflow-hidden rounded-2xl border border-white/10 bg-ink shadow-2xl">
          <div className="border-b border-white/10 p-2">
            <input
              autoFocus
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Caută brand (Minotti, Maytoni, Novacolor…)"
              className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-linen outline-none placeholder:text-linen/35"
            />
          </div>
          <div className="max-h-[18rem] overflow-y-auto p-2">
            <button
              type="button"
              onClick={() => choose(MIX_VENDOR_ID)}
              className={`mb-2 w-full rounded-xl px-3 py-2 text-left text-sm ${
                vendorId === MIX_VENDOR_ID
                  ? "bg-brass text-ink"
                  : "text-linen/80 hover:bg-white/5"
              }`}
            >
              {t("mixMatch")}
            </button>
            {groups.map(({ group, vendors }) => (
              <div key={group} className="mb-3">
                <p className="px-2 pb-1 text-[10px] uppercase tracking-[0.16em] text-linen/40">
                  {VENDOR_GROUP_LABELS[group as VendorGroup]}
                </p>
                {vendors.map((vendor) => {
                  const active = vendorId === vendor.id;
                  return (
                    <button
                      key={vendor.id}
                      type="button"
                      onClick={() => choose(vendor.id)}
                      className={`flex w-full items-center justify-between rounded-xl px-3 py-1.5 text-left text-sm ${
                        active
                          ? "bg-brass text-ink"
                          : "text-linen/80 hover:bg-white/5"
                      }`}
                    >
                      <span>{vendor.brandName}</span>
                      <span className={active ? "text-ink/60" : "text-linen/35"}>
                        {vendor.badge}
                      </span>
                    </button>
                  );
                })}
              </div>
            ))}
            {!groups.length ? (
              <p className="px-3 py-4 text-sm text-linen/50">Niciun brand găsit.</p>
            ) : null}
          </div>
        </div>
      ) : null}
    </div>
  );
}

export function HeaderVendorSelect() {
  const t = useTranslations("commerce");
  const isMounted = useIsMounted();

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
      <VendorSearchDropdown compact />
    </label>
  );
}

export function VendorChipBar() {
  const t = useTranslations("commerce");
  const { country } = useProjectDestination();

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
      <VendorSearchDropdown />
    </section>
  );
}
