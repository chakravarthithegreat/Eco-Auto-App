/**
 * Notification Sound Utilities
 * Handles playing notification sounds with global settings
 */
import { audioContextManager } from './audioContextManager';

// Predefined notification sounds with file paths
const predefinedSounds = {
  'chime': { name: 'Chime', file: '/sounds/chime.mp3' },
  'bell': { name: 'Bell', file: '/sounds/bell.mp3' },
  'ping': { name: 'Ping', file: '/sounds/ping.mp3' },
  'alert': { name: 'Alert', file: '/sounds/alert.mp3' },
  'success': { name: 'Success', file: '/sounds/success.mp3' },
  'notification': { name: 'Notification', file: '/sounds/notification.mp3' }
};

// Global settings for notification sounds
let notificationSoundSettings = {
  enabled: true,
  volume: 0.7,
  sound: 'chime',
  customSound: null
};

/**
 * Set notification sound settings
 * @param {Object} settings - Notification sound settings
 */
export const setNotificationSoundSettings = (settings) => {
  notificationSoundSettings = { ...notificationSoundSettings, ...settings };
};

/**
 * Get current notification sound settings
 * @returns {Object} Current notification sound settings
 */
export const getNotificationSoundSettings = () => {
  return { ...notificationSoundSettings };
};

/**
 * Get predefined notification sounds
 * @returns {Object} Predefined sounds map
 */
export const getPredefinedSounds = () => {
  return { ...predefinedSounds };
};

/**
 * Play a notification sound
 * @param {string} soundName - Name of the predefined sound to play
 * @param {string} customSoundUrl - URL of a custom sound to play
 */
export const playNotificationSound = (soundName = null, customSoundUrl = null) => {
  // Check if sound is enabled
  if (!notificationSoundSettings.enabled) {
    return;
  }

  // Determine which sound to play
  const soundToPlay = customSoundUrl || notificationSoundSettings.customSound || soundName || notificationSoundSettings.sound;
  
  // If we have a custom sound URL, play it directly
  if (customSoundUrl || notificationSoundSettings.customSound) {
    const url = customSoundUrl || notificationSoundSettings.customSound;
    playCustomSound(url);
    return;
  }

  // Try to play file-based sound first
  const soundInfo = predefinedSounds[soundToPlay];
  if (soundInfo && soundInfo.file) {
    playFileBasedSound(soundInfo.file);
  } else {
    // Fallback to generated sound
    playGeneratedSound(soundToPlay);
  }
};

/**
 * Play a custom sound from URL
 * @param {string} url - URL of the sound file
 */
const playCustomSound = (url) => {
  if (!url) return;
  
  try {
    const audio = new Audio(url);
    audio.volume = notificationSoundSettings.volume;
    audio.play().catch(e => {
      console.warn('Failed to play custom sound:', e);
      // Fallback to generated sound
      playGeneratedSound(notificationSoundSettings.sound);
    });
  } catch (e) {
    console.warn('Error playing custom sound:', e);
    // Fallback to generated sound
    playGeneratedSound(notificationSoundSettings.sound);
  }
};

/**
 * Play a file-based sound
 * @param {string} filePath - Path to the sound file
 */
const playFileBasedSound = (filePath) => {
  try {
    const audio = new Audio(filePath);
    audio.volume = notificationSoundSettings.volume;
    audio.play().catch(e => {
      console.warn('Failed to play file-based sound:', e);
      // Fallback to generated sound
      playGeneratedSound(notificationSoundSettings.sound);
    });
  } catch (e) {
    console.warn('Error playing file-based sound:', e);
    // Fallback to generated sound
    playGeneratedSound(notificationSoundSettings.sound);
  }
};

/**
 * Play a generated sound using Web Audio API
 * @param {string} soundName - Name of the predefined sound
 */
const playGeneratedSound = (soundName) => {
  // Get or create audio context
  const audioContext = audioContextManager.getAudioContext();
  if (!audioContext) {
    console.warn('Audio context not available, cannot play generated sound');
    return;
  }

  // Resume context if suspended (required for most browsers)
  audioContextManager.resumeContext();

  try {
    switch (soundName) {
      case 'chime':
        playChimeSound(audioContext);
        break;
      case 'bell':
        playBellSound(audioContext);
        break;
      case 'ping':
        playPingSound(audioContext);
        break;
      case 'alert':
        playAlertSound(audioContext);
        break;
      case 'success':
        playSuccessSound(audioContext);
        break;
      case 'notification':
        playNotificationTone(audioContext);
        break;
      default:
        playChimeSound(audioContext);
    }
  } catch (e) {
    console.warn('Error playing generated sound:', e);
  }
};

/**
 * Play a chime sound
 * @param {AudioContext} audioContext - The audio context to use
 */
const playChimeSound = (audioContext) => {
  const oscillator = audioContext.createOscillator();
  const gainNode = audioContext.createGain();
  
  oscillator.connect(gainNode);
  gainNode.connect(audioContext.destination);
  
  oscillator.type = 'sine';
  oscillator.frequency.setValueAtTime(523.25, audioContext.currentTime); // C5
  oscillator.frequency.setValueAtTime(659.25, audioContext.currentTime + 0.1); // E5
  oscillator.frequency.setValueAtTime(783.99, audioContext.currentTime + 0.2); // G5
  
  gainNode.gain.setValueAtTime(0, audioContext.currentTime);
  gainNode.gain.linearRampToValueAtTime(notificationSoundSettings.volume * 0.3, audioContext.currentTime + 0.01);
  gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 0.3);
  
  oscillator.start(audioContext.currentTime);
  oscillator.stop(audioContext.currentTime + 0.3);
};

/**
 * Play a bell sound
 * @param {AudioContext} audioContext - The audio context to use
 */
