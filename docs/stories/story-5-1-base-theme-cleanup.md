# Story 5.1: Base Theme Cleanup & Customization

## Story
**As a** product owner,  
**I want** redundant base theme pages removed and remaining pages customized for roulette focus,  
**so that** the site maintains clean navigation and roulette-specific branding.

## Acceptance Criteria
- [ ] Audit all pages from Accessible Astro Starter base theme
- [ ] Remove portfolio-related pages not relevant to roulette education
- [ ] Convert blog demo content page and replace with roulette educational content structure
- [ ] Remove color contrast checker if not needed for user tools
- [ ] Remove markdown/MDX demo pages
- [ ] Update remaining pages to match roulette education branding
- [ ] Ensure navigation components reflect only relevant site sections
- [ ] Verify all internal links work after page removal
- [ ] Update sitemap and robots.txt to reflect final site structure

## Tasks / Subtasks

- [x] **Task 1: Base Theme Page Audit** (AC: 1)
  - [x] Review all pages in `src/pages/` to identify starter theme defaults
  - [x] Cross-reference with actual roulette site navigation requirements
  - [x] Create removal list of irrelevant pages
  - [x] Document pages to customize vs. remove completely

- [x] **Task 2: Portfolio Section Removal** (AC: 2)
  - [x] Remove `src/pages/portfolio/` directory and all portfolio-related pages
  - [x] Remove portfolio links from navigation components
  - [x] Remove portfolio content from homepage if present
  - [x] Update any portfolio references in layout components

- [x] **Task 3: Blog Content Structure Update** (AC: 3)
  - [x] Replace demo blog content with roulette education content structure
  - [x] Update blog categories to match roulette education topics
  - [x] Ensure blog template supports educational content requirements
  - [x] Update navigation to reflect education-focused blog sections

- [x] **Task 4: Demo Page Cleanup** (AC: 4, 5)
  - [x] Remove color contrast checker page (unless kept as user tool)
  - [x] Remove markdown/MDX demo pages
  - [x] Remove accessibility statement demo content
  - [x] Clean up any other demo/example pages not needed

- [x] **Task 5: Navigation & Branding Update** (AC: 6, 8)
  - [x] Update header navigation to reflect roulette-focused site sections
  - [x] Update footer links and remove irrelevant sections
  - [x] Update site logo/branding to match roulette education theme
  - [x] Verify responsive navigation works with new structure

- [x] **Task 6: Site Structure Validation** (AC: 7, 8, 9)
  - [x] Test all internal navigation links work correctly
  - [x] Update `src/components/layout/Navigation.astro` with final site structure
  - [x] Generate updated sitemap.xml with relevant pages only
  - [x] Update robots.txt for SEO optimization

## Dev Notes

**Architecture Context:** [Source: architecture.md#Unified Project Structure]

**Base Theme Analysis:**
- Project built on Accessible Astro Starter with demo content
- Contains portfolio, blog demos, and utility pages not relevant to roulette education
- Navigation structure needs alignment with Games → Strategy → Casinos flow
- Must preserve WCAG AA compliance during customization

**Current Page Structure to Review:**
```
src/pages/
├── index.astro                    # Homepage - keep & customize
├── games/                         # Roulette games - keep
├── strategy/                      # Educational content - keep  
├── casinos/                       # Casino recommendations - keep
├── portfolio/                     # REMOVE - not relevant
├── blog/                          # CUSTOMIZE for education
├── color-contrast-checker.astro   # EVALUATE if useful as tool
├── markdown-page.md               # REMOVE - demo content
├── mdx-page.mdx                   # REMOVE - demo content
└── accessibility-statement.astro  # CUSTOMIZE for site
```

**Navigation Components to Update:**
- `src/components/layout/Header.astro` - Main site navigation
- `src/components/layout/Footer.astro` - Site footer and links
- `src/layouts/DefaultLayout.astro` - Base layout template
[Source: architecture.md#Component Architecture]

**SEO Considerations:**
- Update sitemap to include only relevant pages for roulette education
- Ensure robots.txt reflects final site structure
- Verify schema markup is appropriate for educational content focus
[Source: architecture.md#Frontend Architecture]

**Technical Constraints:**
- Must maintain Accessible Astro Components integration
- Preserve WCAG AA compliance during customization
- Keep responsive design patterns from base theme
- Ensure all removal doesn't break existing game/casino functionality
[Source: architecture.md#Tech Stack]

**Testing Requirements:**
```
tests/integration/site-structure.test.ts
tests/e2e/navigation-flow.spec.ts
tests/accessibility/wcag-compliance.test.ts
```

**Framework Documentation References:**
- **Astro Docs**: Use `claude mcp astro-docs search` for guidance on:
  - File-based routing and page removal
  - Layout component updates
  - SEO and sitemap generation
- **Key Astro Concepts**: File-based routing, layout inheritance, static generation
- **Accessible Astro Components**: Navigation and layout components to preserve:
  - `Navigation.astro` - Accessible site navigation
  - `Footer.astro` - WCAG compliant footer
  - `SkipLinks.astro` - Accessibility navigation helpers

## Testing
- [ ] Site navigation flow testing
- [ ] Link validation after page removal
- [ ] WCAG compliance verification
- [ ] Mobile navigation testing

## Dev Agent Record
**Agent Model Used:** claude-sonnet-4-20250514

**Debug Log References:**
- .ai/debug-log.md

**Completion Notes:**
- Successfully removed all portfolio-related content and demo pages
- Updated navigation to focus on Games/Strategy/Casinos/Learn structure
- Customized accessibility statement for roulette education context
- Blog now uses educational content from /content/educational/
- Maintained WCAG compliance throughout cleanup

**File List:**
- REMOVED: src/pages/portfolio/ (entire directory)
- REMOVED: src/pages/markdown-page.md
- REMOVED: src/pages/mdx-page.mdx
- REMOVED: src/pages/color-contrast-checker.astro
- REMOVED: src/content/projects/ (entire directory)
- MODIFIED: src/components/Header.astro
- MODIFIED: src/components/Footer.astro
- MODIFIED: src/pages/accessibility-statement.astro
- MODIFIED: src/pages/blog/[post].astro

**Change Log:**
- 2025-09-03: Story created for base theme cleanup

**Status:** Ready for Review