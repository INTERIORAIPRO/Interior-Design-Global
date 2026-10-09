"use client";

import { useState } from "react";

type CatalogPhotoProps = {
  src: string;
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
  const [failed, setFailed] = useState(false);

  if (failed) {
    return (
      <div
        className={className}
        style={{ backgroundColor: fallbackColor }}
        role="img"
        aria-label={alt}
      />
    );
  }

  return (
    // Catalog assets are local SVG placeholders or optional remote photos.
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={alt}
      className={className}
      onError={() => setFailed(true)}
    />
  );
}
