import React from 'react';

const Input = React.forwardRef(({ 
  className = '', 
  type = 'text', 
  ...props 
}, ref) => {
  const baseClasses = 'flex h-10 w-full rounded-md border border-surface-300 bg-white px-3 py-2 text-sm placeholder:text-surface-400 focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500 disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-200';
  
  return (
    <input
      type={type}
      className={`${baseClasses} ${className}`}
      ref={ref}
      {...props}
    />
  );
});

Input.displayName = 'Input';

export { Input };