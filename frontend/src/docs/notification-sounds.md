# Notification Sound System

## Overview

The Eco-Auto app includes a comprehensive notification sound system that allows users to customize their notification experience with both predefined and custom sounds.

## Features

1. **Predefined Sounds**: 6 modern notification sounds (Chime, Bell, Ping, Alert, Success, Notification)
2. **Custom Sounds**: Upload your own notification sounds
3. **Volume Control**: Adjustable volume from 0-100%
4. **Global Settings**: Configure sounds once, apply everywhere
5. **Fallback System**: Generated sounds when files are missing

## Architecture

### Components

1. **notificationSoundUtils.js**: Core sound playback logic
2. **audioContextManager.js**: Audio context lifecycle management
3. **useNotificationSound.js**: React hook for easy integration
4. **AdminSettings.jsx**: UI for configuring sound settings
5. **NotificationCenter.jsx**: Notification display with sound playback
6. **NotificationSoundTest.jsx**: Test page for sounds

### Sound Priority

1. **Custom Sound**: If user has uploaded a custom sound, play that
2. **File-based Sound**: If sound file exists in `/public/sounds/`, play that
3. **Generated Sound**: Fallback to Web Audio API generated sounds

## Implementation

### Playing Sounds

```javascript
import { playNotificationSound } from '../utils/notificationSoundUtils';

// Play default sound
playNotificationSound();

// Play specific predefined sound
playNotificationSound('bell');

// Play custom sound
playNotificationSound(null, 'path/to/custom/sound.mp3');
```

### Using the Hook

```javascript
import { useNotificationSound } from '../hooks/useNotificationSound';

const MyComponent = () => {
  const { playSound, playSoundByName, playCustomSound } = useNotificationSound();
  
  return (
    <button onClick={() => playSoundByName('chime')}>
      Play Chime Sound
    </button>
  );
};
```

### Settings Integration

Settings are stored in the component state and passed to the sound utility:

```javascript
const notificationSettings = {
  enabled: true,
  volume: 0.7,
  sound: 'chime',
  customSound: null
};

setNotificationSoundSettings(notificationSettings);
```

## Adding Custom Sounds

1. **Predefined Sounds**: Place MP3 files in `/public/sounds/` with correct names
2. **User Custom Sounds**: Uploaded through the settings UI
3. **Supported Formats**: MP3, WAV, OGG

## Testing

1. **Notification Center**: "Add Test Notification" button
2. **Sound Test Page**: Dedicated test page at `/notification-sound-test`
3. **Settings Panel**: "Test" button in notification settings

## Browser Support

- **Web Audio API**: Modern browsers (Chrome, Firefox, Safari, Edge)
- **HTML5 Audio**: Universal support
- **Fallback**: Silent operation if neither is available

## Performance Considerations

- Audio context is managed globally
- Context is suspended when not in use
- Generated sounds are lightweight
- File-based sounds are cached by the browser