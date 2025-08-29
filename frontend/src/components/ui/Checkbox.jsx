import React from 'react';

const Checkbox = ({ checked, onCheckedChange, id, className = '', ...props }) => {
  const handleChange = (e) => {
    onCheckedChange(e.target.checked);
  };

  return (
    <input
      type="checkbox"
      checked={checked}
      onChange={handleChange}
      id={id}
      className={`h-4 w-4 text-primary-green focus:ring-primary-green border-gray-300 rounded ${className}`}
      {...props}
    />
  );
};

export { Checkbox };