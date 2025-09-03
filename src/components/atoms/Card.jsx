import React, { forwardRef } from "react";
import { cn } from "@/utils/cn";

const Card = React.forwardRef(({ 
  className, 
  children, 
  variant = "default",
  ...props 
}, ref) => {
  const variants = {
    default: "bg-white rounded-xl shadow-md hover:shadow-lg border border-gray-100 hover:border-gray-200",
    ghost: "bg-transparent",
    elevated: "bg-white rounded-xl shadow-lg hover:shadow-2xl border border-gray-100 hover:border-gray-200 transform hover:-translate-y-1"
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