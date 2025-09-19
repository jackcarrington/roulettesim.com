import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@components/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground shadow hover:bg-primary/90",
        destructive:
          "bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90",
        outline:
          "border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground",
        secondary:
          "bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
        // Casino variants using CSS variables from Story 5.2
        casino:
          "bg-[var(--color-casino-600)] text-white shadow-md hover:bg-[var(--color-casino-700)] hover:shadow-lg hover:-translate-y-0.5 active:bg-[var(--color-casino-800)] active:translate-y-0 transition-all duration-200",
        premium:
          "bg-gradient-to-br from-[var(--color-premium-600)] to-[var(--color-premium-500)] text-[var(--color-neutral-900)] shadow-lg hover:from-[var(--color-premium-700)] hover:to-[var(--color-premium-600)] hover:shadow-xl hover:-translate-y-0.5 active:from-[var(--color-premium-800)] active:to-[var(--color-premium-700)] active:translate-y-0 transition-all duration-200 relative overflow-hidden before:absolute before:inset-0 before:bg-gradient-to-br before:from-transparent before:to-white/20 before:pointer-events-none",
      },
      size: {
        default: "h-9 px-4 py-2",
        sm: "h-8 rounded-md px-3 text-xs",
        lg: "h-10 rounded-md px-8",
        // Casino-optimized size for mobile interactions
        casino: "h-11 px-6 py-3 text-base min-w-[44px]", // Meets mobile touch target requirements
        icon: "h-9 w-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
