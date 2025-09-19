/**
 * UnifiedButton Component Tests
 * Tests for the unified button system bridging SCSS and Shadcn patterns
 */

import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { UnifiedButton, CasinoButton, PremiumButton } from '../unified-button'

describe('UnifiedButton Component', () => {
  describe('Basic functionality', () => {
    it('should render with default variant', () => {
      render(<UnifiedButton>Default Button</UnifiedButton>)
      const button = screen.getByRole('button')

      expect(button).toBeInTheDocument()
      expect(button).toHaveTextContent('Default Button')
      expect(button).toHaveClass('button')
    })

    it('should apply SCSS classes when useScss is true (default)', () => {
      render(
        <UnifiedButton variant="casino" size="lg">
          Casino Button
        </UnifiedButton>
      )
      const button = screen.getByRole('button')

      expect(button).toHaveClass('button')
      expect(button).toHaveClass('variant-casino')
      expect(button).toHaveClass('size-lg')
    })

    it('should apply custom className with SCSS', () => {
      render(
        <UnifiedButton className="custom-class">
          Custom Button
        </UnifiedButton>
      )
      const button = screen.getByRole('button')

      expect(button).toHaveClass('button')
      expect(button).toHaveClass('custom-class')
    })
  })

  describe('Variant support', () => {
    it('should apply secondary variant correctly', () => {
      render(
        <UnifiedButton variant="secondary">
          Secondary Button
        </UnifiedButton>
      )
      const button = screen.getByRole('button')

      expect(button).toHaveClass('button')
      expect(button).toHaveClass('color-secondary')
    })

    it('should apply casino variant correctly', () => {
      render(
        <UnifiedButton variant="casino">
          Casino Button
        </UnifiedButton>
      )
      const button = screen.getByRole('button')

      expect(button).toHaveClass('variant-casino')
    })

    it('should apply premium variant correctly', () => {
      render(
        <UnifiedButton variant="premium">
          Premium Button
        </UnifiedButton>
      )
      const button = screen.getByRole('button')

      expect(button).toHaveClass('variant-premium')
    })
  })

  describe('Size support', () => {
    it('should apply large size correctly', () => {
      render(
        <UnifiedButton size="lg">
          Large Button
        </UnifiedButton>
      )
      const button = screen.getByRole('button')

      expect(button).toHaveClass('size-lg')
    })

    it('should apply default size (no class) correctly', () => {
      render(
        <UnifiedButton size="default">
          Default Size Button
        </UnifiedButton>
      )
      const button = screen.getByRole('button')

      expect(button).toHaveClass('button')
      // Default size should not add additional size class
      expect(button).not.toHaveClass('size-lg')
    })
  })

  describe('Icon support', () => {
    it('should render with left icon and has-icon class', () => {
      const icon = <span data-testid="test-icon">🎰</span>
      render(
        <UnifiedButton icon={icon} iconPosition="left">
          Button with Icon
        </UnifiedButton>
      )

      const button = screen.getByRole('button')
      const iconElement = screen.getByTestId('test-icon')

      expect(button).toHaveClass('has-icon')
      expect(iconElement).toBeInTheDocument()
    })

    it('should render with right icon', () => {
      const icon = <span data-testid="test-icon">🎰</span>
      render(
        <UnifiedButton icon={icon} iconPosition="right">
          Button with Right Icon
        </UnifiedButton>
      )

      const button = screen.getByRole('button')
      const iconElement = screen.getByTestId('test-icon')

      expect(button).toHaveClass('has-icon')
      expect(iconElement).toBeInTheDocument()
    })
  })

  describe('Enhanced states', () => {
    it('should apply enhanced states class when enabled', () => {
      render(
        <UnifiedButton enhancedStates={true} variant="casino">
          Enhanced Casino Button
        </UnifiedButton>
      )
      const button = screen.getByRole('button')

      expect(button).toHaveClass('casino-enhanced')
    })

    it('should not apply enhanced states class when disabled', () => {
      render(
        <UnifiedButton enhancedStates={false} variant="casino">
          Regular Casino Button
        </UnifiedButton>
      )
      const button = screen.getByRole('button')

      expect(button).not.toHaveClass('casino-enhanced')
    })
  })

  describe('Loading state', () => {
    it('should show loading spinner and disable button when loading', () => {
      render(
        <UnifiedButton loading={true}>
          Loading Button
        </UnifiedButton>
      )
      const button = screen.getByRole('button')

      expect(button).toBeDisabled()
      expect(button).toHaveAttribute('aria-busy', 'true')
      expect(button).toHaveAttribute('aria-label', 'Loading...')

      // Should have loading spinner
      const spinner = button.querySelector('.button-spinner')
      expect(spinner).toBeInTheDocument()
    })

    it('should hide content when loading', () => {
      render(
        <UnifiedButton loading={true}>
          Button Content
        </UnifiedButton>
      )
      const button = screen.getByRole('button')

      // Content should not be visible, only loading spinner
      expect(button).not.toHaveTextContent('Button Content')
    })

    it('should hide right icon when loading', () => {
      const icon = <span data-testid="test-icon">🎰</span>
      render(
        <UnifiedButton loading={true} icon={icon} iconPosition="right">
          Loading with Icon
        </UnifiedButton>
      )

      const iconElement = screen.queryByTestId('test-icon')
      expect(iconElement).not.toBeInTheDocument()
    })
  })

  describe('Accessibility', () => {
    it('should support custom aria-label', () => {
      render(
        <UnifiedButton aria-label="Custom Label">
          Button
        </UnifiedButton>
      )
      const button = screen.getByRole('button')

      expect(button).toHaveAttribute('aria-label', 'Custom Label')
    })

    it('should override aria-label when loading', () => {
      render(
        <UnifiedButton loading={true} aria-label="Custom Label">
          Button
        </UnifiedButton>
      )
      const button = screen.getByRole('button')

      expect(button).toHaveAttribute('aria-label', 'Loading...')
    })

    it('should have proper focus management', () => {
      render(<UnifiedButton>Focusable Button</UnifiedButton>)
      const button = screen.getByRole('button')

      button.focus()
      expect(button).toHaveFocus()
    })
  })

  describe('asChild prop', () => {
    it('should render as different element when asChild is true', () => {
      render(
        <UnifiedButton asChild>
          <a href="/test">Link Button</a>
        </UnifiedButton>
      )

      const link = screen.getByText('Link Button')
      expect(link).toBeInTheDocument()
      expect(link).toHaveClass('button')
      expect(link).toHaveAttribute('href', '/test')
    })
  })
})

