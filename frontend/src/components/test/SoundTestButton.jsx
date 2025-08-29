import React from 'react';
import { Button } from '../ui/Button';
import { Play } from 'lucide-react';
import { playNotificationSound } from '../../utils/notificationSoundUtils';

const SoundTestButton = ({ soundType = 'chime', customSound = null, children }) => {
  const handlePlaySound = () => {
    playNotificationSound(soundType, customSound);
  };

  return (
    <Button 
      onClick={handlePlaySound}
      variant="outline"
      className="flex items-center gap-2"
    >
      <Play className="w-4 h-4" />
      {children || 'Play Sound'}
    </Button>
  );
};

export default SoundTestButton;