const playBellSound = (audioContext) => {
  const oscillator = audioContext.createOscillator();
  const gainNode = audioContext.createGain();
  
  oscillator.connect(gainNode);
  gainNode.connect(audioContext.destination);
  
  oscillator.type = 'triangle';
  oscillator.frequency.setValueAtTime(880, audioContext.currentTime);
  
  gainNode.gain.setValueAtTime(0, audioContext.currentTime);
  gainNode.gain.linearRampToValueAtTime(notificationSoundSettings.volume * 0.5, audioContext.currentTime + 0.01);
  gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 0.5);
  
  oscillator.start(audioContext.currentTime);
  oscillator.stop(audioContext.currentTime + 0.5);
};

/**
 * Play a ping sound
 * @param {AudioContext} audioContext - The audio context to use
 */
const playPingSound = (audioContext) => {
  const oscillator = audioContext.createOscillator();
  const gainNode = audioContext.createGain();
  
  oscillator.connect(gainNode);
  gainNode.connect(audioContext.destination);
  
  oscillator.type = 'sine';
  oscillator.frequency.setValueAtTime(1200, audioContext.currentTime);
  oscillator.frequency.setValueAtTime(800, audioContext.currentTime + 0.05);
  
  gainNode.gain.setValueAtTime(0, audioContext.currentTime);
  gainNode.gain.linearRampToValueAtTime(notificationSoundSettings.volume * 0.4, audioContext.currentTime + 0.01);
  gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 0.15);
  
  oscillator.start(audioContext.currentTime);
  oscillator.stop(audioContext.currentTime + 0.15);
};

/**
 * Play an alert sound
 * @param {AudioContext} audioContext - The audio context to use
 */
const playAlertSound = (audioContext) => {
  const oscillator = audioContext.createOscillator();
  const gainNode = audioContext.createGain();
  
  oscillator.connect(gainNode);
  gainNode.connect(audioContext.destination);
  
  oscillator.type = 'sawtooth';
  oscillator.frequency.setValueAtTime(440, audioContext.currentTime);
  
  gainNode.gain.setValueAtTime(0, audioContext.currentTime);
  gainNode.gain.linearRampToValueAtTime(notificationSoundSettings.volume * 0.5, audioContext.currentTime + 0.01);
  gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 0.2);
  
  oscillator.start(audioContext.currentTime);
  oscillator.stop(audioContext.currentTime + 0.2);
  
  // Second tone for alert
  setTimeout(() => {
    const oscillator2 = audioContext.createOscillator();
    const gainNode2 = audioContext.createGain();
    
    oscillator2.connect(gainNode2);
    gainNode2.connect(audioContext.destination);
    
    oscillator2.type = 'sawtooth';
    oscillator2.frequency.setValueAtTime(400, audioContext.currentTime);
    
    gainNode2.gain.setValueAtTime(0, audioContext.currentTime);
    gainNode2.gain.linearRampToValueAtTime(notificationSoundSettings.volume * 0.5, audioContext.currentTime + 0.01);
    gainNode2.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 0.2);
    
    oscillator2.start(audioContext.currentTime);
    oscillator2.stop(audioContext.currentTime + 0.2);
  }, 100);
};

/**
 * Play a success sound
 * @param {AudioContext} audioContext - The audio context to use
 */
const playSuccessSound = (audioContext) => {
  const oscillator = audioContext.createOscillator();
  const gainNode = audioContext.createGain();
  
  oscillator.connect(gainNode);
  gainNode.connect(audioContext.destination);
  
  oscillator.type = 'sine';
  oscillator.frequency.setValueAtTime(523.25, audioContext.currentTime); // C5
  oscillator.frequency.setValueAtTime(659.25, audioContext.currentTime + 0.1); // E5
  oscillator.frequency.setValueAtTime(783.99, audioContext.currentTime + 0.2); // G5
  oscillator.frequency.setValueAtTime(1046.50, audioContext.currentTime + 0.3); // C6
  
  gainNode.gain.setValueAtTime(0, audioContext.currentTime);
  gainNode.gain.linearRampToValueAtTime(notificationSoundSettings.volume * 0.3, audioContext.currentTime + 0.01);
  gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 0.4);
  
  oscillator.start(audioContext.currentTime);
  oscillator.stop(audioContext.currentTime + 0.4);
};

/**
 * Play a notification tone
 * @param {AudioContext} audioContext - The audio context to use
 */
const playNotificationTone = (audioContext) => {
  const oscillator = audioContext.createOscillator();
  const gainNode = audioContext.createGain();
  
  oscillator.connect(gainNode);
  gainNode.connect(audioContext.destination);
  
  oscillator.type = 'sine';
  oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
  
  gainNode.gain.setValueAtTime(0, audioContext.currentTime);
  gainNode.gain.linearRampToValueAtTime(notificationSoundSettings.volume * 0.3, audioContext.currentTime + 0.01);
  gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 0.1);
  
  oscillator.start(audioContext.currentTime);
  oscillator.stop(audioContext.currentTime + 0.1);
  
  // Second tone
  setTimeout(() => {
    const oscillator2 = audioContext.createOscillator();
    const gainNode2 = audioContext.createGain();
    
    oscillator2.connect(gainNode2);
    gainNode2.connect(audioContext.destination);
    
    oscillator2.type = 'sine';
    oscillator2.frequency.setValueAtTime(1000, audioContext.currentTime);
    
    gainNode2.gain.setValueAtTime(0, audioContext.currentTime);
    gainNode2.gain.linearRampToValueAtTime(notificationSoundSettings.volume * 0.3, audioContext.currentTime + 0.01);
    gainNode2.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 0.1);
    
    oscillator2.start(audioContext.currentTime);
    oscillator2.stop(audioContext.currentTime + 0.1);
  }, 150);
};