describe('CasinoButton Component', () => {
  it('should render with casino variant and enhanced states', () => {
    render(<CasinoButton>Casino Action</CasinoButton>)
    const button = screen.getByRole('button')

    expect(button).toHaveClass('variant-casino')
    expect(button).toHaveClass('casino-enhanced')
  })

  it('should accept additional props', () => {
    render(
      <CasinoButton size="lg" disabled>
        Disabled Casino Button
      </CasinoButton>
    )
    const button = screen.getByRole('button')

    expect(button).toBeDisabled()
    expect(button).toHaveClass('size-lg')
  })
})

describe('PremiumButton Component', () => {
  it('should render with premium variant, enhanced states, and large size', () => {
    render(<PremiumButton>Premium Action</PremiumButton>)
    const button = screen.getByRole('button')

    expect(button).toHaveClass('variant-premium')
    expect(button).toHaveClass('casino-enhanced')
    expect(button).toHaveClass('size-lg')
  })

  it('should override size prop', () => {
    render(
      <PremiumButton size="default">
        Premium with Default Size
      </PremiumButton>
    )
    const button = screen.getByRole('button')

    // PremiumButton forces size="lg"
    expect(button).toHaveClass('size-lg')
  })
})

describe('Coexistence with existing button systems', () => {
  it('should work alongside standard HTML buttons', () => {
    render(
      <div>
        <button>Standard HTML Button</button>
        <UnifiedButton>Unified Button</UnifiedButton>
      </div>
    )

    const buttons = screen.getAllByRole('button')
    expect(buttons).toHaveLength(2)

    // Standard button should not have .button class
    expect(buttons[0]).not.toHaveClass('button')
    // Unified button should have .button class
    expect(buttons[1]).toHaveClass('button')
  })

  it('should maintain backward compatibility for existing class usage', () => {
    render(
      <div>
        {/* Simulate existing SCSS button usage */}
        <a className="button color-secondary">Existing SCSS Button</a>
        <UnifiedButton variant="secondary">New Unified Button</UnifiedButton>
      </div>
    )

    const scssButton = screen.getByText('Existing SCSS Button')
    const unifiedButton = screen.getByText('New Unified Button')

    // Both should have similar classes
    expect(scssButton).toHaveClass('button', 'color-secondary')
    expect(unifiedButton).toHaveClass('button', 'color-secondary')
  })
})