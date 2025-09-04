import React, { forwardRef } from "react";
import { cn } from "@/utils/cn";

const Card = React.forwardRef(({ 
  className, 
  children, 
  variant = "default",
  ...props 
}, ref) => {
const variants = {
    default: "bg-surface-100 rounded-xl border border-primary-500/20 hover:border-primary-500/40 transition-all duration-300",
    ghost: "bg-transparent",
    elevated: "bg-surface-100 rounded-xl border border-primary-500/30 hover:border-primary-500/50 transform hover:-translate-y-1 transition-all duration-300"
  };

  return (
    <div
      ref={ref}
      className={cn(
        "transition-all duration-300 ease-out",
        variants[variant],
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
});

Card.displayName = "Card";

export default Card;