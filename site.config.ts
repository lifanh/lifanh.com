import siteConfig from "./src/utils/config";

const config = siteConfig({
  title: "Lifan",
  prologue: "Welcome to my personal site.",
  author: {
    name: "Lifan",
    email: "i@lifanh.com",
    link: "https://lifanh.com"
  },
  description: "Lifan's personal website and blog.",
  copyright: {
    type: "CC BY-NC-ND 4.0",
    year: "2025"
  },
  i18n: {
    locales: ["en", "zh-cn", "ja"],
    defaultLocale: "en"
  },
  feed: {
    section: "*",
    limit: 20
  },
  latest: "*"
});

export const monolocale = Number(config.i18n.locales.length) === 1;

export default config;
