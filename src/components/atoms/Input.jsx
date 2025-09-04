import React, { forwardRef } from "react";
import { cn } from "@/utils/cn";

const Input = React.forwardRef(({ 
  className, 
  type = "text",
  label,
  error,
  helperText,
  ...props 
}, ref) => {
  const id = props.id || `input-${Math.random().toString(36).substr(2, 9)}`;

  return (
    <div className="w-full">
      {label && (
<label htmlFor={id} className="block text-sm font-semibold text-surface-800 mb-2 tracking-wide">
          {label}
        </label>
      )}
<input
        type={type}
        id={id}
className={cn(
          "w-full px-4 py-3 border rounded-lg transition-all duration-300 font-sans tracking-wide",
          "placeholder:text-surface-700 focus:outline-none focus:ring-2 focus:ring-offset-0",
          "hover:border-primary-500/50 bg-surface-100",
          "min-h-[44px]", // Touch-friendly minimum height
          error 
            ? "border-error focus:border-error focus:ring-error/20 bg-error/5" 
            : "border-primary-500/30 focus:border-primary-500 focus:ring-primary-500/20",
          "disabled:bg-surface-200 disabled:text-surface-600 disabled:border-surface-300 disabled:cursor-not-allowed disabled:shadow-none",
          className
        )}
        ref={ref}
        {...props}
      />
      {error && (
<p className="mt-2 text-sm font-medium text-error flex items-center gap-1 tracking-wide">
          <span className="w-1 h-1 bg-error rounded-full animate-pulse"></span>
          {error}
        </p>
      )}
      {helperText && !error && (
<p className="mt-2 text-sm text-surface-700 tracking-wide">{helperText}</p>
      )}
    </div>
  );
});

Input.displayName = "Input";

export default Input;