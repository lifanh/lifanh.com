# AI Agent Instructions for lifanh.com

This document provides global guidelines for AI coding agents working on this repository.

## Project Overview

This is a personal website built with Astro, based on the ThoughtLite theme template. It's a content-focused static site with blog posts, notes, and personal information.

**Key Information:**
- Owner: Lifan Huang (lifanh)
- Site URL: https://lifanh.com
- License: GPL-3.0
- Primary Language: TypeScript
- Framework: Astro 5.x
- UI Framework: Svelte 5.x
- Styling: Tailwind CSS 4.x
- Code Quality: Biome

## Development Commands

**IMPORTANT**: Always run these commands in the repository root directory. Use these exact commands:

### Essential Commands
```bash
# Install dependencies
npm install

# Start development server (http://localhost:4321)
npm run dev

# Type checking
npm run check

# Build for production
npm run build

# Preview production build
npm run preview
```

### Code Quality Commands
```bash
# Format code with Biome
npm run format

# Lint code with Biome
npm run lint
```

### Content Creation
```bash
# Create new content file (interactive)
npm run new
```

### Design Tokens
```bash
# Build design tokens
npm run tokens:build
```

**No test suite** - validate changes with `npm run check` and manual testing.

## Code Style and Formatting

### Formatter Configuration
- **Biome** is the primary formatter and linter
- Pre-commit hooks via Husky + lint-staged run Biome automatically on staged files

### Style Rules (from biome.json)
- **Indentation**: 2 spaces
- **Line Width**: 150 characters
- **Line Ending**: LF
- **Bracket Spacing**: Enabled
- **Quote Style**: Double quotes
- **Semicolons**: Always
- **Trailing Commas**: None
- **Arrow Parentheses**: As needed

### TypeScript
- Strict mode enabled (extends `astro/tsconfigs/strict`)
- Use explicit types where beneficial
- `noExplicitAny` is off - avoid `any` when possible but not strictly enforced

### Naming Conventions
- Use camelCase for variables and functions
- Use PascalCase for components and classes
- strictCase warnings enabled (not errors)

## Project Structure

### Directory Layout
```
/
├── public/               # Static assets
├── scripts/              # Build and utility scripts
├── src/
│   ├── components/       # Reusable UI components (Svelte/Astro)
│   ├── content/          # Content collections (Markdown/MDX)
│   │   ├── note/         # Long-form blog posts
│   │   ├── jotting/      # Short-form posts
│   │   ├── information/  # Site information pages
│   │   └── preface/      # Homepage preface
│   ├── graph/            # OG image generation (Satori + Sharp)
│   ├── i18n/             # Internationalization files (YAML)
│   ├── layouts/          # Page layouts (App, Base, Footer, header/)
│   ├── pages/            # Astro pages (routes)
│   ├── styles/           # Global styles
│   ├── tokens/           # Design tokens (JSON, processed by Style Dictionary)
│   └── utils/            # Utility functions and helpers
│       └── remark/       # Custom markdown plugins
├── astro.config.ts       # Astro configuration, markdown plugins
├── site.config.ts        # Site metadata, author info, i18n, feed config
├── biome.json            # Biome configuration
└── tsconfig.json         # TypeScript configuration
```

### Path Aliases (tsconfig.json)
Use these path aliases for imports:
- `$config` → `site.config.ts`
- `$i18n` → `src/i18n/index`
- `$utils/*`, `$components/*`, `$layouts/*`, `$graph/*`, `$icons/*`, `$styles/*`, `$public/*`, `$assets/*`

## Content System

### Content Collections (`src/content/`)

| Collection | Purpose | Schema Fields |
|------------|---------|---------------|
| **note** | Long-form articles | title, timestamp, series, tags, description, toc, top, draft, sensitive |
| **jotting** | Short-form posts | title, timestamp, tags, description, top, draft, sensitive |
| **preface** | Homepage intro | timestamp |
| **information** | Static pages | No schema (flexible) |

- Files prefixed with `_` are excluded from collections
- Frontmatter requires: `title`, `timestamp` (ISO format with timezone)

### Multilingual Support
- Supported languages: English (en), Simplified Chinese (zh-cn), Japanese (ja)
- Default language: English (no URL prefix)
- Translation files: `src/i18n/<locale>/index.yaml`

### i18n Usage
```typescript
import i18nit from "$i18n";
const t = i18nit("en");
const text = t("key.path");
```

## Routing (`src/pages/`)

- `[...locale]/` - Dynamic locale routing (index, note/[slug], jotting/[slug], about, policy, feed.xml)
- `graph.png.ts`, `robots.txt.ts` - Generated files
- `404.astro`, `500.astro` - Error pages

**Locale Routing**: Default locale (en) has no prefix; others get locale prefix (e.g., `/zh-cn/note/...`).

## Markdown Pipeline

Configured in `astro.config.ts`. Key features:
- GFM, math (KaTeX), footnotes, tables, alerts
- CJK-friendly processing, ruby annotations
- Code highlighting: Shiki (GitHub Light / Dark Plus) with copy button
- Custom plugins in `src/utils/remark/`: abbr, attr, figure, reading, spoiler, table-wrapper

## Boundaries and Restrictions

### DO NOT Modify Without User Confirmation
- `site.config.ts` - Personal site configuration
- `src/content/` - Personal content
- `src/i18n/` - Multilingual content (requires consistency across locales)
- `biome.json` - Code style standards

### NEVER Modify
- `package-lock.json` (only via `npm install`)
- `.git/`, `node_modules/`, `dist/`

## Dependencies

Use npm: `npm install <package>`. Prefer actively maintained, TypeScript-compatible, lightweight packages. Consider GPL-3.0 license compatibility.

### Core Stack
Astro 5.x, Svelte 5.x, Tailwind CSS 4.x, TypeScript, Biome, MDX, Luxon, Shiki, Swup, Satori + Sharp

## Common Tasks

### Adding a New Component
1. Create in `src/components/`
2. Use Svelte (.svelte) for interactive, Astro (.astro) for static
3. Follow existing patterns

### Modifying Markdown Processing
- Remark/Rehype plugins: Edit `astro.config.ts` → `markdown.remarkPlugins` / `markdown.rehypePlugins`
- Custom plugins: Add to `src/utils/remark/`

## Git Workflow

Use [Conventional Commits](https://www.conventionalcommits.org/): `<type>[(<scope>)]: <description>`

Types: feat, fix, docs, style, refactor, test, chore

Pre-commit hooks run Biome automatically on staged files.

## Deployment

- Static site generation (SSG)
- Build: `npm run build` → Output: `dist/`
- Platform: Cloudflare Workers (see `wrangler.jsonc`)

## Additional Notes

- Prioritize simplicity and maintainability
- Performance matters - keep bundle sizes small
- Supports light/dark mode automatically
- Open Graph meta tags configured for social sharing
