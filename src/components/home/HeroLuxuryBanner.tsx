"use client";

import { useEffect, useState } from "react";
import { useLocale, useTranslations } from "next-intl";

const slideKeys = [
  "living",
  "kitchen",
  "office",
  "bathroom",
  "bedroom",
  "terrace",
  "horeca",
] as const;

const slideImages: Record<(typeof slideKeys)[number], string> = {
  living: "/hero/living.jpg",
  kitchen: "/hero/kitchen.jpg",
  office: "/hero/office.jpg",
  bathroom: "/hero/bathroom.jpg",
  bedroom:
    "https://images.unsplash.com/photo-1618773928121-c32242e63f39?q=80&w=1200&auto=format&fit=crop",
  terrace: "/hero/terrace.jpg",
  horeca: "/hero/horeca.jpg",
};

const localImages: Record<(typeof slideKeys)[number], string> = {
  living: "/hero/living.jpg",
  kitchen: "/hero/kitchen.jpg",
  office: "/hero/office.jpg",
  bathroom: "/hero/bathroom.jpg",
  bedroom: "/hero/bedroom.jpg",
  terrace: "/hero/terrace.jpg",
  horeca: "/hero/horeca.jpg",
};

export function HeroLuxuryBanner() {
  const locale = useLocale();
  const t = useTranslations("welcome");
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused) return undefined;
    const timer = window.setInterval(() => {
      setIndex((current) => (current + 1) % slideKeys.length);
    }, 5200);
    return () => window.clearInterval(timer);
  }, [locale, paused]);

  const activeKey = slideKeys[index];

  return (
    <div
      key={locale}
      className="relative isolate overflow-hidden rounded-[28px] border border-white/10 bg-ink shadow-[0_30px_80px_rgba(0,0,0,0.45)]"
    >
      <div className="relative aspect-[4/5] sm:aspect-[4/3] lg:aspect-[5/4]">
        {slideKeys.map((key, slideIndex) => (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            key={`${locale}-${key}`}
            src={slideImages[key]}
            alt={t(`slides.${key}.title`)}
            onError={(event) => {
              event.currentTarget.src = localImages[key];
            }}
            className={`absolute inset-0 h-full w-full object-cover object-center transition-opacity duration-700 ${
              slideIndex === index ? "opacity-100" : "opacity-0"
            }`}
          />
        ))}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 p-6">
          <h2 className="font-serif text-3xl leading-tight tracking-tight text-linen sm:text-4xl">
            <span className="line-clamp-1">{t(`slides.${activeKey}.title`)}</span>
          </h2>
          <p className="mt-2 line-clamp-2 min-h-[2.75rem] max-w-sm text-sm leading-relaxed text-linen/75">
            {t(`slides.${activeKey}.caption`)}
          </p>
          <div className="mt-4 flex flex-nowrap items-center gap-2">
            {slideKeys.map((key, slideIndex) => (
              <button
                key={`${locale}-${key}-dot`}
                type="button"
                aria-label={t(`slides.${key}.title`)}
                onClick={() => {
                  setPaused(true);
                  setIndex(slideIndex);
                }}
                className={`h-1.5 shrink-0 rounded-full transition-all ${
                  slideIndex === index ? "w-8 bg-brass" : "w-3 bg-white/30"
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
