/**
 * Haptic feedback utilities for enhanced user interactions
 * Activates the brain's reward system to increase engagement
 */

// Global flag to enable/disable haptic feedback
let hapticEnabled = false; // Disabled by default to prevent jerky movements

/**
 * Enable or disable haptic feedback
 * @param {boolean} enabled - Whether to enable haptic feedback
 */
export const setHapticEnabled = (enabled) => {
  hapticEnabled = enabled;
};

/**
 * Get current haptic feedback state
 * @returns {boolean} Whether haptic feedback is enabled
 */
export const isHapticEnabled = () => {
  return hapticEnabled;
};

/**
 * Trigger haptic feedback for user interactions
 * @param {string} type - Type of haptic feedback ('light', 'medium', 'heavy')
 */
export const triggerHaptic = (type = 'light') => {
  // If haptic feedback is disabled, do nothing
  if (!hapticEnabled) {
    return;
  }

  // Check if the browser supports the Vibration API
  if (typeof navigator !== 'undefined' && navigator.vibrate) {
    switch (type) {
      case 'light':
        navigator.vibrate(10); // 10ms light vibration
        break;
      case 'medium':
        navigator.vibrate(20); // 20ms medium vibration
        break;
      case 'heavy':
        navigator.vibrate(40); // 40ms heavy vibration
        break;
      default:
        navigator.vibrate(10);
    }
  }
  
  // For browsers that don't support Vibration API, 
  // we can use a more subtle CSS effect that doesn't affect the entire page
  if (typeof window !== 'undefined') {
    // Create a temporary overlay for haptic feedback instead of affecting the body
    const hapticOverlay = document.createElement('div');
    hapticOverlay.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      pointer-events: none;
      z-index: 9999;
      background: transparent;
      opacity: 0;
      transition: opacity 0.05s ease-in-out;
    `;
    
    document.body.appendChild(hapticOverlay);
    
    // Trigger a subtle flash effect
    setTimeout(() => {
      hapticOverlay.style.opacity = '0.02';
      setTimeout(() => {
        hapticOverlay.style.opacity = '0';
        setTimeout(() => {
          if (hapticOverlay.parentNode) {
            hapticOverlay.parentNode.removeChild(hapticOverlay);
          }
        }, 50);
      }, 50);
    }, 10);
  }
};

/**
 * Add haptic feedback to interactive elements
 * @param {HTMLElement} element - Element to add haptic feedback to
 * @param {string} type - Type of haptic feedback
 */
export const addHapticToElement = (element, type = 'light') => {
  if (element) {
    element.addEventListener('click', () => triggerHaptic(type));
    element.addEventListener('touchstart', () => triggerHaptic(type));
  }
};

/**
 * Initialize haptic feedback for common interactive elements
 */
export const initializeHaptics = () => {
  // Add haptic feedback to buttons
  const buttons = document.querySelectorAll('button');
  buttons.forEach(button => {
    addHapticToElement(button, 'light');
  });
  
  // Add haptic feedback to form inputs
  const inputs = document.querySelectorAll('input, select, textarea');
  inputs.forEach(input => {
    input.addEventListener('focus', () => triggerHaptic('light'));
  });
};