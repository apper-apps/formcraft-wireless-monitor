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
<label htmlFor={id} className="block text-sm font-bold text-gray-900 mb-2">
          {label}
        </label>
      )}
<input
type={type}
        id={id}
className={cn(
"w-full px-4 py-3 border rounded-lg transition-all duration-200 text-gray-900 font-medium",
          "placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-0",
          "hover:border-gray-500 hover:shadow-md",
          "min-h-[44px]", // Touch-friendly minimum height
          error 
            ? "border-red-400 bg-red-50 focus:border-red-500 focus:ring-red-500" 
            : "border-gray-400 bg-white focus:border-purple-500 focus:ring-purple-500",
          "disabled:bg-gray-200 disabled:text-gray-600 disabled:border-gray-400 disabled:cursor-not-allowed",
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