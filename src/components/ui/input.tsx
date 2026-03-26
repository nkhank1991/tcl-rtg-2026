import { cn } from "@/lib/utils";
import { forwardRef, type InputHTMLAttributes } from "react";

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, id, ...props }, ref) => {
    const inputId = id || label?.toLowerCase().replace(/\s+/g, "-");
    return (
      <div className="space-y-1.5">
        {label && (
          <label htmlFor={inputId} className="text-sm font-medium text-text-secondary">
            {label}
          </label>
        )}
        <input
          id={inputId}
          className={cn(
            "w-full h-10 px-3 rounded-lg bg-bg-elevated border text-text-primary placeholder:text-text-muted text-sm transition-colors",
            "focus:outline-none focus:ring-2 focus:ring-tcl-red focus:border-transparent",
            error ? "border-error" : "border-border-default",
            className
          )}
          ref={ref}
          {...props}
        />
        {error && <p className="text-xs text-error">{error}</p>}
      </div>
    );
  }
);
Input.displayName = "Input";

export { Input };
