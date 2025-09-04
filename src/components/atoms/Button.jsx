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
    primary: "bg-gradient-to-r from-primary-500 via-primary-400 to-accent-500 hover:from-primary-400 hover:via-primary-300 hover:to-accent-400 text-surface-50 font-bold transform hover:scale-[1.03] hover:-translate-y-1 focus:ring-4 focus:ring-primary-300 active:scale-[0.98] active:translate-y-0 tracking-wider",
    secondary: "bg-gradient-to-r from-surface-200 to-surface-100 hover:from-surface-100 hover:to-surface-50 text-surface-900 border-2 border-primary-500/30 hover:border-primary-500/50 transform hover:scale-[1.02] hover:-translate-y-0.5 focus:ring-4 focus:ring-primary-200 active:scale-[0.98] tracking-wide",
    success: "bg-gradient-to-r from-cyber-500 via-cyber-400 to-cyber-600 hover:from-cyber-400 hover:via-cyber-300 hover:to-cyber-500 text-surface-50 font-bold transform hover:scale-[1.03] hover:-translate-y-1 focus:ring-4 focus:ring-cyber-200 active:scale-[0.98] tracking-wider",
    ghost: "text-surface-800 hover:text-primary-500 hover:bg-gradient-to-r hover:from-primary-500/10 hover:to-accent-500/10 rounded-lg focus:ring-4 focus:ring-primary-200 transform hover:scale-[1.02] transition-all duration-200 tracking-wide",
    danger: "bg-gradient-to-r from-error via-neural-500 to-error hover:from-neural-400 hover:via-error hover:to-neural-400 text-surface-50 font-bold transform hover:scale-[1.03] hover:-translate-y-1 focus:ring-4 focus:ring-error/30 active:scale-[0.98] tracking-wider",
    outline: "border-2 border-primary-400 text-primary-600 hover:bg-gradient-to-r hover:from-primary-500/10 hover:to-accent-500/10 hover:border-primary-500 focus:ring-4 focus:ring-primary-200 transform hover:scale-[1.02] transition-all duration-200 tracking-wide"
  };
  
  const sizes = {
    sm: "px-4 py-2 text-sm min-h-[36px]",
    md: "px-6 py-2.5 text-sm",
    lg: "px-8 py-3 text-base",
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

Button.displayName = "Button";

export default Button;