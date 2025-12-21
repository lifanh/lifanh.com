# AI Agent Instructions for lifanh.com

This document provides instructions for AI coding agents working on this repository.

## Project Overview

This is a personal website built with Astro, based on the ThoughtLite theme template. It's a content-focused site with blog posts, notes, and personal information.

**Key Information:**
- Owner: Lifan Huang (lifanh)
- Site URL: https://lifanh.com
- License: GPL-3.0
- Primary Language: TypeScript
- Framework: Astro 5.x
- UI Framework: Svelte 5.x
- Styling: Tailwind CSS 4.x
- Code Quality: Biome + Prettier

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
# Format code (run Prettier first, then Biome)
npm run format

# Lint code
npm run lint
```

### Content Creation
```bash
# Create new content file (interactive)
npm run new
```

## Code Style and Formatting

### Formatter Configuration
1. **Biome** is the primary formatter and linter
2. **Prettier** is used as fallback for Astro and Svelte files (HTMLish code)
3. **Order matters**: Format with Prettier first, then format with Biome

### Style Rules
- **Indentation**: Tabs (width: 4)
- **Line Width**: 150 characters
- **Line Ending**: LF
- **Bracket Spacing**: Enabled
- **Quote Style**: Use project defaults

### TypeScript
- Strict mode enabled
- Use explicit types where beneficial
- Avoid `any` when possible (but it's not strictly enforced)

### Naming Conventions
- Use camelCase for variables and functions
- Use PascalCase for components and classes
- strictCase warnings enabled (not errors)

## Testing Practices

**Note**: This repository does not have a test suite. When adding features:
- Focus on type safety with TypeScript
- Use Astro's built-in type checking: `npm run check`
- Manually test changes in development mode: `npm run dev`

## Project Structure

### Directory Layout
```
/
├── .github/              # GitHub configuration
├── public/               # Static assets
├── scripts/              # Build and utility scripts
├── src/
│   ├── components/       # Reusable UI components (Svelte/Astro)
│   ├── content/          # Content collections (Markdown/MDX)
│   │   ├── note/         # Long-form blog posts
│   │   ├── jotting/      # Short-form posts
│   │   ├── information/  # Site information pages
│   │   └── preface/      # Homepage preface
│   ├── graph/            # GraphQL or data graph utilities
│   ├── i18n/             # Internationalization files (YAML)
│   ├── icons/            # Icon components
│   ├── layouts/          # Page layouts
│   ├── pages/            # Astro pages (routes)
│   ├── styles/           # Global styles
│   └── utils/            # Utility functions and helpers
├── astro.config.ts       # Astro configuration
├── site.config.ts        # Site-specific configuration
├── biome.json            # Biome configuration
└── tsconfig.json         # TypeScript configuration
```

### Key Files
- **`site.config.ts`**: Site metadata, author info, i18n settings, feed configuration
- **`astro.config.ts`**: Astro framework configuration, plugins, markdown processing
- **`.env`**: Environment variables (not committed, use `.env.example` as template)

## Boundaries and Restrictions

### DO NOT Modify
- **`package-lock.json`**: Only modify through `npm install`
- **`.git/`**: Git internals
- **`node_modules/`**: Managed by npm
- **`dist/`**: Build output directory
- **`.github/agents/`**: Agent configuration (restricted access)

### Be Cautious With
- **`site.config.ts`**: Personal site configuration - verify changes with user
- **`src/content/`**: Contains personal content - be careful with modifications
- **i18n files**: Multilingual content requires consistency across all locales
- **`biome.json`** and **`.prettierrc`**: Code style standards

## Dependencies

### Adding New Dependencies
- Use npm: `npm install <package>`
- Prefer packages that are:
  - Actively maintained
  - TypeScript-compatible
  - Lightweight (bundle size matters)
- Consider the GPL-3.0 license compatibility

### Core Technology Stack
- **Astro** 5.x - Core framework
- **Svelte** 5.x - UI components
- **Tailwind CSS** 4.x - Styling
- **TypeScript** - Type safety
- **Biome** - Code quality
- **MDX** - Enhanced Markdown
- **Luxon** - Date/time handling
- **Shiki** - Syntax highlighting
- **Swup** - Page transitions

### Markdown Processing Pipeline
- Remark plugins: GFM, math, footnotes, directives, etc.
- Rehype plugins: Headings, links, KaTeX, etc.
- Custom plugins in `src/utils/remark/`

## Content Guidelines

### Content Types
1. **Notes** (`src/content/note/`): Long-form, carefully crafted articles
2. **Jottings** (`src/content/jotting/`): Short-form, lightweight posts
3. **Information** (`src/content/information/`): About, policy, and informational pages
4. **Preface** (`src/content/preface/`): Homepage introduction

### Multilingual Support
- Supported languages: English (en), Simplified Chinese (zh-cn), Japanese (ja)
- Default language: English
- Content must exist in at least the default locale
- Translation files: `src/i18n/<locale>/index.yaml`

### Frontmatter Requirements
All content files require frontmatter with at minimum:
- `title`: Content title
- `timestamp`: ISO format with timezone
- `description`: Brief description

## Common Tasks

### Adding a Blog Post
```bash
npm run new
# Follow interactive prompts
# File created in src/content/note/<locale>/
```

### Changing Site Configuration
1. Edit `site.config.ts` for site metadata
2. Edit `astro.config.ts` for Astro framework settings
3. Edit `.env` for environment variables (timezone, etc.)

### Adding a New Component
1. Create in `src/components/`
2. Use Svelte (.svelte) for interactive components
3. Use Astro (.astro) for static components
4. Follow existing component patterns

### Modifying Markdown Processing
1. Remark plugins: Edit `astro.config.ts` → `markdown.remarkPlugins`
2. Rehype plugins: Edit `astro.config.ts` → `markdown.rehypePlugins`
3. Custom plugins: Add to `src/utils/remark/` or `src/utils/rehype/`

## Git Workflow

### Commit Convention
Use [Conventional Commits](https://www.conventionalcommits.org/):
```
<type>[(<scope>)]: <description>

Types: feat, fix, docs, style, refactor, test, chore
```

### Pre-commit Hooks
- Husky is configured to run lint-staged
- Biome checks run automatically on staged files

## Deployment

- Static site generation (SSG)
- Deployed on static hosting (likely Vercel or Netlify)
- Build command: `npm run build`
- Output directory: `dist/`

## Additional Notes

- This is a personal site - prioritize simplicity and maintainability
- Performance matters - keep bundle sizes small
- Accessibility is important - follow ARIA guidelines
- The site supports light/dark mode automatically
- Open Graph meta tags are configured for social sharing

## Getting Help

- Astro Docs: https://docs.astro.build/
- ThoughtLite Theme: Based on astro-theme-thought-lite
- Repository Issues: https://github.com/lifanh/lifanh.com/issues
