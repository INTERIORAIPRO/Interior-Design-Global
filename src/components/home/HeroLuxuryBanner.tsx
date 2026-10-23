"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";

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
  const t = useTranslations("welcome.slides");
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setIndex((current) => (current + 1) % slideKeys.length);
    }, 5200);
    return () => window.clearInterval(timer);
  }, []);

  const activeKey = slideKeys[index];

  return (
    <div className="relative overflow-hidden rounded-[28px] border border-white/10 bg-ink shadow-[0_30px_80px_rgba(0,0,0,0.45)]">
      <div className="relative aspect-[4/5] sm:aspect-[4/3] lg:aspect-[5/4]">
        {slideKeys.map((key, slideIndex) => (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            key={key}
            src={slideImages[key]}
            alt={t(`${key}.title`)}
            className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ${
              slideIndex === index ? "opacity-100" : "opacity-0"
            }`}
          />
        ))}
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/20 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 p-6">
          <h2 className="font-serif text-3xl text-linen sm:text-4xl">
            {t(`${activeKey}.title`)}
          </h2>
          <p className="mt-2 max-w-sm text-sm text-linen/75">
            {t(`${activeKey}.caption`)}
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            {slideKeys.map((key, slideIndex) => (
              <button
                key={key}
                type="button"
                aria-label={t(`${key}.title`)}
                onClick={() => setIndex(slideIndex)}
                className={`h-1.5 rounded-full transition ${
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
