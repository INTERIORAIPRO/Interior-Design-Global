export const DISPLAY_CURRENCIES = ["EUR", "USD", "RON", "GBP"] as const;
export type DisplayCurrency = (typeof DISPLAY_CURRENCIES)[number];

export const HEADER_LOCALES = ["ro", "en", "de", "fr", "es"] as const;
export type HeaderLocale = (typeof HEADER_LOCALES)[number];

const EUR_RATES: Record<DisplayCurrency, number> = {
  EUR: 1,
  USD: 1.08,
  RON: 4.97,
  GBP: 0.86,
};

export function isDisplayCurrency(value: string | null | undefined): value is DisplayCurrency {
  return Boolean(value && DISPLAY_CURRENCIES.includes(value as DisplayCurrency));
}

export function convertPrice(amount: number, from: string | undefined, to: DisplayCurrency) {
  const source = isDisplayCurrency(from) ? from : "EUR";
  const euros = amount / EUR_RATES[source];
  return euros * EUR_RATES[to];
}

export function currencyForLocaleCountry(
  locale: string,
  countryId?: string,
): DisplayCurrency {
  if (countryId === "RO" || locale === "ro") return "RON";
  if (countryId === "UK") return "GBP";
  if (countryId === "US" || countryId === "CA") return "USD";
  return "EUR";
}

export function detectBrowserMarket() {
  const lang = navigator.language.toLowerCase();
  const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
  if (lang.startsWith("ro") || tz === "Europe/Bucharest") {
    return { locale: "ro" as const, country: "RO" as const, currency: "RON" as const };
  }
  if (lang.startsWith("de") || tz === "Europe/Berlin") {
    return { locale: "de" as const, country: "DE" as const, currency: "EUR" as const };
  }
  if (lang.startsWith("fr") || tz === "Europe/Paris") {
    return { locale: "fr" as const, country: "FR" as const, currency: "EUR" as const };
  }
  if (lang.startsWith("es") || tz === "Europe/Madrid") {
    return { locale: "es" as const, country: "ES" as const, currency: "EUR" as const };
  }
  if (lang.startsWith("en-gb") || tz === "Europe/London") {
    return { locale: "en" as const, country: "UK" as const, currency: "GBP" as const };
  }
  if (lang.startsWith("en-us") || tz.startsWith("America/")) {
    return { locale: "en" as const, country: "US" as const, currency: "USD" as const };
  }
  return { locale: "en" as const, country: "DE" as const, currency: "EUR" as const };
}
