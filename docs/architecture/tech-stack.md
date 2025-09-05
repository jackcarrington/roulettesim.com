# Tech Stack - RouletteSim.com

## Overview

RouletteSim.com is an educational roulette platform built with modern web technologies, focusing on performance, accessibility, and educational value. This document outlines the complete technology stack and architectural decisions.

## Core Framework

### Astro 5.8+ (Static Site Generator)
- **Why**: Optimal performance through islands architecture and partial hydration
- **Benefits**: Zero JS by default, component agnostic, excellent SEO
- **Configuration**: Static output for maximum performance and CDN compatibility

```javascript
// astro.config.mjs
export default defineConfig({
  output: 'static',
  site: 'https://roulettesim.com',
  integrations: [mdx(), react(), sitemap(), icon(), compress()]
})
```

## Frontend Technologies

### React 18
- **Usage**: Interactive components (RouletteAnimation.tsx, GameGridPro.tsx)
- **Pattern**: Islands architecture - hydrated only when needed
- **State Management**: Nanostores for global state

### TypeScript 5.9+
- **Configuration**: Strict mode with Astro's strict tsconfig
- **Path Aliases**: Comprehensive alias system for clean imports
- **Type Safety**: Runtime validation with Zod schemas

### Styling System

#### Tailwind CSS 4
- **Configuration**: Dark mode support with `.darkmode` class
- **Integration**: Vite plugin for optimal performance
- **Customization**: Minimal config, leveraging utility-first approach

#### SCSS Architecture
```
src/assets/scss/
├── base/
│   ├── _root.scss        # CSS custom properties
│   ├── _button.scss      # Unified button system
│   ├── _font.scss        # Atkinson Hyperlegible font
│   └── _mixins.scss      # Reusable SCSS mixins
└── index.scss            # Main stylesheet
```

#### Design System
- **Typography**: Atkinson Hyperlegible font for accessibility
- **Colors**: CSS custom properties with light/dark mode support
- **Components**: Unified `.button` class system
- **Spacing**: Consistent spacing scale with CSS variables

## State Management

### Nanostores
- **Global State**: `gameState.ts`, `sessionState.ts`
- **React Integration**: `@nanostores/react` for component binding
- **Benefits**: Minimal bundle size, framework agnostic

```typescript
// Example: gameState.ts
import { atom } from 'nanostores'

export const selectedGame = atom<GameData | null>(null)
export const gameLibrary = atom<GameData[]>([])
```

## Content Management

### Astro Content Collections
- **Educational Content**: Markdown with frontmatter validation
- **Casino Data**: JSON with Zod schema validation
- **Benefits**: Type-safe content, automatic routing, SEO optimization

```typescript
// content.config.mjs
const educationalSchema = z.object({
  title: z.string(),
  author: z.object({
    name: z.string(),
    credentials: z.string()
  }),
  publishDate: z.date()
})

export const collections = {
  educational: defineCollection({
    type: 'content',
    schema: educationalSchema
  })
}
```

## API Integration

### SlotsLaunch API
- **Authentication**: Token-based authentication
- **Caching**: 30-minute server-side cache for game data
- **Fallback**: Mock service for development and API failures
- **CORS**: Configured with origin domain validation

### API Architecture
```
src/services/
├── apiClient.ts          # HTTP client wrapper
├── mockGameService.ts    # Fallback game data
├── casinoService.ts      # Casino recommendations
└── analyticsService.ts   # Privacy-first tracking
```

## Development Tools

### Code Quality

#### ESLint 9.27+
- **Configuration**: Flat config system
- **Rules**: 
  - Astro plugin with JSX A11Y strict mode
  - TypeScript recommended rules
  - Accessibility-focused linting
- **Integration**: VSCode and CI/CD pipeline

#### Prettier 3.5+
- **Plugins**: 
  - `prettier-plugin-astro`
  - `prettier-plugin-tailwindcss`
  - `prettier-plugin-css-order`
- **Configuration**: Consistent code formatting across team

### Testing Framework

#### Vitest 3.2+
- **Unit Testing**: Components and services
- **Configuration**: JSDoc integration with fast execution
- **Coverage**: Comprehensive test coverage reporting

#### Playwright 1.40+
- **E2E Testing**: Critical user journeys
- **Cross-browser**: Chromium, Firefox, Safari support
- **CI/CD Integration**: Automated testing pipeline

#### Accessibility Testing
- **@axe-core/cli**: Automated accessibility auditing
- **Integration**: `npm run test:a11y` command
- **Standards**: WCAG AA compliance validation

## UI Component Libraries

### Shadcn/UI (React Components)
- **Components**: Button, Card, Dialog, Command, Popover
- **Integration**: MCP server configuration for component management
- **Customization**: Tailwind-based with CSS variables

