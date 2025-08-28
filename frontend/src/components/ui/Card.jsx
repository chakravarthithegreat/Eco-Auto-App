import React from 'react';

const Card = React.forwardRef(({ className, variant, hoverEffect = true, ...props }, ref) => {
  const variantClasses = {
    default: "bg-white border border-gray-200 dark:bg-gray-800 dark:border-gray-700",
    glass: "bg-white/80 backdrop-blur-sm border border-gray-200 dark:bg-gray-800/80 dark:border-gray-700",
    blue: "bg-blue-600 border-none text-white dark:bg-blue-500",
    white: "bg-white border-none dark:bg-gray-800",
    elevated: "bg-white/95 shadow-lg border border-gray-200 dark:bg-gray-800/95 dark:border-gray-700",
    panelBlue: "bg-blue-600 text-white border-0"
  };

  // Base classes with optional hover effect
  const baseClasses = "rounded-2xl transition-all duration-300 ease-out";
  const hoverClasses = hoverEffect ? "hover:shadow-glass-md hover:-translate-y-0.5" : "";
  
  return (
    <div
      ref={ref}
      className={`${baseClasses} ${variantClasses[variant || 'default']} ${hoverClasses} ${className || ''}`}
      {...props}
    />
  );
});

const CardHeader = React.forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={`flex flex-col space-y-1.5 p-5 ${className || ''}`}
    {...props}
  />
));

const CardTitle = React.forwardRef(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={`text-lg font-semibold leading-none tracking-tight text-gray-900 dark:text-gray-100 ${className || ''}`}
    {...props}
  />
));

const CardDescription = React.forwardRef(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={`text-sm text-gray-600 dark:text-gray-400 ${className || ''}`}
    {...props}
  />
));

const CardContent = React.forwardRef(({ className, ...props }, ref) => (
  <div ref={ref} className={`p-5 ${className || ''}`} {...props} />
));

const CardFooter = React.forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={`flex items-center p-5 pt-0 ${className || ''}`}
    {...props}
  />
));

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent };