"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { appConfig } from "../../../config/interior-design.config";

export function SiteFooter() {
  const t = useTranslations("legal");

  return (
    <footer className="border-t border-white/10 bg-ink">
      <div className="mx-auto max-w-6xl px-6 py-10">
        <p className="max-w-3xl text-sm leading-relaxed text-linen/70">
          {t("affiliateDisclosure")}
        </p>
        <nav className="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-sm">
          <Link href="/privacy" className="text-brass hover:underline">
            {t("privacy")}
          </Link>
          <Link href="/terms" className="text-brass hover:underline">
            {t("terms")}
          </Link>
        </nav>
        <p className="mt-6 text-xs text-linen/40">
          © 2026 {appConfig.name}
        </p>
      </div>
    </footer>
  );
}
