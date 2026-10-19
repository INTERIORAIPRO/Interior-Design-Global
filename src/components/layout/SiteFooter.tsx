"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { appConfig } from "../../../config/interior-design.config";

export function SiteFooter() {
  const t = useTranslations("legal");

  return (
    <footer className="border-t border-white/5 bg-ink">
      <div className="mx-auto max-w-6xl px-6 py-8">
        <p className="max-w-3xl text-xs leading-relaxed text-neutral-500">
          {t("affiliateDisclosure")}
        </p>
        <nav className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-xs text-neutral-500">
          <Link href="/privacy" className="hover:text-neutral-400">
            {t("privacy")}
          </Link>
          <Link href="/terms" className="hover:text-neutral-400">
            {t("terms")}
          </Link>
        </nav>
        <p className="mt-5 text-[11px] text-neutral-600">
          © 2026 {appConfig.name}
        </p>
      </div>
    </footer>
  );
}
