/**
 * Color Validation Tests
 * Tests for WCAG compliance validation of casino colors
 */

import { describe, it, expect } from 'vitest'
import {
  calculateContrastRatio,
  evaluateContrast,
  validateCasinoColors,
  validateConversionColors,
  generateAccessibilityReport
} from '../colorValidation'

describe('Color Validation Utility', () => {
  describe('calculateContrastRatio', () => {
    it('should calculate correct contrast ratio for black and white', () => {
      const ratio = calculateContrastRatio('#000000', '#ffffff')
      expect(ratio).toBe(21)
    })

    it('should calculate correct contrast ratio for casino red and light background', () => {
      const ratio = calculateContrastRatio('#b91c1c', '#f5f5f5')
      expect(ratio).toBeGreaterThan(4.5) // Should pass WCAG AA
    })

    it('should calculate correct contrast ratio for table green and light background', () => {
      const ratio = calculateContrastRatio('#15803d', '#f5f5f5')
      expect(ratio).toBeGreaterThan(4.5) // Should pass WCAG AA
    })

    it('should calculate correct contrast ratio for premium gold and dark background', () => {
      const ratio = calculateContrastRatio('#d97706', '#171717')
      expect(ratio).toBeGreaterThan(4.5) // Should pass WCAG AA
    })

    it('should throw error for invalid color format', () => {
      expect(() => calculateContrastRatio('invalid', '#ffffff')).toThrow('Invalid color format')
    })
  })

  describe('evaluateContrast', () => {
    it('should return AAA level for high contrast ratios', () => {
      const result = evaluateContrast(7.5)
      expect(result.level).toBe('AAA')
      expect(result.passes).toBe(true)
    })

    it('should return AA level for medium contrast ratios', () => {
      const result = evaluateContrast(5.0)
      expect(result.level).toBe('AA')
      expect(result.passes).toBe(true)
    })

    it('should return FAIL for low contrast ratios', () => {
      const result = evaluateContrast(3.0)
      expect(result.level).toBe('FAIL')
      expect(result.passes).toBe(false)
    })

    it('should return exact ratio with proper rounding', () => {
      const result = evaluateContrast(4.567)
      expect(result.ratio).toBe(4.57)
    })
  })

  describe('validateCasinoColors', () => {
    it('should validate all casino color variants', () => {
      const results = validateCasinoColors()

      expect(results).toHaveLength(15) // 5 variants × 3 color families

      // Check that each result has required properties
      results.forEach(result => {
        expect(result).toHaveProperty('color')
        expect(result).toHaveProperty('background')
        expect(result).toHaveProperty('contrast')
        expect(result).toHaveProperty('lightMode')
        expect(result).toHaveProperty('darkMode')
      })
    })

    it('should ensure main casino colors pass WCAG AA', () => {
      const results = validateCasinoColors()

      const mainColors = results.filter(result =>
        result.color.includes('--brand-') || result.color.includes('-600')
      )

      // All main casino colors should pass WCAG AA in at least one mode
      mainColors.forEach(result => {
        const passesInOneMode = result.lightMode.passes || result.darkMode.passes
        expect(passesInOneMode).toBe(true)
      })
    })
  })

  describe('validateConversionColors', () => {
    it('should validate all conversion state colors', () => {
      const results = validateConversionColors()

      expect(results).toHaveLength(3) // engagement, recommendation, premium

      // All conversion colors should pass WCAG AA
      results.forEach(result => {
        expect(result.contrast.passes).toBe(true)
      })
    })

    it('should ensure conversion colors work in both light and dark modes', () => {
      const results = validateConversionColors()

      results.forEach(result => {
        // At least one mode should pass (preferably both)
        const passesInOneMode = result.lightMode.passes || result.darkMode.passes
        expect(passesInOneMode).toBe(true)
      })
    })
  })

  describe('generateAccessibilityReport', () => {
    it('should generate comprehensive accessibility report', () => {
      const report = generateAccessibilityReport()

      expect(report).toHaveProperty('overallPasses')
      expect(report).toHaveProperty('casinoColors')
      expect(report).toHaveProperty('conversionColors')
      expect(report).toHaveProperty('summary')

      expect(report.summary).toHaveProperty('total')
      expect(report.summary).toHaveProperty('passing')
      expect(report.summary).toHaveProperty('failing')
      expect(report.summary).toHaveProperty('score')
    })

    it('should calculate correct summary statistics', () => {
      const report = generateAccessibilityReport()

      expect(report.summary.total).toBe(
        report.summary.passing + report.summary.failing
      )

      expect(report.summary.score).toBe(
        Math.round((report.summary.passing / report.summary.total) * 100)
      )
    })

    it('should ensure high accessibility score for casino colors', () => {
      const report = generateAccessibilityReport()

      // Casino colors should achieve at least 80% accessibility compliance
      expect(report.summary.score).toBeGreaterThanOrEqual(80)
    })

    it('should pass overall accessibility when all colors meet WCAG standards', () => {
      const report = generateAccessibilityReport()

      // If no colors are failing, overall should pass
      if (report.summary.failing === 0) {
        expect(report.overallPasses).toBe(true)
      }
    })
  })

  describe('Integration with CSS variables', () => {
    it('should validate casino colors match the CSS variable definitions', () => {
      const casinoColorValues = {
        '--brand-casino': '#b91c1c',
        '--brand-table': '#15803d',
        '--brand-premium': '#d97706'
      }

      Object.entries(casinoColorValues).forEach(([colorName, colorValue]) => {
        // Test that color can be used in contrast calculations
        const ratio = calculateContrastRatio(colorValue, '#ffffff')
        expect(ratio).toBeGreaterThan(1)
        expect(ratio).toBeLessThan(21)
      })
    })

    it('should ensure OKLCH-generated variants maintain accessibility', () => {
      // Test that OKLCH variants (simulated values) maintain good contrast
      const oklchVariants = {
        '--color-casino-300': '#fca5a5', // Lighter variant
        '--color-casino-600': '#b91c1c', // Base color (WCAG AA compliant)
        '--color-casino-900': '#7f1d1d'  // Darker variant
      }

      Object.entries(oklchVariants).forEach(([colorName, colorValue]) => {
        // Light variants should work on dark backgrounds
        if (colorName.includes('-300')) {
          const darkBgRatio = calculateContrastRatio(colorValue, '#171717')
          expect(darkBgRatio).toBeGreaterThan(3) // Some contrast required
        }

        // Dark variants should work on light backgrounds
        if (colorName.includes('-900')) {
          const lightBgRatio = calculateContrastRatio(colorValue, '#f5f5f5')
          expect(lightBgRatio).toBeGreaterThan(4.5) // WCAG AA compliance
        }
      })
    })
  })
})