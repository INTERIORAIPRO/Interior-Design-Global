import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";

type PageProps = {
  params: Promise<{ locale: string; id: string }>;
};

export default async function ReturnDetailPage({ params }: PageProps) {
  const { locale, id } = await params;
  setRequestLocale(locale);

  if (!id.startsWith("rma_")) {
    notFound();
  }

  return (
    <main className="mx-auto max-w-6xl px-6 pb-24 pt-28">
      <Link href="/returns" className="text-sm text-brass">
        ← All returns
      </Link>
      <h1 className="mt-4 font-serif text-4xl text-linen">{id}</h1>
      <p className="mt-3 text-linen/65">
        Return detail, inspection checklist, and refund workflow will be wired
        here.
      </p>
    </main>
  );
}
