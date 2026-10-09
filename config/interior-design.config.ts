export const locales = ["en", "ro", "fr", "de", "es", "it"] as const;
export type AppLocale = (typeof locales)[number];

export const appConfig = {
  name: "Interior Design Global",
  tagline: "International interior design marketplace",
  defaultLocale: "en" as AppLocale,
  locales,
  commerce: {
    defaultCurrency: "EUR",
    supportedCurrencies: ["EUR", "USD", "GBP", "RON"] as const,
  },
  features: {
    marketplace: true,
    vendorPortal: true,
    returns: true,
    engine3d: true,
    multilingual: true,
    aiRender: true,
    photorealAiEngine: true,
  },
  engine3d: {
    defaultQuality: "high" as const,
    maxSceneObjects: 250,
    enableRealtimePreview: true,
  },
  vendors: {
    defaultCommissionPercent: 12,
    onboardingRequired: true,
    primaryStoreId: "vnd_the_home",
  },
  returns: {
    windowDays: 14,
    restockingFeePercent: 0,
  },
} as const;

export type AppConfig = typeof appConfig;
