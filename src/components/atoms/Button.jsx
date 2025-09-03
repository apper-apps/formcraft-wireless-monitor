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
  const baseClasses = "inline-flex items-center justify-center rounded-lg font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none";
const variants = {
primary: "bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700 text-white shadow-md hover:shadow-lg transform hover:scale-105 focus:ring-indigo-500",
    secondary: "bg-white hover:bg-gray-50 text-gray-700 border border-gray-200 shadow-sm hover:shadow-md transform hover:scale-105 focus:ring-gray-500",
    success: "bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white shadow-md hover:shadow-lg transform hover:scale-105 focus:ring-green-500",
    ghost: "text-gray-600 hover:text-indigo-600 hover:bg-indigo-50 focus:ring-indigo-500",
    danger: "bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white shadow-md hover:shadow-lg transform hover:scale-105 focus:ring-red-500",
    outline: "border-2 border-indigo-300 text-indigo-700 hover:bg-indigo-50 hover:border-indigo-400 focus:ring-indigo-500"
  };
  
const sizes = {
    sm: "px-4 py-2 text-sm font-medium",
    md: "px-5 py-2.5 font-medium",
    lg: "px-8 py-3.5 text-lg font-semibold",
    xl: "px-10 py-4 text-xl font-semibold"
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