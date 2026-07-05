// @ts-check
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import svelte from "@astrojs/svelte";
import yaml from "@rollup/plugin-yaml";
import swup from "@swup/astro";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig, fontProviders } from "astro/config";

import { rehypeHeadingIds as ids, unified } from "@astrojs/markdown-remark";
import sectionize from "@hbsnow/rehype-sectionize";
import figure from "@tuyuritio/rehype-image-figure";
import wrapper from "@tuyuritio/rehype-table-wrapper";
import abbr from "@tuyuritio/remark-abbreviation";
import attr from "@tuyuritio/remark-attribute";
import alerts from "@tuyuritio/remark-github-alert";
import ruby from "@tuyuritio/remark-ruby";
import spoiler from "@tuyuritio/remark-spoiler";
import copy from "@tuyuritio/shiki-code-copy";
import anchor from "rehype-autolink-headings";
import links from "rehype-external-links";
import katex from "rehype-katex";
import CJK from "remark-cjk-friendly";
import CJKStrikethrough from "remark-cjk-friendly-gfm-strikethrough";
import { remarkExtendedTable as table, extendedTableHandlers as tableHandler } from "remark-extended-table";
import mark from "remark-flexible-markers";
import footnote from "remark-footnotes-extra";
import gemoji from "remark-gemoji";
import GFM from "remark-gfm";
import ins from "remark-ins";
import math from "remark-math";

import mermaid from "./src/utils/mermaid";
import reading from "./src/utils/reading";

import siteConfig from "./site.config";
// import ZeoSevenFonts from "./src/fonts/zeo-seven-fonts";

// https://astro.build/config
export default defineConfig({
  site: "https://lifanh.com",
  trailingSlash: "never",
  i18n: {
    ...siteConfig.i18n,
    routing: {
      redirectToDefaultLocale: false,
      prefixDefaultLocale: false
    }
  },
  markdown: {
    processor: unified({
      remarkPlugins: [
        [GFM, { singleTilde: false }],
        ins,
        mark,
        spoiler,
        CJK,
        [CJKStrikethrough, { singleTilde: false }],
        ruby,
        attr,
        math,
        gemoji,
        footnote,
        abbr,
        [table, { colspanWithEmpty: true }],
        [alerts, { typeFormat: "capitalize" }],
        reading,
        mermaid
      ],
      remarkRehype: {
        footnoteLabel: null,
        footnoteLabelTagName: "p",
        footnoteLabelProperties: {
          className: ["hidden"]
        },
        handlers: {
          ...tableHandler
        }
      },
      rehypePlugins: [
        ids,
        [anchor, { behavior: "wrap" }],
        [links, { target: "_blank", rel: ["nofollow", "noopener", "noreferrer"] }],
        katex,
        figure,
        wrapper,
        sectionize
      ],
      smartypants: false
    }),
    shikiConfig: {
      themes: {
        light: "github-light",
        dark: "dark-plus"
      },
      transformers: [copy({ duration: 1500 })]
    }
  },
  vite: {
    plugins: [yaml(), tailwindcss()]
  },
  integrations: [
    svelte(),
    mdx(),
    sitemap(),
    swup({
      globalInstance: true,
      preload: false,
      smoothScrolling: false,
      progress: true
    })
  ],
  fonts: [
    {
      name: "Newsreader",
      provider: fontProviders.google(),
      weights: [400, 500, 700],
      styles: ["normal", "italic"],
      optimizedFallbacks: false,
      fallbacks: ["Garamond", "Georgia", "Times New Roman", "serif"],
      cssVariable: "--font-newsreader"
    },
    {
      name: "IBM Plex Sans",
      provider: fontProviders.google(),
      weights: [300, 400, 600],
      optimizedFallbacks: false,
      fallbacks: ["Helvetica Neue", "Arial", "system-ui", "sans-serif"],
      cssVariable: "--font-ibm-plex-sans"
    },
    {
      name: "IBM Plex Mono",
      provider: fontProviders.google(),
      weights: [400, 500],
      optimizedFallbacks: false,
      fallbacks: ["Consolas", "Monaco", "Courier New", "monospace"],
      cssVariable: "--font-ibm-plex-mono"
    },
    {
      name: "Noto Serif SC",
      provider: fontProviders.google(),
      weights: [400, 700],
      optimizedFallbacks: false,
      fallbacks: ["Noto Serif SC", "Source Han Serif SC", "STSong", "Songti SC", "SimSun", "serif"],
      cssVariable: "--font-noto-serif-sc"
    },
    {
      name: "Noto Serif JP",
      provider: fontProviders.google(),
      weights: [400, 700],
      optimizedFallbacks: false,
      fallbacks: ["Noto Serif JP", "Source Han Serif JP", "Hiragino Mincho ProN", "MS Mincho", "serif"],
      cssVariable: "--font-noto-serif-jp"
    },
    {
      name: "Playwrite MX",
      provider: fontProviders.google(),
      weights: [100],
      display: "block",
      subsets: ["fallback"],
      fallbacks: ["Apple Chancery", "Segoe Script", "cursive"],
      cssVariable: "--font-playwrite-mx"
    }
    // TODO: Re-enable when ZeoSeven font CDN is accessible
    // {
    // 	name: "Maple Mono NF CN",
    // 	provider: ZeoSevenFonts(),
    // 	optimizedFallbacks: false,
    // 	fallbacks: [
    // 		"Maple Mono NF CN",
    // 		"Maple Mono NF",
    // 		"Maple Mono CN",
    // 		"Maple Mono",
    // 		"Consolas",
    // 		"Monaco",
    // 		"Cascadia Code",
    // 		"Courier New",
    // 		"monospace"
    // 	],
    // 	cssVariable: "--font-maple-mono-nf-cn"
    // },
    // {
    // 	name: "The Peak Font Plus",
    // 	provider: ZeoSevenFonts(),
    // 	optimizedFallbacks: false,
    // 	fallbacks: ["Georgia", "STSong", "serif"],
    // 	cssVariable: "--font-the-peak-font-plus"
    // }
  ]
});
