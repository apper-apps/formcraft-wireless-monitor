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
          "w-full px-4 py-3 border rounded-xl transition-all duration-300 font-sans tracking-wide backdrop-blur-sm",
          "placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-0",
          "hover:border-primary-500/60 hover:bg-white/30 hover:shadow-lg",
          "min-h-[44px]", // Touch-friendly minimum height
          error 
            ? "border-error/60 bg-error/10 focus:border-error focus:ring-error/30 backdrop-blur-sm" 
            : "border-white/30 bg-white/20 focus:border-primary-500/50 focus:ring-primary-500/30 focus:bg-white/30",
          "disabled:bg-gray-200/20 disabled:text-gray-500 disabled:border-gray-300/30 disabled:cursor-not-allowed disabled:shadow-none disabled:backdrop-blur-sm",
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