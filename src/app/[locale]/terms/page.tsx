import { getTranslations, setRequestLocale } from "next-intl/server";
import { LegalDocument } from "@/components/layout/LegalDocument";

type PageProps = {
  params: Promise<{ locale: string }>;
};

export default async function TermsPage({ params }: PageProps) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("legal");
  const sections = t.raw("termsSections") as { title: string; body: string }[];

  return (
    <LegalDocument
      kicker="Legal"
      title={t("termsTitle")}
      updated={t("updated")}
      sections={sections}
    />
  );
}
