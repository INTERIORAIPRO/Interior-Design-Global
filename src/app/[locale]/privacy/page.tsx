import { getTranslations, setRequestLocale } from "next-intl/server";
import { LegalDocument } from "@/components/layout/LegalDocument";

type PageProps = {
  params: Promise<{ locale: string }>;
};

export default async function PrivacyPage({ params }: PageProps) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("legal");
  const sections = t.raw("privacySections") as { title: string; body: string }[];

  return (
    <LegalDocument
      kicker="GDPR"
      title={t("privacyTitle")}
      updated={t("updated")}
      sections={sections}
    />
  );
}
