/** @type {import("next").NextConfig} */

const withBundleAnalyzer = require("@next/bundle-analyzer")({
  enabled: process.env.ANALYZE === "true",
});

const config = {
  images: {
    domains: [
      "dummyjson.com",
      "storage.googleapis.com",
      "firebasestorage.googleapis.com",
    ],
  },

  /**
   * If you have the "experimental: { appDir: true }" setting enabled, then you
   * must comment the below `i18n` config out.
   *
   * @see https://github.com/vercel/next.js/issues/41980
   */
  i18n: {
    locales: ["en"],
    defaultLocale: "en",
  },
};

module.exports = withBundleAnalyzer(config);
