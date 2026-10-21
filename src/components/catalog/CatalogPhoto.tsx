"use client";

import { useEffect, useState } from "react";
import { isDisplayableProductImage } from "@/lib/partner-store/catalog";

type CatalogPhotoProps = {
  src?: string | null;
  alt: string;
  fallbackColor?: string;
  className?: string;
};

export function CatalogPhoto({
  src,
  alt,
  fallbackColor = "#2a231c",
  className,
}: CatalogPhotoProps) {
  const usable = isDisplayableProductImage(src) ? src!.trim() : "";
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    setFailed(false);
  }, [usable]);

  if (!usable || failed) {
    return (
      <div
        className={`h-full w-full border border-white/10 ${className ?? ""}`}
        style={{
          background: `linear-gradient(160deg, ${fallbackColor}55, #1a1612 78%)`,
        }}
        role="img"
        aria-label={alt}
      />
    );
  }

  return (
    // Catalog assets are stock photos or public /partner-store fallbacks.
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={usable}
      alt={alt}
      className={className}
      onError={() => setFailed(true)}
    />
  );
}
