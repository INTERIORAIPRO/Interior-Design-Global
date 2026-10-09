import type { ReactNode } from "react";
import { Link } from "@/i18n/navigation";

const items = [
  { href: "/vendor", label: "Overview" },
  { href: "/vendor/products", label: "Products" },
];

export function VendorShell({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <main className="mx-auto max-w-6xl px-6 pb-24 pt-28">
      <p className="text-xs uppercase tracking-[0.28em] text-brass">Partners</p>
      <h1 className="mt-3 font-serif text-5xl text-linen">{title}</h1>
      <nav className="mt-6 flex gap-4 text-sm">
        {items.map((item) => (
          <Link key={item.href} href={item.href} className="text-linen/70 hover:text-brass">
            {item.label}
          </Link>
        ))}
      </nav>
      <div className="mt-8">{children}</div>
    </main>
  );
}
