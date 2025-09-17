import React, { forwardRef } from "react";
import { cn } from "@/utils/cn";

const Card = React.forwardRef(({ 
  className, 
  children, 
  variant = "default",
  ...props 
}, ref) => {
const variants = {
default: "bg-white border border-gray-300 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200",
    hover: "bg-white border border-gray-300 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-200",
    elevated: "bg-white border border-gray-400 rounded-lg shadow-xl hover:shadow-2xl transition-shadow duration-200"
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