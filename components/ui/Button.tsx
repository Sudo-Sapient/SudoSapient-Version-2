import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap font-mono text-[13px] font-medium uppercase tracking-[0.08em] transition-colors disabled:pointer-events-none disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-current",
  {
    variants: {
      variant: {
        // Primary: white outline on blue, fills white on hover with blue text
        primary: "border border-white text-white hover:bg-white hover:text-blueprint",
        // Secondary: blue outline on white
        secondary: "border border-ink text-ink hover:bg-ink hover:text-white",
        // Ghost: text only
        ghost: "text-white hover:bg-white/10",
        ghostInk: "text-ink hover:bg-ink/5",
        // Solid white for blue backgrounds
        solid: "bg-white text-blueprint hover:bg-white/90",
      },
      size: {
        default: "h-11 px-5",
        sm: "h-9 px-4 text-[12px]",
        lg: "h-12 px-6",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, children, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props}>
        {children}
      </Comp>
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
