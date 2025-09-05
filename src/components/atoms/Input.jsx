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
<label htmlFor={id} className="block text-sm font-semibold text-gray-900 mb-2">
          {label}
        </label>
      )}
<input
        type={type}
        id={id}
className={cn(
"w-full px-4 py-3 border rounded-lg transition-all duration-200",
          "placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-0",
          "hover:border-gray-400 hover:shadow-sm",
          "min-h-[44px]", // Touch-friendly minimum height
          error 
            ? "border-red-300 bg-red-50 focus:border-red-500 focus:ring-red-500" 
            : "border-gray-300 bg-white focus:border-blue-500 focus:ring-blue-500",
          "disabled:bg-gray-100 disabled:text-gray-500 disabled:border-gray-300 disabled:cursor-not-allowed",
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