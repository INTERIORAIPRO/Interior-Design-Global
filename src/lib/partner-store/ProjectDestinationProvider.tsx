"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { productsForDestination, type PartnerProduct } from "./catalog";
import {
  DEFAULT_SHIPPING_COUNTRY,
  MIX_VENDOR_ID,
  dedicatedBrandIds,
  getShippingCountry,
  isVendorId,
  vendorsForCountry,
  type DedicatedVendorId,
  type FurnitureVendor,
  type ShippingCountry,
  type ShippingCountryId,
  type VendorId,
} from "./vendors";

const COUNTRY_KEY = "idg-shipping-country";
const VENDOR_KEY = "idg-vendor-id";
const BRANDS_KEY = "idg-selected-brands";

type ProjectDestinationValue = {
  country: ShippingCountry;
  countryId: ShippingCountryId;
  vendorId: VendorId;
  selectedBrands: DedicatedVendorId[];
  availableVendors: FurnitureVendor[];
  catalog: PartnerProduct[];
  setCountryId: (id: ShippingCountryId) => void;
  setVendorId: (id: VendorId) => void;
  toggleBrand: (id: DedicatedVendorId) => void;
  setSelectedBrands: (ids: DedicatedVendorId[]) => void;
  clearSelectedBrands: () => void;
};

const ProjectDestinationContext = createContext<ProjectDestinationValue | null>(
  null,
);

export function ProjectDestinationProvider({ children }: { children: ReactNode }) {
  const [countryId, setCountryIdState] = useState<ShippingCountryId>(
    DEFAULT_SHIPPING_COUNTRY,
  );
  const [selectedBrands, setSelectedBrandsState] = useState<DedicatedVendorId[]>(
    [],
  );

  useEffect(() => {
    try {
      const storedCountry = window.localStorage.getItem(COUNTRY_KEY);
      const storedBrands = window.localStorage.getItem(BRANDS_KEY);
      const storedVendor = window.localStorage.getItem(VENDOR_KEY);
      if (storedCountry) {
        const match = getShippingCountry(storedCountry);
        setCountryIdState(match.id);
      }
      if (storedBrands) {
        const parsed = JSON.parse(storedBrands) as unknown;
        if (Array.isArray(parsed)) {
          setSelectedBrandsState(dedicatedBrandIds(parsed.map(String)));
          return;
        }
      }
      if (isVendorId(storedVendor) && storedVendor !== MIX_VENDOR_ID) {
        setSelectedBrandsState([storedVendor]);
      }
    } catch {
      /* ignore private-mode storage */
    }
  }, []);

  const availableVendors = useMemo(
    () => vendorsForCountry(countryId),
  [countryId],
  );

  const effectiveBrands = useMemo(() => {
    const allowed = new Set(availableVendors.map((vendor) => vendor.id));
    return selectedBrands.filter((id) => allowed.has(id));
  }, [availableVendors, selectedBrands]);

  const effectiveVendorId = useMemo<VendorId>(() => {
    if (effectiveBrands.length === 1) return effectiveBrands[0];
    return MIX_VENDOR_ID;
  }, [effectiveBrands]);

  useEffect(() => {
    try {
      window.localStorage.setItem(COUNTRY_KEY, countryId);
      window.localStorage.setItem(BRANDS_KEY, JSON.stringify(effectiveBrands));
      window.localStorage.setItem(VENDOR_KEY, effectiveVendorId);
    } catch {
      /* ignore */
    }
  }, [countryId, effectiveBrands, effectiveVendorId]);

  const catalog = useMemo(
    () => productsForDestination(countryId, effectiveBrands),
    [countryId, effectiveBrands],
  );

  const value = useMemo<ProjectDestinationValue>(
    () => ({
      country: getShippingCountry(countryId),
      countryId,
      vendorId: effectiveVendorId,
      selectedBrands: effectiveBrands,
      availableVendors,
      catalog,
      setCountryId: setCountryIdState,
      setVendorId: (id) => {
        if (id === MIX_VENDOR_ID) {
          setSelectedBrandsState([]);
          return;
        }
        setSelectedBrandsState([id as DedicatedVendorId]);
      },
      toggleBrand: (id) => {
        setSelectedBrandsState((current) =>
          current.includes(id)
            ? current.filter((item) => item !== id)
            : [...current, id],
        );
      },
      setSelectedBrands: setSelectedBrandsState,
      clearSelectedBrands: () => setSelectedBrandsState([]),
    }),
    [availableVendors, catalog, countryId, effectiveBrands, effectiveVendorId],
  );

  return (
    <ProjectDestinationContext.Provider value={value}>
      {children}
    </ProjectDestinationContext.Provider>
  );
}

export function useProjectDestination() {
  const value = useContext(ProjectDestinationContext);
  if (!value) {
    throw new Error("useProjectDestination must be used within ProjectDestinationProvider");
  }
  return value;
}
