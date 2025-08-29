import React from 'react';

const Alert = ({ children, variant = 'default', className = '', ...props }) => {
  const variantClasses = {
    default: 'bg-blue-50 border-blue-200 text-blue-800 dark:bg-blue-900 dark:border-blue-800 dark:text-blue-200',
    destructive: 'bg-red-50 border-red-200 text-red-800 dark:bg-red-900 dark:border-red-800 dark:text-red-200'
  };

  return (
    <div 
      className={`border rounded-lg p-4 ${variantClasses[variant]} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

const AlertDescription = ({ children, className = '', ...props }) => {
  return (
    <div className={`text-sm ${className}`} {...props}>
      {children}
    </div>
  );
};

export { Alert, AlertDescription };