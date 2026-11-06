"use client";

import { useEffect, useState } from "react";
import { useLocale, useTranslations } from "next-intl";

// Ordinea și URL-urile sunt cele cerute. Titlurile/descrierile vin din
// src/i18n/messages/*.json (welcome.slides.<key>.title|caption).
const slides = [
  {
    // 1. Zona de zi
    key: "living",
    image:
      "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1200&q=80",
    fallback: "/hero/living.jpg",
  },
  {
    // 2. Bucătărie și zona de mese
    key: "kitchen",
    image:
      "https://images.unsplash.com/photo-1615529162924-f8605388461d?auto=format&fit=crop&w=1200&q=80",
    fallback: "/hero/kitchen.jpg",
  },
  {
    // 3. Birou
    key: "office",
    image:
      "https://images.unsplash.com/photo-1595515106969-1ce29566ff1c?auto=format&fit=crop&w=1200&q=80",
    fallback: "/hero/office.jpg",
  },
  {
    // 4. Baie și finisaje
    key: "bathroom",
    image:
      "https://images.unsplash.com/photo-1620626011761-996317b8d101?auto=format&fit=crop&w=1200&q=80",
    fallback: "/hero/bathroom.jpg",
  },
  {
    // 5. Dormitor
    key: "bedroom",
    image:
      "https://images.unsplash.com/photo-1616046229478-9901c5536a45?auto=format&fit=crop&w=1200&q=80",
    fallback: "/hero/bedroom.jpg",
  },
  {
    // 6. Terasă și grădină
    key: "terrace",
    image:
      "https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=1200&q=80",
    fallback: "/hero/terrace.jpg",
  },
  {
    // 7. HoReCa și comercial
    key: "horeca",
    image:
      "https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=1200&q=80",
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

  // Un singur șablon de randare pentru toate cele 7 carduri:
  // aceeași înălțime, același gradient, aceeași tipografie, aceiași dots.
  return (
    <div
      key={locale}
      className="relative h-[420px] w-full overflow-hidden rounded-2xl bg-ink shadow-2xl"
    >
      {slides.map((slide, slideIndex) => (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          key={`${locale}-${slide.key}`}
          suppressHydrationWarning={true}
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
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 z-10 p-6">
        <h2
          suppressHydrationWarning={true}
          className="line-clamp-1 font-serif text-2xl font-light text-white"
        >
          {t(`slides.${active.key}.title`)}
        </h2>
        <p
          suppressHydrationWarning={true}
          className="mt-1 line-clamp-2 min-h-10 max-w-sm text-sm text-gray-200"
        >
          {t(`slides.${active.key}.caption`)}
        </p>
        <div className="mt-4 flex flex-nowrap items-center gap-2">
          {slides.map((slide, slideIndex) => (
            <button
              key={`${locale}-${slide.key}-dot`}
              suppressHydrationWarning={true}
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
