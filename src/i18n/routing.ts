import { defineRouting } from 'next-intl/routing';
import { createNavigation } from 'next-intl/navigation';

export const routing = defineRouting({
  locales: ['en', 'ro', 'fr', 'de', 'es', 'it'],
  defaultLocale: 'ro'
});

export const { Link, redirect, usePathname, useRouter, getPathname } =
  createNavigation(routing);
