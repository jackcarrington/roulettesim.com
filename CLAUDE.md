# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 🚨 CRITICAL FOR DEVELOPMENT AGENTS: 
**BEFORE ANY CODING WORK:** You MUST read the agent development briefing document at `.bmad-core/data/agent-dev-briefing.md` and acknowledge understanding. This ensures you follow established CSS variables, component patterns, and MCP research requirements. **NO EXCEPTIONS.**

## Project Overview

This is **roulettesim.com** - an educational roulette platform that integrates with the SlotsLaunch API to provide authentic casino game practice. The platform serves educational content about roulette variants, game discovery, and includes embedded game iframes with analytics tracking and casino recommendations.

## Core Architecture

### Tech Stack
- **Frontend**: Astro 5.8+ static site generator with React components
- **Styling**: Tailwind CSS 4 with custom SCSS utilities and Atkinson Hyperlegible font
- **Content**: Astro Content Collections for educational materials and casino data
- **API Integration**: SlotsLaunch API for live game data via iframe embedding
- **Analytics**: Custom privacy-compliant session tracking with localStorage
- **Testing**: Vitest unit tests, Playwright e2e tests, Axe accessibility tests

### React Integration & SSR
- **Setup**: React integration via `@astrojs/react` (add with `npx astro add react`)
- **Default Behavior**: React components render to static HTML on server
- **Hydration**: Use client directives for interactivity:
  - `client:load` - Immediate hydration (high priority)
  - `client:idle` - Hydrate when page loads (medium priority)
  - `client:visible` - Hydrate when in viewport (low priority)
  - `client:media={QUERY}` - Conditional based on media query
  - `client:only="react"` - Client-only rendering (skip SSR)
- **Props**: Only serializable data (string, number, Array, Object, Date, etc.)
- **Children**: Pass via standard React patterns or Astro named slots
- **Islands Architecture**: React components are isolated "islands" - can't import .astro components inside them

### Directory Structure
```
src/
├── components/          # Reusable Astro/React components
│   ├── game/           # Game-specific components (GameFrame, GameLibrary)
│   ├── conversion/     # Casino recommendation components  
│   ├── education/      # Educational content components
│   └── seo/           # SEO optimization components
├── content/            # Astro Collections
│   ├── educational/    # Educational markdown content
│   └── casinos/       # Casino data (JSON)
├── pages/api/         # Astro API routes
├── services/          # Business logic and external API clients
├── stores/            # Nanostores for client state management
├── types/             # TypeScript interfaces
└── utils/             # Helper utilities
```

### Path Aliases
All imports use TypeScript path aliases defined in astro.config.mjs:
- `@components/*` → `./src/components/*`
- `@services/*` → `./src/services/*` 
- `@stores/*` → `./src/stores/*`
- `@types/*` → `./src/types/*`
- `@utils/*` → `./src/utils/*`
- `@content/*` → `./src/content/*`

## Development Commands

| Command | Action |
|---------|--------|
| `npm run dev` | Start dev server at localhost:4321 |
| `npm run build` | Build production site |
| `npm run preview` | Preview production build |
| `npm run test` | Run Vitest unit tests |
| `npm run test:e2e` | Run Playwright end-to-end tests |
| `npm run test:a11y` | Run Axe accessibility tests |
| `npm run type-check` | Run Astro TypeScript checks |

## Key Integration Points

### SlotsLaunch API
- Authenticated via `SLOTSLAUNCH_API_TOKEN` environment variable
- Games API endpoint: `/api/games` (caches for 30 minutes)
- Iframe integration via `GameFrame.astro` component
- Requires Origin header: `ORIGIN_DOMAIN` env var (defaults to Netlify domain)
- API filters roulette games using `type[]=22` parameter

### Analytics & Privacy
- Privacy-first analytics via `analyticsService.ts`
- Tracks game engagement, educational content interaction, casino interest
- Session data stored in localStorage with user consent
- Conversion score algorithm based on engagement signals

