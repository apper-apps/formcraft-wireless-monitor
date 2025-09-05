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
const baseClasses = "inline-flex items-center justify-center rounded-lg font-semibold transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-60 disabled:pointer-events-none disabled:cursor-not-allowed min-h-[44px] tracking-wide";
  
  const variants = {
primary: "bg-blue-600 hover:bg-blue-700 text-white font-medium focus:ring-2 focus:ring-blue-500 focus:outline-none transition-colors duration-200",
    secondary: "bg-gray-200 hover:bg-gray-300 text-gray-900 border border-gray-300 font-medium focus:ring-2 focus:ring-gray-500 focus:outline-none transition-colors duration-200",
    success: "bg-green-600 hover:bg-green-700 text-white font-medium focus:ring-2 focus:ring-green-500 focus:outline-none transition-colors duration-200",
    ghost: "text-gray-600 hover:text-gray-900 hover:bg-gray-100 focus:ring-2 focus:ring-gray-500 focus:outline-none transition-colors duration-200",
    danger: "bg-red-600 hover:bg-red-700 text-white font-medium focus:ring-2 focus:ring-red-500 focus:outline-none transition-colors duration-200",
    outline: "border border-blue-600 text-blue-600 hover:bg-blue-50 focus:ring-2 focus:ring-blue-500 focus:outline-none transition-colors duration-200"
  };
  
  const sizes = {
    sm: "px-4 py-2 text-sm min-h-[36px]",
md: "px-4 py-2 text-sm",
    lg: "px-6 py-3 text-base",
    xl: "px-10 py-4 text-lg"
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