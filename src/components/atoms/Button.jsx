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
    primary: "bg-gradient-to-r from-indigo-600 via-indigo-500 to-purple-600 hover:from-indigo-700 hover:via-indigo-600 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transform hover:scale-[1.02] hover:-translate-y-0.5 focus:ring-4 focus:ring-indigo-200 transition-all duration-200 ease-out",
    secondary: "bg-gradient-to-r from-white to-gray-50 hover:from-gray-50 hover:to-gray-100 text-gray-800 border-2 border-gray-200 hover:border-gray-300 shadow-md hover:shadow-lg transform hover:scale-[1.02] hover:-translate-y-0.5 focus:ring-4 focus:ring-gray-200 transition-all duration-200 ease-out",
    success: "bg-gradient-to-r from-emerald-600 via-emerald-500 to-green-600 hover:from-emerald-700 hover:via-emerald-600 hover:to-green-700 text-white shadow-lg hover:shadow-xl transform hover:scale-[1.02] hover:-translate-y-0.5 focus:ring-4 focus:ring-emerald-200 transition-all duration-200 ease-out",
    ghost: "text-gray-700 hover:text-indigo-700 hover:bg-gradient-to-r hover:from-indigo-50 hover:to-purple-50 hover:shadow-sm focus:ring-4 focus:ring-indigo-200 transition-all duration-200 ease-out",
    danger: "bg-gradient-to-r from-red-600 via-red-500 to-pink-600 hover:from-red-700 hover:via-red-600 hover:to-pink-700 text-white shadow-lg hover:shadow-xl transform hover:scale-[1.02] hover:-translate-y-0.5 focus:ring-4 focus:ring-red-200 transition-all duration-200 ease-out",
    outline: "border-2 border-indigo-400 text-indigo-800 hover:bg-gradient-to-r hover:from-indigo-50 hover:to-purple-50 hover:border-indigo-500 hover:shadow-md focus:ring-4 focus:ring-indigo-200 transition-all duration-200 ease-out"
  };
  
const sizes = {
    sm: "px-4 py-2 text-sm font-semibold",
    md: "px-6 py-2.5 text-sm font-semibold",
    lg: "px-8 py-3 text-base font-bold",
    xl: "px-10 py-4 text-lg font-bold"
  };

return (
    <button
      className={cn(baseClasses, variants[variant], sizes[size], "active:scale-95", className)}
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