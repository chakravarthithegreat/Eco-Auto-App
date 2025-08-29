import React, { useState, useRef, useEffect } from 'react';

const Select = ({ children, value, onValueChange, className = '', ...props }) => {
  return (
    <div className={`relative ${className}`} {...props}>
      {React.Children.map(children, child => {
        if (child.type === SelectTrigger) {
          return React.cloneElement(child, { value, onValueChange });
        }
        if (child.type === SelectContent) {
          return React.cloneElement(child, { value, onValueChange });
        }
        return child;
      })}
    </div>
  );
};

const SelectTrigger = ({ children, value, onValueChange, className = '', ...props }) => {
  const [isOpen, setIsOpen] = useState(false);
  const selectRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (selectRef.current && !selectRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div ref={selectRef} className="relative">
      <button
        type="button"
        className={`w-full px-3 py-2 text-left bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-green focus:border-primary-green dark:bg-gray-800 dark:border-gray-600 ${className}`}
        onClick={() => setIsOpen(!isOpen)}
        {...props}
      >
        {children}
        <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
          <svg className="w-5 h-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </div>
      </button>
    </div>
  );
};

const SelectContent = ({ children, value, onValueChange, className = '', ...props }) => {
  const [isOpen, setIsOpen] = useState(false);
  const selectRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (selectRef.current && !selectRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="relative" ref={selectRef}>
      {isOpen && (
        <div className={`absolute z-10 mt-1 w-full bg-white shadow-lg rounded-md py-1 dark:bg-gray-800 ${className}`} {...props}>
          {React.Children.map(children, child => {
            if (child.type === SelectItem) {
              return React.cloneElement(child, { 
                onSelect: (value) => {
                  onValueChange(value);
                  setIsOpen(false);
                },
                isSelected: child.props.value === value
              });
            }
            return child;
          })}
        </div>
      )}
    </div>
  );
};

const SelectItem = ({ children, value, onSelect, isSelected, className = '', ...props }) => {
  return (
    <div
      className={`cursor-pointer select-none relative py-2 pl-3 pr-9 hover:bg-gray-100 dark:hover:bg-gray-700 ${isSelected ? 'bg-gray-100 dark:bg-gray-700' : ''} ${className}`}
      onClick={() => onSelect(value)}
      {...props}
    >
      <span className={`block truncate ${isSelected ? 'font-semibold' : 'font-normal'}`}>
        {children}
      </span>
      {isSelected && (
        <span className="absolute inset-y-0 right-0 flex items-center pr-4 text-primary-green">
          <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
        </span>
      )}
    </div>
  );
};

const SelectValue = ({ placeholder }) => {
  return <span>{placeholder}</span>;
};

export { Select, SelectTrigger, SelectContent, SelectItem, SelectValue };