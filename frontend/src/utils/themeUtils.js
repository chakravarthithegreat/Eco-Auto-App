/**
 * Theme utilities for dynamic color themes based on time of day
 * Aligns with circadian rhythms to improve user experience
 */

/**
 * Get theme based on current time of day
 * @returns {string} Theme name ('morning', 'afternoon', 'evening')
 */
export const getTimeBasedTheme = () => {
  const hour = new Date().getHours();
  
  if (hour >= 6 && hour < 12) {
    return 'morning'; // Cool blues and greens for morning
  } else if (hour >= 12 && hour < 18) {
    return 'afternoon'; // Vibrant colors for peak productivity
  } else {
    return 'evening'; // Warm tones for evening
  }
};

/**
 * Get CSS variables for the current time-based theme
 * @returns {Object} CSS variables object
 */
export const getThemeVariables = () => {
  const theme = getTimeBasedTheme();
  
  const themes = {
    morning: {
      '--primary-accent': '#84D9A7', // Primary green
      '--secondary-accent': '#67a0e4', // Accent blue
      '--background-primary': '#f8fafc',
      '--background-secondary': '#ffffff',
      '--text-primary': '#1e293b',
      '--text-secondary': '#64748b',
    },
    afternoon: {
      '--primary-accent': '#6B8AF6', // Vibrant blue for peak hours
      '--secondary-accent': '#84D9A7', // Primary green
      '--background-primary': '#f1f5f9',
      '--background-secondary': '#ffffff',
      '--text-primary': '#0f172a',
      '--text-secondary': '#475569',
    },
    evening: {
      '--primary-accent': '#F2B05E', // Warm amber for evening
      '--secondary-accent': '#F27D6E', // Danger red
      '--background-primary': '#f8f4f0',
      '--background-secondary': '#fefcf9',
      '--text-primary': '#1c1917',
      '--text-secondary': '#78716c',
    }
  };
  
  return themes[theme];
};

/**
 * Apply time-based theme to the document
 */
export const applyTimeBasedTheme = () => {
  const themeVariables = getThemeVariables();
  
  Object.entries(themeVariables).forEach(([property, value]) => {
    document.documentElement.style.setProperty(property, value);
  });
};

/**
 * Initialize theme and set up interval for theme updates
 */
export const initializeTheme = () => {
  // Apply initial theme
  applyTimeBasedTheme();
  
  // Update theme every hour
  setInterval(() => {
    applyTimeBasedTheme();
  }, 60 * 60 * 1000); // Every hour
};