import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full text-[15px] font-semibold transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0 disabled:pointer-events-none disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-current",
  {
    variants: {
      variant: {
        // Primary and solid: the bright amber call to action
        primary:
          "bg-warn text-ink shadow-[0_4px_14px_-4px_rgba(251,191,36,0.35)] hover:bg-[#fcd34d] hover:shadow-[0_6px_18px_-4px_rgba(251,191,36,0.5)]",
        // Secondary: filled ink on light backgrounds
        secondary: "bg-ink text-white shadow-[0_8px_24px_-8px_rgba(10,20,40,0.6)] hover:bg-ink/90",
        // Ghost: white outline pill on blue
        ghost:
          "border-2 border-white/80 text-white hover:border-white hover:bg-white hover:text-blueprint",
        ghostInk: "text-ink hover:bg-ink/5",
        solid:
          "bg-warn text-ink shadow-[0_4px_14px_-4px_rgba(251,191,36,0.35)] hover:bg-[#fcd34d] hover:shadow-[0_6px_18px_-4px_rgba(251,191,36,0.5)]",
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
