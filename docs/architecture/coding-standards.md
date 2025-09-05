# Coding Standards - RouletteSim.com

## Overview

This document defines the coding standards and best practices for the RouletteSim.com educational roulette platform. These standards ensure consistency, maintainability, and accessibility across the codebase.

## Code Organization

### File Structure Convention
- Use kebab-case for file names: `game-library.astro`, `casino-service.ts`
- Component files use PascalCase: `RouletteAnimation.tsx`, `GameGridPro.tsx`
- Directory names use kebab-case: `game/`, `conversion/`, `education/`

### Import Path Aliases
Always use TypeScript path aliases for imports:
```typescript
// ✅ Good
import { GameFrame } from '@components/game/GameFrame.astro'
import { analyticsService } from '@services/analyticsService'

// ❌ Bad  
import { GameFrame } from '../../../components/game/GameFrame.astro'
```

## TypeScript Standards

### Strict Type Safety
- Use strict TypeScript configuration (`astro/tsconfigs/strict`)
- No `any` types - use proper type definitions
- Prefer interfaces over types for object shapes
- Use Zod for runtime validation

### Type Definitions
```typescript
// ✅ Good - Explicit interface
interface GameData {
  id: string
  name: string
  provider: string
  type: GameType
}

// ✅ Good - Proper union types
type GameType = 'european-roulette' | 'american-roulette' | 'french-roulette'
```

### Error Handling
```typescript
// ✅ Good - Explicit error handling
try {
  const response = await apiClient.fetchGames()
  return response.data
} catch (error) {
  console.error('Failed to fetch games:', error)
  return mockGameService.getFallbackGames()
}
```

## React/JSX Standards

### Component Structure
```tsx
// ✅ Good - Functional component with proper typing
interface GameCardProps {
  game: GameData
  onSelect: (gameId: string) => void
}

export function GameCard({ game, onSelect }: GameCardProps) {
  return (
    <div className="game-card">
      <h3>{game.name}</h3>
      <button onClick={() => onSelect(game.id)}>
        Play Game
      </button>
    </div>
  )
}
```

### Hooks Usage
- Use custom hooks for complex logic: `useGameSearch.ts`
- Leverage nanostores for state management: `gameState.ts`, `sessionState.ts`

## Astro Component Standards

### Component Organization
```astro
---
// Script section - imports, props, logic
import { GameFrame } from '@components/game/GameFrame.astro'

interface Props {
  gameId: string
  title?: string
}

const { gameId, title } = Astro.props
---

<!-- Template section -->
<section class="game-container">
  <h2>{title || 'Play Roulette'}</h2>
  <GameFrame gameId={gameId} />
</section>

<style>
/* Component-specific styles */
.game-container {
  padding: var(--space-lg);
}
</style>
```

## CSS/SCSS Standards

### Design System Usage
- **Always use `.button` class** for interactive elements
- Use CSS custom properties from `_root.scss`
- Follow existing spacing scale (`--space-*`)
- Maintain 4.5:1+ contrast ratios for accessibility

### SCSS Architecture
```scss
// ✅ Good - Use existing variables
.game-card {
  padding: var(--space-md);
  background: var(--color-neutral-100);
  border-radius: var(--radius-md);
  
  &:hover {
    background: var(--color-neutral-200);
  }
}

// ✅ Good - Follow BEM-like naming
.game-library {
  &__header {
    margin-bottom: var(--space-lg);
  }
  
  &__grid {
    display: grid;
    gap: var(--space-md);
  }
}
```

### Color System
- Use CSS variables for colors: `--color-primary-500`, `--color-secondary-400`
- Support both light and dark modes automatically
- Never hardcode color values

## API Integration Standards

