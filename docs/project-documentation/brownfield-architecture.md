# RouletteSimulator.com Brownfield Architecture Document

## Introduction

This document captures the CURRENT STATE of the RouletteSimulator.com codebase after successful implementation of the SlotsLaunch API integration and automated game page generation system. It reflects the actual working architecture, including technical debt, workarounds, and real-world patterns.

### Document Scope

Comprehensive documentation focusing on the operational roulette game aggregation system now live at https://zingy-sfogliatella-7901c5.netlify.app

### Change Log

| Date       | Version | Description                                    | Author    |
| ---------- | ------- | ---------------------------------------------- | --------- |
| 2025-09-03 | 1.0     | Initial brownfield analysis post-API integration | Winston   |

## Quick Reference - Key Files and Entry Points

### Critical Files for Understanding the System

- **Main Entry**: `src/pages/index.astro` - Homepage with game previews
- **API Integration**: `src/pages/api/games.ts` - SlotsLaunch API integration with roulette filtering
- **Game Page Template**: `src/pages/games/[gameId].astro` - Individual game page generator
- **Game Library**: `src/pages/games/index.astro` - Main games listing page
- **Configuration**: `astro.config.mjs`, `netlify.toml`, `.env`
- **Core Services**: `src/services/apiClient.ts`, `src/services/mockGameService.ts`
- **Type Definitions**: `src/types/game.ts` - Game data structures

### Operational API Endpoints

- **Live Games API**: `/api/games` - Returns 61+ roulette games from SlotsLaunch
- **Individual Game Pages**: `/games/{gameId}` - 84 static pages generated at build time

## High Level Architecture

### Technical Summary

RouletteSimulator.com is an Astro-based static site that aggregates roulette games from the SlotsLaunch API. The system automatically discovers roulette games (using API type filter `type[]=22`), processes them into structured data with variant detection, and generates individual static pages for each game during build time. This creates an SEO-optimized, fast-loading demo game library with full categorization.

### Actual Tech Stack (Operational)

| Category  | Technology | Version | Purpose | Notes |
| --------- | ---------- | ------- | ------- | ----- |
| Frontend Framework | Astro | 5.8.0 | Static site generation | SSG mode for performance |
| Language | TypeScript | 5.9.2 | Type safety | Used throughout frontend/backend |
| UI Framework | Tailwind CSS | 4.1.7 | Styling system | Utility-first approach |
| Component Library | Accessible Astro Components | 4.1.2 | WCAG-compliant components | Accessibility-focused |
| State Management | Nanostores | 0.9.5 | Lightweight client state | Minimal state needs |
| API Client | Native Fetch | Built-in | HTTP requests | Simple API integration |
| Game Data Source | SlotsLaunch API | v1 | Roulette game feed | 84 games discovered |
| Build Tool | Astro CLI | 5.8.0 | SSG compilation | Fast build times |
| Testing | Vitest + Playwright | 1.0.0 | Unit and E2E testing | Basic test coverage |
| Hosting | Netlify | Latest | Static hosting + functions | CDN distribution |
| Compression | astro-compress | 2.3.8 | Asset optimization | HTML/CSS/JS/Image compression |
| Schema Validation | Zod | 3.22.0 | Runtime type checking | API response validation |

### Repository Structure Reality

- **Type**: Monorepo (single Astro project)
- **Package Manager**: npm (package-lock.json present)
- **Notable**: Clean separation of concerns, well-organized src/ structure

## Source Tree and Module Organization

### Project Structure (Actual)

```text
roulettesim/
├── src/
│   ├── pages/
│   │   ├── api/games.ts           # SlotsLaunch API integration (CRITICAL)
│   │   ├── games/[gameId].astro   # Dynamic game page template
│   │   └── games/index.astro      # Game library listing
│   ├── services/
│   │   ├── apiClient.ts           # API client abstraction
│   │   └── mockGameService.ts     # Fallback data for API failures
│   ├── components/game/
│   │   ├── GameFrame.astro        # Game iframe wrapper
│   │   ├── GameLibrary.astro      # Game grid display
│   │   └── VariantSelector.astro  # Roulette variant filtering
│   ├── types/
│   │   └── game.ts                # RouletteGame interface definitions
│   └── utils/
│       └── gameFilters.ts         # Game categorization logic
├── docs/                          # Extensive project documentation
│   ├── stories/                   # Feature implementation stories
│   └── API-docs/                  # SlotsLaunch API documentation
├── netlify.toml                   # Netlify deployment configuration
└── .env                           # Environment variables (API token)
```

