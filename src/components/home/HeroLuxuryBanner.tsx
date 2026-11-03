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
  living:
    "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1600&q=80",
  kitchen:
    "https://images.unsplash.com/photo-1556912173-46c336c7fd55?auto=format&fit=crop&w=1600&q=80",
  office:
    "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1600&q=80",
  bathroom:
    "https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?auto=format&fit=crop&w=1600&q=80",
  bedroom:
    "https://images.unsplash.com/photo-1616594039964-0aa65c88877f?auto=format&fit=crop&w=1600&q=80",
  terrace:
    "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=80",
  horeca:
    "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1600&q=80",
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
      className="relative overflow-hidden rounded-[28px] border border-white/10 bg-ink shadow-[0_30px_80px_rgba(0,0,0,0.45)]"
    >
      <div className="relative aspect-[4/3] overflow-hidden sm:aspect-[5/4]">
        {slideKeys.map((key, slideIndex) => (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            key={`${locale}-${key}`}
            src={slideImages[key]}
            alt={t(`slides.${key}.title`)}
            className={`absolute inset-0 h-full w-full object-cover object-center transition-opacity duration-700 ${
              slideIndex === index ? "opacity-100" : "opacity-0"
            }`}
          />
        ))}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink/55 via-transparent to-black/10" />
      </div>
      <div className="flex min-h-[10.5rem] flex-col px-6 pb-5 pt-5">
        <h2 className="min-h-[2.5rem] font-serif text-[1.75rem] leading-tight tracking-tight text-linen sm:text-[2rem]">
          <span className="line-clamp-1">{t(`slides.${activeKey}.title`)}</span>
        </h2>
        <p className="mt-2 min-h-[2.75rem] max-w-sm text-sm leading-relaxed text-linen/75">
          <span className="line-clamp-2">{t(`slides.${activeKey}.caption`)}</span>
        </p>
        <div className="mt-auto flex h-4 flex-nowrap items-center gap-2 pt-4">
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
  );
}
