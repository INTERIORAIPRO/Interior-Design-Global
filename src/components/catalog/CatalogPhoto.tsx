"use client";

import { useEffect, useState } from "react";
import { isDisplayableProductImage } from "@/lib/partner-store/catalog";

type CatalogPhotoProps = {
  src?: string | null;
  alt: string;
  fallbackColor?: string;
  className?: string;
};

function initialsFrom(alt: string) {
  const parts = alt
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2);
  if (!parts.length) return "ID";
  return parts.map((part) => part[0]?.toUpperCase() ?? "").join("");
}

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
        className={`flex h-full w-full flex-col items-center justify-center gap-2 border border-white/10 bg-ink/80 ${className ?? ""}`}
        style={{ background: `linear-gradient(160deg, ${fallbackColor}33, #1a1612 70%)` }}
        role="img"
        aria-label={alt}
      >
        <span
          className="flex h-14 w-14 items-center justify-center rounded-full border border-brass/40 font-serif text-lg text-brass"
          aria-hidden
        >
          {initialsFrom(alt)}
        </span>
        <span className="px-4 text-center text-[10px] uppercase tracking-[0.18em] text-linen/45">
          Imagine indisponibilă
        </span>
      </div>
    );
  }

  return (
    // Catalog assets are optional remote photos; placeholders render above.
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={usable}
      alt={alt}
      className={className}
      onError={() => setFailed(true)}
    />
  );
}