### Key Modules and Their Purpose

- **API Integration**: `src/pages/api/games.ts` - Fetches from SlotsLaunch with `type[]=22` filter for roulette games
- **Game Processing**: Built-in variant detection logic within API route
- **Page Generation**: `src/pages/games/[gameId].astro` uses `getStaticPaths()` for build-time generation
- **Mock Fallback**: `src/services/mockGameService.ts` provides 3 demo games when API fails
- **Type Safety**: `src/types/game.ts` defines RouletteGame interface used throughout

## Data Models and APIs

### Data Models

**Primary Data Structure**: See `src/types/game.ts`

```typescript
interface RouletteGame {
  id: string;
  name: string;
  provider: string;
  variant: RouletteVariant;
  thumbnail: string;
  iframeUrl: string;
  isAvailable: boolean;
  metadata: GameMetadata;
  cacheTimestamp: number;
}
```

### API Specifications

**SlotsLaunch Integration**: `src/pages/api/games.ts`
- **Endpoint**: `https://slotslaunch.com/api/games`
- **Filter**: `type[]=22` (Roulette games only)
- **Authentication**: Token-based via `SLOTSLAUNCH_API_TOKEN`
- **Cache**: 30-minute TTL with fallback to mock data
- **Response**: 61+ live roulette games from multiple providers

**Internal API Endpoints**:
- **GET `/api/games`**: Returns processed roulette games with variant detection
- **Query Parameters**: `variant`, `provider` for client-side filtering

## Current Operational Status

### Live System Performance

✅ **Successfully Operational**: https://zingy-sfogliatella-7901c5.netlify.app
- **84 individual game pages generated** from live API data
- **61+ unique roulette games** discovered and categorized
- **Automatic variant detection**: European, American, French, Lightning, Mini, Live
- **Provider diversity**: Evolution, KA Gaming, Playtech, iSoftBet, Amusnet, etc.
- **Build time**: ~10 seconds for complete site generation
- **API response time**: ~240ms for games endpoint

### Game Discovery Results

**Current Game Variants Detected**:
- European Roulette (most common)
- American Roulette  
- French Roulette
- Lightning Roulette (Evolution multiplier games)
- Mini Roulette (reduced numbers)
- Auto Roulette (automated spinning)
- Multi Roulette (multiple wheel variants)
- Live Roulette

**Provider Distribution**: 15+ game providers including major casino software companies

## Technical Debt and Known Issues

### Current Technical Debt

1. **Environment Variable Management**: Local `.env` vs Netlify environment variables require manual sync
2. **Mock Data Fallback**: Hardcoded 3 games in `mockGameService.ts` - should be more representative
3. **Build-Time API Dependency**: Site generation depends on external API availability
4. **No Incremental Builds**: Full site rebuild required for new games discovery

### Known Operational Issues

1. **iframe Embedding Blocked**: SlotsLaunch sets `X-Frame-Options: sameorigin` preventing iframe embedding on external domains
   - **Impact**: Game iframes display placeholder instead of playable games
   - **Workaround**: "Play Game" button approach (common pattern for demo sites)
   - **Resolution**: Requires SlotsLaunch business agreement for iframe embedding permissions

### Workarounds and Gotchas

- **API Token Security**: Token stored in environment variables, not exposed to client
- **Origin Header Required**: SlotsLaunch API requires exact domain match in Origin header
- **Published Games Only**: Must use `published=1` parameter to get playable games
- **Type Filter Essential**: Without `type[]=22`, API returns slots instead of roulette games

## Integration Points and External Dependencies

### External Services

