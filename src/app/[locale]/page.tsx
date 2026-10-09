import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { RoomPreview } from "@/components/engine3d/RoomPreview";

type WelcomePageProps = {
  params: Promise<{ locale: string }>;
};

export default async function WelcomePage({ params }: WelcomePageProps) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("welcome");
  const features = await getTranslations("features");

  const cards = [
    { key: "ai", href: "/ai-studio" },
    { key: "i18n", href: "/marketplace" },
    { key: "engine", href: "/studio" },
    { key: "vendors", href: "/vendor" },
    { key: "returns", href: "/returns" },
  ] as const;

  return (
    <main className="relative overflow-hidden">
      <div className="pointer-events-none absolute -left-24 top-10 h-80 w-80 rounded-full bg-brass/15 blur-3xl" />
      <div className="pointer-events-none absolute right-0 top-40 h-96 w-96 rounded-full bg-sage/10 blur-3xl" />

      <section className="mx-auto grid min-h-screen max-w-6xl items-center gap-12 px-6 pb-20 pt-28 lg:grid-cols-[1.05fr_0.95fr]">
        <div>
          <p className="text-xs uppercase tracking-[0.28em] text-brass">
            {t("kicker")}
          </p>
          <h1 className="mt-5 font-serif text-5xl leading-[1.05] text-linen sm:text-6xl lg:text-7xl">
            {t("title")}
          </h1>
          <p className="mt-6 max-w-xl text-base leading-relaxed text-linen/70 sm:text-lg">
            {t("subtitle")}
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/ai-studio"
              className="rounded-full bg-brass px-6 py-3 text-sm font-medium text-ink transition hover:bg-[#d4b88a]"
            >
              {t("ctaPrimary")}
            </Link>
            <Link
              href="/studio"
              className="rounded-full border border-white/15 px-6 py-3 text-sm text-linen transition hover:border-brass/60 hover:text-brass"
            >
              {t("ctaStudio")}
            </Link>
            <Link
              href="/marketplace"
              className="rounded-full border border-white/15 px-6 py-3 text-sm text-linen transition hover:border-brass/60 hover:text-brass"
            >
              {t("ctaSecondary")}
            </Link>
            <Link
              href="/vendor"
              className="rounded-full px-6 py-3 text-sm text-linen/70 underline-offset-4 hover:text-linen hover:underline"
            >
              {t("ctaVendor")}
            </Link>
          </div>
        </div>
        <RoomPreview />
      </section>

      <section className="mx-auto grid max-w-6xl gap-4 px-6 pb-24 sm:grid-cols-2">
        {cards.map((card) => (
          <Link
            key={card.key}
            href={card.href}
            className="rounded-3xl border border-white/10 bg-white/5 p-6 transition hover:border-brass/40 hover:bg-white/[0.07]"
          >
            <h2 className="font-serif text-2xl text-linen">
              {features(`${card.key}.title`)}
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-linen/65">
              {features(`${card.key}.body`)}
            </p>
          </Link>
        ))}
      </section>
    </main>
  );
}
