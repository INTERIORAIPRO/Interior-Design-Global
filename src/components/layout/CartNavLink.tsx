"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import { cartCount, readCart, subscribeCart } from "@/lib/cart/designCart";
import { useIsMounted } from "@/lib/useIsMounted";

export function CartNavLink() {
  const t = useTranslations("nav");
  const pathname = usePathname();
  const isMounted = useIsMounted();
  const [count, setCount] = useState(0);

  useEffect(() => {
    const sync = () => setCount(cartCount(readCart()));
    sync();
    return subscribeCart(sync);
  }, []);

  return (
    <Link
      href="/cart"
      className={pathname === "/cart" ? "text-brass" : "transition-colors hover:text-linen"}
    >
      {t("cart")}
      {isMounted && count > 0 ? (
        <span className="ml-1 rounded-full bg-brass px-1.5 py-0.5 text-[10px] font-medium text-ink">
          {count}
        </span>
      ) : null}
    </Link>
  );
}
