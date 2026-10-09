"use client";

import { useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import { LocaleSwitcher } from "@/components/layout/LocaleSwitcher";
import { CartNavLink } from "@/components/layout/CartNavLink";
import { appConfig } from "../../../config/interior-design.config";

const links = [
  { href: "/marketplace", key: "marketplace" as const },
  { href: "/ai-studio", key: "aiStudio" as const },
  { href: "/studio", key: "studio" as const },
  { href: "/vendor", key: "vendors" as const },
  { href: "/returns", key: "returns" as const },
];

export function SiteHeader() {
  const t = useTranslations("nav");
  const pathname = usePathname();

  return (
    <header className="fixed inset-x-0 top-0 z-40 border-b border-white/10 bg-ink/70 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        <Link href="/" className="font-serif text-xl tracking-tight text-linen">
          {appConfig.name}
        </Link>
        <nav className="flex items-center gap-4 overflow-x-auto text-xs text-linen/75 sm:gap-7 sm:text-sm">
          {links.map((link) => {
            const active = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={
                  active
                    ? "text-brass"
                    : "transition-colors hover:text-linen"
                }
              >
                {t(link.key)}
              </Link>
            );
          })}
          <CartNavLink />
        </nav>
        <LocaleSwitcher />
      </div>
    </header>
  );
}
