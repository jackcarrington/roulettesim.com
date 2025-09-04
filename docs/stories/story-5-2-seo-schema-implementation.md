# Story 5.2: SEO Implementation & Schema Configuration

## Story
**As a** content marketer,  
**I want** comprehensive SEO implementation with clean URLs and structured data,  
**so that** roulette educational content ranks well and drives organic traffic conversion.

## Acceptance Criteria
- [ ] Implement Astro's built-in SEO features (meta titles, descriptions, Open Graph)
- [ ] Create clean, SEO-friendly URLs using game names instead of IDs
- [ ] Add JSON-LD schema markup for educational content (Article, HowTo, FAQPage)
- [ ] Implement comprehensive VideoGame + SoftwareApplication schema for demo games site-wide
- [ ] Add demo-specific schema properties (free play, educational purpose)
- [ ] Include Casino schema markup for casino recommendation pages
- [ ] Add breadcrumb navigation with schema markup
- [ ] Generate XML sitemap with proper priority and frequency settings
- [ ] Implement canonical URLs to prevent duplicate content issues
- [ ] Add hreflang tags for international SEO (if multiple languages planned)
- [ ] Create SEO-optimized URL redirects from old ID-based URLs
- [ ] Implement meta robots tags for proper page indexing control

## Tasks / Subtasks

- [x] **Task 1: Astro SEO Infrastructure Setup** (AC: 1, 7)
  - [x] Install and configure `@astrojs/sitemap` integration
  - [x] Create `src/components/seo/SEOHead.astro` component using Astro SEO patterns
  - [x] Implement dynamic meta title/description generation
  - [x] Add Open Graph and Twitter Card meta tags
  - [x] Set up canonical URL generation for all page types
  - [x] Create site-wide Organization schema component for every page

- [x] **Task 2: Clean URL Structure Implementation** (AC: 2, 9)
  - [x] Update game routing from `/games/[gameId]` to `/games/[gameSlug]`
  - [x] Create slug generation utility in `src/utils/slugHelpers.ts`
  - [x] Implement URL redirects from old ID-based URLs to new slug URLs
  - [x] Update all internal links to use new URL structure
  - [x] Verify SlotsLaunch iframe integration works with new URL structure

- [x] **Task 3: Educational Content Schema Implementation** (AC: 3)
  - [x] Add JSON-LD Article schema for strategy guides
  - [x] Implement HowTo schema for game rule explanations
  - [x] Add FAQPage schema for common roulette questions
  - [x] Create author schema markup for content credibility
  - [x] Add breadcrumb navigation schema

- [x] **Task 4: Comprehensive Game Demo Schema Configuration** (AC: 4, 5, 6)
  - [x] Implement VideoGame schema for all demo roulette games site-wide
  - [x] Add SoftwareApplication schema with demo/educational properties
  - [x] Create Casino schema markup for casino recommendation pages
  - [x] Add demo-specific properties (isAccessibleForFree: true, "Free Demo" naming, educational purpose)
  - [x] Implement site-wide game category schema (genre: "Casino Game", "Educational")
  - [x] Add responsible gambling schema markup for compliance

- [x] **Task 5: SEO Component Integration** (AC: 6, 10)
  - [x] Update all page templates to use SEOHead component
  - [x] Implement page-specific meta robots tags
  - [x] Add structured sitemap generation with game and education priorities
  - [x] Create SEO testing utilities for schema validation

## Dev Notes

