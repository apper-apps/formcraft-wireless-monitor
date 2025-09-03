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
        <label htmlFor={id} className="block text-sm font-semibold text-gray-800 mb-2">
          {label}
        </label>
      )}
<input
        type={type}
        id={id}
        className={cn(
          "w-full px-4 py-3 border rounded-lg shadow-sm transition-all duration-300",
          "placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-0",
          "hover:border-gray-400 hover:shadow-md",
          "min-h-[44px]", // Touch-friendly minimum height
          error 
            ? "border-red-300 focus:border-red-500 focus:ring-red-200 bg-red-50" 
            : "border-gray-300 focus:border-indigo-500 focus:ring-indigo-200 focus:bg-white",
          "disabled:bg-gray-100 disabled:text-gray-500 disabled:border-gray-200 disabled:cursor-not-allowed disabled:shadow-none",
          className
        )}
        ref={ref}
        {...props}
      />
      {error && (
        <p className="mt-2 text-sm font-medium text-red-600 flex items-center gap-1">
          <span className="w-1 h-1 bg-red-500 rounded-full"></span>
          {error}
        </p>
      )}
      {helperText && !error && (
        <p className="mt-2 text-sm text-gray-600">{helperText}</p>
      )}
    </div>
  );
});

Input.displayName = "Input";

export default Input;