import React from "react";
import { cn } from "@/utils/cn";

const Button = React.forwardRef(({ 
  className, 
  variant = "primary", 
  size = "md", 
  children, 
  disabled,
  ...props 
}, ref) => {
const baseClasses = "inline-flex items-center justify-center rounded-lg font-semibold focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-60 disabled:pointer-events-none disabled:cursor-not-allowed min-h-[44px] tracking-wide transition-all duration-200 cubic-bezier(0.4, 0, 0.2, 1)";
  
  const variants = {
primary: "bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-medium focus:ring-2 focus:ring-blue-500 shadow-sm hover:shadow-md transform hover:-translate-y-0.5 active:translate-y-0 border border-blue-600",
    secondary: "bg-white hover:bg-gray-50 active:bg-gray-100 text-gray-900 border border-gray-300 hover:border-gray-400 font-medium focus:ring-2 focus:ring-gray-500 shadow-sm hover:shadow-md",
    success: "bg-green-600 hover:bg-green-700 active:bg-green-800 text-white font-medium focus:ring-2 focus:ring-green-500 shadow-sm hover:shadow-md transform hover:-translate-y-0.5 border border-green-600",
    ghost: "text-gray-600 hover:text-gray-900 hover:bg-gray-100 active:bg-gray-200 focus:ring-2 focus:ring-gray-500",
    danger: "bg-red-600 hover:bg-red-700 active:bg-red-800 text-white font-medium focus:ring-2 focus:ring-red-500 shadow-sm hover:shadow-md transform hover:-translate-y-0.5 border border-red-600",
    outline: "border border-blue-600 text-blue-600 hover:bg-blue-50 active:bg-blue-100 hover:border-blue-700 focus:ring-2 focus:ring-blue-500 shadow-sm hover:shadow-md bg-white"
  };
  
  const sizes = {
    sm: "px-3 py-1.5 text-sm min-h-[36px]", /* 8px grid: 12px and 6px */
    md: "px-4 py-2 text-sm min-h-[40px]", /* 8px grid: 16px and 8px */
    lg: "px-6 py-3 text-base min-h-[44px]", /* 8px grid: 24px and 12px */
    xl: "px-8 py-4 text-lg min-h-[48px]" /* 8px grid: 32px and 16px */
  };

  return (
    <button
      className={cn(baseClasses, variants[variant], sizes[size], className)}
      ref={ref}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
});

Button.displayName = "Button";

export default Button;