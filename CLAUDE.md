# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

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