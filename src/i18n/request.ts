import { getRequestConfig } from "next-intl/server";
import { routing } from "./routing";

async function loadMessages(locale: string) {
  switch (locale) {
    case "en":
      return (await import("./messages/en.json")).default;
    case "fr":
      return (await import("./messages/fr.json")).default;
    case "de":
      return (await import("./messages/de.json")).default;
    case "es":
      return (await import("./messages/es.json")).default;
    case "it":
      return (await import("./messages/it.json")).default;
    default:
      return (await import("./messages/ro.json")).default;
  }
}

export default getRequestConfig(async ({ requestLocale }) => {
  let locale = await requestLocale;
  if (!locale || !routing.locales.includes(locale as (typeof routing.locales)[number])) {
    locale = routing.defaultLocale;
  }

  return {
    locale,
    messages: await loadMessages(locale),
  };
});
