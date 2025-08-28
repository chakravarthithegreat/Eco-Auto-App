import React from 'react';

const Button = React.forwardRef(({ className, variant, size, ...props }, ref) => {
  const baseClasses = "inline-flex items-center justify-center font-medium transition-all focus-visible:outline-none disabled:opacity-50 disabled:pointer-events-none rounded-lg";
  
  const variantClasses = {
    default: "bg-light-secondary text-white hover:bg-light-secondary/90 dark:bg-dark-secondary dark:hover:bg-dark-secondary/90",
    primary: "bg-light-primary text-white hover:bg-light-primary/90 dark:bg-dark-primary dark:hover:bg-dark-primary/90",
    destructive: "bg-light-danger text-white hover:bg-light-danger/90 dark:bg-dark-danger dark:hover:bg-dark-danger/90",
    outline: "border border-light-bg-secondary bg-light-surface hover:bg-light-bg-secondary text-light-text dark:border-dark-bg-secondary dark:bg-dark-surface dark:hover:bg-dark-bg-secondary dark:text-dark-text",
    secondary: "bg-light-bg-secondary text-light-text hover:bg-light-bg-secondary/80 dark:bg-dark-bg-secondary dark:text-dark-text dark:hover:bg-dark-bg-secondary/80",
    ghost: "hover:bg-light-bg-secondary text-light-text dark:hover:bg-dark-bg-secondary dark:text-dark-text",
    link: "underline-offset-4 hover:underline text-light-secondary dark:text-dark-secondary",
    icon: "bg-light-bg-secondary text-light-text hover:bg-light-bg-secondary/80 dark:bg-dark-bg-secondary dark:text-dark-text dark:hover:bg-dark-bg-secondary/80 rounded-full",
    action: "bg-light-secondary text-white hover:bg-light-secondary/90 dark:bg-dark-secondary dark:hover:bg-dark-secondary/90 rounded-full shadow-glass-sm"
  };
  
  const sizeClasses = {
    default: "h-9 px-4 py-2 text-sm",
    sm: "h-8 px-3 py-1 text-xs",
    lg: "h-10 px-6 py-2 text-base",
    icon: "h-9 w-9"
  };
  
  return (
    <button
      ref={ref}
      className={`${baseClasses} ${variantClasses[variant || 'default']} ${sizeClasses[size || 'default']} ${className || ''}`}
      {...props}
    />
  );
});

export { Button };