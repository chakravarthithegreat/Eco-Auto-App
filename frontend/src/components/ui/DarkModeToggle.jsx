import React from 'react';
import { Moon, Sun } from 'lucide-react';
import { useDarkMode } from '../../contexts/DarkModeContext';

const DarkModeToggle = ({ className = "", variant = "button", size = "default" }) => {
  const { isDarkMode, toggleDarkMode } = useDarkMode();

  const sizes = {
    xs: "w-7 h-7",
    sm: "w-8 h-8",
    default: "w-9 h-9",
    lg: "w-10 h-10"
  };

  const iconSizes = {
    xs: "w-3.5 h-3.5",
    sm: "w-4 h-4",
    default: "w-4.5 h-4.5", 
    lg: "w-5 h-5"
  };

  if (variant === "switch") {
    return (
      <button
        onClick={toggleDarkMode}
        className={`relative inline-flex items-center ${sizes[size]} rounded-full transition-colors duration-300 focus:outline-none focus:ring-1 focus:ring-primary-500 focus:ring-offset-1 ${
          isDarkMode ? 'bg-primary-500' : 'bg-surface-300'
        } ${className}`}
        aria-label={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
      >
        <span
          className={`inline-block ${
            size === 'sm' ? 'w-4 h-4' : size === 'lg' ? 'w-6 h-6' : 'w-5 h-5'
          } transform rounded-full bg-white transition-transform duration-300 ease-in-out shadow-lg ${
            isDarkMode ? 'translate-x-4' : 'translate-x-0'
          } flex items-center justify-center`}
        >
          {isDarkMode ? (
            <Moon className={`${iconSizes[size]} text-primary-500`} />
          ) : (
            <Sun className={`${iconSizes[size]} text-warning-500`} />
          )}
        </span>
      </button>
    );
  }

  return (
    <button
      onClick={toggleDarkMode}
      className={`
        inline-flex items-center justify-center ${sizes[size]} 
        rounded-md transition-all duration-200 
        bg-surface-100 hover:bg-surface-200 
        dark:bg-surface-700 dark:hover:bg-surface-600
        text-surface-700 dark:text-surface-300
        hover:scale-[1.02] active:scale-[0.98]
        focus:outline-none focus:ring-1 focus:ring-primary-500 focus:ring-offset-1
        ${className}
      `}
      aria-label={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
      title={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      {isDarkMode ? (
        <Sun className={`${iconSizes[size]} text-warning-500 transition-all duration-200`} />
      ) : (
        <Moon className={`${iconSizes[size]} text-surface-600 dark:text-surface-300 transition-all duration-200`} />
      )}
    </button>
  );
};

export default DarkModeToggle;