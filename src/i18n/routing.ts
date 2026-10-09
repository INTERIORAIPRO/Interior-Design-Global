import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["en", "ro", "fr", "de", "es", "it"],
  defaultLocale: "en",
  localePrefix: "always",
});
