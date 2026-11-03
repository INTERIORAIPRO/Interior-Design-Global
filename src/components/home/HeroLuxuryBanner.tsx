"use client";

import { useEffect, useState } from "react";
import { useLocale, useTranslations } from "next-intl";

const slides = [
  {
    key: "living",
    image:
      "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1200&q=80",
    fallback: "/hero/living.jpg",
  },
  {
    key: "kitchen",
    image:
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80",
    fallback: "/hero/kitchen.jpg",
  },
  {
    key: "office",
    image:
      "https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=1200&q=80",
    fallback: "/hero/office.jpg",
  },
  {
    key: "bathroom",
    image:
      "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=1200&q=80",
    fallback: "/hero/bathroom.jpg",
  },
  {
    key: "bedroom",
    image:
      "https://images.unsplash.com/photo-1616594039964-ae9021a400a0?auto=format&fit=crop&w=1200&q=80",
    fallback: "/hero/bedroom.jpg",
  },
  {
    key: "terrace",
    image:
      "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80",
    fallback: "/hero/terrace.jpg",
  },
  {
    key: "horeca",
    image:
      "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1200&q=80",
    fallback: "/hero/horeca.jpg",
  },
] as const;

export function HeroLuxuryBanner() {
  const locale = useLocale();
  const t = useTranslations("welcome");
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused) return undefined;
    const timer = window.setInterval(() => {
      setIndex((current) => (current + 1) % slides.length);
    }, 5200);
    return () => window.clearInterval(timer);
  }, [locale, paused]);

  const active = slides[index];

  return (
    <div
      key={locale}
      className="relative h-[420px] w-full overflow-hidden rounded-2xl bg-ink shadow-2xl"
    >
      {slides.map((slide, slideIndex) => (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          key={`${locale}-${slide.key}`}
          src={slide.image}
          alt={t(`slides.${slide.key}.title`)}
          onError={(event) => {
            if (!event.currentTarget.src.endsWith(slide.fallback)) {
              event.currentTarget.src = slide.fallback;
            }
          }}
          className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ${
            slideIndex === index ? "opacity-100" : "opacity-0"
          }`}
        />
      ))}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 z-10 p-6 text-white">
        <h2 className="line-clamp-1 font-serif text-2xl font-light">
          {t(`slides.${active.key}.title`)}
        </h2>
        <p className="mt-1 line-clamp-2 min-h-10 max-w-sm text-sm text-gray-200">
          {t(`slides.${active.key}.caption`)}
        </p>
        <div className="mt-4 flex flex-nowrap items-center gap-2">
          {slides.map((slide, slideIndex) => (
            <button
              key={`${locale}-${slide.key}-dot`}
              type="button"
              aria-label={t(`slides.${slide.key}.title`)}
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
