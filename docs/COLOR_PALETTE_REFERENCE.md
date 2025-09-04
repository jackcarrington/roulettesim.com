# Color Palette Reference

## Overview
Roulettesim.com uses a modern OKLCH-based color system with automatic light/dark mode support via CSS `light-dark()` function.

## Brand Colors
```scss
--brand-primary: #d648ff;    // Purple - primary brand color
--brand-secondary: #00d1b7;  // Teal - secondary brand color  
--brand-neutral: #b9bec4;    // Gray - neutral base
```

## Semantic Color Variables
**Always use these instead of hardcoded colors:**

### Core Colors
```scss
--foreground-color: light-dark(var(--color-neutral-800), var(--color-neutral-100));
--background-color: light-dark(var(--color-neutral-100), var(--color-neutral-900));
--icon-color: light-dark(var(--color-neutral-800), var(--color-neutral-100));
```

### Interactive Elements
```scss
--link-color: light-dark(var(--color-primary-400), var(--color-secondary-100));
--link-hover-color: light-dark(var(--color-primary-300), var(--color-secondary-200));
```

### Borders & UI
```scss
--border-color: light-dark(var(--color-neutral-900), var(--color-neutral-100));
--border-color-subtle: light-dark(var(--color-neutral-300), var(--color-neutral-800));
```

## Generated Palette Scale
Each brand color auto-generates a 100-500 scale using OKLCH:
- `--color-primary-100` through `--color-primary-500`
- `--color-secondary-100` through `--color-secondary-500`  
- `--color-neutral-100` through `--color-neutral-900`

## Dark Mode Configuration
- **Tailwind**: `darkMode: ['class', '.darkmode']`
- **CSS**: `.darkmode { color-scheme: dark; }`
- **Component**: Uses accessible-astro-components `DarkMode` toggle

## ⚠️ Issues Found During Audit

### Inconsistent Color Usage
Many components still use hardcoded Tailwind classes that don't adapt to dark mode:

**Replace these patterns:**
- `text-gray-600` → `style="color: var(--foreground-color); opacity: 0.8;"`
- `bg-gray-50` → `style="background-color: var(--color-neutral-200);"`
- `text-blue-600` → `style="color: var(--link-color);"`
- `bg-blue-600` → `style="background-color: var(--color-primary-400);"`
- `text-red-800` → `style="color: var(--color-primary-500);"` (for errors)

### Components Needing Updates
1. **GameLibrary.astro** - Blue buttons and gray text
2. **VariantSelector.astro** - Gray descriptions and blue CTAs
3. **CasinoRecommendations.astro** - Status badges and gray backgrounds
4. **GameFrame.astro** - Fallback message styling

## Best Practices for New Features

### ✅ Do:
- Use semantic CSS variables (`var(--foreground-color)`)
- Leverage `light-dark()` function for theme-aware styling
- Test in both light and dark modes
- Use the generated palette scales for consistency

### ❌ Don't:
- Use hardcoded Tailwind color classes (`text-gray-600`)
- Use fixed hex colors (`#666666`)
- Assume colors work in both themes without testing
- Mix color systems (stick to your OKLCH palette)

### Template for New Components:
```astro
<style>
  .my-component {
    color: var(--foreground-color);
    background-color: var(--background-color);
    border: 1px solid var(--border-color-subtle);
  }
  
  .my-button {
    background-color: var(--color-primary-400);
    color: var(--color-neutral-100);
  }
  
  .my-button:hover {
    background-color: var(--color-primary-300);
  }
</style>
```

## Accessibility Notes
- All color combinations maintain WCAG AA contrast ratios
- Focus indicators use `var(--link-color)` for consistency
- Error states use primary palette instead of separate red colors