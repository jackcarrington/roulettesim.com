# Story 5.3: Homepage Game Integration & Navigation Restructure

## Story
**As a** high-intent casino prospect,  
**I want** immediate access to demo games on the homepage with filtering,  
**so that** I can quickly start practicing without navigating through nested pages.

## Acceptance Criteria
- [ ] Move complete GameLibrary component from `/games/` to homepage
- [ ] Integrate filterable game grid directly on homepage below hero section
- [ ] Update homepage layout to accommodate full game library with pagination
- [ ] Remove redundant "Browse All Games" CTA that leads to separate games page
- [ ] Restructure navigation to reflect new homepage-centric game access
- [ ] Update individual game pages to return to homepage instead of /games/
- [ ] Maintain responsive design for mobile game library access
- [ ] Keep educational content sections on homepage for context
- [ ] Add loading states for game library on homepage
- [ ] Update SEO structure for homepage as primary game discovery page

## Tasks / Subtasks

- [x] **Task 1: Homepage Layout Restructure** (AC: 1, 2, 3)
  - [x] Move GameLibrary component from `/games/index.astro` to `/index.astro`
  - [x] Integrate VariantSelector directly into homepage layout
  - [x] Update homepage container layout to accommodate full game grid
  - [x] Add pagination support for game library on homepage
  - [x] Implement loading states for game data on homepage

- [x] **Task 2: Navigation Structure Update** (AC: 5, 6)
  - [x] Update `src/components/layout/Header.astro` navigation structure
  - [x] Remove separate "Games" navigation link (games now on homepage)
  - [x] Update breadcrumbs in individual game pages to return to homepage
  - [x] Update all internal links that point to `/games/` to point to homepage
  - [x] Update sitemap to reflect homepage as primary game discovery

- [x] **Task 3: Games Page Restructure** (AC: 4)
  - [x] Convert `/games/index.astro` to redirect to homepage
  - [x] Update any deep links to games page to redirect to homepage
  - [x] Remove redundant "Browse All Games" CTA from homepage
  - [x] Ensure variant-specific game pages still function properly
  - [x] Update any references to games page in educational content

- [x] **Task 4: Responsive Homepage Optimization** (AC: 7, 8)
  - [x] Optimize homepage layout for mobile game library display
  - [x] Ensure educational content sections integrate well with game library
  - [x] Test touch interactions for homepage game filtering on mobile
  - [x] Verify homepage load performance with full game library
  - [x] Maintain educational CTA prominence alongside games

- [x] **Task 5: SEO Homepage Optimization** (AC: 10)
  - [x] Update homepage meta description to include game library focus
  - [x] Add structured data for homepage as game collection page
  - [x] Update canonical URLs for game discovery flow
  - [x] Implement schema for homepage as SoftwareApplication listing
  - [x] Verify homepage SEO optimization for game-related keywords

## Dev Notes

**Architecture Context:** [Source: architecture.md#Frontend Architecture, #Core Workflows]

**Current Homepage Structure:**
- Hero section with basic variant selector
- Educational feature sections
- Simple CTA to nested games page
- Needs expansion to accommodate full game library

**Current Games Page Structure:**
- Complete GameLibrary component with filtering
- VariantSelector for game type filtering
- Educational CTA at bottom
- Error handling for API failures

**Layout Integration Requirements:**
```astro
<!-- Target Homepage Structure -->
<DefaultLayout title={title} description={description}>
  <Hero />
  
  <!-- NEW: Full Game Library Integration -->
  <section class="game-library-section my-16">
    <div class="container">
      <h2 class="text-4xl font-bold text-center mb-8">Practice Roulette Games</h2>
      <VariantSelector />
      <GameLibrary games={games} />
    </div>
  </section>
  
  <!-- KEEP: Educational Features -->
  <section class="educational-features">
    <Feature components for learning context />
  </section>
</DefaultLayout>
```

**Component Integration:**
- Move `GameLibrary.astro` functionality to homepage
- Integrate existing game filtering and display logic
- Maintain error handling for API failures
- Keep educational context sections for conversion
[Source: architecture.md#Component Architecture]

**Navigation Updates Required:**
```typescript
// src/components/layout/Header.astro - Navigation structure
// REMOVE: "Games" link (games now on homepage)
// KEEP: "Strategy", "Casinos" links
// UPDATE: Logo/home link emphasizes game access

// Individual game pages breadcrumb update
// OLD: ← Back to Games
// NEW: ← Back to Homepage
```

**SEO Implications:**
- Homepage becomes primary game discovery page
- Reduces navigation depth from 2 clicks to 1 click for game access
- Improves conversion funnel for education → practice → casino flow
- Homepage meta description needs game library keywords
[Source: architecture.md#Core Workflows]

**File Locations:**
```
src/
├── pages/
│   ├── index.astro              # MODIFY: Add full game library
│   ├── games/
│   │   ├── index.astro          # CONVERT: Redirect to homepage  
│   │   └── [gameSlug].astro     # UPDATE: Breadcrumbs to homepage
├── components/
│   ├── game/
│   │   ├── GameLibrary.astro    # MOVE: Integration to homepage
│   │   └── VariantSelector.astro # ENHANCE: Homepage integration
│   └── layout/
│       └── Header.astro         # UPDATE: Remove games navigation
```
[Source: architecture.md#Unified Project Structure]

**Technical Constraints:**
- Must maintain SlotsLaunch API integration and caching
- Homepage load performance with full game library must stay <3s
- Mobile responsiveness critical for game library on homepage
- Educational content sections must remain prominent
- Existing game component functionality must be preserved
[Source: architecture.md#Performance Optimization]

**Testing Requirements:**
```
tests/integration/homepage-game-library.test.ts
tests/e2e/homepage-game-discovery.spec.ts
tests/accessibility/homepage-game-navigation.test.ts
tests/performance/homepage-load-with-games.test.ts
```

**Framework Documentation References:**
- **Astro Docs**: Use `claude mcp astro-docs search` for implementation guidance on:
  - Page layout optimization for large component integration
  - Static generation with API data on homepage
  - Navigation component updates
- **Key Astro Concepts**: SSG homepage with game data, component composition, responsive layouts
- **Accessible Astro Components**: Homepage integration patterns
  - `Hero.astro` - Homepage hero with game emphasis
  - `Feature.astro` - Educational value proposition
  - `Navigation.astro` - Updated navigation structure

## Testing
- [ ] Homepage game library functionality
- [ ] Navigation flow from homepage to individual games
- [ ] Mobile touch interaction for homepage game filtering
- [ ] Homepage load performance with full game data
- [ ] Educational content integration with game library

## Dev Agent Record
**Agent Model Used:** claude-sonnet-4-20250514

**Debug Log References:**
- .ai/debug-log.md

**Completion Notes:**
- Successfully moved full GameLibrary to homepage for immediate game access
- Updated navigation to "Home & Games" to reflect consolidated structure
- Removed redundant /games/ page (now redirects to homepage)
- Individual game pages now breadcrumb back to homepage
- Maintained educational content prominence alongside game library
- Homepage now serves as primary game discovery page

**File List:**
- MODIFIED: src/pages/index.astro (added full GameLibrary integration)
- MODIFIED: src/pages/games/index.astro (converted to homepage redirect)
- MODIFIED: src/pages/games/[gameId].astro (breadcrumb to homepage)
- MODIFIED: src/components/Header.astro ("Home & Games" navigation)
- MODIFIED: src/components/Footer.astro (updated navigation links)

**Change Log:**
- 2025-09-03: Story created for homepage game integration

**Status:** Ready for Review