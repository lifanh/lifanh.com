# Design Tokens

This project uses a centralized design token system powered by [Style Dictionary](https://amzn.github.io/style-dictionary/) to maintain consistent design values across the codebase.

## Overview

Design tokens are the visual design atoms of the design system — specifically, they are named entities that store visual design attributes. They provide a single source of truth for design values like colors, spacing, typography, and more.

## Token Categories

### Colors (`src/tokens/colors.json`)

Theme-aware color tokens that automatically switch between light and dark modes:

- **Primary colors**: `--primary-color`, `--secondary-color`
- **Text colors**: `--remark-color` (less prominent text), `--weak-color` (subtle text)
- **Background colors**: `--background-color`, `--block-color`
- **Utility colors**: `--shadow-color`, `--selection-color`

Each color has both light and dark variants (e.g., `--primary-color-light`, `--primary-color-dark`).

### Typography (`src/tokens/typography.json`)

Font family tokens:

- `--font-serif`: Serif fonts for body text
- `--font-monospace`: Monospace fonts for code
- `--font-cursive`: Cursive fonts for special elements

### Spacing (`src/tokens/spacing.json`)

Consistent spacing scale:

- `--spacing-xs`: 4px
- `--spacing-sm`: 8px
- `--spacing-md`: 16px
- `--spacing-lg`: 24px
- `--spacing-xl`: 32px
- `--spacing-2xl`: 48px
- `--spacing-3xl`: 64px

### Border Radius (`src/tokens/radius.json`)

Border radius tokens for rounded corners:

- `--radius-none`: 0
- `--radius-sm`: 4px
- `--radius-md`: 8px
- `--radius-lg`: 12px
- `--radius-xl`: 16px
- `--radius-full`: 9999px (perfect circles)

### Shadows (`src/tokens/shadows.json`)

Box shadow tokens that use `--shadow-color` for theme consistency:

- `--shadow-sm`: Small subtle shadow
- `--shadow-md`: Medium shadow
- `--shadow-lg`: Large shadow
- `--shadow-xl`: Extra large shadow

### Motion (`src/tokens/motion.json`)

Animation and transition tokens:

**Duration:**
- `--duration-fast`: 100ms
- `--duration-normal`: 200ms
- `--duration-slow`: 300ms
- `--duration-slower`: 500ms

**Easing:**
- `--ease-in`: Cubic bezier for ease-in
- `--ease-out`: Cubic bezier for ease-out
- `--ease-in-out`: Cubic bezier for ease-in-out

## Using Tokens

### In CSS

Tokens are available as CSS custom properties:

```css
.my-component {
  color: var(--primary-color);
  padding: var(--spacing-md);
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-md);
  transition: all var(--duration-normal) var(--ease-out);
}
```

### In Tailwind CSS

Tokens are exposed in Tailwind's `@theme` block and can be used with Tailwind utilities:

```html
<!-- Using semantic color tokens -->
<div class="bg-background text-primary p-spacing-md rounded-radius-lg shadow-shadow-md">
  Content
</div>

<!-- Tailwind also provides its own spacing/sizing utilities that will work -->
<div class="p-4 rounded-lg">
  Content
</div>
```

## Modifying Tokens

### Adding or Updating Tokens

1. **Edit the JSON files** in `src/tokens/`:
   - For colors: Edit `colors.json`
   - For spacing: Edit `spacing.json`
   - etc.

2. **Run the build command**:
   ```bash
   npm run tokens:build
   ```

3. **The generated file** (`src/styles/tokens.css`) will be automatically updated and imported in `global.css`.

### Example: Adding a New Spacing Token

Edit `src/tokens/spacing.json`:

```json
{
  "spacing": {
    "xs": { "value": "4px", "type": "spacing" },
    "4xl": { "value": "96px", "type": "spacing" }  // Add this line
  }
}
```

Then rebuild:

```bash
npm run tokens:build
```

The new `--spacing-4xl` token will be available as a CSS custom property.

## Token Structure

### JSON Format

Tokens follow the Style Dictionary format:

```json
{
  "category": {
    "token-name": {
      "value": "actual-value",
      "type": "token-type"
    }
  }
}
```

**Important fields:**
- `value`: The actual CSS value
- `type`: Describes the token type (color, spacing, fontFamily, etc.)

### Light/Dark Theme Structure

Color tokens have a special structure for theme support:

```json
{
  "color": {
    "light": {
      "primary": { "value": "#2a2a28", "type": "color" }
    },
    "dark": {
      "primary": { "value": "#dddddb", "type": "color" }
    }
  }
}
```

This generates:
- `--primary-color-light`: Light theme value
- `--primary-color-dark`: Dark theme value
- `--primary-color`: Automatically switches based on theme

## Build Process

### NPM Scripts

- `npm run tokens:build` - Build tokens from JSON to CSS
- `npm run tokens:watch` - Watch for token changes and rebuild (optional)
- `npm run dev` - Includes token build before starting dev server
- `npm run build` - Includes token build before production build

### Generated Files

The build process generates:
- `src/styles/tokens.css` - CSS custom properties (auto-generated, not tracked in git)

**Note**: `tokens.css` is generated and should not be edited manually. Edit the source JSON files instead.

## Configuration

The token build process is configured in `style-dictionary.config.mjs`. This file defines:
- Source token files
- Output formats and destinations
- Custom transforms and formatters

## Theme Switching

The token system supports automatic theme switching based on:

1. **System preference**: Uses `@media (prefers-color-scheme: dark)`
2. **Manual override**: Uses `[data-theme="light"]` or `[data-theme="dark"]` attributes

Example:
```html
<html data-theme="dark">
  <!-- Content will use dark theme tokens -->
</html>
```

## Best Practices

1. **Always use tokens**: Prefer tokens over hardcoded values for consistency
2. **Edit source files**: Only edit JSON files in `src/tokens/`, never the generated CSS
3. **Rebuild after changes**: Run `npm run tokens:build` after modifying tokens
4. **Semantic naming**: Use descriptive names that convey purpose (e.g., `primary` not `blue`)
5. **Test both themes**: When adding colors, test in both light and dark modes

## Integration with Existing Code

The token system is integrated into:
- **`src/styles/global.css`**: Imports `tokens.css`
- **`src/styles/tailwind.css`**: Exposes tokens in `@theme` block
- **Build process**: Runs `tokens:build` before `dev` and `build` commands

All existing CSS custom properties from the original `global.css` have been migrated to the token system, ensuring backward compatibility.

## Troubleshooting

**Issue**: Tokens not updating after editing JSON files
- **Solution**: Run `npm run tokens:build` to regenerate `tokens.css`

**Issue**: Build failing
- **Solution**: Ensure all JSON files have valid syntax. Check `style-dictionary.config.mjs` for configuration errors.

**Issue**: Tokens not available in CSS
- **Solution**: Verify that `src/styles/global.css` imports `./tokens.css`

## Resources

- [Style Dictionary Documentation](https://amzn.github.io/style-dictionary/)
- [Design Tokens Community Group](https://www.w3.org/community/design-tokens/)
- [CSS Custom Properties (MDN)](https://developer.mozilla.org/en-US/docs/Web/CSS/--*)
