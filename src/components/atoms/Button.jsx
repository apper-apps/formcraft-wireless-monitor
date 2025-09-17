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
primary: "bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700 active:from-pink-800 active:to-purple-800 text-white font-bold focus:ring-2 focus:ring-purple-500 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 active:translate-y-0 border border-pink-600",
secondary: "bg-white hover:bg-gray-100 active:bg-gray-200 text-gray-900 border border-gray-400 hover:border-gray-500 font-bold focus:ring-2 focus:ring-gray-600 shadow-md hover:shadow-lg",
success: "bg-green-600 hover:bg-green-700 active:bg-green-800 text-white font-bold focus:ring-2 focus:ring-green-500 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 border border-green-600",
ghost: "text-gray-800 hover:text-gray-900 hover:bg-gray-200 active:bg-gray-300 focus:ring-2 focus:ring-gray-600 font-medium",
danger: "bg-red-600 hover:bg-red-700 active:bg-red-800 text-white font-bold focus:ring-2 focus:ring-red-500 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 border border-red-600",
outline: "border border-purple-600 text-purple-600 hover:bg-purple-50 active:bg-purple-100 hover:border-purple-700 focus:ring-2 focus:ring-purple-500 shadow-md hover:shadow-lg bg-white font-bold",
menu: "bg-white hover:bg-gray-100 active:bg-gray-200 text-gray-800 border border-gray-400 hover:border-gray-500 font-bold focus:ring-2 focus:ring-gray-600 shadow-md hover:shadow-lg"
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