### Radix UI Primitives
- **Accessibility**: ARIA-compliant component primitives
- **Components**: Dialog, Popover, Slot
- **Benefits**: Unstyled, accessible foundation

### Accessible Astro Components 4.1+
- **Foundation**: Base accessible components
- **Integration**: Astro-specific accessibility patterns

### Icon System
- **Astro Icon**: SVG icon system
- **Lucide React**: React icon library
- **Iconify**: JSON icon collections (@iconify-json/lucide)

## Animation and Media

### Lottie React 2.4+
- **Usage**: RouletteAnimation.tsx component
- **Benefits**: Lightweight vector animations
- **Performance**: Optimized for web delivery

### Asset Optimization
- **SVGO**: SVG optimization
- **Astro Compress**: Production build optimization
- **Image Optimization**: Built-in Astro image processing

## Development Environment

### Build Tools

#### Vite (via Astro)
- **Plugins**: Tailwind CSS, SCSS preprocessing
- **Optimization**: Tree shaking, code splitting
- **Development**: Hot module replacement

#### Node.js Ecosystem
- **Package Manager**: npm
- **Node Version**: Modern LTS support
- **Scripts**: Development, build, test, preview workflows

### Path Resolution
```typescript
// Vite alias configuration
resolve: {
  alias: {
    '@components': './src/components',
    '@services': './src/services',
    '@stores': './src/stores',
    '@types': './src/types',
    '@utils': './src/utils',
    '@content': './src/content'
  }
}
```

## Analytics and Privacy

### Privacy-First Analytics
- **Implementation**: Custom analytics service
- **Storage**: localStorage with user consent
- **Data**: Session-based, no personal identification
- **Compliance**: GDPR-friendly approach

### Conversion Tracking
- **Algorithm**: Engagement-based scoring
- **Metrics**: Game interaction, educational content consumption
- **Privacy**: No third-party tracking services

## Deployment and Hosting

### Static Hosting
- **Primary**: Netlify with GitHub integration
- **Alternative**: Direct deployment capability
- **CDN**: Global edge distribution
- **SSL**: Automatic HTTPS with custom domain

### Build Process
```json
{
  "scripts": {
    "dev": "astro dev",
    "build": "astro build",
    "preview": "astro preview",
    "type-check": "astro check"
  }
}
```

### Environment Configuration
- **Variables**: `.env` for development, Netlify for production
- **Required**: 
  - `SLOTSLAUNCH_API_TOKEN`
  - `ORIGIN_DOMAIN`
  - `PUBLIC_SITE_URL`

## Data Validation and Security

### Runtime Validation
- **Zod 3.22+**: Schema validation for all external data
- **Type Safety**: Runtime type checking
- **API Responses**: Validated game data and casino information

### Security Practices
- **Input Sanitization**: `sanitize-html` for user content
- **API Security**: Token-based authentication
- **CORS**: Strict origin validation
- **Content Security**: No inline scripts, proper CSP headers

## Performance Optimization

### Core Web Vitals
- **Strategy**: Astro's islands architecture minimizes JavaScript
- **Images**: Optimized loading and formats
- **Critical CSS**: Inlined for above-the-fold content
- **Lazy Loading**: Non-critical resources loaded on demand

### Caching Strategy
- **Static Assets**: Long-term caching with CDN
- **API Responses**: Server-side caching (30 minutes)
- **Build Output**: Optimized for edge delivery

## Browser Support

### Modern Browsers
- **Chrome**: Latest 2 versions
- **Firefox**: Latest 2 versions  
- **Safari**: Latest 2 versions
- **Edge**: Latest 2 versions

### Progressive Enhancement
- **Core Functionality**: Works without JavaScript
- **Enhanced Experience**: Interactive features with JavaScript
- **Accessibility**: Screen reader and keyboard navigation support

## Development Workflow

### Local Development
```bash
npm run dev          # Development server (localhost:4321)
npm run build        # Production build
npm run preview      # Preview production build
npm run test         # Unit tests
npm run test:e2e     # E2E tests
npm run test:a11y    # Accessibility tests
npm run type-check   # TypeScript validation
```

### Quality Assurance
1. **Type Safety**: Astro check + TypeScript
2. **Code Quality**: ESLint with accessibility rules
3. **Testing**: Vitest unit tests + Playwright E2E
4. **Accessibility**: Axe-core automated testing
5. **Performance**: Lighthouse CI integration

## Future Considerations

### Scalability
- **Content**: Headless CMS integration potential
- **Internationalization**: i18n ready architecture
- **Performance**: Service worker for offline capability
- **Features**: WebGL roulette simulation enhancement

### Technology Upgrades
- **Astro**: Following stable release cycle
- **React**: Concurrent features adoption
- **Tailwind**: CSS container queries integration
- **Testing**: Visual regression testing addition