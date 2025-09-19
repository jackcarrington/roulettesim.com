/**
 * Test setup for React Testing Library and Vitest
 */

import '@testing-library/jest-dom'

// Mock CSS imports
const mockCSS = new Proxy({}, {
  get() {
    return ''
  }
})

// Mock CSS modules
global.CSS = mockCSS as any

// Mock IntersectionObserver
global.IntersectionObserver = class IntersectionObserver {
  constructor() {}
  disconnect() {}
  observe() {}
  unobserve() {}
}

// Mock ResizeObserver
global.ResizeObserver = class ResizeObserver {
  constructor() {}
  disconnect() {}
  observe() {}
  unobserve() {}
}

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: (query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => {},
  }),
})

// Mock CSS custom properties (for casino color variables)
Object.defineProperty(document.documentElement.style, 'getPropertyValue', {
  value: (prop: string) => {
    const cssVariables: Record<string, string> = {
      '--color-casino-600': '#b91c1c',
      '--color-casino-700': '#991b1b',
      '--color-casino-800': '#7f1d1d',
      '--color-premium-600': '#d97706',
      '--color-premium-700': '#b45309',
      '--color-premium-800': '#92400e',
      '--space-2xs': '0.5rem',
      '--space-xs': '0.75rem',
      '--space-s': '1rem',
      '--target-size-max': '44px',
      '--animation-speed-medium': '0.3s',
      '--cubic-bezier': 'cubic-bezier(0.1, 0.1, 0, 1)',
    }
    return cssVariables[prop] || ''
  }
})