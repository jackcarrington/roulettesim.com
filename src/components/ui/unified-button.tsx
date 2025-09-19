/**
 * UnifiedButton Component
 * Bridges SCSS .button styles with Shadcn functionality for casino enhancements
 */

import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@components/lib/utils"

// Enhanced button variants that integrate with existing SCSS classes
const unifiedButtonVariants = cva(
  // Base classes that work with existing SCSS .button
  "button inline-flex items-center justify-center gap-2 whitespace-nowrap font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        // Maps to existing SCSS .button (default)
        default: "",
        // Maps to existing SCSS .button.color-secondary
        secondary: "color-secondary",
        // Maps to new SCSS .button.variant-casino
        casino: "variant-casino",
        // Maps to new SCSS .button.variant-premium
        premium: "variant-premium",
        // Pure Shadcn variants (for components that need React-only styling)
        destructive: "bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90",
        outline: "border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        // Maps to existing SCSS .button (default)
        default: "",
        // Maps to existing SCSS .button.size-lg
        lg: "size-lg",
        // Shadcn-specific sizes
        sm: "h-8 rounded-md px-3 text-xs",
        icon: "h-9 w-9",
      },
      // Casino-specific enhancements
      enhancedStates: {
        false: "",
        true: "enhanced-states", // Class for enhanced casino interactions
      },
      // Loading state support
      loading: {
        false: "",
        true: "loading", // Class for loading state styling
      }
    },
    defaultVariants: {
      variant: "default",
      size: "default",
      enhancedStates: false,
      loading: false,
    },
  }
)

export interface UnifiedButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof unifiedButtonVariants> {
  asChild?: boolean
  // Bridge functionality
  useScss?: boolean // Opt-in to SCSS styling (true by default)
  enhancedStates?: boolean // Enable casino interaction states
  loading?: boolean // Show loading state
  // Icon support (compatible with existing .has-icon)
  icon?: React.ReactNode
  iconPosition?: 'left' | 'right'
}

const UnifiedButton = React.forwardRef<HTMLButtonElement, UnifiedButtonProps>(
  ({
    className,
    variant,
    size,
    enhancedStates = false,
    loading = false,
    useScss = true,
    icon,
    iconPosition = 'left',
    asChild = false,
    children,
    disabled,
    ...props
  }, ref) => {
    const Comp = asChild ? Slot : "button"

    // Build class names
    const variantClasses = unifiedButtonVariants({
      variant,
      size,
      enhancedStates,
      loading,
      className: useScss ? undefined : className // Only apply custom classes if not using SCSS
    })

    // Add .has-icon class when icon is present (compatible with existing SCSS)
    const hasIconClass = icon && useScss ? "has-icon" : ""

    // Combine all classes
    const buttonClasses = cn(
      variantClasses,
      hasIconClass,
      useScss ? className : "", // Apply custom classes when using SCSS
      {
        // Enhanced states for casino interactions
        "casino-enhanced": enhancedStates && (variant === "casino" || variant === "premium"),
      }
    )

    // Handle loading state
    const isDisabled = disabled || loading

    // For asChild mode, we can't add additional elements (icons, spinner)
    // So we simplify to just pass through the child element
    if (asChild) {
      return (
        <Comp
          className={buttonClasses}
          ref={ref}
          disabled={isDisabled}
          aria-busy={loading}
          {...props}
          aria-label={loading ? "Loading..." : props['aria-label']}
        >
          {children}
        </Comp>
      )
    }

    return (
      <Comp
        className={buttonClasses}
        ref={ref}
        disabled={isDisabled}
        aria-busy={loading}
        {...props}
        aria-label={loading ? "Loading..." : props['aria-label']}
      >
        {/* Left icon */}
        {icon && iconPosition === 'left' && (
          <span className="button-icon" aria-hidden="true">
            {icon}
          </span>
        )}

        {/* Loading spinner */}
        {loading && (
          <span className="button-spinner" aria-hidden="true">
            <svg
              className="animate-spin h-4 w-4"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
          </span>
        )}

        {/* Button content */}
        {!loading && children}

        {/* Right icon */}
        {icon && iconPosition === 'right' && !loading && (
          <span className="button-icon" aria-hidden="true">
            {icon}
          </span>
        )}
      </Comp>
    )
  }
)

UnifiedButton.displayName = "UnifiedButton"

// Enhanced button variants for specific casino use cases
export const CasinoButton = React.forwardRef<HTMLButtonElement, UnifiedButtonProps>(
  (props, ref) => (
    <UnifiedButton
      ref={ref}
      variant="casino"
      enhancedStates={true}
      {...props}
    />
  )
)
CasinoButton.displayName = "CasinoButton"

export const PremiumButton = React.forwardRef<HTMLButtonElement, UnifiedButtonProps>(
  ({ size, ...props }, ref) => (
    <UnifiedButton
      ref={ref}
      variant="premium"
      enhancedStates={true}
      {...props}
      size="lg" // Always force lg size for premium buttons
    />
  )
)
PremiumButton.displayName = "PremiumButton"

export { UnifiedButton, unifiedButtonVariants }
export type { UnifiedButtonProps }