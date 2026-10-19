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
  DEFAULT_VENDOR_ID,
  MIX_VENDOR_ID,
  getShippingCountry,
  isVendorId,
  vendorsForCountry,
  type FurnitureVendor,
  type ShippingCountry,
  type ShippingCountryId,
  type VendorId,
} from "./vendors";

const COUNTRY_KEY = "idg-shipping-country";
const VENDOR_KEY = "idg-vendor-id";

type ProjectDestinationValue = {
  country: ShippingCountry;
  countryId: ShippingCountryId;
  vendorId: VendorId;
  availableVendors: FurnitureVendor[];
  catalog: PartnerProduct[];
  setCountryId: (id: ShippingCountryId) => void;
  setVendorId: (id: VendorId) => void;
};

const ProjectDestinationContext = createContext<ProjectDestinationValue | null>(
  null,
);

export function ProjectDestinationProvider({ children }: { children: ReactNode }) {
  const [countryId, setCountryIdState] = useState<ShippingCountryId>(
    DEFAULT_SHIPPING_COUNTRY,
  );
  const [vendorId, setVendorIdState] = useState<VendorId>(DEFAULT_VENDOR_ID);

  useEffect(() => {
    try {
      const storedCountry = window.localStorage.getItem(COUNTRY_KEY);
      const storedVendor = window.localStorage.getItem(VENDOR_KEY);
      if (storedCountry) {
        const match = getShippingCountry(storedCountry);
        setCountryIdState(match.id);
      }
      if (isVendorId(storedVendor)) {
        setVendorIdState(storedVendor);
      }
    } catch {
      /* ignore private-mode storage */
    }
  }, []);

  const availableVendors = useMemo(
    () => vendorsForCountry(countryId),
    [countryId],
  );

  const effectiveVendorId = useMemo<VendorId>(() => {
    if (vendorId === MIX_VENDOR_ID) return MIX_VENDOR_ID;
    return availableVendors.some((vendor) => vendor.id === vendorId)
      ? vendorId
      : MIX_VENDOR_ID;
  }, [availableVendors, vendorId]);

  useEffect(() => {
    try {
      window.localStorage.setItem(COUNTRY_KEY, countryId);
      window.localStorage.setItem(VENDOR_KEY, effectiveVendorId);
    } catch {
      /* ignore */
    }
  }, [countryId, effectiveVendorId]);

  const catalog = useMemo(
    () => productsForDestination(countryId, effectiveVendorId),
    [countryId, effectiveVendorId],
  );

  const value = useMemo<ProjectDestinationValue>(
    () => ({
      country: getShippingCountry(countryId),
      countryId,
      vendorId: effectiveVendorId,
      availableVendors,
      catalog,
      setCountryId: setCountryIdState,
      setVendorId: setVendorIdState,
    }),
    [availableVendors, catalog, countryId, effectiveVendorId],
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
