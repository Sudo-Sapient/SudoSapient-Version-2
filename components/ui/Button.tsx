import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full text-[15px] font-semibold transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0 disabled:pointer-events-none disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-current",
  {
    variants: {
      variant: {
        // Primary and solid: the call to action on blue, a white pill with blue text
        primary:
          "bg-white text-blueprint shadow-[0_6px_18px_-8px_rgba(0,0,0,0.45)] hover:bg-[#EEF1F5]",
        // Secondary: the call to action on light backgrounds, a brand blue pill
        secondary:
          "bg-blueprint text-white shadow-[0_6px_18px_-8px_rgba(30,64,175,0.6)] hover:bg-blueprint-deep",
        // Ghost: white outline pill on blue
        ghost:
          "border-2 border-white/80 text-white hover:border-white hover:bg-white hover:text-blueprint",
        ghostInk: "text-ink hover:bg-ink/5",
        solid:
          "bg-white text-blueprint shadow-[0_6px_18px_-8px_rgba(0,0,0,0.45)] hover:bg-[#EEF1F5]",
      },
      size: {
        default: "h-11 px-5",
        sm: "h-9 px-4 text-sm",
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