**Architecture Context:** [Source: architecture.md#Frontend Architecture, #Unified Project Structure]

**Current URL Structure Issues:**
- Games currently use ID-based URLs: `/games/14672/`
- Need clean URLs: `/games/european-roulette-capecod-gaming/`
- SEO-friendly slugs improve search ranking and user experience

**SEO Implementation Requirements:**

**Astro SEO Integration:**
```typescript
// src/components/seo/SEOHead.astro
---
export interface Props {
  title: string;
  description: string;
  canonical?: string;
  openGraph?: {
    title: string;
    description: string;
    image: string;
    type: 'website' | 'article';
  };
  schema?: object;
}
---
```

**URL Structure Transformation:**
```typescript
// Current: /games/[gameId].astro → /games/14672/
// Target:  /games/[gameSlug].astro → /games/european-roulette-capecod-gaming/

// src/utils/slugHelpers.ts
export function generateGameSlug(game: RouletteGame): string {
  const variant = game.variant;
  const name = game.name.toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-');
  const provider = game.provider.toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-');
  
  return `${variant}-${name}-${provider}`;
}
```

**Schema Markup Specifications:**
```typescript
// Demo Game Schema (VideoGame + SoftwareApplication)
const demoGameSchema = {
  "@context": "https://schema.org",
  "@type": ["VideoGame", "SoftwareApplication"],
  "name": `${gameName} - Free Demo`,
  "description": `${gameDescription} Play this free roulette demo for practice and learning.`,
  "genre": ["Casino Game", "Educational"],
  "gamePlatform": ["Web Browser", "Mobile"],
  "applicationCategory": "Game",
  "isAccessibleForFree": true,
  "educationalUse": "Practice and Learning",
  "playMode": "SinglePlayer",
  "operatingSystem": ["Web Browser", "iOS", "Android"],
  "softwareVersion": "Demo Version",
  "applicationSubCategory": "Casino Game Demo",
  "publisher": {
    "@type": "Organization",
    "name": "Roulettesim.com"
  },
  "offers": {
    "@type": "Offer",
    "name": "Free Demo Access",
    "description": "Free-to-play demo version for educational purposes",
    "price": "0",
    "priceCurrency": "USD",
    "availability": "InStock",
    "category": "Free Software"
  },
  "audience": {
    "@type": "Audience",
    "audienceType": "Casino Game Learners",
    "suggestedMinAge": 18
  },
  "mainEntityOfPage": gameUrl,
  "url": gameUrl,
  "screenshot": thumbnailUrl,
  "keywords": ["free roulette", "casino demo", "roulette practice", "gambling education"]
};

// Educational Content Schema
const educationalSchema = {
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": title,
  "description": description,
  "author": {
    "@type": "Person",
    "name": authorName,
    "jobTitle": "Casino Game Expert"
  },
  "publisher": {
    "@type": "Organization", 
    "name": "Roulettesim.com"
  },
  "mainEntityOfPage": canonical,
  "datePublished": publishDate,
  "dateModified": lastUpdated,
  "articleSection": "Casino Education",
  "about": {
    "@type": "Thing",
    "name": "Roulette Strategy"
  }
};

// Casino Recommendation Schema
const casinoSchema = {
  "@context": "https://schema.org",
  "@type": "Casino",
  "name": casinoName,
  "description": casinoDescription,
  "url": affiliateUrl,
  "offers": {
    "@type": "Offer",
    "name": "Casino Signup Bonus",
    "category": "Gambling"
  },
  "geo": {
    "@type": "GeoCoordinates",
    "addressCountry": availableCountries
  }
};

// Site-wide Organization Schema
const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "Roulettesim.com",
  "description": "Educational roulette strategy and casino game practice platform",
  "url": "https://roulettesim.com",
  "logo": "https://roulettesim.com/logo.png",
  "foundingDate": "2025",
  "knowsAbout": ["Roulette Strategy", "Casino Games", "Gambling Education"],
  "mainEntityOfPage": "https://roulettesim.com"
};
```

**File Locations:**
```
src/
├── components/seo/
│   ├── SEOHead.astro           # Main SEO component
│   ├── SchemaMarkup.astro      # JSON-LD schema component
│   └── BreadcrumbNav.astro     # Schema-enabled breadcrumbs
├── pages/games/
│   └── [gameSlug].astro        # Updated routing with slugs
├── utils/
│   ├── slugHelpers.ts          # URL slug generation
│   └── seoHelpers.ts           # SEO optimization utilities
└── layouts/
    └── BaseLayout.astro        # Updated with SEO integration
```
[Source: architecture.md#Component Architecture, #Unified Project Structure]

**Technical Constraints:**
- Must maintain SlotsLaunch iframe integration with new URL structure
- URL redirects required for existing indexed ID-based URLs
- Schema markup must comply with Google's structured data requirements
- Clean URLs should be SEO-optimized and user-friendly
- **CRITICAL**: All demo games must include VideoGame + SoftwareApplication dual schema
- Site-wide Organization schema required on every page for authority
- **Demo Game Schema Requirements**:
  - `isAccessibleForFree: true` - Mark all demos as free
  - `name: "${gameName} - Free Demo"` - Clear free-to-play naming
  - `offers.name: "Free Demo Access"` - Explicit free access offering
  - `offers.category: "Free Software"` - Free software classification
  - `applicationSubCategory: "Casino Game Demo"` - Demo software type
  - `softwareVersion: "Demo Version"` - Version clarity
[Source: architecture.md#SEO Requirements]

**Astro Integration Requirements:**
- Use Astro's built-in sitemap generation
- Leverage Astro's meta tag management
- Implement Astro content collections schema for educational content
- Utilize Astro's static generation for SEO performance

**Testing Requirements:**
```
tests/unit/utils/slugHelpers.test.ts
tests/unit/components/seo/SEOHead.test.ts
tests/integration/seo-meta-tags.test.ts
tests/e2e/url-structure.spec.ts
tests/e2e/schema-validation.spec.ts
```

**Framework Documentation References:**
- **Astro Docs**: Use `claude mcp astro-docs search` for implementation guidance on:
  - SEO and meta tags configuration
  - Sitemap generation setup
  - Dynamic routing with slugs
  - Content collections schema
- **Key Astro Concepts**: Built-in SEO features, file-based routing, static generation
- **Accessible Astro Components**: Available components for SEO enhancement
  - `Navigation.astro` - SEO-friendly navigation structure
  - `Footer.astro` - Structured footer with schema support

## Testing
- [ ] SEO meta tag validation
- [ ] Schema markup testing with Google's Rich Results Test
- [ ] URL redirect functionality
- [ ] Sitemap generation verification
- [ ] Clean URL accessibility testing

## Dev Agent Record
**Agent Model Used:** claude-sonnet-4-20250514

**Debug Log References:**
- .ai/debug-log.md

**Completion Notes:**
- Implemented comprehensive SEO with clean URLs for games
- Created reusable SEOHead component with schema support
- Generated clean game URLs: /games/european-classic-european-roulette-evolution-gaming/
- Added dual VideoGame + SoftwareApplication schema for all demos
- Implemented automatic sitemap generation
- Added organization schema site-wide

**File List:**
- CREATED: src/components/seo/SEOHead.astro
- CREATED: src/utils/slugHelpers.ts
- CREATED: src/utils/seoHelpers.ts
- MODIFIED: astro.config.mjs (added sitemap integration)
- MODIFIED: src/pages/games/[gameId].astro (slug routing + SEO)
- MODIFIED: src/pages/blog/[post].astro (educational schema)
- MODIFIED: src/pages/index.astro (homepage SEO + schema)
- AUTO-GENERATED: dist/sitemap-index.xml

**Change Log:**
- 2025-09-03: Story created for SEO implementation and clean URLs

**Status:** Ready for Review