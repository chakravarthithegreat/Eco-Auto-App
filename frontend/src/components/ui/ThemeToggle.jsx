import React from 'react';
import { useDarkMode } from '../../contexts/DarkModeContext';
import { Sun, Moon } from 'lucide-react';

const ThemeToggle = () => {
  const { isDarkMode, toggleDarkMode } = useDarkMode();

  return (
    <button
      onClick={toggleDarkMode}
      className="p-2 rounded-full bg-light-bg-secondary dark:bg-dark-bg-secondary hover:bg-light-bg-secondary/80 dark:hover:bg-dark-bg-secondary/80 transition-colors duration-200"
      aria-label={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      {isDarkMode ? (
        <Sun className="w-5 h-5 text-light-warning dark:text-dark-warning" />
      ) : (
        <Moon className="w-5 h-5 text-light-text-secondary dark:text-dark-text-secondary" />
      )}
    </button>
  );
};

export default ThemeToggle;