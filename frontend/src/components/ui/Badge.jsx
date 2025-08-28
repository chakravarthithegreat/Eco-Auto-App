import React from 'react';

const Badge = React.forwardRef(({ className, variant, ...props }, ref) => {
  const baseClasses = "inline-flex items-center justify-center rounded-full px-3 py-0.5 text-xs font-medium";
  
  const variantClasses = {
    default: "bg-slate-100 text-slate-700",
    secondary: "bg-gray-50 text-gray-700",
    destructive: "bg-red-50 text-red-600",
    outline: "text-slate-700 border border-slate-200",
    success: "bg-green-50 text-green-600",
    warning: "bg-amber-50 text-amber-600 border border-amber-200",
    primary: "bg-blue-50 text-blue-700",
    waiting: "bg-amber-50 text-amber-600 border border-amber-200",
    done: "bg-green-50 text-green-600 border border-green-200",
    failed: "bg-red-50 text-red-600 border border-red-200",
  };
  
  return (
    <div
      ref={ref}
      className={`${baseClasses} ${variantClasses[variant || 'default']} ${className || ''}`}
      {...props}
    />
  );
});

export { Badge };