// @ts-check
import { defineConfig } from 'astro/config';
import { satteri } from '@astrojs/markdown-satteri';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';
import { mermaidPlugin } from './src/lib/markdown/mermaid.js';

// https://astro.build/config
export default defineConfig({
  site: 'https://lifanh.com/',
  integrations: [
    react(),
    sitemap({
      filter: (page) => new URL(page).pathname.replace(/\/+$/, '') !== '/demo',
    }),
  ],
  markdown: {
    syntaxHighlight: {
      type: 'shiki',
      excludeLangs: ['mermaid'],
    },
    processor: satteri({
      hastPlugins: [mermaidPlugin()],
    }),
  },
  vite: {
    plugins: [tailwindcss()],
    ssr: {
      noExternal: ['@lifanh/quiet-paper'],
    },
  },
});
