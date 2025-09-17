# Agent Development Briefing
<!-- Powered by BMAD™ Core -->

## 🚨 CRITICAL: Read This Before Any Development Work

This document MUST be read and acknowledged by any agent before starting development tasks on roulettesim.com.

## Project Architecture Overview

**Tech Stack:**
- **Framework:** Astro 5.8+ with React components
- **Styling:** Tailwind CSS 4 + Custom SCSS + Root CSS Variables
- **Font:** Atkinson Hyperlegible (accessibility-focused)
- **API:** SlotsLaunch integration for game data
- **Testing:** Vitest, Playwright, Axe accessibility

**Available MCP Integrations (MANDATORY USAGE):**
- **Astro Docs MCP:** `mcp__astro-docs__search_astro_docs` - For framework implementation guidance
- **Shadcn MCP:** `mcp__shadcn__*` functions - For component implementation patterns

## 🎨 DESIGN SYSTEM - MANDATORY COMPLIANCE

### CSS Variables System (NEVER CREATE CUSTOM CSS)

**Colors - USE ONLY THESE:**
```css
/* Primary Colors */
--color-primary-100 through --color-primary-500
--color-secondary-100 through --color-secondary-500
--color-neutral-100 through --color-neutral-900

/* Semantic Colors (Auto light/dark mode) */
--foreground-color
--background-color
--link-color, --link-hover-color
--border-color, --border-color-subtle
```

**Spacing - USE ONLY THESE:**
```css
--space-5xs through --space-5xl
/* Never hardcode px values */
```

**Typography - USE ONLY THESE:**
```css
--font-size--2 through --font-size-8
--font-heading, --font-body
```

### 🔴 FORBIDDEN PRACTICES:
- ❌ Custom color values (e.g., `#ff0000`, `rgb(255,0,0)`)
- ❌ Hardcoded spacing (e.g., `margin: 10px`)
- ❌ Custom font sizes outside the scale
- ❌ Inline styles for colors/spacing
- ❌ Creating new CSS classes when existing ones exist

### ✅ REQUIRED PRACTICES:
- ✅ Always use CSS custom properties from `:root`
- ✅ Use existing `.button` class (never create custom buttons)
- ✅ Check existing components before creating new ones
- ✅ Follow light-dark() pattern for theme compatibility

## 🧩 COMPONENT SYSTEM

### Established Components (REUSE THESE FIRST):
```
src/components/
├── ui/
│   ├── GameCard.astro
│   ├── FeatureCard.astro
├── game/
│   ├── GameFrame.astro
│   ├── GameLibrary.astro
│   ├── VariantSelector.astro
├── conversion/
│   ├── CasinoRecommendations.astro
├── education/
│   ├── EducationalCard.astro
│   ├── EducationalGrid.astro
├── safety/
│   ├── SafetyAlert.astro
│   ├── SupportResourceFinder.astro
├── seo/
│   ├── SEOHead.astro
└── [Base components: Header, Footer, Navigation, etc.]
```

### Button System (CRITICAL):
**ALWAYS use the unified `.button` class:**
```html
<!-- Primary button -->
<a class="button">Click me</a>

<!-- Secondary button -->
<a class="button color-secondary">Click me</a>

<!-- Button with icon -->
<a class="button has-icon">
  <Icon name="example" />
  Click me
</a>
```

**NEVER create custom button styles** - this maintains accessibility and consistency.

## 🔍 MANDATORY MCP RESEARCH WORKFLOW

### For ANY Astro-Related Implementation:
```bash
# 1. Search Astro docs first
mcp__astro-docs__search_astro_docs("component patterns")
mcp__astro-docs__search_astro_docs("specific feature name")

# 2. Cross-reference with our existing patterns
# 3. Implement following both Astro best practices AND our conventions
```

### For ANY New Component Creation:
```bash
# 1. Search shadcn registry for similar components
mcp__shadcn__search_items_in_registries(registries: ["@shadcn"], query: "form")

# 2. Get implementation examples
mcp__shadcn__get_item_examples_from_registries(registries: ["@shadcn"], query: "form-demo")

# 3. View component details
mcp__shadcn__view_items_in_registries(items: ["@shadcn/form"])

# 4. Adapt the shadcn pattern to our Astro + CSS variable system
```

### Research-First Development Process:
1. **Research Phase:** Use MCPs to understand best practices
2. **Adaptation Phase:** Modify patterns to fit our design system
3. **Implementation Phase:** Code using our established conventions
4. **Validation Phase:** Test and verify compliance

## 🏗️ DEVELOPMENT WORKFLOW

### Path Aliases (ALWAYS USE):
```typescript
@components/* → ./src/components/*
@services/* → ./src/services/*
@stores/* → ./src/stores/*
@types/* → ./src/types/*
@utils/* → ./src/utils/*
@content/* → ./src/content/*
```

### Before Adding ANY New Feature:
1. **Check existing components** in the relevant directory
2. **Review root CSS variables** for colors, spacing, typography
3. **Use `.button` class** for any interactive elements
4. **MANDATORY: Cross-reference Astro documentation** using `mcp__astro-docs__search_astro_docs` for proper Astro implementation patterns
5. **MANDATORY: For new components, check shadcn** using `mcp__shadcn__search_items_in_registries` and `mcp__shadcn__get_item_examples_from_registries` for implementation examples
6. **Follow Astro + React patterns** from existing code
7. **Test both light and dark modes**

### File Structure Patterns:
- **Pages:** `/src/pages/` (Astro routing)
- **Components:** Organized by feature/type
- **Styles:** Use established SCSS architecture
- **Assets:** Follow existing asset organization

## 🚀 QUALITY STANDARDS

### Accessibility Requirements:
- Use semantic HTML
- Maintain WCAG compliance (4.5:1+ contrast ratios)
- Support keyboard navigation
- Follow existing accessibility patterns

### Browser Compatibility:
- Support modern browsers
- Test responsive design
- Ensure progressive enhancement

### Performance:
- Follow Astro's island architecture
- Use proper image optimization
- Minimize bundle size impact

## 📋 PRE-DEVELOPMENT CHECKLIST

Before starting ANY development task:
- [ ] I have read this entire briefing document
- [ ] I understand the CSS variable system and will NOT create custom colors/spacing
- [ ] I will use the `.button` class for all interactive elements
- [ ] I will check existing components before creating new ones
- [ ] **I will use `mcp__astro-docs__search_astro_docs` to verify Astro implementation patterns**
- [ ] **I will use shadcn MCP functions to research component examples before building**
- [ ] I will use established path aliases
- [ ] I will test both light and dark modes
- [ ] I will follow accessibility standards

**CONFIRMATION REQUIRED:** Respond "BRIEFING ACKNOWLEDGED" before beginning development.

## 🔍 VALIDATION COMMANDS

After development, run these to ensure compliance:
```bash
npm run type-check
npm run test
npm run test:a11y
```

## 📚 Key Reference Files:
- `/src/assets/scss/base/_root.scss` - All CSS variables
- `/src/assets/scss/base/_button.scss` - Button system
- `/CLAUDE.md` - Project overview and commands
- `/src/components/` - Component library

Remember: **Consistency over creativity** - follow established patterns!