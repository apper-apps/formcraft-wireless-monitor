import React, { forwardRef } from "react";
import { cn } from "@/utils/cn";

const Card = React.forwardRef(({ 
  className, 
  children, 
  variant = "default",
  ...props 
}, ref) => {
const variants = {
default: "bg-gradient-to-br from-white/30 to-gray-50/20 backdrop-blur-xl rounded-2xl border border-white/20 hover:border-white/40 transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:-translate-y-1",
    ghost: "bg-transparent backdrop-blur-sm",
    elevated: "bg-gradient-to-br from-white/40 to-gray-50/30 backdrop-blur-xl rounded-2xl border border-white/30 hover:border-white/50 transform hover:-translate-y-2 transition-all duration-300 shadow-2xl hover:shadow-3xl"
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