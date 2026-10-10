import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./src/i18n.ts');

/** @type {import('next').NextCoreConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
};

export default withNextIntl(nextConfig);
