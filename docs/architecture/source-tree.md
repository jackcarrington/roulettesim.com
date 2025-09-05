# Source Tree - RouletteSim.com

## Overview

This document provides a comprehensive guide to the RouletteSim.com project structure, explaining the purpose and organization of each directory and key files.

## Project Root

```
roulettesim.com/
├── .bmad-core/              # BMAD development framework
├── docs/                    # Project documentation
├── public/                  # Static assets
├── src/                     # Source code
├── astro.config.mjs         # Astro configuration
├── package.json             # Dependencies and scripts
├── tailwind.config.js       # Tailwind CSS configuration
├── tsconfig.json            # TypeScript configuration
├── eslint.config.js         # ESLint configuration
└── CLAUDE.md               # Claude Code assistant instructions
```

## Core Configuration Files

### `astro.config.mjs`
Primary Astro configuration including:
- Site URL and output mode
- Integration setup (React, MDX, Sitemap, Icons)
- Vite configuration with path aliases
- SCSS preprocessing setup

### `package.json`
- **Scripts**: `dev`, `build`, `preview`, `test`, `test:e2e`, `test:a11y`, `type-check`
- **Dependencies**: Astro, React, Tailwind, TypeScript ecosystem
- **Dev Dependencies**: Testing frameworks, ESLint, Prettier

### `tsconfig.json`
TypeScript configuration extending Astro's strict setup with path aliases for clean imports.

## Source Directory Structure

```
src/
├── assets/                  # Static assets and stylesheets
├── components/              # Reusable UI components
├── content/                 # Astro Content Collections
├── hooks/                   # Custom React hooks
├── layouts/                 # Page layout templates
├── pages/                   # File-based routing
├── services/                # Business logic and API clients
├── stores/                  # Global state management
├── styles/                  # Global styles
├── types/                   # TypeScript type definitions
├── utils/                   # Helper utilities
├── content.config.mjs       # Content Collections configuration
└── env.d.ts                # TypeScript environment declarations
```

## Assets Directory

```
src/assets/
├── animations/              # Lottie animation files
├── images/                  # Project images
│   ├── posts/              # Blog post images
│   └── projects/           # Project showcase images
├── img/
│   └── logo.svg            # Site logo
└── scss/                   # SCSS stylesheets
    ├── base/               # Base styles and variables
    │   ├── _root.scss      # CSS custom properties
    │   ├── _button.scss    # Unified button system
    │   ├── _font.scss      # Typography (Atkinson Hyperlegible)
    │   ├── _general.scss   # General styles
    │   ├── _mixins.scss    # SCSS mixins
    │   └── _utility.scss   # Utility classes
    └── index.scss          # Main stylesheet entry point
```

### Key Asset Files
- **`_root.scss`**: Central CSS custom properties for colors, spacing, typography
- **`_button.scss`**: Unified button system for consistency across site
- **`_font.scss`**: Atkinson Hyperlegible font integration for accessibility

## Components Directory

```
src/components/
├── components/              # Shadcn UI components
│   └── ui/                 # Reusable UI primitives
│       ├── button.tsx      # Button component
│       ├── card.tsx        # Card component
│       ├── command.tsx     # Command palette
│       ├── dialog.tsx      # Modal dialogs
│       ├── input.tsx       # Form inputs
│       ├── pagination.tsx  # Pagination controls
│       └── popover.tsx     # Popover component
├── conversion/             # Conversion optimization components
│   ├── CasinoRecommendations.astro
│   └── ProgressiveCTA.tsx
├── education/              # Educational content components
├── game/                   # Game-specific components
│   ├── GameFrame.astro     # SlotsLaunch iframe integration
│   ├── GameGridPro.tsx     # Game library grid
│   ├── GameLibrary.astro   # Main game library
│   └── VariantSelector.astro
├── lib/
│   └── utils.ts            # Component utilities
├── search/
│   └── GameSearchBar.tsx   # Game search functionality
├── seo/
│   └── SEOHead.astro       # SEO optimization component
├── RouletteAnimation.tsx   # Lottie-based roulette animation
├── SiteMeta.astro          # Site metadata management
└── [Core Astro Components] # Header, Footer, Navigation, etc.
```

### Component Organization Principles
- **Domain-based**: Components grouped by functionality (game/, conversion/, education/)
- **Reusability**: UI primitives in `components/ui/`
- **Framework-specific**: `.astro` for server-rendered, `.tsx` for interactive
- **Accessibility**: All components follow WCAG guidelines

## Content Directory

```
src/content/
├── casinos/                # Casino recommendation data
│   ├── casino-evolution.json
│   ├── casino-netent.json
│   └── casino-playtech.json
└── educational/            # Educational content
    ├── basic-rules.md
    ├── basic-strategies.md
    ├── european-vs-american.md
    ├── odds-and-probability.md
    └── responsible-gambling.md
```

### Content Collections
- **Educational**: Markdown content with author credentials and SEO metadata
- **Casinos**: JSON data with geographic targeting and affiliate information
- **Validation**: Zod schemas ensure data integrity

## Pages Directory (File-based Routing)

```
src/pages/
├── api/                    # API routes
│   ├── analytics/          # Analytics endpoints
│   │   ├── experiment.ts   # A/B testing
│   │   └── session.ts      # Session tracking
│   ├── games.ts            # Games API proxy
│   └── recommendations.ts  # Casino recommendations
├── blog/                   # Blog functionality
│   ├── [...page].astro     # Paginated blog listing
│   └── [post].astro        # Individual blog posts
├── games/                  # Game pages
│   ├── [gameId].astro      # Dynamic game pages
│   └── index.astro         # Game library listing
├── strategy/               # Strategy content
│   ├── [post].astro        # Individual strategy posts
│   └── index.astro         # Strategy listing
├── tools/
│   └── roulette-rules-cheat-sheet.astro
├── index.astro             # Homepage
├── 404.astro               # Error page
├── accessibility-statement.astro
└── accessible-components.astro
```

