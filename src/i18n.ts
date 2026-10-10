import { getRequestConfig } from 'next-intl/server';
import { routing } from './i18n/routing';

export default getRequestConfig(async ({ locale }) => {
  let activeLocale = locale;
  if (!activeLocale || !routing.locales.includes(activeLocale as any)) {
    activeLocale = routing.defaultLocale;
  }

  let messages;
  switch (activeLocale) {
    case 'ro':
      messages = (await import('./i18n/messages/ro.json')).default;
      break;
    default:
      messages = (await import('./i18n/messages/en.json')).default;
      break;
  }

  return {
    locale: activeLocale,
    messages
  };
});