### Content Collections
- **Educational**: Markdown content with expert credentials and SEO metadata
- **Casinos**: JSON data for affiliate recommendations with geographic targeting
- Both collections include validation schemas via Zod

### Game Architecture
- Games fetched from SlotsLaunch API with automatic variant detection
- Fallback to mock data service if API unavailable  
- Game state managed via nanostores (`gameState.ts`, `sessionState.ts`)
- Iframe embedding handles token authentication automatically

## Shadcn UI Integration
The project has shadcn CLI configured via `.mcp.json` for component management.

**IMPORTANT**: Before implementing any shadcn components or making changes via MCP:
1. **Review shadcn documentation first** for proper implementation patterns
2. **Check component compatibility** with Astro framework 
3. **Verify integration** with existing Tailwind CSS 4 and color system
4. **Test accessibility** with current WCAG standards
5. **Ensure consistency** with established design system and CSS variables

Use shadcn MCP only after understanding the component requirements and integration approach.

## Design System & Consistency Guidelines

### Button System
**IMPORTANT**: Always use the unified `.button` class for all interactive elements across the site.

- **Primary buttons**: `<a class="button">` or `<a class="button has-icon">`
- **Secondary buttons**: `<a class="button color-secondary">` 
- **Never create custom button styles** - this maintains accessibility and consistency
- **All buttons support light/dark modes** automatically with proper contrast ratios
- **Located in**: `/src/assets/scss/base/_button.scss`

### Site-wide Consistency Rules
1. **Use existing components** before creating new ones
2. **Check component library** in `/src/components/` for reusable elements
3. **Follow CSS variable system** defined in `/src/assets/scss/base/_root.scss`
4. **Maintain accessibility standards** (WCAG compliance with 4.5:1+ contrast ratios)
5. **Test both light and dark modes** for all new components
6. **Use consistent spacing** with CSS variables (`--space-*`)
7. **Follow typography scale** defined in `_font.scss` (h1-h5 hierarchy)

### Brand Colors (Fixed Contrast System)
- **Primary**: Purple variants (`--color-primary-*`) with proper light/dark mode variants
- **Secondary**: Cyan variants (`--color-secondary-*`) with proper light/dark mode variants
- **Colors automatically adjust** for light/dark mode accessibility
- **Never hardcode colors** - always use CSS variables

### Component Integration Priority
1. **First**: Check if existing component can be modified
2. **Second**: Use established `.button`, `.container`, `.card` classes
3. **Third**: Follow existing SCSS architecture in `/src/assets/scss/`
4. **Last Resort**: Create new component (must follow existing patterns)

## Deployment Workflow

### GitHub Integration (Recommended)
The project is now configured for automatic deployment via GitHub integration:

1. **Development Workflow:**
   ```bash
   # Make changes locally
   git add .
   git commit -m "Your commit message"
   git push origin main  # Triggers automatic Netlify deployment
   ```

2. **Repository:** https://github.com/jackcarrington/roulettesim.com
3. **Live Site:** https://roulettesim.com
4. **Netlify Dashboard:** https://app.netlify.com/projects/zingy-sfogliatella-7901c5

### Manual Netlify Setup Steps (One-time)
To complete the GitHub integration:

1. **Connect GitHub to Netlify:**
   - Log into Netlify dashboard
   - Go to Site Settings → Build & Deploy → Continuous Deployment
   - Connect to Git provider (GitHub)
   - Select `jackcarrington/roulettesim.com` repository
   - Set build command: `npm run build`
   - Set publish directory: `dist`

2. **Environment Variables:**
   - In Netlify dashboard: Site Settings → Environment Variables
   - Add required variables (see below)

### Alternative: Direct Deployment
For quick fixes, you can still deploy directly:
```bash
netlify deploy --prod
```

## Environment Variables
Required for full functionality:
- `SLOTSLAUNCH_API_TOKEN` - API authentication
- `ORIGIN_DOMAIN` - RouletteSim.com domain for CORS compliance
- `PUBLIC_SITE_URL` - https://roulettesim.com for API base path resolution