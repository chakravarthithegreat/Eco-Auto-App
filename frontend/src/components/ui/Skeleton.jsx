import React from 'react';

const Skeleton = ({ 
  className = '',
  variant = 'rectangular',
  width,
  height,
  borderRadius = 'rounded-xl',
  ...props 
}) => {
  const baseClasses = "bg-gray-200 dark:bg-gray-700 animate-pulse";
  
  const variantClasses = {
    rectangular: "rounded-lg",
    circular: "rounded-full",
    text: "rounded-full",
  };
  
  // For text variant, we make it a bit shorter
  const textWidth = variant === 'text' ? (width || 'w-3/4') : (width || 'w-full');
  const finalHeight = height || (variant === 'text' ? 'h-4' : 'h-8');
  
  return (
    <div
      className={`${baseClasses} ${variantClasses[variant]} ${borderRadius} ${textWidth} ${finalHeight} ${className}`}
      {...props}
    />
  );
};

export default Skeleton;