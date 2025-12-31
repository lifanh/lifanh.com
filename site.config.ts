import siteConfig from "./src/utils/config";

const config = siteConfig({
  title: "Lifan Huang",
  prologue: "Hey, welcome to my personal website.",
  author: {
    name: "Lifan Huang",
    email: "i@lifanh.com",
    link: "https://lifanh.com"
  },
  description: "Lifan's website.",
  copyright: {
    type: "CC BY-NC-ND 4.0",
    year: "2025"
  },
  i18n: {
    locales: ["en"],
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
