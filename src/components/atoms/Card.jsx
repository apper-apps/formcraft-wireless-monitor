import React, { forwardRef } from "react";
import { cn } from "@/utils/cn";

const Card = React.forwardRef(({ 
  className, 
  children, 
  variant = "default",
  ...props 
}, ref) => {
const variants = {
default: "bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200",
    ghost: "bg-transparent",
    elevated: "bg-white border border-gray-200 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200"
  };
  return (
    <div
      ref={ref}
      className={cn(
"transition-shadow duration-200",
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