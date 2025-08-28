import React from 'react';

/**
 * Textarea component for multi-line text input
 * 
 * @param {Object} props - Component props
 * @param {string} [props.className] - Additional CSS classes
 * @param {string} [props.placeholder] - Placeholder text
 * @param {string} [props.value] - Current value
 * @param {Function} [props.onChange] - Change handler
 * @param {number} [props.rows=3] - Number of visible text lines
 * @param {boolean} [props.disabled] - Whether the textarea is disabled
 * @param {string} [props.name] - Input name
 * @param {string} [props.id] - Input ID
 * @returns {JSX.Element} Textarea component
 */
const Textarea = React.forwardRef(({
  className = '',
  placeholder,
  value,
  onChange,
  rows = 3,
  disabled = false,
  name,
  id,
  ...props
}, ref) => {
  return (
    <textarea
      ref={ref}
      className={`w-full px-3 py-2 bg-white border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-green focus:border-transparent placeholder-gray-400 disabled:bg-gray-100 disabled:text-gray-500 disabled:cursor-not-allowed resize-vertical ${className}`}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      rows={rows}
      disabled={disabled}
      name={name}
      id={id}
      {...props}
    />
  );
});

Textarea.displayName = 'Textarea';

export { Textarea };