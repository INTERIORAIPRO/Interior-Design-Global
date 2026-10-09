"use client";

import { useLocale } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import { useIsMounted } from "@/lib/useIsMounted";

export function LocaleSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const isMounted = useIsMounted();

  if (!isMounted) {
    return (
      <span className="rounded-full border border-white/15 px-3 py-1.5 text-xs uppercase tracking-widest text-linen/60">
        {locale}
      </span>
    );
  }

  return (
    <label className="flex items-center gap-2 text-xs uppercase tracking-[0.18em] text-linen/60">
      <span className="hidden sm:inline">Lang</span>
      <select
        value={locale}
        onChange={(event) => {
          router.replace(pathname, { locale: event.target.value });
        }}
        className="rounded-full border border-white/15 bg-white/5 px-3 py-1.5 text-xs uppercase tracking-widest text-linen outline-none"
      >
        {routing.locales.map((code) => (
          <option key={code} value={code} className="text-ink">
            {code}
          </option>
        ))}
      </select>
    </label>
  );
}
