"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { useIsMounted } from "@/lib/useIsMounted";
import { useProjectDestination } from "@/lib/partner-store/ProjectDestinationProvider";
import {
  VENDOR_GROUP_LABELS,
  VENDOR_GROUP_ORDER,
  selectedBrandsLabel,
  type DedicatedVendorId,
  type VendorGroup,
} from "@/lib/partner-store/vendors";

function VendorMultiSelect({ compact = false }: { compact?: boolean }) {
  const t = useTranslations("commerce");
  const {
    selectedBrands,
    toggleBrand,
    clearSelectedBrands,
    availableVendors,
  } = useProjectDestination();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const rootRef = useRef<HTMLDivElement>(null);
  const selectedLabel = selectedBrandsLabel(selectedBrands, t("mixMatch"));

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

  function toggle(id: DedicatedVendorId) {
    toggleBrand(id);
  }

  return (
    <div ref={rootRef} className={`relative ${compact ? "w-[10.5rem]" : "w-full"}`}>
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        className={`flex w-full items-center justify-between gap-2 rounded-full border px-3 py-1.5 text-left text-[11px] tracking-normal outline-none ${
          compact
            ? "border-white/10 bg-white/[0.04] text-linen"
            : "border-white/15 bg-ink/40 text-linen"
        }`}
      >
        <span className="truncate">{selectedLabel}</span>
        <span className="text-linen/45">{open ? "▴" : "▾"}</span>
      </button>
      {open ? (
        <div className="absolute z-50 mt-2 max-h-[24rem] w-[min(100vw-2rem,24rem)] overflow-hidden rounded-2xl border border-white/10 bg-ink shadow-2xl">
          <div className="border-b border-white/10 p-2">
            <input
              autoFocus
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Caută și bifează branduri (Eichholtz, Novacolor, Maytoni…)"
              className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-linen outline-none placeholder:text-linen/35"
            />
          </div>
          <div className="max-h-[19rem] overflow-y-auto p-2">
            <label className="mb-2 flex cursor-pointer items-center gap-2 rounded-xl px-3 py-2 text-sm text-linen/80 hover:bg-white/5">
              <input
                type="checkbox"
                checked={selectedBrands.length === 0}
                className="accent-brass"
                onChange={() => clearSelectedBrands()}
              />
              {t("mixMatch")}
            </label>
            {groups.map(({ group, vendors }) => (
              <div key={group} className="mb-3">
                <p className="px-2 pb-1 text-[10px] uppercase tracking-[0.16em] text-linen/40">
                  {VENDOR_GROUP_LABELS[group as VendorGroup]}
                </p>
                {vendors.map((vendor) => {
                  const checked = selectedBrands.includes(vendor.id);
                  return (
                    <label
                      key={vendor.id}
                      className={`flex cursor-pointer items-center justify-between rounded-xl px-3 py-1.5 text-sm ${
                        checked ? "bg-brass/15 text-linen" : "text-linen/80 hover:bg-white/5"
                      }`}
                    >
                      <span className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={checked}
                          className="accent-brass"
                          onChange={() => toggle(vendor.id)}
                        />
                        {vendor.brandName}
                      </span>
                      <span className="text-linen/35">{vendor.badge}</span>
                    </label>
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
  const isMounted = useIsMounted();

  if (!isMounted) {
    return (
      <span className="rounded-full border border-white/15 px-3 py-1.5 text-xs text-linen/60">
        Mix
      </span>
    );
  }

  return (
    <div className="flex items-center">
      <VendorMultiSelect compact />
    </div>
  );
}

export function VendorChipBar() {
  const t = useTranslations("commerce");
  const { country, selectedBrands, toggleBrand, availableVendors } =
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
      {selectedBrands.length ? (
        <div className="flex flex-wrap gap-2">
          {selectedBrands.map((id) => {
            const vendor = availableVendors.find((item) => item.id === id);
            if (!vendor) return null;
            return (
              <button
                key={id}
                type="button"
                onClick={() => toggleBrand(id)}
                className="rounded-full bg-brass px-3 py-1.5 text-xs text-ink"
              >
                {vendor.brandName} ×
              </button>
            );
          })}
        </div>
      ) : null}
      <VendorMultiSelect />
    </section>
  );
}