| Service      | Purpose              | Integration Type | Key Files                  | Status  |
| ------------ | -------------------- | ---------------- | -------------------------- | ------- |
| SlotsLaunch  | Roulette game feed   | REST API         | `src/pages/api/games.ts`   | ✅ Live |
| Netlify      | Hosting + Functions  | Platform         | `netlify.toml`             | ✅ Live |
| GitHub       | Source control       | Git              | `.git/`                    | 🟡 Planned |

### Internal Integration Points

- **Frontend ↔ API**: Client calls `/api/games` for dynamic game data
- **Build Process**: `getStaticPaths()` calls API service during SSG
- **Cache Layer**: In-memory caching with TTL in API route
- **Asset Pipeline**: Game thumbnails served via SlotsLaunch CDN

## Development and Deployment

### Local Development Setup (Working Process)

```bash
# 1. Environment setup
cp .env.example .env
# Edit .env with SlotsLaunch token

# 2. Install dependencies  
npm install

# 3. Start development server
npm run dev
# Site available at http://localhost:4321

# 4. Build for production
npm run build
```

### Build and Deployment Process (Operational)

- **Build Command**: `npm run build` (generates static site + 84 game pages)
- **Deployment**: Netlify auto-deploy on git push
- **Environment Variables**: Configured via `netlify env:set`
- **CDN**: Global distribution via Netlify CDN
- **Compression**: Automatic HTML/CSS/JS/Image compression via astro-compress

## Testing Reality

### Current Test Coverage

- **Unit Tests**: Vitest setup in `tests/unit/` - minimal coverage
- **Component Tests**: `GameFrame.test.ts` exists
- **Integration Tests**: Manual testing of API integration
- **E2E Tests**: Playwright configured but minimal tests
- **Manual Testing**: Primary QA method for game functionality

### Running Tests

```bash
npm test              # Vitest unit tests
npm run test:e2e      # Playwright E2E tests
npm run test:a11y     # Accessibility testing with axe-core
npm run type-check    # TypeScript type checking
```

## Operational Game Processing Workflow

### Build-Time Process (Successful Implementation)

1. **API Discovery**: `getStaticPaths()` calls SlotsLaunch API with `type[]=22`
2. **Game Processing**: 61+ roulette games discovered and processed
3. **Variant Detection**: Automatic categorization (European/American/French/Lightning/etc.)
4. **Page Generation**: 84 individual static pages created at `/games/{gameId}`
5. **Metadata Processing**: Betting limits, RTP, provider info extracted
6. **Asset Optimization**: Thumbnails and assets compressed and optimized

### Runtime Process (API Endpoint)

1. **Client Request**: Frontend calls `/api/games`
2. **Cache Check**: 30-minute TTL cache validation
3. **API Call**: SlotsLaunch API with proper headers and type filter
4. **Data Processing**: Game variant detection and metadata structuring
5. **Response**: Structured JSON with categorized games

### Weekly Discovery Pattern (Planned)

- **Scheduled Builds**: Netlify scheduled functions to trigger daily/weekly rebuilds
- **New Game Detection**: Build process automatically discovers new games in API feed
- **Page Generation**: New games automatically get individual pages
- **Content Sync**: Static pages updated with fresh game data

## Appendix - Useful Commands and Scripts

### Frequently Used Commands

```bash
npm run dev           # Development server (port 4321)
npm run build         # Production build with game page generation
npm run preview       # Preview built site locally
netlify deploy --prod # Deploy to production
netlify env:set KEY VALUE # Set environment variables
netlify build         # Trigger build with env vars
```

### Game Discovery Commands

```bash
# Test API locally
curl "http://localhost:4321/api/games" | jq '.games | length'

# Test live API
curl "https://zingy-sfogliatella-7901c5.netlify.app/api/games" | jq '.games[0]'

# Test SlotsLaunch API directly  
curl "https://slotslaunch.com/api/games?token={TOKEN}&type[]=22&per_page=5" | jq '.'
```

### Debugging and Troubleshooting

- **Build Logs**: Netlify build logs show API call status and page generation
- **API Issues**: Check environment variables and Origin header configuration
- **Game Detection**: Review `detectRouletteVariant()` function in API route
- **Fallback Behavior**: System gracefully falls back to mock data on API failures