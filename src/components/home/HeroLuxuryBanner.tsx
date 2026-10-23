"use client";

import { useEffect, useState } from "react";

const slides = [
  {
    src: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1600&q=80",
    title: "Living de lux",
    caption: "Canapele, lumină arhitecturală, materiale minerale.",
  },
  {
    src: "https://images.unsplash.com/photo-1556912173-46c336c7fd55?auto=format&fit=crop&w=1600&q=80",
    title: "Dining & Bucătărie",
    caption: "Masă, scaune, pendule — scenă de Architectural Digest.",
  },
  {
    src: "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1600&q=80",
    title: "Birou Acasă",
    caption: "Birou modern, scaun ergonomic, lampă de lucru.",
  },
  {
    src: "https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?auto=format&fit=crop&w=1600&q=80",
    title: "Baie & Finisaje",
    caption: "Piatră, oglinzi, sanitare de designer.",
  },
];

export function HeroLuxuryBanner() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setIndex((current) => (current + 1) % slides.length);
    }, 5200);
    return () => window.clearInterval(timer);
  }, []);

  const slide = slides[index];

  return (
    <div className="relative overflow-hidden rounded-[28px] border border-white/10 bg-ink shadow-[0_30px_80px_rgba(0,0,0,0.45)]">
      <div className="relative aspect-[4/5] sm:aspect-[4/3] lg:aspect-[5/4]">
        {slides.map((item, slideIndex) => (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            key={item.src}
            src={item.src}
            alt={item.title}
            className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ${
              slideIndex === index ? "opacity-100" : "opacity-0"
            }`}
          />
        ))}
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/20 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 p-6">
          <p className="text-[10px] uppercase tracking-[0.28em] text-brass">
            Luxury Studio
          </p>
          <h2 className="mt-2 font-serif text-3xl text-linen sm:text-4xl">
            {slide.title}
          </h2>
          <p className="mt-2 max-w-sm text-sm text-linen/75">{slide.caption}</p>
          <div className="mt-4 flex gap-2">
            {slides.map((item, slideIndex) => (
              <button
                key={item.title}
                type="button"
                aria-label={item.title}
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
