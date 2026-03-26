import { Slot } from "@radix-ui/react-slot";
import { cn } from "@/lib/utils";
import { forwardRef, type ButtonHTMLAttributes } from "react";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "destructive";
  size?: "sm" | "md" | "lg";
  asChild?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(
          "inline-flex items-center justify-center font-medium rounded-lg transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-tcl-red disabled:opacity-50 disabled:pointer-events-none",
          {
            "bg-tcl-red text-white hover:bg-tcl-red-dark": variant === "primary",
            "bg-bg-elevated text-text-primary hover:bg-border-strong": variant === "secondary",
            "border border-border-default text-text-primary hover:bg-bg-elevated": variant === "outline",
            "text-text-primary hover:bg-bg-elevated": variant === "ghost",
            "bg-error text-white hover:bg-red-600": variant === "destructive",
          },
          {
            "h-8 px-3 text-sm": size === "sm",
            "h-10 px-4 text-sm": size === "md",
            "h-12 px-6 text-base": size === "lg",
          },
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button };
