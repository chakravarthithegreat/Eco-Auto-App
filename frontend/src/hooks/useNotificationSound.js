import { useEffect } from 'react';
import { 
  playNotificationSound, 
  setNotificationSoundSettings,
  getNotificationSoundSettings
} from '../utils/notificationSoundUtils';

/**
 * Hook for managing notification sounds
 * @param {Object} settings - Notification sound settings
 * @returns {Object} Object containing sound functions
 */
export const useNotificationSound = (settings = null) => {
  // Initialize notification sound settings if provided
  useEffect(() => {
    if (settings) {
      setNotificationSoundSettings(settings);
    }
  }, [settings]);

  /**
   * Play a notification sound
   * @param {string} soundName - Name of the predefined sound to play
   * @param {string} customSoundUrl - URL of a custom sound to play
   */
  const playSound = (soundName = null, customSoundUrl = null) => {
    playNotificationSound(soundName, customSoundUrl);
  };

  /**
   * Play a specific sound by name
   * @param {string} soundName - Name of the sound to play
   */
  const playSoundByName = (soundName) => {
    playNotificationSound(soundName);
  };

  /**
   * Play a custom sound
   * @param {string} customSoundUrl - URL of the custom sound to play
   */
  const playCustomSound = (customSoundUrl) => {
    playNotificationSound(null, customSoundUrl);
  };

  /**
   * Get current notification sound settings
   * @returns {Object} Current notification sound settings
   */
  const getSettings = () => {
    return getNotificationSoundSettings();
  };

  return {
    playSound,
    playSoundByName,
    playCustomSound,
    getSettings
  };
};