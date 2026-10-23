"use client";

import { useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import { LocaleCurrencySwitcher } from "@/components/layout/LocaleCurrencySwitcher";
import { CartNavLink } from "@/components/layout/CartNavLink";
import { ShippingCountrySelect } from "@/components/layout/ShippingCountrySelect";
import { HeaderVendorSelect } from "@/components/layout/VendorSelect";
import { appConfig } from "../../../config/interior-design.config";

const allLinks = [
  { href: "/marketplace", key: "marketplace" as const },
  { href: "/ai-studio", key: "aiStudio" as const },
  { href: "/studio", key: "studio" as const },
  { href: "/returns", key: "returns" as const },
];

export function SiteHeader() {
  const t = useTranslations("nav");
  const pathname = usePathname();
  const isHome = pathname === "/";
  const links = isHome
    ? allLinks.filter((link) => link.key !== "returns")
    : allLinks;

  return (
    <header className="fixed inset-x-0 top-0 z-40 border-b border-white/8 bg-ink/85 backdrop-blur-2xl">
      <div className="mx-auto flex h-14 max-w-6xl items-center gap-3 px-5">
        <Link
          href="/"
          className="shrink-0 font-serif text-[12px] tracking-[0.12em] text-linen sm:text-[15px]"
        >
          {appConfig.name}
        </Link>
        <nav className="hidden min-w-0 flex-1 items-center justify-center gap-5 overflow-hidden text-[11px] uppercase tracking-[0.16em] text-linen/60 md:flex">
          {links.map((link) => {
            const active = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={
                  active
                    ? "shrink-0 text-brass"
                    : "shrink-0 transition-colors hover:text-linen"
                }
              >
                {t(link.key)}
              </Link>
            );
          })}
          <CartNavLink />
        </nav>
        <div className="ml-auto flex shrink-0 items-center gap-1.5">
          {!isHome ? <ShippingCountrySelect /> : null}
          {!isHome ? <HeaderVendorSelect /> : null}
          <LocaleCurrencySwitcher languagesOnly={isHome} />
        </div>
      </div>
    </header>
  );
}