### Service Layer Pattern
```typescript
// ✅ Good - Centralized service with error handling
export class GameService {
  private apiClient: ApiClient

  async fetchGames(): Promise<GameData[]> {
    try {
      const response = await this.apiClient.get('/games')
      return this.validateGames(response.data)
    } catch (error) {
      console.error('Game service error:', error)
      return mockGameService.getFallbackGames()
    }
  }
  
  private validateGames(games: unknown): GameData[] {
    return gameDataSchema.parse(games)
  }
}
```

### Environment Variables
- Prefix public variables with `PUBLIC_`
- Use proper typing for environment variables
- Provide fallbacks for development

## Testing Standards

### Unit Testing (Vitest)
```typescript
// ✅ Good - Comprehensive test coverage
describe('GameService', () => {
  it('should fetch games successfully', async () => {
    const mockGames = [{ id: '1', name: 'European Roulette' }]
    vi.mocked(apiClient.get).mockResolvedValue({ data: mockGames })
    
    const result = await gameService.fetchGames()
    
    expect(result).toEqual(mockGames)
  })
  
  it('should fallback to mock data on API failure', async () => {
    vi.mocked(apiClient.get).mockRejectedValue(new Error('API down'))
    
    const result = await gameService.fetchGames()
    
    expect(result).toEqual(mockGameService.getFallbackGames())
  })
})
```

### E2E Testing (Playwright)
- Test critical user journeys
- Verify accessibility with axe-core
- Test both light and dark modes

## Content Standards

### Astro Content Collections
```typescript
// ✅ Good - Zod schema validation
const educationalSchema = z.object({
  title: z.string(),
  description: z.string(),
  author: z.object({
    name: z.string(),
    credentials: z.string(),
  }),
  publishDate: z.date(),
  tags: z.array(z.string()),
})

export const collections = {
  educational: defineCollection({
    type: 'content',
    schema: educationalSchema,
  }),
}
```

### SEO Standards
- Use semantic HTML structure (h1-h5 hierarchy)
- Include proper meta descriptions and titles
- Implement structured data where relevant
- Optimize for Core Web Vitals

## Security Standards

### Data Validation
- Validate all external data with Zod schemas
- Sanitize user inputs
- Use secure API authentication

### Privacy Compliance
- Implement privacy-first analytics
- Store minimal user data
- Provide clear consent mechanisms

## Performance Standards

### Asset Optimization
- Compress images and use modern formats
- Implement lazy loading for non-critical content
- Use Astro's built-in optimizations

### Code Splitting
- Use dynamic imports for heavy components
- Leverage Astro's partial hydration
- Minimize client-side JavaScript

## Accessibility Standards

### WCAG Compliance
- Maintain AA compliance (4.5:1 contrast minimum)
- Provide proper ARIA labels and roles
- Ensure keyboard navigation support
- Test with screen readers

### Component Accessibility
```astro
<!-- ✅ Good - Proper semantic markup -->
<button 
  class="button"
  aria-label="Play European Roulette"
  @click={handleGameSelect}
>
  <Icon name="play" aria-hidden="true" />
  Play Game
</button>
```

## Documentation Standards

### Code Comments
- Use JSDoc for public APIs
- Comment complex business logic
- Keep comments up-to-date with code changes

### README Updates
- Document new features and breaking changes
- Maintain accurate setup instructions
- Include troubleshooting guides

## Version Control Standards

### Commit Messages
```bash
# ✅ Good - Descriptive commit messages
feat(games): add roulette variant filtering
fix(analytics): resolve session tracking edge case
docs(api): update SlotsLaunch integration guide
```

### Branch Strategy
- Use feature branches for new development
- Maintain clean commit history
- Test thoroughly before merging

## Build and Deployment

### Development Workflow
1. Run type checking: `npm run type-check`
2. Run linting: `npm run lint` (implied from ESLint config)
3. Run tests: `npm run test`
4. Run accessibility tests: `npm run test:a11y`

### Production Requirements
- All tests must pass
- No TypeScript errors
- No accessibility violations
- Lighthouse score > 90