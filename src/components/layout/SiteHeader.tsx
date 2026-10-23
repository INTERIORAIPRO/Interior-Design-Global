"use client";

import { useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import { LocaleSwitcher } from "@/components/layout/LocaleSwitcher";
import { CartNavLink } from "@/components/layout/CartNavLink";
import { ShippingCountrySelect } from "@/components/layout/ShippingCountrySelect";
import { HeaderVendorSelect } from "@/components/layout/VendorSelect";
import { appConfig } from "../../../config/interior-design.config";

const links = [
  { href: "/marketplace", key: "marketplace" as const },
  { href: "/ai-studio", key: "aiStudio" as const },
  { href: "/studio", key: "studio" as const },
  { href: "/returns", key: "returns" as const },
];

export function SiteHeader() {
  const t = useTranslations("nav");
  const pathname = usePathname();

  return (
    <header className="fixed inset-x-0 top-0 z-40 border-b border-white/8 bg-ink/85 backdrop-blur-2xl">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between gap-4 px-5">
        <Link
          href="/"
          className="shrink-0 font-serif text-lg tracking-[0.04em] text-linen"
        >
          {appConfig.name}
        </Link>
        <nav className="flex max-w-[46%] items-center gap-4 overflow-x-auto text-[11px] uppercase tracking-[0.16em] text-linen/60 sm:gap-6">
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
        <div className="flex items-center gap-1.5">
          <ShippingCountrySelect />
          <HeaderVendorSelect />
          <LocaleSwitcher />
        </div>
      </div>
    </header>
  );
}
