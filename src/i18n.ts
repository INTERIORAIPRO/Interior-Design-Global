import { getRequestConfig } from 'next-intl/server';
import { routing } from './src/i18n/routing';

export default getRequestConfig(async ({ locale }) => {
  let activeLocale = locale;
  if (!activeLocale || !routing.locales.includes(activeLocale as any)) {
    activeLocale = routing.defaultLocale;
  }

  return {
    locale: activeLocale,
    messages: (await import(`./messages/${activeLocale}.json`)).default
  };
});