### Routing Patterns
- **Dynamic Routes**: `[gameId].astro`, `[post].astro` for content-driven pages
- **Catch-all Routes**: `[...page].astro` for pagination
- **API Routes**: `.ts` files in `/api/` for server-side logic

## Services Directory

```
src/services/
├── analyticsService.ts     # Privacy-first analytics tracking
├── apiClient.ts            # HTTP client for external APIs
├── casinoService.ts        # Casino recommendation logic
├── experimentService.ts    # A/B testing service
└── mockGameService.ts      # Fallback game data
```

### Service Layer Benefits
- **Separation of Concerns**: Business logic isolated from UI
- **Testability**: Services can be unit tested independently
- **Reusability**: Services used across multiple components
- **Error Handling**: Centralized error handling and fallback logic

## State Management

```
src/stores/
├── gameState.ts            # Game selection and library state
└── sessionState.ts         # User session and analytics state
```

### Nanostores Pattern
- **Minimal**: Tiny state management library
- **Framework Agnostic**: Works with both Astro and React
- **Type Safe**: Full TypeScript support
- **Reactive**: Automatic component updates

## Types Directory

```
src/types/
├── analytics.ts            # Analytics and tracking types
├── casino.ts              # Casino and recommendation types
└── game.ts                # Game data and API response types
```

### Type Organization
- **Domain-based**: Types grouped by business domain
- **Shared**: Common types used across multiple services
- **API Contracts**: Types matching external API responses

## Utilities Directory

```
src/utils/
├── contentValidation.ts    # Content validation helpers
├── gameFilters.ts         # Game filtering and sorting
├── privacyHelpers.ts      # Privacy compliance utilities
├── seoHelpers.ts          # SEO optimization helpers
└── slugHelpers.ts         # URL slug generation
```

## Hooks Directory

```
src/hooks/
└── useGameSearch.ts        # Game search functionality hook
```

## Layouts Directory

```
src/layouts/
├── DefaultLayout.astro     # Primary site layout
└── MarkdownLayout.astro    # Layout for markdown content
```

### Layout Responsibilities
- **Common Structure**: Header, navigation, footer
- **SEO**: Meta tags, structured data
- **Accessibility**: Skip links, ARIA landmarks
- **Responsive**: Mobile-first design patterns

## Public Directory

```
public/
├── favicon.ico            # Site favicon
├── robots.txt            # Search engine directives
└── [Static Assets]       # Directly served files
```

## Documentation Directory

```
docs/
├── architecture/          # Architecture documentation
│   ├── coding-standards.md
│   ├── tech-stack.md
│   └── source-tree.md
├── prd/                  # Product requirements (if sharded)
├── stories/              # Development stories
└── qa/                   # Quality assurance documentation
```

## Development Framework

```
.bmad-core/               # BMAD development framework
├── checklists/           # Quality checklists
├── tasks/               # Automated tasks
├── templates/           # Document templates
└── core-config.yaml     # Framework configuration
```

## Path Alias Mapping

The project uses comprehensive path aliases for clean imports:

```typescript
// Alias → Actual Path
'@components/*' → './src/components/*'
'@layouts/*'    → './src/layouts/*'
'@assets/*'     → './src/assets/*'
'@content/*'    → './src/content/*'
'@pages/*'      → './src/pages/*'
'@stores/*'     → './src/stores/*'
'@services/*'   → './src/services/*'
'@types/*'      → './src/types/*'
'@utils/*'      → './src/utils/*'
'@public/*'     → './public/*'
```

## File Naming Conventions

### Components
- **Astro Components**: PascalCase with `.astro` extension
- **React Components**: PascalCase with `.tsx` extension
- **UI Primitives**: kebab-case with `.tsx` extension

### Services and Utilities
- **Services**: camelCase with `Service` suffix
- **Utilities**: camelCase with descriptive names
- **Types**: camelCase with `.ts` extension

### Content
- **Markdown**: kebab-case with `.md` extension
- **Data Files**: kebab-case with appropriate extension (`.json`, `.yaml`)

## Integration Points

### External APIs
- **SlotsLaunch API**: Game data integration via `apiClient.ts`
- **Analytics**: Custom privacy-first tracking system
- **Casino Recommendations**: Affiliate integration system

### Content Management
- **Astro Collections**: Type-safe content with validation
- **Markdown Processing**: MDX for rich interactive content
- **Asset Pipeline**: Optimized image and asset handling

## Build and Development

### Development Server
- **Port**: 4321 (configurable)
- **Hot Reload**: Vite-powered development experience
- **TypeScript**: Real-time type checking

### Build Process
1. **Type Checking**: Astro check validates all TypeScript
2. **Linting**: ESLint ensures code quality
3. **Testing**: Vitest unit tests, Playwright E2E tests
4. **Building**: Static site generation with optimizations
5. **Compression**: Gzip and Brotli compression

### Quality Gates
- **TypeScript**: No type errors allowed
- **ESLint**: All linting rules must pass
- **Accessibility**: Axe-core violations must be resolved
- **Performance**: Lighthouse scores must meet thresholds

This source tree structure supports:
- **Scalability**: Clear separation of concerns
- **Maintainability**: Logical organization and naming
- **Developer Experience**: Path aliases and consistent patterns
- **Performance**: Optimized build and deployment pipeline
- **Quality**: Comprehensive testing and validation